const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Data file paths
const studentsFile = path.join(__dirname, 'data', 'students.json');
const questionsFile = path.join(__dirname, 'data', 'questions.json');
const resultsFile = path.join(__dirname, 'data', 'results.json');
const pastQuestionsFile = path.join(__dirname, 'data', 'past-questions.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions to read/write JSON files
function readJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
  }
}

// Generate unique 10-digit registration number
function generateRegistrationNumber() {
  let regNumber;
  let isUnique = false;
  const students = readJSON(studentsFile);

  while (!isUnique) {
    regNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    isUnique = !students.some(student => student.regNumber === regNumber.toString());
  }

  return regNumber.toString();
}

// API Endpoints

// 1. Register a new candidate
app.post('/api/register', (req, res) => {
  const { name, subject } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ error: 'Name and Subject are required' });
  }

  const regNumber = generateRegistrationNumber();
  const students = readJSON(studentsFile);

  const newStudent = {
    id: students.length + 1,
    name: name,
    subject: subject,
    regNumber: regNumber,
    registeredDate: new Date().toISOString()
  };

  students.push(newStudent);
  writeJSON(studentsFile, students);

  res.json({
    success: true,
    message: 'Student registered successfully',
    regNumber: regNumber,
    student: newStudent
  });
});

// 2. Add questions
app.post('/api/add-questions', (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Invalid questions format' });
  }

  const existingQuestions = readJSON(questionsFile);
  const newQuestions = questions.map((q, index) => ({
    id: existingQuestions.length + index + 1,
    question: q.question,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctAnswer: q.correctAnswer
  }));

  const allQuestions = existingQuestions.concat(newQuestions);
  writeJSON(questionsFile, allQuestions);

  res.json({
    success: true,
    message: `${newQuestions.length} questions added successfully`,
    totalQuestions: allQuestions.length
  });
});

// 3. Student login
app.post('/api/login', (req, res) => {
  const { regNumber } = req.body;

  if (!regNumber) {
    return res.status(400).json({ error: 'Registration Number is required' });
  }

  const students = readJSON(studentsFile);
  const student = students.find(s => s.regNumber === regNumber);

  if (!student) {
    return res.status(401).json({ error: 'Invalid Registration Number' });
  }

  res.json({
    success: true,
    student: {
      id: student.id,
      name: student.name,
      subject: student.subject,
      regNumber: student.regNumber
    }
  });
});

// 4. Get all questions
app.get('/api/questions', (req, res) => {
  const questions = readJSON(questionsFile);

  if (questions.length === 0) {
    return res.status(404).json({ error: 'No questions available' });
  }

  res.json({
    success: true,
    totalQuestions: questions.length,
    questions: questions
  });
});

// 5. Submit exam answers and auto-grade
app.post('/api/submit-exam', (req, res) => {
  const { studentId, regNumber, answers, studentName, subject, timeSpent } = req.body;

  if (!studentId || !regNumber || !answers) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const questions = readJSON(questionsFile);
  let score = 0;
  const results = [];

  // Grade each answer
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      if (isCorrect) score++;

      results.push({
        questionId: answer.questionId,
        question: question.question,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect
      });
    }
  });

  const percentage = Math.round((score / questions.length) * 100);

  // Save result
  const allResults = readJSON(resultsFile);
  const result = {
    id: allResults.length + 1,
    studentId: studentId,
    regNumber: regNumber,
    studentName: studentName,
    subject: subject,
    score: score,
    totalQuestions: questions.length,
    percentage: percentage,
    submittedDate: new Date().toISOString(),
    timeSpent: timeSpent,
    answers: results
  };

  allResults.push(result);
  writeJSON(resultsFile, allResults);

  res.json({
    success: true,
    message: 'Exam submitted successfully',
    result: {
      regNumber: regNumber,
      studentName: studentName,
      score: score,
      totalQuestions: questions.length,
      percentage: percentage,
      feedback: percentage >= 40 ? 'PASSED' : 'FAILED'
    }
  });
});

// 6. Get student results
app.get('/api/results/:regNumber', (req, res) => {
  const { regNumber } = req.params;
  const results = readJSON(resultsFile);

  const studentResult = results.find(r => r.regNumber === regNumber);

  if (!studentResult) {
    return res.status(404).json({ error: 'No results found for this student' });
  }

  res.json({
    success: true,
    result: studentResult
  });
});

