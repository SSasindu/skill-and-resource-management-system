# API Testing Screenshots Guide

## Instructions for Capturing API Test Screenshots

To complete the project deliverables, you need to capture at least **5 screenshots** showing successful API tests. Follow the instructions below:

---

## Required Screenshots (Minimum 5)

### Screenshot 1: POST - Create New Personnel ✅

**What to capture:**
- Request URL: `POST http://localhost:5000/api/personnel`
- Request Headers showing `Content-Type: application/json`
- Request Body with all fields:
  ```json
  {
    "name": "Alice Thompson",
    "email": "alice.thompson@example.com",
    "role": "Backend Developer",
    "experience_level": "Mid-Level"
  }
  ```
- Response Status: `201 Created`
- Response Body showing the created personnel with auto-generated ID and timestamp

**File name:** `01_POST_Create_Personnel.png`

---

### Screenshot 2: GET - Retrieve All Personnel ✅

**What to capture:**
- Request URL: `GET http://localhost:5000/api/personnel`
- Response Status: `200 OK`
- Response Body showing an array of personnel objects with all their details

**File name:** `02_GET_All_Personnel.png`

---

### Screenshot 3: PUT - Update Skill ✅

**What to capture:**
- Request URL: `PUT http://localhost:5000/api/skills/1`
- Request Headers
- Request Body with updated skill information:
  ```json
  {
    "skill_name": "React.js",
    "category": "JavaScript Framework",
    "description": "A popular JavaScript library for building modern user interfaces"
  }
  ```
- Response Status: `200 OK`
- Response Body showing updated skill data

**File name:** `03_PUT_Update_Skill.png`

---

### Screenshot 4: POST - Assign Skill to Personnel ✅

**What to capture:**
- Request URL: `POST http://localhost:5000/api/skills/assign`
- Request Body:
  ```json
  {
    "personnel_id": 1,
    "skill_id": 5,
    "proficiency_level": "Advanced"
  }
  ```
- Response Status: `201 Created`
- Response Body showing the skill assignment with personnel name and skill name

**File name:** `04_POST_Assign_Skill.png`

---

### Screenshot 5: GET - Matching Algorithm ✅

**What to capture:**
- Request URL: `GET http://localhost:5000/api/matching/project/1`
- Response Status: `200 OK`
- Response Body showing:
  - Project details
  - Required skills array
  - Matched personnel array with:
    - Personnel information
    - Match percentage
    - Matched skills comparison
  - Total matches count

**File name:** `05_GET_Matching_Algorithm.png`

---

## How to Take Screenshots in Different Tools

### Using Postman:
1. Send the request
2. Ensure the entire window is visible (request + response)
3. Press `Windows + Shift + S` (Windows) or `Cmd + Shift + 4` (Mac)
4. Select the area to capture
5. Save with the appropriate filename

### Using Thunder Client (VS Code):
1. Send the request
2. Make sure both request and response panels are visible
3. Press `Windows + Shift + S` (Windows) or `Cmd + Shift + 4` (Mac)
4. Capture the relevant area
5. Save the screenshot

### Using Insomnia:
1. Execute the request
2. Ensure request and response are both visible
3. Capture screenshot
4. Save with descriptive filename

---

## Screenshot Quality Checklist

Before saving each screenshot, verify it shows:

✅ Complete URL with method (GET, POST, PUT, DELETE)  
✅ Request headers (if applicable)  
✅ Request body (for POST/PUT requests)  
✅ HTTP status code (200, 201, etc.)  
✅ Full response body with data  
✅ Clear, readable text (not too small)  
✅ No sensitive information (passwords, real emails if used)

---

## Alternative: Video Recording

Instead of screenshots, you can also:
1. Record a short video (2-3 minutes) demonstrating all 5 API tests
2. Use tools like OBS Studio, Loom, or Windows Game Bar
3. Show each request being sent and the response received
4. Narrate what you're testing (optional)

---

## Organization

Create a folder structure:
```
api-testing-examples/
├── screenshots/
│   ├── 01_POST_Create_Personnel.png
│   ├── 02_GET_All_Personnel.png
│   ├── 03_PUT_Update_Skill.png
│   ├── 04_POST_Assign_Skill.png
│   └── 05_GET_Matching_Algorithm.png
├── API_TESTING_GUIDE.md
├── Postman_Collection.json
└── SCREENSHOT_INSTRUCTIONS.md (this file)
```

---

## Testing Order Recommendation

Follow this order for best results:

1. **First**, start your backend server: `cd backend && npm start`
2. **Second**, verify database has sample data (from schema.sql)
3. **Test 1**: GET all personnel (to see existing data)
4. **Test 2**: POST create new personnel
5. **Test 3**: PUT update a skill
6. **Test 4**: POST assign skill to personnel
7. **Test 5**: GET matching algorithm for project 1

---

## Common Issues and Solutions

### Issue: Empty response arrays
**Solution:** Make sure you ran the database schema.sql which includes sample data

### Issue: Connection refused
**Solution:** Verify backend server is running on port 5000

### Issue: 404 errors
**Solution:** Double-check the endpoint URLs and IDs

### Issue: 400 Bad Request
**Solution:** Verify JSON syntax in request body and all required fields are present

---

## Tips for Best Screenshots

1. **Use a clean background**: Close unnecessary browser tabs
2. **Full screen the API tool**: Maximize Postman/Thunder Client
3. **Zoom appropriately**: Text should be readable but fit in one screen
4. **Include timestamps**: Shows when the test was performed
5. **Highlight important parts**: Use arrows or boxes if needed (optional)

---

## Submission Checklist

Before submitting your project, ensure:

- [ ] All 5 required API test screenshots are captured
- [ ] Each screenshot clearly shows request and response
- [ ] Screenshots are named descriptively
- [ ] All status codes are successful (200, 201)
- [ ] Response data is visible and correct
- [ ] Screenshots are in a common format (PNG, JPG)
- [ ] Images are clear and readable

---

**Note**: These screenshots demonstrate that your API is working correctly and will be part of your project deliverables. Take your time to ensure they clearly show the functionality of your application.

---

Last Updated: December 2025
