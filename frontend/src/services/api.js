import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Personnel API
export const personnelAPI = {
    getAll: () => api.get('/personnel'),
    getById: (id) => api.get(`/personnel/${id}`),
    create: (data) => api.post('/personnel', data),
    update: (id, data) => api.put(`/personnel/${id}`, data),
    delete: (id) => api.delete(`/personnel/${id}`),
    getWithSkills: (id) => api.get(`/personnel/${id}/skills`)
};

// Skills API
export const skillsAPI = {
    getAll: () => api.get('/skills'),
    getById: (id) => api.get(`/skills/${id}`),
    create: (data) => api.post('/skills', data),
    update: (id, data) => api.put(`/skills/${id}`, data),
    delete: (id) => api.delete(`/skills/${id}`),
    assignToPersonnel: (data) => api.post('/skills/assign', data),
    updateAssignment: (id, data) => api.put(`/skills/assignment/${id}`, data),
    removeAssignment: (id) => api.delete(`/skills/assignment/${id}`)
};

// Projects API
export const projectsAPI = {
    getAll: () => api.get('/projects'),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
    addRequiredSkill: (data) => api.post('/projects/required-skills', data),
    getWithSkills: (id) => api.get(`/projects/${id}/skills`),
    removeRequiredSkill: (id) => api.delete(`/projects/required-skills/${id}`)
};

// Matching API
export const matchingAPI = {
    matchProject: (projectId) => api.get(`/matching/project/${projectId}`),
    getAllMatches: () => api.get('/matching/projects/all')
};

export default api;