// 7. Get all students (Admin)
app.get('/api/admin/students', (req, res) => {
  const students = readJSON(studentsFile);
  res.json({
    success: true,
    totalStudents: students.length,
    students: students
  });
});

// 8. Get all results (Admin)
app.get('/api/admin/results', (req, res) => {
  const results = readJSON(resultsFile);
  res.json({
    success: true,
    totalResults: results.length,
    results: results
  });
});

// 9. Auto-generate JAMB questions from PAST QUESTIONS database (2023-2025)
app.get('/api/generate-jamb-questions', async (req, res) => {
  const { count = 10, subject = null, year = null } = req.query;
  
  try {
    // Load past questions from our database (2023-2025)
    const pastQuestions = readJSON(pastQuestionsFile);
    
    if (!pastQuestions || pastQuestions.length === 0) {
      console.warn('Past questions database is empty, falling back to mock questions');
      const mockQuestions = generateMockJambQuestions(count);
      return res.json({
        success: true,
        count: mockQuestions.length,
        totalAvailable: 50,
        source: 'Mock Questions Database',
        questions: mockQuestions
      });
    }
    
    // Filter by subject if provided
    let filtered = pastQuestions;
    if (subject) {
      filtered = filtered.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }
    
    // Filter by year if provided
    if (year) {
      filtered = filtered.filter(q => q.year === parseInt(year));
    }
    
    // Shuffle and select requested count
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    res.json({
      success: true,
      count: selected.length,
      totalAvailable: pastQuestions.length,
      source: 'JAMB Past Questions (2023-2025)',
      years: [...new Set(pastQuestions.map(q => q.year))].sort(),
      subjects: [...new Set(pastQuestions.map(q => q.subject))],
      questions: selected
    });
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    
    // Fallback to mock questions on error
    const mockQuestions = generateMockJambQuestions(count);
    res.json({
      success: true,
      count: mockQuestions.length,
      totalAvailable: 50,
      source: 'Mock Questions (Fallback)',
      questions: mockQuestions
    });
  }
});

// Helper function to generate mock JAMB questions
function generateMockJambQuestions(count) {
  const mockQuestions = [
    {
      id: 1,
      question: 'What is the chemical symbol for sodium?',
      optionA: 'So',
      optionB: 'Na',
      optionC: 'S',
      optionD: 'Sd',
      correctAnswer: 'B',
      subject: 'Chemistry',
      difficulty: 'easy',
      year: 2025
    },
    {
      id: 2,
      question: 'Which of these is NOT a state in Nigeria?',
      optionA: 'Lagos',
      optionB: 'Kano',
      optionC: 'Abuja',
      optionD: 'Cairo',
      correctAnswer: 'D',
      subject: 'Government',
      difficulty: 'easy',
      year: 2025
    },
    {
      id: 3,
      question: 'What is 15% of 300?',
      optionA: '45',
      optionB: '50',
      optionC: '55',
      optionD: '60',
      correctAnswer: 'A',
      subject: 'Mathematics',
      difficulty: 'easy',
      year: 2025
    },
    {
      id: 4,
      question: 'What does DNA stand for?',
      optionA: 'Deoxyribonucleic Acid',
      optionB: 'Diribonucleic Acid',
      optionC: 'Deoxyribose Nucleic Acid',
      optionD: 'Dynamic Nuclear Acid',
      correctAnswer: 'A',
      subject: 'Biology',
      difficulty: 'medium',
      year: 2025
    },
    {
      id: 5,
      question: 'What is the speed of light?',
      optionA: '2 × 10^8 m/s',
      optionB: '3 × 10^8 m/s',
      optionC: '4 × 10^8 m/s',
      optionD: '5 × 10^8 m/s',
      correctAnswer: 'B',
      subject: 'Physics',
      difficulty: 'easy',
      year: 2025
    },
    {
      id: 6,
      question: 'Which word is a synonym for "eloquent"?',
      optionA: 'Silent',
      optionB: 'Articulate',
      optionC: 'Quiet',
      optionD: 'Dull',
      correctAnswer: 'B',
      subject: 'English',
      difficulty: 'medium',
      year: 2025
    }
  ];
  
  // Shuffle and return requested count
  const shuffled = mockQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Helper function to decode HTML entities
function decodeHTML(html) {
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&#039;': "'"
  };
  return html.replace(/&amp;|&lt;|&gt;|&quot;|&#039;|&apos;/g, m => map[m]);
}

// Public endpoint: list/filter past questions (2023-2025)
app.get('/api/past-questions', (req, res) => {
  const { count = 10, subject = null, year = null } = req.query;

  try {
    const past = readJSON(pastQuestionsFile);

    if (!past || past.length === 0) {
      return res.json({
        success: true,
        count: 0,
        totalAvailable: 0,
        source: 'JAMB Past Questions (empty)',
        questions: []
      });
    }

    let filtered = past;
    if (subject) {
      filtered = filtered.filter(q => q.subject && q.subject.toLowerCase() === subject.toLowerCase());
    }
    if (year) {
      filtered = filtered.filter(q => q.year === parseInt(year));
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(parseInt(count), shuffled.length));

    res.json({
      success: true,
      count: selected.length,
      totalAvailable: past.length,
      source: 'JAMB Past Questions (2023-2025)',
      years: [...new Set(past.map(q => q.year))].sort(),
      subjects: [...new Set(past.map(q => q.subject))],
      questions: selected
    });
  } catch (err) {
    console.error('Error in /api/past-questions:', err);
    res.status(500).json({ success: false, error: 'Server error', details: err.message });
  }
});

// Admin endpoint: append past questions to the DB
app.post('/api/admin/add-past-questions', (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid payload. Expected { questions: [...] }' });
  }

  try {
    const existing = readJSON(pastQuestionsFile) || [];
    const maxId = existing.length ? Math.max(...existing.map(q => q.id || 0)) : 0;
    const newQuestions = questions.map((q, i) => ({
      id: maxId + i + 1,
      year: q.year || 2025,
      subject: q.subject || 'General',
      question: q.question || '',
      optionA: q.optionA || '',
      optionB: q.optionB || '',
      optionC: q.optionC || '',
      optionD: q.optionD || '',
      correctAnswer: q.correctAnswer || 'A',
      difficulty: q.difficulty || 'medium',
      topic: q.topic || ''
    }));

    const merged = existing.concat(newQuestions);
    writeJSON(pastQuestionsFile, merged);

    res.json({ success: true, added: newQuestions.length, total: merged.length });
  } catch (err) {
    console.error('Error in admin add past questions:', err);
    res.status(500).json({ success: false, error: 'Server error', details: err.message });
  }
});

