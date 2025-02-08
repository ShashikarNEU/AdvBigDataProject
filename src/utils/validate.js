const Ajv = require('ajv');
const planSchema = require('../schema/plan.schema.json');

const ajv = new Ajv();
const validate = ajv.compile(planSchema);

module.exports = {validate};