# 🎯 OCEAN PARK MOCK EXAM - VISUAL WORKFLOW GUIDE

## 🏗️ SYSTEM ARCHITECTURE

```
                    BROWSER (Client-side)
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  ┌──────────────┐  ┌──────────────────────────┐ │
    │  │ Login Page   │  │  Admin Panel             │ │
    │  │ (index.html) │  │  (admin.html)            │ │
    │  └──────┬───────┘  └──────────┬───────────────┘ │
    │         │                     │                  │
    │         │                     ├─Register Student │
    │         │                     ├─Upload Questions│
    │         │                     ├─View Students   │
    │         │                     └─View Results    │
    │         │                                        │
    │         └─Login─────────────────────────────────┤
    │                                                 │
    │         ┌──────────────────────────────────────┐│
    │         │  Exam Page (exam.html)               ││
    │         │                                      ││
    │         │  ┌──────────────┐ ┌──────────────┐  ││
    │         │  │   Question   │ │  Question    │  ││
    │         │  │   Display    │ │  Grid        │  ││
    │         │  │   (Left)     │ │  (Right)     │  ││
    │         │  └──────────────┘ └──────────────┘  ││
    │         │                                      ││
    │         │  ┌──────────────────────────────┐   ││
    │         │  │  2-Hour Timer                │   ││
    │         │  └──────────────────────────────┘   ││
    │         │                                      ││
    │         │  ┌──────────────────────────────┐   ││
    │         │  │  Submit Button               │   ││
    │         │  └──────────────────────────────┘   ││
    │         └──────────────────────────────────────┘│
    │                                                 │
    └────────────────────┬────────────────────────────┘
                         │
                    HTTP/REST API
                         │
    ┌────────────────────▼────────────────────────────┐
    │                                                 │
    │         SERVER (server.js)                     │
    │         Express.js on Port 3000                │
    │                                                 │
    │  ┌─────────────────────────────────────────┐   │
    │  │ API Endpoints (8 total)                 │   │
    │  │  • POST   /api/register                 │   │
    │  │  • POST   /api/login                    │   │
    │  │  • GET    /api/questions                │   │
    │  │  • POST   /api/add-questions            │   │
    │  │  • POST   /api/submit-exam              │   │
    │  │  • GET    /api/results/:regNumber       │   │
    │  │  • GET    /api/admin/students           │   │
    │  │  • GET    /api/admin/results            │   │
    │  └──────────────┬──────────────────────────┘   │
    │                 │                              │
    │                 │ Read/Write                   │
    │                 ▼                              │
    │  ┌─────────────────────────────────────────┐   │
    │  │  Data Files (/data folder)              │   │
    │  │  • students.json  ← Student records    │   │
    │  │  • questions.json ← Exam questions     │   │
    │  │  • results.json   ← Exam results       │   │
    │  └─────────────────────────────────────────┘   │
    │                                                 │
    └─────────────────────────────────────────────────┘
```

---

## 👥 USER WORKFLOWS

### WORKFLOW 1: ADMIN REGISTRATION

```
Admin Panel (admin.html)
       │
       ├─ Enter Name: "John Doe"
       ├─ Select Subject: "Mathematics"
       │
       └─► POST /api/register
           │
           ├─ Generate unique 10-digit number: 8374615982
           ├─ Save to /data/students.json
           │
           └─► Response: Registration successful! ✓
               Display Reg Number

Data Saved:
{
  "id": 1,
  "name": "John Doe",
  "subject": "Mathematics",
  "regNumber": "8374615982",
  "registeredDate": "2026-02-16T10:30:00Z"
}
```

### WORKFLOW 2: ADMIN UPLOAD QUESTIONS

```
Admin Panel (admin.html)
       │
       ├─ Click "+ Add Question"
       ├─ Enter Question text
       ├─ Enter Options A-D
       ├─ Select Correct Answer
       ├─ Repeat for multiple questions
       │
       └─► POST /api/add-questions
           │
           ├─ Validate all questions
           ├─ Assign IDs (1, 2, 3...)
           ├─ Save to /data/questions.json
           │
           └─► Response: "3 questions added successfully!" ✓

Data Saved:
[
  {
    "id": 1,
    "question": "What is 2+2?",
    "optionA": "3",
    "optionB": "4",
    "optionC": "5",
    "optionD": "6",
    "correctAnswer": "B"
  },
  ...
]
```

### WORKFLOW 3: STUDENT LOGIN

```
Student Portal (index.html)
       │
       ├─ Enter Reg Number: "8374615982"
       │
       └─► POST /api/login
           │
           ├─ Lookup in /data/students.json
           ├─ Verify registration exists
           ├─ Save student data to browser (localStorage)
           │
           └─► Response: Success! ✓
               Redirect to Exam Page (exam.html)

Browser Storage:
localStorage.student = {
  "id": 1,
  "name": "John Doe",
  "subject": "Mathematics",
  "regNumber": "8374615982"
}
```

