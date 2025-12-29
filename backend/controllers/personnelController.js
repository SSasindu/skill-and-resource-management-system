const db = require('../config/database');

// Get all personnel
exports.getAllPersonnel = async (req, res) => {
    try {
        const query = `
        SELECT 
            p.id AS "id",
            p.email AS "email",
            p.name AS "name",
            p.role AS "role",
            p.experience_level AS "experience_level",
            GROUP_CONCAT(s.skill_name ORDER BY s.skill_name SEPARATOR ', ') AS "skills"
        FROM personnel p
        LEFT JOIN personnel_skills ps ON p.id = ps.personnel_id
        LEFT JOIN skills s ON ps.skill_id = s.id
        GROUP BY p.id
        ORDER BY p.id ASC;`;

        const [rows] = await db.query(query);
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching personnel',
            error: error.message
        });
    }
};

// Get single personnel by ID
exports.getPersonnelById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM personnel WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Personnel not found'
            });
        }
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching personnel',
            error: error.message
        });
    }
};

// Create new personnel
exports.createPersonnel = async (req, res) => {
    try {
        const { name, email, role, experience_level } = req.body;

        // Validation
        if (!name || !email || !role || !experience_level) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, role, experience_level'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Experience level validation
        const validLevels = ['Junior', 'Mid-Level', 'Senior'];
        if (!validLevels.includes(experience_level)) {
            return res.status(400).json({
                success: false,
                message: 'Experience level must be: Junior, Mid-Level, or Senior'
            });
        }

        const [result] = await db.query(
            'INSERT INTO personnel (name, email, role, experience_level) VALUES (?, ?, ?, ?)',
            [name, email, role, experience_level]
        );

        const [newPersonnel] = await db.query('SELECT * FROM personnel WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Personnel created successfully',
            data: newPersonnel[0],
            id: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating personnel',
            error: error.message
        });
    }
};

// Update personnel
exports.updatePersonnel = async (req, res) => {
    try {
        const { name, email, role, experience_level } = req.body;
        const { id } = req.params;

        // Check if personnel exists
        const [existing] = await db.query('SELECT * FROM personnel WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Personnel not found'
            });
        }

        // Email validation if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                });
            }
        }

        // Experience level validation if provided
        if (experience_level) {
            const validLevels = ['Junior', 'Mid-Level', 'Senior'];
            if (!validLevels.includes(experience_level)) {
                return res.status(400).json({
                    success: false,
                    message: 'Experience level must be: Junior, Mid-Level, or Senior'
                });
            }
        }

        await db.query(
            'UPDATE personnel SET name = ?, email = ?, role = ?, experience_level = ? WHERE id = ?',
            [
                name || existing[0].name,
                email || existing[0].email,
                role || existing[0].role,
                experience_level || existing[0].experience_level,
                id
            ]
        );

        const [updated] = await db.query('SELECT * FROM personnel WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Personnel updated successfully',
            data: updated[0],
            id: id
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating personnel',
            error: error.message
        });
    }
};

// Delete personnel
exports.deletePersonnel = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM personnel WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Personnel not found'
            });
        }

        await db.query('DELETE FROM personnel WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Personnel deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting personnel',
            error: error.message
        });
    }
};

// Get personnel with their skills
exports.getPersonnelWithSkills = async (req, res) => {
    try {
        const { id } = req.params;

        const [personnel] = await db.query('SELECT * FROM personnel WHERE id = ?', [id]);
        if (personnel.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Personnel not found'
            });
        }

        const [skills] = await db.query(
            `SELECT ps.id, s.id as skill_id, s.skill_name, s.category, ps.proficiency_level
             FROM personnel_skills ps
             JOIN skills s ON ps.skill_id = s.id
             WHERE ps.personnel_id = ?`,
            [id]
        );

        res.json({
            success: true,
            data: {
                ...personnel[0],
                skills: skills
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching personnel with skills',
            error: error.message
        });
    }
};
