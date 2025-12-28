import React, { useState } from 'react';
import './App.css';
import PersonnelManagement from './components/PersonnelManagement';
import SkillManagement from './components/SkillManagement';
import ProjectManagement from './components/ProjectManagement';
import SkillMatching from './components/SkillMatching';

function App() {
  const [activeTab, setActiveTab] = useState('personnel');

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>Skill & Resource Management System</h1>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Manage personnel, skills, and match teams to projects
          </p>
        </div>
      </header>

      <nav className="nav">
        <button
          className={activeTab === 'personnel' ? 'active' : ''}
          onClick={() => setActiveTab('personnel')}
        >
          Personnel
        </button>
        <button
          className={activeTab === 'skills' ? 'active' : ''}
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </button>
        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={activeTab === 'matching' ? 'active' : ''}
          onClick={() => setActiveTab('matching')}
        >
          Skill Matching
        </button>
      </nav>

      <div className="container">
        {activeTab === 'personnel' && <PersonnelManagement />}
        {activeTab === 'skills' && <SkillManagement />}
        {activeTab === 'projects' && <ProjectManagement />}
        {activeTab === 'matching' && <SkillMatching />}
      </div>

      <footer style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d', marginTop: '40px' }}>
        <p>© 2025 Skill & Resource Management System</p>
      </footer>
    </div>
  );
}

export default App;
