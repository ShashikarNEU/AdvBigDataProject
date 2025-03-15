const { validate } = require('../utils/validate');
const { savePlan, getPlan, updatePlanService, deletePlan } = require('../services/plan-service');

const createPlan = async (req, res) => {
  try {
    valid = validate(req.body);

    if (!valid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validate.errors
      })
    }

    const existingPlan = await getPlan(req.body.objectId);

    if (existingPlan) {
      console.log(`Plan already exists: ${req.body.objectId}`);
      return res.status(409).json({
        error: 'Plan already exists'
      })
    }

    const {objectId, etag} = await savePlan(req.body.objectId, req.body);
    console.log(`Plan created: ${req.body.objectId}, ETag: ${etag}`);
    //console.log(`ETag in controller: ${etag}`);
    res.set('Etag', etag); // Set Etag in headers
    return res.status(201).json({
      message: `Plan with id:${req.body.objectId} created successfully`,
      objectId: req.body.objectId
    });
  }
  catch(error) {
    console.error('Error in createPlan:', error);
    return res.status(500).json({
      error: `Internal server error: ${error}`
    })
  }
}

const readPlan = async (req, res) => {
  try {
    objectId = req.params.id;
  
    const existingPlan = await getPlan(objectId);
    if (!existingPlan) {
      console.log(`Plan not found: ${objectId}`);
      return res.status(404).json({
        error: 'Plan not found'
      })
    }

    const clientETag = req.headers['if-none-match'];
    const serverEtag = existingPlan._etag;
    console.log(`Client ETag: ${clientETag}, Server ETag: ${serverEtag}`);
    if (clientETag === serverEtag) {
      console.log(`Plan not modified: ${objectId}`);
      return res.status(304).end(); // Not modified
    }

    // Check if ETag mis-matches
    if (clientETag && clientETag !== serverEtag) {
      return res.status(412).json({ message: "ETag mismatch - Data has been modified" }); // 412 Precondition Failed
    }

    console.log(`Plan retrieved: ${objectId}`);

    const { _etag, ...filteredData } = existingPlan; // Destructure to exclude `_etag`
    
    return res.status(200).json(filteredData);
  }
  catch(error){
    console.error('Error in readPlan:', error);
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}

const updatePlan = async (req, res) => {
  try {
    objectId = req.params.id;
    const existingPlan = await getPlan(objectId);
    if (!existingPlan) {
      console.log(`Plan not found: ${objectId}`);
      return res.status(404).json({
        error: 'Plan not found'
      })
    }
    const serverEtag = existingPlan._etag;
    const clientETag = req.headers['if-match'];

    if (!clientETag) {
      return res.status(428).json({ message: "Precondition Required" }); // 428 Precondition Required
    }

    // Check if ETag matches
    if (clientETag !== serverEtag) {
      return res.status(412).json({ message: "ETag mismatch - Data has been modified" }); // 412 Precondition Failed
    }

    const {planKey, etag, updatedPlan} = await updatePlanService(objectId, req.body);

    console.log(`Plan updated: ${planKey}, updated plan: ${updatedPlan}`);

    res.set('Etag', etag); // Set Etag in headers

    const {_etag, ...filteredData} = updatedPlan

    return res.status(200).json(filteredData)
  }
  catch(error){
    console.error('Error in updatePlan:', error);
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}

const removePlan = async (req, res) => {
  try {
    objectId = req.params.id;
    const existingPlan = await getPlan(objectId);
    if (!existingPlan) {
      console.log(`Plan not found: ${objectId}`);
      return res.status(404).json({
        error: 'Plan not found'
      })
    }
    await deletePlan(objectId);
    console.log(`Plan deleted: ${objectId}`);
    return res.status(204).end();
  }
  catch(error){
    console.error('Error in removePlan:', error);
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}

module.exports = { createPlan, readPlan, updatePlan, removePlan };