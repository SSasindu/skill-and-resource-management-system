import React, { useState, useEffect } from 'react';
import { matchingAPI, projectsAPI } from '../services/api';

function SkillMatching() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [matchResults, setMatchResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data.data);
        } catch (err) {
            setError('Failed to fetch projects: ' + err.message);
        }
    };

    const handleMatch = async () => {
        if (!selectedProjectId) {
            setError('Please select a project');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await matchingAPI.matchProject(selectedProjectId);
            setMatchResults(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to match personnel');
        } finally {
            setLoading(false);
        }
    };

    const getProficiencyBadge = (level) => {
        const classes = {
            'Beginner': 'badge-beginner',
            'Intermediate': 'badge-intermediate',
            'Advanced': 'badge-advanced',
            'Expert': 'badge-expert'
        };
        return classes[level] || '';
    };

    const getExperienceBadge = (level) => {
        const classes = {
            'Junior': 'badge-junior',
            'Mid-Level': 'badge-mid',
            'Senior': 'badge-senior'
        };
        return classes[level] || '';
    };

    return (
        <div>
            <div className="card">
                <h2>Skill Matching - Find Personnel for Projects</h2>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="form-group">
                    <label>Select Project</label>
                    <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        style={{ marginRight: '10px' }}
                    >
                        <option value="">-- Select a Project --</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.project_name} ({project.status})
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn btn-primary"
                        onClick={handleMatch}
                        disabled={loading || !selectedProjectId}
                    >
                        {loading ? 'Matching...' : 'Find Matching Personnel'}
                    </button>
                </div>

                {matchResults && (
                    <div style={{ marginTop: '30px' }}>
                        <div style={{ backgroundColor: '#ecf0f1', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h3>Project: {matchResults.project.project_name}</h3>
                            <p><strong>Description:</strong> {matchResults.project.description || 'N/A'}</p>
                            <p><strong>Status:</strong> {matchResults.project.status}</p>
                            <p><strong>Duration:</strong> {new Date(matchResults.project.start_date).toLocaleDateString()} - {new Date(matchResults.project.end_date).toLocaleDateString()}</p>
                        </div>

                        <div>
                            <h3>Required Skills</h3>
                            {matchResults.required_skills.length === 0 ? (
                                <div className="alert alert-info">
                                    No required skills defined for this project yet.
                                </div>
                            ) : (
                                <div style={{ marginBottom: '20px' }}>
                                    {matchResults.required_skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                display: 'inline-block',
                                                backgroundColor: '#3498db',
                                                color: 'white',
                                                padding: '8px 15px',
                                                margin: '5px',
                                                borderRadius: '20px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {skill.skill_name} (Min: {skill.min_proficiency_level})
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3>Matched Personnel ({matchResults.total_matches})</h3>
                            {matchResults.matched_personnel.length === 0 ? (
                                <div className="empty-state">
                                    <h4>No matching personnel found</h4>
                                    <p>No team members have all the required skills with sufficient proficiency levels.</p>
                                </div>
                            ) : (
                                <div>
                                    {matchResults.matched_personnel.map((person) => (
                                        <div key={person.id} className="match-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, color: '#2c3e50' }}>{person.name}</h4>
                                                    <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
                                                        {person.role} | {person.email}
                                                    </p>
                                                    <span className={`badge ${getExperienceBadge(person.experience_level)}`}>
                                                        {person.experience_level}
                                                    </span>
                                                </div>
                                                <div className="match-percentage">
                                                    {person.match_percentage}% Match
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <strong>Matching Skills:</strong>
                                                <ul className="skill-match-list">
                                                    {person.matched_skills.map((skill, index) => (
                                                        <li key={index} className="skill-match-item">
                                                            <strong>{skill.skill_name}</strong>
                                                            <span style={{ float: 'right' }}>
                                                                Required: <span className={`badge ${getProficiencyBadge(skill.required_level)}`}>{skill.required_level}</span>
                                                                {' '}| Has: <span className={`badge ${getProficiencyBadge(skill.person_level)}`}>{skill.person_level}</span>
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!matchResults && !loading && (
                    <div className="empty-state">
                        <h3>Ready to Find the Perfect Team</h3>
                        <p>Select a project above and click "Find Matching Personnel" to see who has the required skills.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SkillMatching;
