const express = require('express');
const router = express.Router();
const { explainMove } = require('../controllers/AiTutor');

// POST /api/v1/ai-tutor/explain
router.post('/explain', explainMove);

module.exports = router;