### WORKFLOW 4: TAKE EXAM

```
Exam Page (exam.html)
       │
       ├─ Load Questions (GET /api/questions)
       ├─ Load student from localStorage
       ├─ Display Question 1
       ├─ Start 2-hour timer
       │
       ├─ Student selects Option A-D
       ├─ Radio button checked ✓
       ├─ Grid button 1 turns GREEN ✓
       │
       ├─ Student clicks grid button 2 (or Next)
       ├─ Question 2 displayed
       │
       ├─ Student selects Option B
       ├─ Grid button 2 turns GREEN ✓
       │
       ├─ Repeat for all questions
       │
       └─ Student clicks SUBMIT

Memory State:
studentAnswers = [
  "A",  // Question 1 answer
  "B",  // Question 2 answer
  "C",  // Question 3 answer
  null, // Q4 unanswered
  ...
]
```

### WORKFLOW 5: SUBMIT & GRADE

```
Student clicks SUBMIT
       │
       ├─ Show confirmation modal
       │
       ├─ Student confirms
       │
       └─► POST /api/submit-exam
           │
           ├─ Receive: studentAnswers array
           ├─ Load correct answers from /data/questions.json
           ├─ Compare each answer:
           │  - Q1: Student="A", Correct="A" ✓ Match (1 point)
           │  - Q2: Student="B", Correct="B" ✓ Match (1 point)
           │  - Q3: Student="C", Correct="D" ✗ Wrong (0 points)
           │  - Q4: Student=null, Correct="A" ✗ Unanswered (0 points)
           │
           ├─ Calculate:
           │  - Score = 2/4 = 50%
           │  - Status = 50% >= 40% = PASSED ✓
           │
           ├─ Save to /data/results.json
           │
           └─► Response: Results! ✓

Data Saved:
{
  "id": 1,
  "studentId": 1,
  "regNumber": "8374615982",
  "studentName": "John Doe",
  "subject": "Mathematics",
  "score": 2,
  "totalQuestions": 4,
  "percentage": 50,
  "submittedDate": "2026-02-16T11:30:00Z",
  "timeSpent": 3600,
  "answers": [...]
}
```

### WORKFLOW 6: VIEW RESULTS (ADMIN)

```
Admin Panel (admin.html)
       │
       ├─ Click "Load Results"
       │
       └─► GET /api/admin/results
           │
           ├─ Read /data/results.json
           ├─ Display in table format
           │
           └─► Table shows:
               ┌──────────────────────────────────────────┐
               │ Registration │ Name     │ Score │ Status │
               ├──────────────────────────────────────────┤
               │ 8374615982   │ John Doe │ 2/4   │ PASSED │
               └──────────────────────────────────────────┘
```

---

## ⏱️ TIMER COUNTDOWN

```
Time Remaining:
02:00:00  ← Start (2 hours)
  ▼
01:59:59
01:59:58
01:59:57
  ...
00:10:30  ← 10 minutes remaining
00:10:29    Timer turns RED ⚠️
  ...
00:00:30
00:00:29
00:00:28
  ...
00:00:01
00:00:00  ← Time expired!

On expiration:
└─► Auto-submit exam
    └─► Grade automatically
        └─► Display results
```

---

## 🎨 QUESTION GRID STATUS

```
Before answering:
┌─┬─┬─┐
│1│2│3│  All WHITE
│4│5│6│
│7│8│9│
└─┴─┴─┘

After answering Q1, Q3, Q5:
┌─┬─┬─┐
│1│2│3│  1=GREEN, 3=GREEN (answered)
│4│5│6│  5=GREEN (answered)
│7│8│9│  Others=WHITE (unanswered)
└─┴─┴─┘

Viewing Q5:
┌─┬─┬─┐
│1│2│3│  5=BLUE (current)
│4│5│6│  1,3,5=GREEN with blue focus
│7│8│9│
└─┴─┴─┘
```

---

## 📊 GRADING LOGIC

```
Student takes exam with 4 questions:

Question 1:
  Student Answer: A
  Correct Answer: A
  Result: ✓ Correct (1 point)

Question 2:
  Student Answer: B
  Correct Answer: C
  Result: ✗ Wrong (0 points)

Question 3:
  Student Answer: C
  Correct Answer: C
  Result: ✓ Correct (1 point)

Question 4:
  Student Answer: (not answered)
  Correct Answer: D
  Result: ✗ Unanswered (0 points)

───────────────────────────────────
Total Score: 2/4

Percentage Calculation:
(Correct / Total) × 100
(2 / 4) × 100 = 50%

Pass/Fail Determination:
50% >= 40% (pass threshold)
Result: PASSED ✓
```

