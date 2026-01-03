const db = require('../config/database');

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching projects',
            error: error.message
        });
    }
};

// Get single project by ID
exports.getProjectById = async (req, res) => {
    try {
        const query = `
        SELECT
            p.id, 
            p.project_name AS "project_name", 
            p.description AS "description", 
            p.start_date AS "start_date", 
            p.end_date AS "end_date", 
            p.status AS "status", 
            GROUP_CONCAT(s.skill_name ORDER BY s.skill_name SEPARATOR ', ') AS "required_skills",
            GROUP_CONCAT(prs.min_proficiency_level ORDER BY s.skill_name SEPARATOR ', ' ) AS "min_proficiency_level"
        FROM projects p
        LEFT JOIN project_required_skills prs ON prs.project_id=p.id
        LEFT JOIN skills s ON prs.skill_id = s.id
        GROUP BY p.id
        HAVING p.id = ?;`;
        const [rows] = await db.query(query, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching project',
            error: error.message
        });
    }
};

// Create new project
exports.createProject = async (req, res) => {
    try {
        const { project_name, description, start_date, end_date, status } = req.body;

        // Validation
        if (!project_name || !start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide project_name, start_date, and end_date'
            });
        }

        // Status validation
        const validStatuses = ['Planning', 'Active', 'Completed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be: Planning, Active, or Completed'
            });
        }

        const [result] = await db.query(
            'INSERT INTO projects (project_name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [project_name, description || null, start_date, end_date, status || 'Planning']
        );

        const [newProject] = await db.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: newProject[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating project',
            error: error.message
        });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        const { project_name, description, start_date, end_date, status } = req.body;
        const { id } = req.params;

        // Check if project exists
        const [existing] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Status validation if provided
        if (status) {
            const validStatuses = ['Planning', 'Active', 'Completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Status must be: Planning, Active, or Completed'
                });
            }
        }

        await db.query(
            'UPDATE projects SET project_name = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?',
            [
                project_name || existing[0].project_name,
                description !== undefined ? description : existing[0].description,
                start_date || existing[0].start_date,
                end_date || existing[0].end_date,
                status || existing[0].status,
                id
            ]
        );

        const [updated] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Project updated successfully',
            data: updated[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating project',
            error: error.message
        });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        await db.query('DELETE FROM projects WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting project',
            error: error.message
        });
    }
};

// Add required skill to project
exports.addRequiredSkill = async (req, res) => {
    try {
        const { project_id, skill_id, min_proficiency_level } = req.body;

        // Validation
        if (!project_id || !skill_id || !min_proficiency_level) {
            return res.status(400).json({
                success: false,
                message: 'Please provide project_id, skill_id, and min_proficiency_level'
            });
        }

        // Validate proficiency level
        const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        if (!validLevels.includes(min_proficiency_level)) {
            return res.status(400).json({
                success: false,
                message: 'Proficiency level must be: Beginner, Intermediate, Advanced, or Expert'
            });
        }

        // Check if project exists
        const [project] = await db.query('SELECT id FROM projects WHERE id = ?', [project_id]);
        if (project.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
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
            'INSERT INTO project_required_skills (project_id, skill_id, min_proficiency_level) VALUES (?, ?, ?)',
            [project_id, skill_id, min_proficiency_level]
        );

        const [requirement] = await db.query(
            `SELECT prs.*, p.project_name, s.skill_name 
             FROM project_required_skills prs
             JOIN projects p ON prs.project_id = p.id
             JOIN skills s ON prs.skill_id = s.id
             WHERE prs.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Required skill added to project successfully',
            data: requirement[0]
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'This skill is already required for this project'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error adding required skill',
            error: error.message
        });
    }
};

// Get project with required skills
exports.getProjectWithSkills = async (req, res) => {
    try {
        const { id } = req.params;

        const [project] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        if (project.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const [requiredSkills] = await db.query(
            `SELECT prs.id, s.id as skill_id, s.skill_name, prs.min_proficiency_level
             FROM project_required_skills prs
             JOIN skills s ON prs.skill_id = s.id
             WHERE prs.project_id = ?`,
            [id]
        );

        res.json({
            success: true,
            data: {
                ...project[0],
                required_skills: requiredSkills
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching project with skills',
            error: error.message
        });
    }
};

// Remove required skill from project
exports.removeRequiredSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM project_required_skills WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Required skill not found'
            });
        }

        await db.query('DELETE FROM project_required_skills WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Required skill removed from project successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing required skill',
            error: error.message
        });
    }
};
