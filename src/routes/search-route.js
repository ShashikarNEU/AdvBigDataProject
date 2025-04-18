const express = require('express');
const router = express.Router();
const client = require('../config/elastic');

// GET /api/search?q=inNetwork
router.get('/search', async (req, res) => {
  const keyword = req.query.q || '';

  try {
    const result = await client.search({
      index: 'plan-index',
      query: {
        match: {
          planType: keyword
        }
      }
    });

    res.status(200).json(result.hits.hits);
  } catch (error) {
    console.error('Elasticsearch search error:', error);
    res.status(500).json({ error: 'Search failed', detail: error.message });
  }
});

module.exports = router;
