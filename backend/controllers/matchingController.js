const db = require('../config/database');

// Proficiency level mapping for comparison
const proficiencyLevels = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3,
    'Expert': 4
};

// Match personnel to project requirements
exports.matchPersonnelToProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Get project details
        const [project] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        if (project.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Get project required skills
        const [requiredSkills] = await db.query(
            `SELECT prs.skill_id, s.skill_name, prs.min_proficiency_level
             FROM project_required_skills prs
             JOIN skills s ON prs.skill_id = s.id
             WHERE prs.project_id = ?`,
            [id]
        );

        if (requiredSkills.length === 0) {
            return res.json({
                success: true,
                message: 'No required skills defined for this project',
                data: {
                    project: project[0],
                    required_skills: [],
                    matched_personnel: []
                }
            });
        }

        // Get all personnel with their skills
        const [allPersonnel] = await db.query('SELECT * FROM personnel');

        const matchedPersonnel = [];

        for (const person of allPersonnel) {
            // Get person's skills
            const [personSkills] = await db.query(
                `SELECT ps.skill_id, ps.proficiency_level, s.skill_name
                 FROM personnel_skills ps
                 JOIN skills s ON ps.skill_id = s.id
                 WHERE ps.personnel_id = ?`,
                [person.id]
            );

            // Check if person has all required skills with sufficient proficiency
            let hasAllSkills = true;
            let partiallyMatched = false;
            let matchedSkills = [];
            let totalMatch = 0;

            for (const reqSkill of requiredSkills) {
                const personSkill = personSkills.find(ps => ps.skill_id === reqSkill.skill_id);

                if (!personSkill) {
                    hasAllSkills = false;
                    break;
                }

                const personProficiency = proficiencyLevels[personSkill.proficiency_level];
                const requiredProficiency = proficiencyLevels[reqSkill.min_proficiency_level];

                if (personProficiency < requiredProficiency) {
                    hasAllSkills = false;
                    break;
                }

                matchedSkills.push({
                    skill_name: reqSkill.skill_name,
                    required_level: reqSkill.min_proficiency_level,
                    person_level: personSkill.proficiency_level
                });

                totalMatch += personProficiency;
            }

            if (hasAllSkills) {
                const matchPercentage = Math.round((totalMatch / (requiredSkills.length * 4)) * 100);
                
                matchedPersonnel.push({
                    id: person.id,
                    name: person.name,
                    email: person.email,
                    role: person.role,
                    experience_level: person.experience_level,
                    matched_skills: matchedSkills,
                    match_percentage: matchPercentage
                });
            }
        }

        // Sort by match percentage (highest first)
        matchedPersonnel.sort((a, b) => b.match_percentage - a.match_percentage);

        res.json({
            success: true,
            data: {
                project: project[0],
                required_skills: requiredSkills,
                matched_personnel: matchedPersonnel,
                total_matches: matchedPersonnel.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error matching personnel to project',
            error: error.message
        });
    }
};

// Get all matches for all projects
exports.getAllProjectMatches = async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects WHERE status != "Completed"');
        
        const results = [];

        for (const project of projects) {
            const [requiredSkills] = await db.query(
                `SELECT COUNT(*) as count FROM project_required_skills WHERE project_id = ?`,
                [project.id]
            );

            results.push({
                project_id: project.id,
                project_name: project.project_name,
                status: project.status,
                required_skills_count: requiredSkills[0].count
            });
        }

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching project matches',
            error: error.message
        });
    }
};
