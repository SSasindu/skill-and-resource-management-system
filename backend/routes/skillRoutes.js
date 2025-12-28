const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');

// Skill CRUD routes
router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillById);
router.post('/', skillController.createSkill);
router.put('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

// Personnel skill assignment routes
router.post('/assign', skillController.assignSkillToPersonnel);
router.put('/assignment/:id', skillController.updatePersonnelSkill);
router.delete('/assignment/:id', skillController.removeSkillFromPersonnel);

module.exports = router;
