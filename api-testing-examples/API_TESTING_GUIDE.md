# API Testing Documentation

This document contains examples and screenshots for testing the Skill and Resource Management System API.

## Required API Tests (Minimum 5)

Below are the 5 required API tests with detailed request and response examples.

---

## 1. POST - Create New Personnel

**Endpoint:** `POST http://localhost:5000/api/personnel`

**Description:** Creates a new personnel record in the system.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Alice Thompson",
  "email": "alice.thompson@example.com",
  "role": "Backend Developer",
  "experience_level": "Mid-Level"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Personnel created successfully",
  "data": {
    "id": 6,
    "name": "Alice Thompson",
    "email": "alice.thompson@example.com",
    "role": "Backend Developer",
    "experience_level": "Mid-Level",
    "created_at": "2025-12-27T10:30:45.000Z"
  }
}
```

**Validation Tests:**
- Missing required fields should return 400 error
- Invalid email format should return 400 error
- Duplicate email should return 400 error
- Invalid experience level should return 400 error

---

## 2. GET - Retrieve All Personnel

**Endpoint:** `GET http://localhost:5000/api/personnel`

**Description:** Retrieves a list of all personnel in the system.

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john.smith@example.com",
      "role": "Frontend Developer",
      "experience_level": "Senior",
      "created_at": "2025-12-27T08:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Sarah Johnson",
      "email": "sarah.j@example.com",
      "role": "Full Stack Developer",
      "experience_level": "Mid-Level",
      "created_at": "2025-12-27T08:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Mike Chen",
      "email": "mike.chen@example.com",
      "role": "Backend Developer",
      "experience_level": "Senior",
      "created_at": "2025-12-27T08:00:00.000Z"
    }
  ]
}
```

---

## 3. PUT - Update Skill

**Endpoint:** `PUT http://localhost:5000/api/skills/1`

**Description:** Updates an existing skill's information.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "skill_name": "React.js",
  "category": "JavaScript Framework",
  "description": "A popular JavaScript library for building modern user interfaces with component-based architecture"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Skill updated successfully",
  "data": {
    "id": 1,
    "skill_name": "React.js",
    "category": "JavaScript Framework",
    "description": "A popular JavaScript library for building modern user interfaces with component-based architecture",
    "created_at": "2025-12-27T08:00:00.000Z"
  }
}
```

**Error Cases:**
- Skill ID not found: 404 Not Found
- Duplicate skill name: 400 Bad Request

---

## 4. POST - Assign Skill to Personnel

**Endpoint:** `POST http://localhost:5000/api/skills/assign`

**Description:** Assigns a skill with a proficiency level to a personnel member.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "personnel_id": 1,
  "skill_id": 5,
  "proficiency_level": "Advanced"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Skill assigned to personnel successfully",
  "data": {
    "id": 15,
    "personnel_id": 1,
    "skill_id": 5,
    "proficiency_level": "Advanced",
    "personnel_name": "John Smith",
    "skill_name": "MySQL",
    "created_at": "2025-12-27T10:45:30.000Z"
  }
}
```

**Valid Proficiency Levels:**
- Beginner
- Intermediate
- Advanced
- Expert

**Error Cases:**
- Personnel not found: 404
- Skill not found: 404
- Skill already assigned to personnel: 400
- Invalid proficiency level: 400

---

## 5. GET - Matching Algorithm (Find Personnel for Project)

**Endpoint:** `GET http://localhost:5000/api/matching/project/1`

**Description:** Finds all personnel who match the required skills for a specific project.

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": 1,
      "project_name": "E-commerce Platform",
      "description": "Building a modern e-commerce solution",
      "start_date": "2024-01-15",
      "end_date": "2024-06-30",
      "status": "Active",
      "created_at": "2025-12-27T08:00:00.000Z"
    },
    "required_skills": [
      {
        "skill_id": 1,
        "skill_name": "React",
        "min_proficiency_level": "Advanced"
      },
      {
        "skill_id": 2,
        "skill_name": "Node.js",
        "min_proficiency_level": "Intermediate"
      },
      {
        "skill_id": 5,
        "skill_name": "MySQL",
        "min_proficiency_level": "Intermediate"
      }
    ],
    "matched_personnel": [
      {
        "id": 2,
        "name": "Sarah Johnson",
        "email": "sarah.j@example.com",
        "role": "Full Stack Developer",
        "experience_level": "Mid-Level",
        "match_percentage": 83,
        "matched_skills": [
          {
            "skill_name": "React",
            "required_level": "Advanced",
            "person_level": "Advanced"
          },
          {
            "skill_name": "Node.js",
            "required_level": "Intermediate",
            "person_level": "Advanced"
          },
          {
            "skill_name": "MySQL",
            "required_level": "Intermediate",
            "person_level": "Intermediate"
          }
        ]
      }
    ],
    "total_matches": 1
  }
}
```

**How the Algorithm Works:**
1. Retrieves all required skills for the project
2. Searches through all personnel
3. Checks if each person has ALL required skills
4. Verifies proficiency levels meet or exceed minimums
5. Calculates match percentage based on skill levels
6. Sorts results by match percentage (highest first)

---

## Additional API Tests

### 6. POST - Create New Skill

**Endpoint:** `POST http://localhost:5000/api/skills`

