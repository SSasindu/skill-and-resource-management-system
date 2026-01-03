# Skill and Resource Management System

A full-stack web application designed for small consultancies and tech agencies to manage personnel skills and match them to project requirements. This system helps track team member capabilities and suggests the best personnel for upcoming projects based on skill matching algorithms.

## 🚀 Features

### Core Functionality

1. **Personnel Management (CRUD)**
   - Create, Read, Update, and Delete personnel records
   - Track name, email, role/title, and experience level
   - Automatic timestamp tracking
   - Email validation

2. **Skill Management (CRUD)**
   - Maintain a catalog of skills with categories
   - Create, Read, Update, and Delete skills
   - Assign skills to personnel with proficiency levels
   - Four proficiency levels: Beginner, Intermediate, Advanced, Expert

3. **Project Management**
   - Create and manage projects with timelines
   - Define required skills with minimum proficiency levels
   - Track project status (Planning, Active, Completed)

4. **Intelligent Skill Matching**
   - Algorithm matches personnel to project requirements
   - Filters by required skills and proficiency levels
   - Displays match percentage for each candidate
   - Shows detailed skill comparison

## 🛠️ Technology Stack

### Frontend
- **React.js** (v18.2.0) - UI framework with functional components and Hooks
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** (v4.18.2) - Web application framework
- **MySQL2** - MySQL client for Node.js
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- **MySQL** - Relational database management system

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SSasindu/skill-and-resource-management-system.git
cd skill-and-resource-management-system
```

### 2. Database Setup

1. Start your MySQL server

2. Create the database and tables:
```bash
mysql -u root -p < database/schema.sql
```

Or manually execute the SQL file:
```bash
mysql -u root -p
source database/schema.sql
```

This will:
- Create the `skill_resource_db` database
- Create all required tables with relationships
- Insert sample data for testing

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your MySQL credentials
# Example:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=skill_resource_db
# DB_PORT=3306
# PORT=5000
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Start Backend Server

```bash
# From the backend directory
cd backend
npm start

# For development with auto-reload
npm run dev
```

The backend server will start on `http://localhost:5000`

### Start Frontend Application

```bash
# From the frontend directory (in a new terminal)
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Personnel Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/personnel` | Get all personnel |
| GET | `/personnel/:id` | Get single personnel by ID |
| POST | `/personnel` | Create new personnel |
| PUT | `/personnel/:id` | Update personnel |
| DELETE | `/personnel/:id` | Delete personnel |
| GET | `/personnel/:id/skills` | Get personnel with their skills |

**Create Personnel Example:**
```json
POST /api/personnel
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "Frontend Developer",
  "experience_level": "Senior"
}
```

### Skills Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/skills` | Get all skills |
| GET | `/skills/:id` | Get single skill by ID |
| POST | `/skills` | Create new skill |
| PUT | `/skills/:id` | Update skill |
| DELETE | `/skills/:id` | Delete skill |
| POST | `/skills/assign` | Assign skill to personnel |
| PUT | `/skills/assignment/:id` | Update skill assignment |
| DELETE | `/skills/assignment/:id` | Remove skill from personnel |

**Assign Skill Example:**
```json
POST /api/skills/assign
{
  "personnel_id": 1,
  "skill_id": 2,
  "proficiency_level": "Advanced"
}
```

### Projects Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all projects |
| GET | `/projects/:id` | Get single project by ID |
| POST | `/projects` | Create new project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| POST | `/projects/required-skills` | Add required skill to project |
| GET | `/projects/:id/skills` | Get project with required skills |
| DELETE | `/projects/required-skills/:id` | Remove required skill |

**Create Project Example:**
```json
POST /api/projects
{
  "project_name": "E-commerce Platform",
  "description": "Building a modern e-commerce solution",
  "start_date": "2024-01-15",
  "end_date": "2024-06-30",
  "status": "Active"
}
```

### Matching Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/matching/project/:id` | Get matching personnel for a project |
| GET | `/matching/projects/all` | Get all project matches overview |

