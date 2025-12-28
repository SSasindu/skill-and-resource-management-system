# Quick Start Guide

Get the Skill and Resource Management System running in minutes!

## Prerequisites Check

Before starting, verify you have:
- ✅ Node.js installed (v14+): `node --version`
- ✅ MySQL installed (v8+): `mysql --version`
- ✅ npm installed: `npm --version`

## Step-by-Step Setup

### 1️⃣ Database Setup (5 minutes)

```bash
# Start MySQL service
# Windows: Start from Services or MySQL Workbench
# Mac: brew services start mysql
# Linux: sudo service mysql start

# Create database and tables
mysql -u root -p < database/schema.sql

# Enter your MySQL password when prompted
```

**What this does:**
- Creates `skill_resource_db` database
- Creates all 5 tables with relationships
- Inserts sample data (5 personnel, 10 skills, 3 projects)

---

### 2️⃣ Backend Setup (3 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux

# Edit .env file with your MySQL credentials
# Update these values:
# DB_USER=root
# DB_PASSWORD=your_mysql_password
```

**Start the backend:**
```bash
npm start
```

✅ You should see:
```
✓ Database connected successfully
✓ Server running on port 5000
✓ API available at http://localhost:5000
```

---

### 3️⃣ Frontend Setup (3 minutes)

**Open a NEW terminal window** (keep backend running)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

✅ Browser should automatically open to `http://localhost:3000`

---

## 🎉 You're Ready!

The application should now be running with:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Sample Data**: Already loaded

---

## First Steps in the App

1. **Personnel Tab**: View the 5 sample team members
2. **Skills Tab**: See 10 pre-loaded skills
3. **Projects Tab**: Check out 3 sample projects
4. **Skill Matching**: Select "E-commerce Platform" and click "Find Matching Personnel"

---

## Testing the API

### Option 1: Use the Web Interface
Just use the React frontend - it calls all the APIs!

### Option 2: Test with Postman
```bash
# Import the collection
1. Open Postman
2. File → Import
3. Select: api-testing-examples/Postman_Collection.json
4. Start testing!
```

### Option 3: Quick curl test
```bash
# Test if backend is working
curl http://localhost:5000/api/personnel
```

---

## Common Issues & Fixes

### ❌ "Database connection failed"
**Fix:** 
- Check MySQL is running
- Verify credentials in `backend/.env`
- Ensure database was created: `SHOW DATABASES;` in MySQL

### ❌ "Port 5000 already in use"
**Fix:** 
- Change PORT in `backend/.env` to 5001
- Restart backend

### ❌ "Cannot find module"
**Fix:** 
```bash
# Re-install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### ❌ Frontend shows connection error
**Fix:**
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify `proxy` in frontend/package.json

---

## What's Next?

### Try These Tasks:

1. **Add a New Team Member**
   - Go to Personnel tab
   - Click "Add New Personnel"
   - Fill in the form

2. **Create a Custom Skill**
   - Go to Skills tab
   - Click "Add New Skill"
   - Create "Vue.js" with category "Framework"

3. **Assign Skills**
   - Click "Assign Skill to Personnel"
   - Link your new team member to skills

4. **Create a Project**
   - Go to Projects tab
   - Add a new project with timeline
   - Define required skills

5. **Test Matching**
   - Go to Skill Matching tab
   - Select your project
   - See who matches!

---

## Stopping the Application

### Stop Backend:
```bash
# In backend terminal
Ctrl + C
```

### Stop Frontend:
```bash
# In frontend terminal
Ctrl + C
```

### Stop MySQL:
```bash
# Windows: Use Services
# Mac: brew services stop mysql
# Linux: sudo service mysql stop
```

---

## Project Structure Overview

```
skill-and-resource-management-system/
├── backend/          ← Express API server
├── frontend/         ← React web app
├── database/         ← SQL schema
└── api-testing-examples/  ← Testing guides
```

---

## Need Help?

1. Check [README.md](../README.md) for detailed documentation
2. Review [API_TESTING_GUIDE.md](../api-testing-examples/API_TESTING_GUIDE.md)
3. Verify all dependencies are installed
4. Check MySQL error logs
5. Look at browser console for frontend errors

---

## Development Mode

For active development with auto-reload:

**Backend:**
```bash
cd backend
npm run dev  # Uses nodemon
```

**Frontend:**
```bash
cd frontend
npm start    # Already has hot-reload
```

---

## Production Build

### Build Frontend:
```bash
cd frontend
npm run build
```

Creates optimized production build in `frontend/build/`

### Deploy:
- Frontend: Upload `build/` folder to hosting
- Backend: Deploy to Node.js hosting (Heroku, DigitalOcean, AWS)
- Database: Use hosted MySQL (AWS RDS, PlanetScale)

---

**Total Setup Time:** ~10-15 minutes  
**Difficulty:** Beginner-friendly  

Enjoy your Skill and Resource Management System! 🚀
