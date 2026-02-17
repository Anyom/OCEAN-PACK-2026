# QUICK START GUIDE - OCEAN PARK MOCK EXAM

## ⚡ 5-Minute Setup

### 1. Open Terminal in Project Folder
```powershell
cd c:\Users\USER\ocean
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Start Server
```powershell
npm start
```

You'll see:
```
✓ OCEAN PARK COMPUTER SERVICES - MOCK EXAM
✓ Server running at http://localhost:3000
✓ Admin Panel: http://localhost:3000/admin.html
✓ Student Login: http://localhost:3000
```

### 4. Open Browser Tabs

**Tab 1 - Admin Panel**: http://localhost:3000/admin.html
**Tab 2 - Student Login**: http://localhost:3000

---

## 📝 Testing the System (10 Minutes)

### Step A: Register a Student (Admin Panel)

1. Go to **Admin Panel** tab
2. Fill in "Register New Candidate":
   - **Name**: John Doe
   - **Subject**: English
3. Click "Register Candidate"
4. **Copy the Registration Number** (10-digit)

### Step B: Add Questions (Admin Panel)

1. In the "Upload Questions" section:
2. Click "+ Add Question"
3. Fill in first question:
   - **Question**: What is the capital of Nigeria?
   - **Option A**: Lagos
   - **Option B**: Abuja
   - **Option C**: Kano
   - **Option D**: Ibadan
   - **Correct Answer**: B

4. Click "+ Add Question" again
5. Add second question:
   - **Question**: Which element is a noble gas?
   - **Option A**: Oxygen
   - **Option B**: Nitrogen
   - **Option C**: Neon
   - **Option D**: Hydrogen
   - **Correct Answer**: C

6. Click "Upload Questions"

### Step C: Student Takes Exam (Student Login)

1. Go to **Student Login** tab (or refresh it)
2. Enter the **Registration Number** from Step A
3. Click "PROCEED TO EXAM"
4. You're now in the exam:
   - **Left panel**: Shows current question
   - **Right panel**: Question grid (numbered buttons)
   - **Top right**: 2-hour timer

### Step D: Answer Questions

1. For Question 1: Select option **B** (Abuja)
2. Notice the grid button "1" turns **green** ✓
3. Click the "2" button (or click Next)
4. For Question 2: Select option **C** (Neon)
5. Notice button "2" turns **green** ✓

### Step E: Submit Exam

1. Click **"SUBMIT EXAM"** button at bottom
2. Confirm submission in popup
3. View your results:
   - **Score**: 2/2
   - **Percentage**: 100%
   - **Status**: CONGRATULATIONS! YOU PASSED!

### Step F: View Results (Admin Panel)

1. Go back to **Admin Panel**
2. Click "Load Results"
3. You'll see the exam result with:
   - Registration number
   - Student name
   - Score (2/2)
   - Percentage (100%)
   - Status (PASSED)

---

## 📊 Key Features in Action

| Feature | Location | What to Notice |
|---------|----------|-----------------|
| **Reg Number Generation** | Admin Register | 10-digit number auto-generated |
| **Question Upload** | Admin Questions | Multiple questions added |
| **Login** | Student Login | Enter reg number to access |
| **Exam Display** | Left Panel | One question at a time |
| **Question Grid** | Right Panel | Shows all questions (180 max) |
| **Green Highlighting** | Right Panel | Answered questions turn green |
| **Timer** | Top Right | Counts down from 2:00:00 |
| **Navigation** | Previous/Next Buttons | Move between questions |
| **Jump to Question** | Click grid number | Go directly to any question |
| **Auto-Submit** | Timer = 00:00:00 | Exam auto-submits when time ends |
| **Manual Submit** | Submit Button | Choose when to finish |
| **Auto-Grading** | Results Screen | Automatic score calculation |
| **Results Saved** | Admin Results | All results stored in database |

---

## 🎯 What Happens Behind the Scenes

### Registration
```
User Input: Name + Subject
    ↓
Server generates unique 10-digit Reg Number
    ↓
Saved in /data/students.json
```

### Question Upload
```
Admin Input: Question text + 4 options + Correct answer
    ↓
Saved in /data/questions.json
```

### Exam Taking
```
Student answers Q1 → Button 1 turns green
Student answers Q2 → Button 2 turns green
     ↓
Timer counts down (2 hours)
     ↓
Student clicks SUBMIT
     ↓
Server compares answers with correct answers
     ↓
Score calculated: (Correct/Total) × 100
     ↓
Result saved in /data/results.json
```

---

## 🔧 File Structure Created

```
c:\Users\USER\ocean\
├── server.js ..................... Express backend
├── package.json .................. Dependencies
├── README.md ..................... Full documentation
├── QUICKSTART.md ................. This file
├── public/
│   ├── index.html ................ Login page
│   ├── admin.html ................ Admin panel
│   ├── exam.html ................. Exam interface
│   ├── css/
│   │   ├── login.css ............. Login styling
│   │   ├── admin.css ............. Admin styling
│   │   └── exam.css .............. Exam styling
│   └── js/
│       ├── login.js .............. Login logic
│       ├── admin.js .............. Admin operations
│       └── exam.js ............... Exam & timer
└── data/
    ├── students.json ............. Student database
    ├── questions.json ............. Questions database
    └── results.json ............... Results database
```

---

## 🚀 Common Tasks

### Change Number of Questions
Currently supports up to **180 questions**. To change:
- Open `public/exam.html`
- Find: `<span id="totalQuestions">0</span>`
- The system will adapt to any number of questions added

### Change Exam Duration
Currently **2 hours**. To change:
- Open `public/js/exam.js`
- Find: `const EXAM_DURATION_MS = 2 * 60 * 60 * 1000;`
- Change `2` to desired hours (e.g., `1` for 1 hour, `3` for 3 hours)

### Change Pass Score
Currently **40%**. To change:
- Open `server.js`
- Find: `percentage >= 40 ? 'PASSED' : 'FAILED'`
- Change `40` to desired percentage

### Change Server Port
Currently **3000**. To change:
- Open `server.js`
- Find: `const PORT = 3000;`
- Change to desired port number

---

## 💾 Data Files Format

### students.json
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "subject": "English",
    "regNumber": "1234567890",
    "registeredDate": "2026-02-16T10:30:00.000Z"
  }
]
```

### questions.json
```json
[
  {
    "id": 1,
    "question": "What is the capital of Nigeria?",
    "optionA": "Lagos",
    "optionB": "Abuja",
    "optionC": "Kano",
    "optionD": "Ibadan",
    "correctAnswer": "B"
  }
]
```

### results.json
```json
[
  {
    "id": 1,
    "studentId": 1,
    "regNumber": "1234567890",
    "studentName": "John Doe",
    "subject": "English",
    "score": 2,
    "totalQuestions": 2,
    "percentage": 100,
    "submittedDate": "2026-02-16T11:00:00.000Z",
    "timeSpent": 300,
    "answers": [...]
  }
]
```

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 already in use | Change PORT in server.js or use different port |
| Questions not appearing | Upload questions via admin panel first |
| Timer not showing | Refresh exam page |
| Registration number not generating | Check /data folder permissions |
| Results not saving | Ensure /data folder exists and is writable |
| Page won't load | Check browser console (F12) for errors |

---

## 📞 Support

For issues:
1. Check browser console (F12) for errors
2. Check server terminal output
3. Verify all files are created correctly
4. Ensure /data folder exists and is writable
5. Clear browser cache and refresh

---

**System Version**: 1.0.0  
**Last Updated**: February 2026  
**Ready to Use** ✅
