const { etagCreater } = require('../utils/etagHash');

const { redisClient } = require('../config/redis');

const savePlan = async (objectId, plan) => {
  const planKey = `plan:${objectId}`;
  const etag = etagCreater(JSON.stringify(plan)) // Generate Etag
  const planData = { ...plan, _etag: etag }; // Include ETag in the plan data
  await redisClient.set(planKey, JSON.stringify(planData));
  return {planKey, etag};
}

const getPlan = async (objectId) => {
  const planKey = `plan:${objectId}`;
  const plan = await redisClient.get(planKey);
  return plan ? JSON.parse(plan) : null
}

const updatePlanService = async (objectId, plan) => {
  const planKey = `plan:${objectId}`;
  const oldPlan = await getPlan(objectId);

  const updatedPlan = Object.assign({}, oldPlan, plan, {
      // Append for Multiple Cardinality Arrays
      linkedPlanServices: oldPlan.linkedPlanServices && plan.linkedPlanServices
          ? [...oldPlan.linkedPlanServices, ...plan.linkedPlanServices] // Append new services
          : plan.linkedPlanServices || oldPlan.linkedPlanServices
  });

  const etag = etagCreater(JSON.stringify(updatedPlan))

  updatedPlan._etag = etag // Update etag

  await redisClient.set(planKey, JSON.stringify(updatedPlan));

  return { planKey, etag, updatedPlan };
};


const deletePlan = async (objectId) => {
  const planKey = `plan:${objectId}`;
  await redisClient.del(planKey);
}

module.exports = { savePlan, getPlan, updatePlanService , deletePlan };