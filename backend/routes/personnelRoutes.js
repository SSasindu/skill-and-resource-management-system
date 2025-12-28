const express = require('express');
const router = express.Router();
const personnelController = require('../controllers/personnelController');

// Personnel CRUD routes
router.get('/', personnelController.getAllPersonnel);
router.get('/:id', personnelController.getPersonnelById);
router.post('/', personnelController.createPersonnel);
router.put('/:id', personnelController.updatePersonnel);
router.delete('/:id', personnelController.deletePersonnel);

// Get personnel with skills
router.get('/:id/skills', personnelController.getPersonnelWithSkills);

module.exports = router;
