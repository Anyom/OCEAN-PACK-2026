# OCEAN PARK COMPUTER SERVICES - MOCK EXAM SYSTEM

A complete web-based Computer-Based Test (CBT) exam system built with Node.js Express and vanilla JavaScript.

## Features

✅ **Admin Panel**
- Register new candidates (generates 10-digit registration numbers)
- Upload exam questions with multiple-choice options (A-D)
- View all registered students
- View exam results and statistics

✅ **Student Portal**
- JAMB portal-style login interface
- Login using 10-digit registration number
- Professional exam interface with split-screen layout

✅ **Exam Features**
- Display one question at a time on the left
- Interactive 180-question number grid on the right
- Real-time 2-hour countdown timer
- Green highlight for answered questions
- Auto-submit when time expires
- Manual submission option

✅ **Auto-Grading**
- Automatically compares student answers with correct answers
- Calculates score and percentage
- Determines PASS/FAIL status (40% = pass)
- Stores results in JSON files

✅ **Data Storage**
- All data stored in JSON files in `/data` folder
- `students.json` - Registered candidates
- `questions.json` - Exam questions
- `results.json` - Exam results

## Project Structure

```
ocean/
├── server.js                 # Express backend server
├── package.json              # Dependencies
├── public/                   # Frontend files
│   ├── index.html            # Student login page
│   ├── admin.html            # Admin panel
│   ├── exam.html             # Exam interface
│   ├── css/
│   │   ├── login.css         # Login page styles
│   │   ├── admin.css         # Admin panel styles
│   │   └── exam.css          # Exam page styles
│   └── js/
│       ├── login.js          # Login functionality
│       ├── admin.js          # Admin operations
│       └── exam.js           # Exam logic & timer
├── data/                     # Data storage
│   ├── students.json         # Registered students
│   ├── questions.json        # Exam questions
│   └── results.json          # Exam results
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v12 or higher)
- npm (comes with Node.js)

### Step 1: Navigate to Project Directory
```powershell
cd c:\Users\USER\ocean
```

### Step 2: Install Dependencies
```powershell
npm install
```

This will install:
- `express` - Web server framework
- `body-parser` - Request parsing middleware

### Step 3: Start the Server
```powershell
npm start
```

You should see:
```
✓ OCEAN PARK COMPUTER SERVICES - MOCK EXAM
✓ Server running at http://localhost:3000
✓ Admin Panel: http://localhost:3000/admin.html
✓ Student Login: http://localhost:3000
```

### Step 4: Open in Browser
- **Admin Panel**: http://localhost:3000/admin.html
- **Student Login**: http://localhost:3000

## Usage Guide

### Admin Panel Workflow

1. **Register Students**
   - Go to Admin Panel
   - Fill in student name and subject
   - Click "Register Candidate"
   - System generates unique 10-digit registration number
   - Share registration number with student

2. **Upload Questions**
   - Click "+ Add Question"
   - Fill in question text, options A-D, and correct answer
   - Add multiple questions as needed
   - Click "Upload Questions"
   - Questions are saved to questions.json

3. **View Statistics**
   - Click "Load Students" to see all registered candidates
   - Click "Load Results" to see exam results and scores

### Student Exam Workflow

1. **Login**
   - Enter 10-digit registration number
   - Click "PROCEED TO EXAM"

2. **Take Exam**
   - Left panel: Current question with 4 options (A-D)
   - Right panel: Question grid (180 questions)
   - Click question numbers to navigate
   - Use Previous/Next buttons or click grid numbers
   - Grid buttons turn green when answered
   - Timer shows in top right corner

3. **Submit**
   - Click "SUBMIT EXAM" when ready
   - Confirm submission in popup
   - View results with score and percentage

## API Endpoints

### Student Endpoints

- **POST `/api/register`** - Register new candidate
  - Body: `{ name: string, subject: string }`
  - Returns: `{ regNumber: string, student: object }`

- **POST `/api/login`** - Student login
  - Body: `{ regNumber: string }`
  - Returns: `{ student: object }`

- **GET `/api/questions`** - Get all exam questions
  - Returns: `{ totalQuestions: number, questions: array }`

- **POST `/api/submit-exam`** - Submit exam answers
  - Body: `{ studentId, regNumber, answers, studentName, subject, timeSpent }`
  - Returns: `{ result: { score, percentage, feedback } }`

- **GET `/api/results/:regNumber`** - Get student results
  - Returns: `{ result: object }`

### Admin Endpoints

- **GET `/api/admin/students`** - Get all students
  - Returns: `{ totalStudents, students: array }`

- **POST `/api/add-questions`** - Add questions
  - Body: `{ questions: array }`
  - Returns: `{ success, totalQuestions }`

- **GET `/api/admin/results`** - Get all results
  - Returns: `{ totalResults, results: array }`

## Question Format

When uploading questions, use this format:

```json
{
  "question": "What is the capital of Nigeria?",
  "optionA": "Lagos",
  "optionB": "Abuja",
  "optionC": "Kano",
  "optionD": "Ibadan",
  "correctAnswer": "B"
}
```

## Sample Test Data

To quickly test the system:

1. **Register a test student**
   - Name: John Doe
   - Subject: English
   - Note the registration number

2. **Add sample questions**
   - Question: What is 2+2?
   - Options: A: 3, B: 4, C: 5, D: 6
   - Correct: B

3. **Login as student**
   - Use the registration number from step 1

4. **Take exam**
   - Answer questions
   - Submit exam
   - View results

## Features Details

### Timer
- Starts at 2 hours (02:00:00)
- Counts down in real-time
- Turns red when 10 minutes remain
- Auto-submits exam when time expires

### Question Grid
- Shows 180 question slots
- Unanswered questions: white with gray border
- Answered questions: green
- Current question: blue highlight
- Click any number to jump to that question

### Grading
- Automatic comparison with correct answers
- Score calculated as: (Correct Answers / Total Questions) × 100
- Pass: ≥ 40%, Fail: < 40%

### Data Persistence
- All data saved in JSON files
- No database required
- Easy to backup and export

## Security Notes

This is a mock exam system for educational purposes. For production:
- Add authentication/security
- Use a proper database (MongoDB, PostgreSQL)
- Implement user sessions
- Add password protection to admin panel
- Use HTTPS
- Add input validation and sanitization

## Troubleshooting

### Port Already in Use
If port 3000 is in use:
```powershell
# Change PORT in server.js or use different port
$env:PORT = 3001
npm start
```

### Questions Not Loading
- Ensure questions.json exists in /data folder
- Check that questions have been uploaded via admin panel
- Check browser console for errors

### Timer Not Starting
- Refresh the page
- Clear browser cache
- Check browser console for JavaScript errors

### Results Not Saving
- Ensure /data folder exists and is writable
- Check file permissions
- Verify results.json is not corrupted

## File Descriptions

### server.js
Express server with:
- 8 API endpoints
- JSON file management
- Auto-generation of unique reg numbers
- Auto-grading logic

### public/index.html
Student login page with:
- Clean, centered design
- 10-digit registration number input
- Error/success messages

### public/admin.html
Admin dashboard with:
- Student registration form
- Dynamic question input form
- View students table
- View results table

### public/exam.html
Exam interface with:
- Question display panel
- Question grid (180 slots)
- Timer display
- Navigation buttons
- Submission modal
- Results display modal

### CSS Files
- Gradient backgrounds
- Responsive design
- Professional styling
- Color-coded elements

### JS Files
- API communication
- Form validation
- Timer logic
- Answer tracking
- Grid highlighting
- Auto-submission

## Contact & Support

For issues or questions about this system, contact:
OCEAN PARK COMPUTER SERVICES

---

**Version**: 1.0.0
**Last Updated**: February 2026
**License**: MIT
