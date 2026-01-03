-- Skill and Resource Management System Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS skill_resource_db;
USE skill_resource_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS project_required_skills;
DROP TABLE IF EXISTS personnel_skills;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS personnel;

-- Personnel Table
CREATE TABLE personnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL,
    experience_level ENUM('Junior', 'Mid-Level', 'Senior') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_experience (experience_level)
);

-- Skills Table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(255) NOT NULL UNIQUE,
);

-- Personnel Skills (Junction Table with Proficiency)
CREATE TABLE personnel_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personnel_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_personnel_skill (personnel_id, skill_id),
    INDEX idx_personnel (personnel_id),
    INDEX idx_skill (skill_id)
);

-- Projects Table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Planning', 'Active', 'Completed') NOT NULL DEFAULT 'Planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
);

-- Project Required Skills
CREATE TABLE project_required_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    min_proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_skill (project_id, skill_id),
    INDEX idx_project (project_id)
);

-- Sample Data (Optional)
-- Insert sample personnel
INSERT INTO personnel (name, email, role, experience_level) VALUES
('John Smith', 'john.smith@example.com', 'Frontend Developer', 'Senior'),
('Sarah Johnson', 'sarah.j@example.com', 'Full Stack Developer', 'Mid-Level'),
('Mike Chen', 'mike.chen@example.com', 'Backend Developer', 'Senior'),
('Emily Davis', 'emily.d@example.com', 'UI/UX Designer', 'Junior'),
('David Wilson', 'david.w@example.com', 'DevOps Engineer', 'Mid-Level');

-- Insert sample skills
INSERT INTO skills (skill_name) VALUES
('React'),
('Node.js'),
('Python'),
('AWS'),
('MySQL'),
('Docker'),
('JavaScript'),
('TypeScript'),
('Git'),
('Communication');

-- Insert sample personnel skills
INSERT INTO personnel_skills (personnel_id, skill_id, proficiency_level) VALUES
(1, 1, 'Expert'),      -- John: React - Expert
(1, 7, 'Expert'),      -- John: JavaScript - Expert
(1, 8, 'Advanced'),    -- John: TypeScript - Advanced
(2, 1, 'Advanced'),    -- Sarah: React - Advanced
(2, 2, 'Advanced'),    -- Sarah: Node.js - Advanced
(2, 5, 'Intermediate'),-- Sarah: MySQL - Intermediate
(3, 2, 'Expert'),      -- Mike: Node.js - Expert
(3, 3, 'Expert'),      -- Mike: Python - Expert
(3, 5, 'Advanced'),    -- Mike: MySQL - Advanced
(4, 1, 'Intermediate'),-- Emily: React - Intermediate
(5, 4, 'Advanced'),    -- David: AWS - Advanced
(5, 6, 'Expert');      -- David: Docker - Expert

-- Insert sample projects
INSERT INTO projects (project_name, description, start_date, end_date, status) VALUES
('E-commerce Platform', 'Building a modern e-commerce solution', '2024-01-15', '2024-06-30', 'Active'),
('Mobile App Development', 'Cross-platform mobile application', '2024-02-01', '2024-08-31', 'Planning'),
('Cloud Migration', 'Migrate legacy systems to AWS', '2024-03-01', '2024-12-31', 'Planning');

-- Insert sample project required skills
INSERT INTO project_required_skills (project_id, skill_id, min_proficiency_level) VALUES
(1, 1, 'Advanced'),    -- E-commerce: React - Advanced
(1, 2, 'Intermediate'),-- E-commerce: Node.js - Intermediate
(1, 5, 'Intermediate'),-- E-commerce: MySQL - Intermediate
(2, 1, 'Advanced'),    -- Mobile App: React - Advanced
(2, 8, 'Intermediate'),-- Mobile App: TypeScript - Intermediate
(3, 4, 'Advanced'),    -- Cloud Migration: AWS - Advanced
(3, 6, 'Intermediate');-- Cloud Migration: Docker - Intermediate

-- Functions

DELIMITER $$
CREATE FUNCTION find_id (person INT, skill INT)
RETURNS INT
DETERMINISTIC
BEGIN
	DECLARE assignId INT;
    
	SELECT 
		ps.id INTO assignId
	FROM personnel_skills ps
	WHERE personnel_id = person AND skill_id=skill
    LIMIT 1;
    
    RETURN assignId;
END$$
DELIMITER ;