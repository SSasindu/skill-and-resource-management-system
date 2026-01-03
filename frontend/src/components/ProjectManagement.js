import React, { useState, useEffect } from 'react';
import { projectsAPI, skillsAPI } from '../services/api';

function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [projectFormData, setProjectFormData] = useState({
        project_name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'Planning'
    });
    const [skillFormData, setSkillFormData] = useState({
        project_id: '',
        skills: [] // Changed to array to hold multiple skills
    });
    const [selectedSkillId, setSelectedSkillId] = useState('');
    const [selectedMinProficiency, setSelectedMinProficiency] = useState('Beginner');
    const [showModal, setShowModal] = useState(false);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFilter, setSearchFilter] = useState('All');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projectsRes, skillsRes] = await Promise.all([
                projectsAPI.getAll(),
                skillsAPI.getAll()
            ]);
            setProjects(projectsRes.data.data);
            setSkills(skillsRes.data.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectInputChange = (e) => {
        setProjectFormData({
            ...projectFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleSkillInputChange = (e) => {
        setSkillFormData({
            ...skillFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await projectsAPI.update(editingId, projectFormData);
                setSuccess('Project updated successfully!');
            } else {
                await projectsAPI.create(projectFormData);
                setSuccess('Project created successfully!');
            }
            setShowProjectForm(false);
            setEditingId(null);
            setProjectFormData({
                project_name: '',
                description: '',
                start_date: '',
                end_date: '',
                status: 'Planning'
            });
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSkillSubmit = async (e) => {
        e.preventDefault();
        
        if (skillFormData.skills.length === 0) {
            setError('Please add at least one required skill');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        try {
            // Add each skill to the project
            const skillAssignments = skillFormData.skills.map(async (skill) => {
                try {
                    await projectsAPI.addRequiredSkill({
                        project_id: skillFormData.project_id,
                        skill_id: skill.skill_id,
                        min_proficiency_level: skill.min_proficiency_level
                    });
                    return { success: true };
                } catch (err) {
                    // Silently ignore duplicate skill errors
                    if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
                        return { success: true, duplicate: true };
                    }
                    return { success: false, error: err };
                }
            });
            
            await Promise.all(skillAssignments);
            
            setSuccess('Required skills added to project!');
            setShowSkillForm(false);
            setSkillFormData({ project_id: '', skills: [] });
            setSelectedSkillId('');
            setSelectedMinProficiency('Beginner');
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleEdit = (project) => {
        setProjectFormData({
            project_name: project.project_name,
            description: project.description || '',
            start_date: project.start_date,
            end_date: project.end_date,
            status: project.status
        });
        setEditingId(project.id);
        setShowProjectForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectsAPI.delete(id);
                setSuccess('Project deleted successfully!');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.response?.data?.message || 'Delete failed');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleCancel = () => {
        setShowProjectForm(false);
        setShowSkillForm(false);
        setEditingId(null);
        setProjectFormData({
            project_name: '',
            description: '',
            start_date: '',
            end_date: '',
            status: 'Planning'
        });
        setSkillFormData({ project_id: '', skills: [] });
        setSelectedSkillId('');
        setSelectedMinProficiency('Beginner');
    };

    const handleAddSkillToProject = () => {
        if (!selectedSkillId) {
            setError('Please select a skill');
            setTimeout(() => setError(''), 2000);
            return;
        }
        
        const currentSkills = skillFormData.skills || [];
        const skillExists = currentSkills.some(s => s.skill_id === selectedSkillId);
        
        if (skillExists) {
            setSuccess('This skill is already added to this project');
            setTimeout(() => setSuccess(''), 2000);
            return;
        }
        
        setSkillFormData({
            ...skillFormData,
            skills: [...currentSkills, { skill_id: selectedSkillId, min_proficiency_level: selectedMinProficiency }]
        });
        setSelectedSkillId('');
        setSelectedMinProficiency('Beginner');
    };

    const handleRemoveSkillFromForm = (skillId) => {
        setSkillFormData({
            ...skillFormData,
            skills: skillFormData.skills.filter(s => s.skill_id !== skillId)
        });
    };

    const getSkillName = (skillId) => {
        const skill = skills.find(s => s.id.toString() === skillId.toString());
        return skill ? skill.skill_name : '';
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case 'Planning': return 'badge-planning';
            case 'Active': return 'badge-active';
            case 'Completed': return 'badge-completed';
            default: return '';
        }
    };

    const handleViewDetails = async (project) => {
        try {
            // Fetch complete project details including required skills
            const response = await projectsAPI.getById(project.id);
            setSelectedProjectDetails(response.data.data);
            console.log('Project details:', response.data.data);
            setShowModal(true);
        } catch (err) {
            setError('Failed to fetch project details');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProjectDetails(null);
    };

    const getProficiencyBadgeClass = (level) => {
        switch (level) {
            case 'Beginner': return 'badge-beginner';
            case 'Intermediate': return 'badge-intermediate';
            case 'Advanced': return 'badge-advanced';
            case 'Expert': return 'badge-expert';
            default: return '';
        }
    };

    const handleRemoveSkillFromProject = async (skillName) => {
        if (!window.confirm(`Are you sure you want to remove "${skillName}" from ${selectedProjectDetails.project_name}?`)) {
            return;
        }

        try {
            // Fetch project with skills to get the full skill objects with IDs
            const response = await projectsAPI.getWithSkills(selectedProjectDetails.id);
            const projectWithSkills = response.data.data;
            console.log('Fetched project with skills for removal:', selectedProjectDetails.id);
            console.log('Project with skills:', projectWithSkills);
            // Find the required skill record to get its ID
            const requiredSkill = projectWithSkills.required_skills?.find(
                s => s.skill_name === skillName
            );
            console.log('Found required skill to remove:', requiredSkill);
            
            if (!requiredSkill || !requiredSkill.id) {
                setError('Required skill record not found');
                setTimeout(() => setError(''), 3000);
                return;
            }

            // Call API to remove required skill
            await projectsAPI.removeRequiredSkill(requiredSkill.id);
            
            setSuccess('Required skill removed successfully!');
            setTimeout(() => setSuccess(''), 3000);
            
            // Refresh the modal data
            const updatedResponse = await projectsAPI.getById(selectedProjectDetails.id);
            setSelectedProjectDetails(updatedResponse.data.data);
            
            // Also refresh the main project list
            await fetchData();
        } catch (err) {
            console.error('Error removing required skill:', err);
            setError(err.response?.data?.message || err.message || 'Failed to remove required skill');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Filter projects based on search term and filter type
    const filteredProjects = projects.filter(project => {
        if (!searchTerm) return true;
        
        const term = searchTerm.toLowerCase();
        
        switch (searchFilter) {
            case 'Project Name':
                return project.project_name.toLowerCase().includes(term);
            case 'Description':
                return (project.description || '').toLowerCase().includes(term);
            case 'Status':
                return project.status.toLowerCase().includes(term);
            case 'Required Skills':
                const skills = Array.isArray(project.required_skills) ? project.required_skills.join(', ') : project.required_skills || '';
                return skills.toLowerCase().includes(term);
            case 'All':
            default:
                return (
                    project.project_name.toLowerCase().includes(term) ||
                    (project.description || '').toLowerCase().includes(term) ||
                    project.status.toLowerCase().includes(term) ||
                    (Array.isArray(project.required_skills) ? project.required_skills.join(', ') : project.required_skills || '').toLowerCase().includes(term)
                );
        }
    });

    if (loading) return <div className="loading">Loading projects...</div>;

    return (
        <div>
            <div className="card">
                <h2>Project Management</h2>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                <div style={{ marginBottom: '20px' }}>
                    {!showProjectForm && !showSkillForm && (
                        <>
                            <button className="btn btn-primary" onClick={() => setShowProjectForm(true)}>
                                Add New Project
                            </button>
                            <button className="btn btn-success" onClick={() => setShowSkillForm(true)}>
                                Add Required Skills
                            </button>
                        </>
                    )}
                </div>

                {/* Search Bar */}
                {!showProjectForm && !showSkillForm && projects.length > 0 && (
                    <div style={{ 
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                    }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label style={{ fontWeight: 'bold', minWidth: '80px' }}>Search:</label>
                            <select
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
                            >
                                <option value="All">All Fields</option>
                                <option value="Project Name">Project Name</option>
                                <option value="Description">Description</option>
                                <option value="Status">Status</option>
                                <option value="Required Skills">Required Skills</option>
                            </select>
                            <input
                                type="text"
                                placeholder={`Search by ${searchFilter.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ 
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    fontSize: '14px'
                                }}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        {searchTerm && (
                            <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                                Found {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                )}

                {showProjectForm && (
                    <form onSubmit={handleProjectSubmit} style={{ marginBottom: '30px' }}>
                        <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
                        <div className="form-group">
                            <label>Project Name *</label>
                            <input
                                type="text"
                                name="project_name"
                                value={projectFormData.project_name}
                                onChange={handleProjectInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={projectFormData.description}
                                onChange={handleProjectInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Start Date *</label>
                            <input
                                type="date"
                                name="start_date"
                                value={projectFormData.start_date}
                                onChange={handleProjectInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date *</label>
                            <input
                                type="date"
                                name="end_date"
                                value={projectFormData.end_date}
                                onChange={handleProjectInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Status *</label>
                            <select
                                name="status"
                                value={projectFormData.status}
                                onChange={handleProjectInputChange}
                                required
                            >
                                <option value="Planning">Planning</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success">
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </form>
                )}

                {showSkillForm && (
                    <form onSubmit={handleSkillSubmit} style={{ marginBottom: '30px' }}>
                        <h3>Add Required Skills to Project</h3>
                        <div className="form-group">
                            <label>Select Project *</label>
                            <select
                                name="project_id"
                                value={skillFormData.project_id}
                                onChange={handleSkillInputChange}
                                required
                            >
                                <option value="">-- Select Project --</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.project_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Required Skills *</label>
                            {skills.length === 0 ? (
                                <p style={{ color: '#999', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>No skills available. Please create skills first.</p>
                            ) : (
                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                        <div style={{ flex: '2' }}>
                                            <label style={{ fontSize: '12px', marginBottom: '5px', display: 'block' }}>Select Skill</label>
                                            <select
                                                value={selectedSkillId}
                                                onChange={(e) => setSelectedSkillId(e.target.value)}
                                                style={{ width: '100%' }}
                                            >
                                                <option value="">-- Choose a skill --</option>
                                                {skills.filter(skill => !skillFormData.skills.some(s => s.skill_id === skill.id.toString())).map(skill => (
                                                    <option key={skill.id} value={skill.id}>
                                                        {skill.skill_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ flex: '1' }}>
                                            <label style={{ fontSize: '12px', marginBottom: '5px', display: 'block' }}>Minimum Proficiency Level</label>
                                            <select
                                                value={selectedMinProficiency}
                                                onChange={(e) => setSelectedMinProficiency(e.target.value)}
                                                style={{ width: '100%' }}
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                                <option value="Expert">Expert</option>
                                            </select>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={handleAddSkillToProject}
                                            className="btn btn-success"
                                            style={{ padding: '10px 20px', height: 'fit-content' }}
                                        >
                                            + Add
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Display added skills */}
                            {skillFormData.skills.length > 0 && (
                                <div style={{ 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px', 
                                    padding: '10px',
                                    backgroundColor: '#f9f9f9',
                                    marginTop: '10px'
                                }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {skillFormData.skills.map((skillItem, index) => (
                                            <div key={index} style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '14px'
                                            }}>
                                                <span>{getSkillName(skillItem.skill_id)}</span>
                                                <span style={{ 
                                                    marginLeft: '6px', 
                                                    padding: '2px 6px',
                                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                                    borderRadius: '10px',
                                                    fontSize: '11px'
                                                }}>
                                                    Min: {skillItem.min_proficiency_level}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkillFromForm(skillItem.skill_id)}
                                                    style={{
                                                        marginLeft: '8px',
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '16px',
                                                        padding: '0',
                                                        lineHeight: '1'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {skillFormData.skills.length === 0 && (
                                <small style={{ color: '#d9534f', marginTop: '5px', display: 'block' }}>Please add at least one required skill</small>
                            )}
                        </div>
                        <button type="submit" className="btn btn-success">
                            Add Required Skills
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </form>
                )}

                {projects.length === 0 ? (
                    <div className="empty-state">
                        <h3>No projects found</h3>
                        <p>Create your first project to get started</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="empty-state">
                        <h3>No results found</h3>
                        <p>No projects match your search criteria</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Description</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project) => (
                                    <tr key={project.id}>
                                        <td className="align-middle"><strong>{project.project_name}</strong></td>
                                        <td className="align-middle">{project.description || '-'}</td>
                                        <td className="align-middle">{new Date(project.start_date).toLocaleDateString()}</td>
                                        <td className="align-middle">{new Date(project.end_date).toLocaleDateString()}</td>
                                        <td className="align-middle">
                                            <span className={`badge ${getBadgeClass(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="table-actions align-middle">
                                        <button
                                            className="btn btn-info"
                                            onClick={() => handleViewDetails(project)}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEdit(project)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(project.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>

            {/* Modal for viewing project details */}
            {showModal && selectedProjectDetails && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Project Details</h3>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-item">
                                <label>Project Name</label>
                                <p><strong>{selectedProjectDetails.project_name}</strong></p>
                            </div>
                            <div className="detail-item">
                                <label>Description</label>
                                <p>{selectedProjectDetails.description || 'No description provided'}</p>
                            </div>
                            <div className="detail-item">
                                <label>Start Date</label>
                                <p>{new Date(selectedProjectDetails.start_date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</p>
                            </div>
                            <div className="detail-item">
                                <label>End Date</label>
                                <p>{new Date(selectedProjectDetails.end_date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</p>
                            </div>
                            <div className="detail-item">
                                <label>Status</label>
                                <p>
                                    <span className={`badge ${getBadgeClass(selectedProjectDetails.status)}`}>
                                        {selectedProjectDetails.status}
                                    </span>
                                </p>
                            </div>
                            <div className="detail-item">
                                <label>Required Skills & Minimum Proficiency Levels</label>
                                {(() => {
                                    // Check if required_skills is a string (comma-separated from GROUP_CONCAT)
                                    if (selectedProjectDetails.required_skills && typeof selectedProjectDetails.required_skills === 'string') {
                                        const skillNames = selectedProjectDetails.required_skills.split(', ');
                                        const proficiencyLevels = selectedProjectDetails.min_proficiency_level 
                                            ? selectedProjectDetails.min_proficiency_level.split(', ') 
                                            : [];
                                        
                                        if (skillNames.length > 0 && skillNames[0]) {
                                            return (
                                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                                    <thead>
                                                        <tr style={{ borderBottom: '2px solid #ddd' }}>
                                                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#34495e' }}>Skill</th>
                                                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#34495e' }}>Minimum Proficiency Level</th>
                                                            <th style={{ padding: '8px', textAlign: 'center', fontWeight: '600', color: '#34495e', width: '80px' }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {skillNames.map((skillName, index) => (
                                                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                                <td style={{ padding: '10px 8px' }}>{skillName}</td>
                                                                <td style={{ padding: '10px 8px' }}>
                                                                    {proficiencyLevels[index] ? (
                                                                        <span className={`badge ${getProficiencyBadgeClass(proficiencyLevels[index])}`}>
                                                                            {proficiencyLevels[index]}
                                                                        </span>
                                                                    ) : '-'}
                                                                </td>
                                                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                                                    <button
                                                                        onClick={() => handleRemoveSkillFromProject(skillName)}
                                                                        style={{
                                                                            background: 'none',
                                                                            border: 'none',
                                                                            color: '#e74c3c',
                                                                            cursor: 'pointer',
                                                                            fontSize: '18px',
                                                                            padding: '4px 8px',
                                                                            transition: 'color 0.2s'
                                                                        }}
                                                                        onMouseOver={(e) => e.target.style.color = '#c0392b'}
                                                                        onMouseOut={(e) => e.target.style.color = '#e74c3c'}
                                                                        title="Remove required skill"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            );
                                        }
                                    }
                                    // Fallback for array format
                                    else if (Array.isArray(selectedProjectDetails.required_skills) && selectedProjectDetails.required_skills.length > 0) {
                                        return (
                                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '2px solid #ddd' }}>
                                                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#34495e' }}>Skill</th>
                                                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#34495e' }}>Minimum Proficiency Level</th>
                                                        <th style={{ padding: '8px', textAlign: 'center', fontWeight: '600', color: '#34495e', width: '80px' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedProjectDetails.required_skills.map((skill, index) => (
                                                        <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                            <td style={{ padding: '10px 8px' }}>{skill.skill_name || skill}</td>
                                                            <td style={{ padding: '10px 8px' }}>
                                                                {skill.min_proficiency_level ? (
                                                                    <span className={`badge ${getProficiencyBadgeClass(skill.min_proficiency_level)}`}>
                                                                        {skill.min_proficiency_level}
                                                                    </span>
                                                                ) : '-'}
                                                            </td>
                                                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                                                <button
                                                                    onClick={() => handleRemoveSkillFromProject(skill.skill_name || skill)}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: '#e74c3c',
                                                                        cursor: 'pointer',
                                                                        fontSize: '18px',
                                                                        padding: '4px 8px',
                                                                        transition: 'color 0.2s'
                                                                    }}
                                                                    onMouseOver={(e) => e.target.style.color = '#c0392b'}
                                                                    onMouseOut={(e) => e.target.style.color = '#e74c3c'}
                                                                    title="Remove required skill"
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        );
                                    }
                                    return <p>No required skills defined</p>;
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectManagement;
