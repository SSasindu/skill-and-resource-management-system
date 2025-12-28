const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');

// Matching routes
router.get('/project/:id', matchingController.matchPersonnelToProject);
router.get('/projects/all', matchingController.getAllProjectMatches);

module.exports = router;