// Public endpoint: list past questions (with optional filters)
app.get('/api/past-questions', (req, res) => {
  try {
    const { subject = null, year = null, q = null } = req.query;
    let past = readJSON(pastQuestionsFile);

    if (subject) {
      past = past.filter(p => p.subject && p.subject.toLowerCase() === subject.toLowerCase());
    }
    if (year) {
      past = past.filter(p => p.year === parseInt(year));
    }
    if (q) {
      const term = q.toLowerCase();
      past = past.filter(p => (p.question || '').toLowerCase().includes(term));
    }

    res.json({ success: true, total: past.length, questions: past });
  } catch (err) {
    console.error('Error /api/past-questions:', err);
    res.status(500).json({ error: 'Could not load past questions' });
  }
});

// Admin endpoint: add multiple past questions (JSON array)
app.post('/api/admin/add-past-questions', (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Invalid payload: questions array required' });
    }

    const existing = readJSON(pastQuestionsFile);
    const startId = existing.length > 0 ? Math.max(...existing.map(q => q.id || 0)) + 1 : 1;

    const toAdd = questions.map((q, idx) => ({
      id: startId + idx,
      year: q.year || new Date().getFullYear(),
      subject: q.subject || 'General',
      question: q.question || 'Question text',
      optionA: q.optionA || 'A',
      optionB: q.optionB || 'B',
      optionC: q.optionC || 'C',
      optionD: q.optionD || 'D',
      correctAnswer: q.correctAnswer || 'A',
      difficulty: q.difficulty || 'medium',
      topic: q.topic || ''
    }));

    const updated = existing.concat(toAdd);
    writeJSON(pastQuestionsFile, updated);

    res.json({ success: true, added: toAdd.length, total: updated.length });
  } catch (err) {
    console.error('Error adding past questions:', err);
    res.status(500).json({ error: 'Failed to add questions' });
  }
});

// Root endpoint - Dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Legacy redirect for old home
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Direct access routes
app.get('/student', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin-panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/exam-center', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exam.html'));
});

app.get('/showcase', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'premium-login.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ OCEAN PARK COMPUTER SERVICES - MOCK EXAM`);
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Admin Panel: http://localhost:${PORT}/admin.html`);
  console.log(`✓ Student Login: http://localhost:${PORT}`);
});
