const { connectQueue, consumeQueue } = require('../services/queue-service');
const { indexPlanWithChildren, deletePlanFromIndex } = require('../services/elastic-service');

const startWorker = async () => {
  await connectQueue();

  consumeQueue(async (msg) => {
    const { action, id, data } = msg;

    if (action === 'patch') await indexPlanWithChildren(data);
     else if (action === 'delete') await deletePlanFromIndex(id);
  });
};

startWorker();
