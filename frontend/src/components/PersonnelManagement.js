import React, { useState, useEffect } from 'react';
import { personnelAPI, skillsAPI } from '../services/api';

function PersonnelManagement() {
    const [personnel, setPersonnel] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        experience_level: 'Junior',
        skills: []
    });
    const [selectedSkillId, setSelectedSkillId] = useState('');
    const [selectedProficiency, setSelectedProficiency] = useState('Beginner');

    useEffect(() => {
        fetchPersonnel();
    }, []);

    const fetchPersonnel = async () => {
        try {
            setLoading(true);
            const response = await personnelAPI.getAll();
            setPersonnel(response.data.data);
            const skillsResponse = await skillsAPI.getAll();
            setSkills(skillsResponse.data.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddSkill = () => {
        if (!selectedSkillId) {
            setError('Please select a skill');
            setTimeout(() => setError(''), 2000);
            return;
        }
        
        const currentSkills = formData.skills || [];
        const skillExists = currentSkills.some(s => s.skill_id === selectedSkillId);
        
        if (skillExists) {
            // Just ignore silently or show a friendly message
            setSuccess('This skill is already added to this person');
            setTimeout(() => setSuccess(''), 2000);
            return;
        }
        
        setFormData({
            ...formData,
            skills: [...currentSkills, { skill_id: selectedSkillId, proficiency_level: selectedProficiency }]
        });
        setSelectedSkillId('');
        setSelectedProficiency('Beginner');
    };

    const handleRemoveSkill = (skillId) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s.skill_id !== skillId)
        });
    };

    const getSkillName = (skillId) => {
        const skill = skills.find(s => s.id.toString() === skillId.toString());
        return skill ? skill.skill_name : '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.skills.length === 0) {
            setError('Please select at least one skill');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        try {
            let personnelId;
            
            if (editingId) {
                await personnelAPI.update(editingId, formData);
                personnelId = editingId;
            } else {
                const res = await personnelAPI.create(formData);
                personnelId = res.data.id;
            }
            
            // Assign skills with error handling for duplicates
            const skillAssignments = formData.skills.map(async (skill) => {
                try {
                    await skillsAPI.assignToPersonnel({
                        personnel_id: personnelId, 
                        skill_id: skill.skill_id, 
                        proficiency_level: skill.proficiency_level
                    });
                    return { success: true };
                } catch (err) {
                    // Silently ignore duplicate skill errors
                    if (err.response?.status === 400 && err.response?.data?.message?.includes('already assigned')) {
                        return { success: true, duplicate: true };
                    }
                    return { success: false, error: err };
                }
            });
            
            await Promise.all(skillAssignments);
            
            setSuccess(editingId ? 'Personnel updated successfully!' : 'Personnel created successfully!');
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', email: '', role: '', experience_level: 'Junior', skills: [] });
            fetchPersonnel();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleEdit = (person) => {
        setFormData({
            name: person.name,
            email: person.email,
            role: person.role,
            experience_level: person.experience_level,
            skills: Array.isArray(person.skills) ? person.skills : []
        });
        setEditingId(person.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this person?')) {
            try {
                await personnelAPI.delete(id);
                setSuccess('Personnel deleted successfully!');
                fetchPersonnel();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.response?.data?.message || 'Delete failed');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', email: '', role: '', experience_level: 'Junior', skills: [] });
    };

    const getBadgeClass = (level) => {
        switch (level) {
            case 'Junior': return 'badge-junior';
            case 'Mid-Level': return 'badge-mid';
            case 'Senior': return 'badge-senior';
            default: return '';
        }
    };

    if (loading) return <div className="loading">Loading personnel...</div>;

    return (
        <div>
            <div className="card">
                <h2>Personnel Management</h2>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                {!showForm && (
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        Add New Personnel
                    </button>
                )}

                {showForm && (
                    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Role/Title *</label>
                            <input
                                type="text"
                                name="role"
                                placeholder='Web Developer'
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Experience Level *</label>
                            <select
                                name="experience_level"
                                value={formData.experience_level}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Junior">Junior (less than 2 years)</option>
                                <option value="Mid-Level">Mid-Level (2-5 years)</option>
                                <option value="Senior">Senior (5+ years)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Skills *</label>
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
                                                {skills.filter(skill => !formData.skills.some(s => s.skill_id === skill.id.toString())).map(skill => (
                                                    <option key={skill.id} value={skill.id}>
                                                        {skill.skill_name} ({skill.category})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ flex: '1' }}>
                                            <label style={{ fontSize: '12px', marginBottom: '5px', display: 'block' }}>Proficiency Level</label>
                                            <select
                                                value={selectedProficiency}
                                                onChange={(e) => setSelectedProficiency(e.target.value)}
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
                                            onClick={handleAddSkill}
                                            className="btn btn-success"
                                            style={{ padding: '10px 20px', height: 'fit-content' }}
                                        >
                                            + Add
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Display added skills */}
                            {formData.skills.length > 0 && (
                                <div style={{ 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px', 
                                    padding: '10px',
                                    backgroundColor: '#f9f9f9',
                                    marginTop: '10px'
                                }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {formData.skills.map((skillItem, index) => (
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
                                                    {skillItem.proficiency_level}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skillItem.skill_id)}
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
                            
                            {formData.skills.length === 0 && (
                                <small style={{ color: '#d9534f', marginTop: '5px', display: 'block' }}>Please add at least one skill</small>
                            )}
                        </div>
                        <button type="submit" className="btn btn-success">
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </form>
                )}

                {personnel.length === 0 ? (
                    <div className="empty-state">
                        <h3>No personnel found</h3>
                        <p>Add your first team member to get started</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table rounded-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Experience Level</th>
                                    <th>Skills</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {personnel.map((person) => (
                                    <tr key={person.id}>
                                        <td className="align-middle py-7">{person.name}</td>
                                        <td className="align-middle py-7">{person.role}</td>
                                        <td className="align-middle py-7">
                                            <span className={`badge ${getBadgeClass(person.experience_level)}`}>
                                                {person.experience_level}
                                            </span>
                                        </td>
                                        <td className="align-middle py-7">
                                            {Array.isArray(person.skills) 
                                                ? person.skills.join(', ') 
                                                : person.skills || '-'}
                                        </td>
                                        <td className="table-actions align-middle py-7">
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEdit(person)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(person.id)}
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

export default PersonnelManagement;
