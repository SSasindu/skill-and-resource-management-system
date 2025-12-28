const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Project CRUD routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Project required skills routes
router.post('/required-skills', projectController.addRequiredSkill);
router.get('/:id/skills', projectController.getProjectWithSkills);
router.delete('/required-skills/:id', projectController.removeRequiredSkill);

module.exports = router;
