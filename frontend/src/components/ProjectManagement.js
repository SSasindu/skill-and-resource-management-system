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
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectFormData, setProjectFormData] = useState({
        project_name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'Planning'
    });
    const [skillFormData, setSkillFormData] = useState({
        project_id: '',
        skill_id: '',
        min_proficiency_level: 'Beginner'
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);

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
        try {
            await projectsAPI.addRequiredSkill(skillFormData);
            setSuccess('Required skill added to project!');
            setShowSkillForm(false);
            setSkillFormData({ project_id: '', skill_id: '', min_proficiency_level: 'Beginner' });
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
        setSkillFormData({ project_id: '', skill_id: '', min_proficiency_level: 'Beginner' });
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
                            <label>Select Skill *</label>
                            <select
                                name="skill_id"
                                value={skillFormData.skill_id}
                                onChange={handleSkillInputChange}
                                required
                            >
                                <option value="">-- Select Skill --</option>
                                {skills.map((skill) => (
                                    <option key={skill.id} value={skill.id}>
                                        {skill.skill_name} ({skill.category})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Minimum Proficiency Level *</label>
                            <select
                                name="min_proficiency_level"
                                value={skillFormData.min_proficiency_level}
                                onChange={handleSkillInputChange}
                                required
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success">
                            Add Required Skill
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
                                {projects.map((project) => (
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
                                <label>Required Skills</label>
                                {selectedProjectDetails.required_skills && selectedProjectDetails.required_skills.length > 0 ? (
                                    <div className="skill-tags">
                                        {selectedProjectDetails.required_skills.map((skill, index) => (
                                            <div key={index} className="skill-tag">
                                                <span>{skill.skill_name || skill}</span>
                                                {skill.min_proficiency_level && (
                                                    <span className="proficiency">
                                                        Min: {skill.min_proficiency_level}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No required skills defined</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectManagement;