**Matching Response Example:**
```json
GET /api/matching/project/1
{
  "success": true,
  "data": {
    "project": {...},
    "required_skills": [...],
    "matched_personnel": [
      {
        "id": 1,
        "name": "John Smith",
        "role": "Frontend Developer",
        "match_percentage": 85,
        "matched_skills": [...]
      }
    ],
    "total_matches": 2
  }
}
```

## 🗄️ Database Schema

### Tables

1. **personnel**
   - id (Primary Key)
   - name
   - email (Unique)
   - role
   - experience_level (Junior, Mid-Level, Senior)
   - created_at

2. **skills**
   - id (Primary Key)
   - skill_name (Unique)

3. **personnel_skills** (Junction Table)
   - id (Primary Key)
   - personnel_id (Foreign Key)
   - skill_id (Foreign Key)
   - proficiency_level (Beginner, Intermediate, Advanced, Expert)
   - created_at

4. **projects**
   - id (Primary Key)
   - project_name
   - description
   - start_date
   - end_date
   - status (Planning, Active, Completed)
   - created_at

5. **project_required_skills**
   - id (Primary Key)
   - project_id (Foreign Key)
   - skill_id (Foreign Key)
   - min_proficiency_level
   - created_at

## 🧪 Testing the API

### Using the Provided Sample Data

The database schema includes sample data:
- 5 personnel members
- 10 skills
- 3 projects
- Multiple skill assignments

### Testing with Postman/Thunder Client

See the `api-testing` folder for:
- Collection of API requests
- Screenshots of successful API calls

### Manual Testing Workflow

1. **Create Personnel**: POST to `/api/personnel`
2. **Create Skills**: POST to `/api/skills`
3. **Assign Skills**: POST to `/api/skills/assign`
4. **Create Project**: POST to `/api/projects`
5. **Add Required Skills**: POST to `/api/projects/required-skills`
6. **Match Personnel**: GET `/api/matching/project/:id`

## 📁 Project Structure

```
skill-and-resource-management-system/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── personnelController.js
│   │   ├── skillController.js
│   │   ├── projectController.js
│   │   └── matchingController.js
│   ├── routes/
│   │   ├── personnelRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── projectRoutes.js
│   │   └── matchingRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── PersonnelManagement.js
│   │   │   ├── SkillManagement.js
│   │   │   ├── ProjectManagement.js
│   │   │   └── SkillMatching.js
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── .gitignore
│   └── package.json
├── database/
│   └── schema.sql               # Database schema & seed data
└── README.md
```

## 🎯 Usage Guide

### Managing Personnel

1. Navigate to the "Personnel" tab
2. Click "Add New Personnel"
3. Fill in required fields (name, email, role, experience level, skills)
4. Click "Create" to save
5. Use "Edit" or "Delete" buttons to manage existing personnel

### Managing Skills

1. Navigate to the "Skills" tab
2. Click "Add New Skill" to create skills

### Managing Projects

1. Navigate to the "Projects" tab
2. Click "Add New Project"
3. Fill in project details and timeline
4. Select required skills and minimum proficiency level in the dropdown menu and save

### Finding Matching Personnel

1. Navigate to the "Skill Matching" tab
2. Select a project from the dropdown
3. Click "Find Matching Personnel"
4. Review matched personnel with their:
   - Match percentage
   - Skills comparison
   - Experience level
5. Personnel must have ALL required skills at or above minimum proficiency

## 🔒 Security Considerations

- Input validation on both client and server
- Email format validation
- SQL injection prevention using parameterized queries
- CORS configuration for secure cross-origin requests
- Environment variables for sensitive configuration

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database exists and tables are created

### Backend Won't Start
```bash
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# Or change PORT in .env file
```

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check CORS configuration
- Ensure proxy is set in frontend/package.json

## 📝 Development Notes

### Adding New Features

1. **Backend**: Add controller → Add route → Update server.js
2. **Frontend**: Create component → Add API call → Update App.js

### Database Migrations

When modifying schema:
1. Backup existing data
2. Update `schema.sql`
3. Test with fresh database
4. Document changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 👨‍💻 Author

Developed as a full-stack skill and resource management solution for small consultancies and tech agencies.

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check existing documentation
- Review API endpoint examples

## 🎉 Acknowledgments

- Built with React, Express, and MySQL
- Implements RESTful API best practices
- Responsive design for all devices

