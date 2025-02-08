const {createPlan, readPlan, removePlan} = require('../controller/plan-controller');
const express = require('express');

const router = express.Router();

router.post('/', createPlan);
router.get('/:id', readPlan);
router.delete('/:id', removePlan);

module.exports = router;