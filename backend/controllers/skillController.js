const db = require('../config/database');

// Get all skills
exports.getAllSkills = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM skills');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching skills',
            error: error.message
        });
    }
};

// Get single skill by ID
exports.getSkillById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM skills WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching skill',
            error: error.message
        });
    }
};

// Create new skill
exports.createSkill = async (req, res) => {
    try {
        const { skill_name} = req.body;

        // Validation
        if (!skill_name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide skill_name'
            });
        }

        const [result] = await db.query(
            'INSERT INTO skills (skill_name) VALUES (?)',
            [skill_name]
        );

        const [newSkill] = await db.query('SELECT * FROM skills WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: newSkill[0]
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Skill name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating skill',
            error: error.message
        });
    }
};

// Update skill
exports.updateSkill = async (req, res) => {
    try {
        const { skill_name} = req.body;
        const { id } = req.params;

        // Check if skill exists
        const [existing] = await db.query('SELECT * FROM skills WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        await db.query(
            'UPDATE skills SET skill_name = ? WHERE id = ?',
            [
                skill_name || existing[0].skill_name,
                id
            ]
        );

        const [updated] = await db.query('SELECT * FROM skills WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Skill updated successfully',
            data: updated[0]
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Skill name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating skill',
            error: error.message
        });
    }
};

// Delete skill
exports.deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM skills WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        await db.query('DELETE FROM skills WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Skill deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting skill',
            error: error.message
        });
    }
};

// Assign skill to personnel
exports.assignSkillToPersonnel = async (req, res) => {
    try {
        const { personnel_id, skill_id, proficiency_level } = req.body;

        // Validation
        if (!personnel_id || !skill_id || !proficiency_level) {
            return res.status(400).json({
                success: false,
                message: 'Please provide personnel_id, skill_id, and proficiency_level'
            });
        }

        // Validate proficiency level
        const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        if (!validLevels.includes(proficiency_level)) {
            return res.status(400).json({
                success: false,
                message: 'Proficiency level must be: Beginner, Intermediate, Advanced, or Expert'
            });
        }

        // Check if personnel exists
        const [personnel] = await db.query('SELECT id FROM personnel WHERE id = ?', [personnel_id]);
        if (personnel.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Personnel not found'
            });
        }

        // Check if skill exists
        const [skill] = await db.query('SELECT id FROM skills WHERE id = ?', [skill_id]);
        if (skill.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        const [result] = await db.query(
            'INSERT INTO personnel_skills (personnel_id, skill_id, proficiency_level) VALUES (?, ?, ?)',
            [personnel_id, skill_id, proficiency_level]
        );

        const [assignment] = await db.query(
            `SELECT ps.*, p.name as personnel_name, s.skill_name 
             FROM personnel_skills ps
             JOIN personnel p ON ps.personnel_id = p.id
             JOIN skills s ON ps.skill_id = s.id
             WHERE ps.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Skill assigned to personnel successfully',
            data: assignment[0]
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'This skill is already assigned to this personnel'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error assigning skill',
            // error: error.message
        });
    }
};

// Update personnel skill proficiency
exports.updatePersonnelSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { proficiency_level } = req.body;

        // Validate proficiency level
        const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        if (!validLevels.includes(proficiency_level)) {
            return res.status(400).json({
                success: false,
                message: 'Proficiency level must be: Beginner, Intermediate, Advanced, or Expert'
            });
        }

        // Check if assignment exists
        const [existing] = await db.query('SELECT * FROM personnel_skills WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Skill assignment not found'
            });
        }

        await db.query(
            'UPDATE personnel_skills SET proficiency_level = ? WHERE id = ?',
            [proficiency_level, id]
        );

        const [updated] = await db.query(
            `SELECT ps.*, p.name as personnel_name, s.skill_name 
             FROM personnel_skills ps
             JOIN personnel p ON ps.personnel_id = p.id
             JOIN skills s ON ps.skill_id = s.id
             WHERE ps.id = ?`,
            [id]
        );

        res.json({
            success: true,
            message: 'Skill proficiency updated successfully',
            data: updated[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating skill proficiency',
            // error: error.message
        });
    }
};

// Remove skill from personnel
exports.removeSkillFromPersonnel = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM personnel_skills WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Skill assignment not found'
            });
        }

        await db.query('DELETE FROM personnel_skills WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Skill removed from personnel successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing skill',
            // error: error.message
        });
    }
};
