import React, { useState, useEffect } from 'react';
import { personnelAPI } from '../services/api';

function PersonnelManagement() {
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        experience_level: 'Junior'
    });

    useEffect(() => {
        fetchPersonnel();
    }, []);

    const fetchPersonnel = async () => {
        try {
            setLoading(true);
            const response = await personnelAPI.getAll();
            setPersonnel(response.data.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch personnel: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await personnelAPI.update(editingId, formData);
                setSuccess('Personnel updated successfully!');
            } else {
                await personnelAPI.create(formData);
                setSuccess('Personnel created successfully!');
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', email: '', role: '', experience_level: 'Junior' });
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
            experience_level: person.experience_level
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
        setFormData({ name: '', email: '', role: '', experience_level: 'Junior' });
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