---

## 📁 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────┐
│                 User Actions                     │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   Register      Upload Qs    Student Login
   Student       & Answers     & Exam
        │            │            │
        │            │            │
        ▼            ▼            ▼
   ┌─────────┐ ┌──────────┐ ┌─────────────┐
   │  POST   │ │   POST   │ │  POST/GET   │
   │/register│ │/questions│ │/login       │
   └────┬────┘ └────┬─────┘ └────┬────────┘
        │           │            │
        │           │            └─────────┐
        │           │                      │
        ▼           ▼                      ▼
   ┌─────────────────────────────────────────┐
   │         server.js                        │
   │      Express API Server                 │
   └────────┬────────────────────────────────┘
            │
       ┌────┼────┐
       │    │    │
       ▼    ▼    ▼
   students questions results
   .json   .json    .json
       │    │    │
       └────┼────┘
            │
            ▼
   ┌─────────────────┐
   │  File System    │
   │ /data folder    │
   └─────────────────┘
       Storage
```

---

## 🔄 COMPLETE USER JOURNEY

```
START
  │
  ├─ ADMIN PATH
  │  │
  │  ├─► Register Students ► students.json
  │  │
  │  ├─► Upload Questions ► questions.json
  │  │
  │  ├─► View Students (from students.json)
  │  │
  │  └─► View Results (from results.json)
  │
  ├─ STUDENT PATH
  │  │
  │  ├─► Enter Reg Number ─► GET students.json
  │  │                      └─ Verify match
  │  │
  │  ├─► Login Success ─► Start Exam
  │  │
  │  ├─► Load Questions ─► GET questions.json
  │  │
  │  ├─► Answer Q1-180
  │  │  ├─ Select option
  │  │ └─ Grid turns green
  │  │
  │  ├─► Watch Timer
  │  │  ├─ Counts down
  │  │  └─ Warning at 10min
  │  │
  │  ├─► Submit Exam ─► POST /submit-exam
  │  │                  └─ Auto-grade
  │  │
  │  ├─► Grade Results
  │  │  ├─ Calculate Score
  │  │  ├─ Determine Pass/Fail
  │  │  └─ Save to results.json
  │  │
  │  └─► View Results ─► Back to Login
  │
  └─ END
```

---

## 🎪 SCREEN FLOW

```
┌─────────────────────────────┐
│   STUDENT LOGIN (index.html)│
│   - Enter Reg #             │
│   - Blue button             │
└──────────────┬──────────────┘
               │
         Valid? ────── NO ──► Error Message
               │                    │
              YES                   │
               │                    │
               ▼                    │
        ┌─────────────────────┐    │
        │ EXAM (exam.html)    │    │
        │ - Q display (left)  │    │
        │ - Grid (right)      │    │
        │ - Timer (top)       │    │
        └─────────────────────┘    │
               │                    │
         Complete? ─── NO ────────┐ │
               │                  │ │
              YES                 │ │
               │                  │ │
               ▼                  │ │
        ┌─────────────────────┐  │ │
        │ RESULTS (exam.html) │  │ │
        │ - Score             │  │ │
        │ - Percentage        │  │ │
        │ - Pass/Fail         │  │ │
        └─────────────────────┘  │ │
               │                  │ │
               └──────────────────┘ │
                                    │
                    ┌───────────────┘
                    │
                    ▼
            ┌─────────────────┐
            │ LOGIN PAGE      │
            │ (Ready for next)│
            └─────────────────┘
```

---

## 🔐 SECURITY CHECK POINTS

```
Input Validation:
  Registration │ Reg Number
  Form:        └─ 10 digits? ✓
               └─ Numeric? ✓
               └─ In students.json? ✓

Questions:
  Upload │ Question text? ✓
  Form:  │ Options A-D? ✓
         │ Correct answer? ✓
         └─ No duplicates? ✓

Exam:
  Answer │ Only valid options? ✓
  Form:  │ Only one answer per question? ✓
         └─ Cannot modify after submit? ✓
```

---

## 📈 SYSTEM LOAD CAPACITY

```
Concurrent Users: Unlimited (JSON-based)
Questions per exam: 180+
Students: Unlimited
Results: Unlimited
File size impact: ~1KB per student, ~0.5KB per question, ~2KB per result

Scalability recommendations:
- File-based ✓ Small systems (< 1000 students)
- Database needed for Large systems (> 1000 students)
```

---

**This visual guide shows the complete flow of the OCEAN PARK MOCK EXAM system!**
