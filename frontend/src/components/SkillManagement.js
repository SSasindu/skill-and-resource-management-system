import React, { useState, useEffect } from 'react';
import { skillsAPI, personnelAPI } from '../services/api';

function SkillManagement() {
    const [skills, setSkills] = useState([]);
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [skillFormData, setSkillFormData] = useState({skill_name: ''});
    const [assignFormData, setAssignFormData] = useState({
        personnel_id: '',
        skill_id: '',
        proficiency_level: 'Beginner'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [skillsRes, personnelRes] = await Promise.all([
                skillsAPI.getAll(),
                personnelAPI.getAll()
            ]);
            setSkills(skillsRes.data.data);
            setPersonnel(personnelRes.data.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSkillInputChange = (e) => {
        setSkillFormData({
            ...skillFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleAssignInputChange = (e) => {
        setAssignFormData({
            ...assignFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleSkillSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await skillsAPI.update(editingId, skillFormData);
                setSuccess('Skill updated successfully!');
            } else {
                await skillsAPI.create(skillFormData);
                setSuccess('Skill created successfully!');
            }
            setShowSkillForm(false);
            setEditingId(null);
            setSkillFormData({ skill_name: '', category: '', description: '' });
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        try {
            await skillsAPI.assignToPersonnel(assignFormData);
            setSuccess('Skill assigned successfully!');
            setShowAssignForm(false);
            setAssignFormData({ personnel_id: '', skill_id: '', proficiency_level: 'Beginner' });
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Assignment failed');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleEdit = (skill) => {
        setSkillFormData({
            skill_name: skill.skill_name,
            category: skill.category,
            description: skill.description || ''
        });
        setEditingId(skill.id);
        setShowSkillForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this skill?')) {
            try {
                await skillsAPI.delete(id);
                setSuccess('Skill deleted successfully!');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.response?.data?.message || 'Delete failed');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleCancel = () => {
        setShowSkillForm(false);
        setShowAssignForm(false);
        setEditingId(null);
        setSkillFormData({ skill_name: '', category: '', description: '' });
        setAssignFormData({ personnel_id: '', skill_id: '', proficiency_level: 'Beginner' });
    };

    if (loading) return <div className="loading">Loading skills...</div>;

    return (
        <div>
            <div className="card">
                <h2>Skill Management</h2>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                <div style={{ marginBottom: '20px' }}>
                    {!showSkillForm && !showAssignForm && (
                        <>
                            <button className="btn btn-primary" onClick={() => setShowSkillForm(true)}>
                                Add New Skill
                            </button>
                            <button className="btn btn-success" onClick={() => setShowAssignForm(true)}>
                                Assign Skill to Personnel
                            </button>
                        </>
                    )}
                </div>

                {showSkillForm && (
                    <form onSubmit={handleSkillSubmit} style={{ marginBottom: '30px' }}>
                        <h3>{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
                        <div className="form-group">
                            <label>Skill Name *</label>
                            <input
                                type="text"
                                name="skill_name"
                                value={skillFormData.skill_name}
                                onChange={handleSkillInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success">
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </form>
                )}

                {showAssignForm && (
                    <form onSubmit={handleAssignSubmit} style={{ marginBottom: '30px' }}>
                        <h3>Assign Skill to Personnel</h3>
                        <div className="form-group">
                            <label>Select Personnel *</label>
                            <select
                                name="personnel_id"
                                value={assignFormData.personnel_id}
                                onChange={handleAssignInputChange}
                                required
                            >
                                <option value="">-- Select Personnel --</option>
                                {personnel.map((person) => (
                                    <option key={person.id} value={person.id}>
                                        {person.name} - {person.role}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Select Skill *</label>
                            <select
                                name="skill_id"
                                value={assignFormData.skill_id}
                                onChange={handleAssignInputChange}
                                required
                            >
                                <option value="">-- Select Skill --</option>
                                {skills.map((skill) => (
                                    <option key={skill.id} value={skill.id}>
                                        {skill.skill_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Proficiency Level *</label>
                            <select
                                name="proficiency_level"
                                value={assignFormData.proficiency_level}
                                onChange={handleAssignInputChange}
                                required
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success">
                            Assign Skill
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </form>
                )}

                {skills.length === 0 ? (
                    <div className="empty-state">
                        <h3>No skills found</h3>
                        <p>Add your first skill to get started</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Skill Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill) => (
                                    <tr key={skill.id}>
                                        <td className="align-middle"><strong>{skill.skill_name}</strong></td>
                                        <td className="table-actions align-middle">
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEdit(skill)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(skill.id)}
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
        </div>
    );
}

export default SkillManagement;
