const client = require('../config/elastic');

const indexPlanWithChildren = async (plan) => {
  const planId = plan.objectId;

  // 1. Index the parent plan (flat, no nested children)
  await client.index({
    index: 'plan-index',
    id: planId,
    document: {
      _org: plan._org,
      creationDate: plan.creationDate,
      objectId: planId,
      objectType: 'plan',
      planType: plan.planType,
      join_field: {
        name: 'plan'
      }
    },
    refresh: true
  });

  // 2. Index planCostShares as a child of the plan
  if (plan.planCostShares) {
    await client.index({
      index: 'plan-index',
      id: plan.planCostShares.objectId,
      routing: planId,
      document: {
        ...plan.planCostShares,
        join_field: {
          name: 'planCostShares',
          parent: planId
        }
      },
      refresh: true
    });
  }

  // 3. Index linkedPlanServices and their children
  for (const item of plan.linkedPlanServices || []) {
    const planServiceId = item.objectId;

    // a. planservice (child of plan)
    await client.index({
      index: 'plan-index',
      id: planServiceId,
      routing: planId,
      document: {
        _org: item._org,
        objectId: item.objectId,
        objectType: 'planservice',
        join_field: {
          name: 'planservice',
          parent: planId
        }
      },
      refresh: true
    });

    // b. linkedService (child of planservice)
    if (item.linkedService) {
      await client.index({
        index: 'plan-index',
        id: item.linkedService.objectId,
        routing: planServiceId,
        document: {
          ...item.linkedService,
          join_field: {
            name: 'service',
            parent: planServiceId
          }
        },
        refresh: true
      });
    }

    // c. planserviceCostShares (child of planservice)
    if (item.planserviceCostShares) {
      await client.index({
        index: 'plan-index',
        id: item.planserviceCostShares.objectId,
        routing: planServiceId,
        document: {
          ...item.planserviceCostShares,
          join_field: {
            name: 'membercostshare',
            parent: planServiceId
          }
        },
        refresh: true
      });
    }
  }
};

const deletePlanFromIndex = async (planId) => {
  try {
    // Step 1: Find all immediate children of the plan
    const planChildren = await client.search({
      index: 'plan-index',
      query: {
        bool: {
          should: [
            {
              has_parent: {
                parent_type: 'plan',
                query: {
                  term: {
                    _id: planId
                  }
                }
              }
            }
          ]
        }
      },
      size: 1000 // adjust if you expect a lot of children
    });

    for (const child of planChildren.hits.hits) {
      const childId = child._id;
      const childType = child._source.join_field.name;

      // Step 2: If child is planservice, it may have grandchildren
      if (childType === 'planservice') {
        const grandchildren = await client.search({
          index: 'plan-index',
          query: {
            bool: {
              should: [
                {
                  has_parent: {
                    parent_type: 'planservice',
                    query: {
                      term: {
                        _id: childId
                      }
                    }
                  }
                }
              ]
            }
          },
          size: 1000
        });

        for (const grandchild of grandchildren.hits.hits) {
          await client.delete({
            index: 'plan-index',
            id: grandchild._id,
            routing: childId,
            refresh: true
          });
        }
      }

      // Step 3: Delete the immediate child
      await client.delete({
        index: 'plan-index',
        id: childId,
        routing: planId,
        refresh: true
      });
    }

    // Step 4: Delete the parent plan
    await client.delete({
      index: 'plan-index',
      id: planId,
      refresh: true
    });

    console.log(`[Cascade Delete] Deleted plan ${planId} and all its children.`);
  } catch (err) {
    console.error('[Cascade Delete Error]', err.meta?.body?.error || err.message);
  }
};

module.exports = {
  indexPlanWithChildren,
  deletePlanFromIndex
};
