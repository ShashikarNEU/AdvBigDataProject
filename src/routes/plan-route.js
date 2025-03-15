const {createPlan, readPlan, updatePlan, removePlan} = require('../controller/plan-controller');
const express = require('express');
const {verifyToken} = require('../middleware/auth-middleware');

const router = express.Router();

router.post('/', verifyToken, createPlan);
router.get('/:id', verifyToken, readPlan);
router.patch('/:id', verifyToken, updatePlan);
router.delete('/:id', verifyToken, removePlan);

module.exports = router;