**Request Body:**
```json
{
  "skill_name": "MongoDB",
  "category": "Database",
  "description": "NoSQL document database"
}
```

---

### 7. POST - Create New Project

**Endpoint:** `POST http://localhost:5000/api/projects`

**Request Body:**
```json
{
  "project_name": "Mobile Banking App",
  "description": "Cross-platform mobile banking application",
  "start_date": "2024-03-01",
  "end_date": "2024-09-30",
  "status": "Planning"
}
```

---

### 8. POST - Add Required Skill to Project

**Endpoint:** `POST http://localhost:5000/api/projects/required-skills`

**Request Body:**
```json
{
  "project_id": 1,
  "skill_id": 1,
  "min_proficiency_level": "Advanced"
}
```

---

### 9. GET - Get Personnel with Skills

**Endpoint:** `GET http://localhost:5000/api/personnel/1/skills`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "Frontend Developer",
    "experience_level": "Senior",
    "created_at": "2025-12-27T08:00:00.000Z",
    "skills": [
      {
        "id": 1,
        "skill_id": 1,
        "skill_name": "React",
        "category": "Framework",
        "proficiency_level": "Expert"
      },
      {
        "id": 2,
        "skill_id": 7,
        "skill_name": "JavaScript",
        "category": "Programming Language",
        "proficiency_level": "Expert"
      }
    ]
  }
}
```

---

### 10. DELETE - Delete Personnel

**Endpoint:** `DELETE http://localhost:5000/api/personnel/6`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Personnel deleted successfully"
}
```

---

## Testing with Postman

### Setup Instructions:

1. **Download and Install Postman** from https://www.postman.com/downloads/

2. **Create a New Collection**
   - Name it "Skill & Resource Management API"
   - Add all the endpoints listed above

3. **Set Environment Variables** (Optional but Recommended)
   - Create a new environment
   - Add variable: `base_url` = `http://localhost:5000/api`
   - Use `{{base_url}}/personnel` in requests

4. **Import Collection** (If provided)
   - File → Import
   - Select the Postman collection JSON file

### Testing Workflow:

1. Start the backend server
2. Test GET endpoints first to see existing data
3. Test POST endpoints to create new records
4. Test PUT endpoints to update records
5. Test the matching algorithm
6. Test DELETE endpoints last

---

## Testing with Thunder Client (VS Code Extension)

### Setup:

1. Install Thunder Client extension in VS Code
2. Create a new request
3. Set method (GET, POST, PUT, DELETE)
4. Enter URL
5. Add headers and body as needed
6. Send request and review response

---

## Screenshot Checklist

For project submission, capture screenshots showing:

✅ **Test 1:** POST request creating new personnel with full request body and 201 response  
✅ **Test 2:** GET request retrieving all personnel with data array in response  
✅ **Test 3:** PUT request updating a skill with request body and success response  
✅ **Test 4:** POST request assigning skill to personnel with all required fields  
✅ **Test 5:** GET request to matching endpoint showing project details and matched personnel  

Each screenshot should clearly show:
- Request method and URL
- Request headers
- Request body (for POST/PUT)
- Response status code
- Response body with data

---

## Common Response Codes

- **200 OK** - Successful GET, PUT, DELETE
- **201 Created** - Successful POST (resource created)
- **400 Bad Request** - Validation error, missing fields, invalid data
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server-side error

---

## Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description here",
  "error": "Detailed error message"
}
```

---

## Testing Best Practices

1. **Test in Order**: Create resources before trying to update/delete them
2. **Use Valid Data**: Follow the schema requirements
3. **Check Relationships**: Ensure foreign keys reference existing records
4. **Test Edge Cases**: Empty strings, null values, invalid IDs
5. **Verify Timestamps**: Check that created_at is auto-generated
6. **Test Validations**: Try invalid emails, experience levels, etc.

---

**Last Updated:** December 2025  
**API Version:** 1.0.0
