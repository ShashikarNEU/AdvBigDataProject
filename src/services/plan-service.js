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

const deletePlan = async (objectId) => {
  const planKey = `plan:${objectId}`;
  await redisClient.del(planKey);
}

module.exports = { savePlan, getPlan, deletePlan };