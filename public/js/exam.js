// Exam Page JavaScript

let student = null;
let questions = [];
let currentQuestionIndex = 0;
let studentAnswers = [];
let examStartTime = null;
let timerInterval = null;
const EXAM_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

// Initialize exam
window.addEventListener('load', () => {
    initializeExam();
});

async function initializeExam() {
    // Get student from localStorage
    const studentData = localStorage.getItem('student');
    
    if (!studentData) {
        window.location.href = '/';
        return;
    }
    
    student = JSON.parse(studentData);
    
    // Display student info
    document.getElementById('studentNameDisplay').textContent = student.name;
    document.getElementById('subjectDisplay').textContent = student.subject;
    
    // Fetch questions
    try {
        const response = await fetch('/api/questions');
        const data = await response.json();
        
        if (response.ok) {
            questions = data.questions;
            
            if (questions.length === 0) {
                alert('No questions available for this exam.');
                window.location.href = '/';
                return;
            }
            
            // Initialize answers array
            studentAnswers = new Array(questions.length).fill(null);
            
            // Update UI
            document.getElementById('totalQuestions').textContent = questions.length;
            
            // Create question grid
            createQuestionGrid();
            
            // Display first question
            displayQuestion(0);
            
            // Start timer
            examStartTime = Date.now();
            startTimer();
        } else {
            alert('Error loading questions.');
            window.location.href = '/';
        }
    } catch (error) {
        alert('Error loading exam. Please try again.');
        window.location.href = '/';
        console.error('Error:', error);
    }
}

// Create question grid
function createQuestionGrid() {
    const grid = document.getElementById('questionGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < questions.length; i++) {
        const button = document.createElement('button');
        button.className = 'grid-button';
        button.textContent = i + 1;
        button.onclick = () => goToQuestion(i);
        
        if (i === 0) {
            button.classList.add('current');
        }
        
        grid.appendChild(button);
    }
}

// Display question
function displayQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    currentQuestionIndex = index;
    const question = questions[index];
    
    // Update question display
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('optionA').textContent = question.optionA;
    document.getElementById('optionB').textContent = question.optionB;
    document.getElementById('optionC').textContent = question.optionC;
    document.getElementById('optionD').textContent = question.optionD;
    
    // Clear radio buttons
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.checked = false;
    });
    
    // Set previously selected answer
    if (studentAnswers[index]) {
        const selectedRadio = document.querySelector(`input[name="answer"][value="${studentAnswers[index]}"]`);
        if (selectedRadio) {
            selectedRadio.checked = true;
        }
    }
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === questions.length - 1;
    
    // Update grid highlighting
    document.querySelectorAll('.grid-button').forEach((btn, i) => {
        btn.classList.remove('current');
        if (i === index) {
            btn.classList.add('current');
        }
    });
    
    // Scroll to top of question area
    document.querySelector('.question-panel').scrollTop = 0;
}

// Navigate to specific question
function goToQuestion(index) {
    // Save current answer before moving
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        studentAnswers[currentQuestionIndex] = selected.value;
        updateGridButton(currentQuestionIndex);
    }
    
    displayQuestion(index);
}

// Next question
function nextQuestion() {
    // Save current answer
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        studentAnswers[currentQuestionIndex] = selected.value;
        updateGridButton(currentQuestionIndex);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        displayQuestion(currentQuestionIndex + 1);
    }
}

// Previous question
function previousQuestion() {
    // Save current answer
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        studentAnswers[currentQuestionIndex] = selected.value;
        updateGridButton(currentQuestionIndex);
    }
    
    if (currentQuestionIndex > 0) {
        displayQuestion(currentQuestionIndex - 1);
    }
}

// Update grid button color when answered
function updateGridButton(index) {
    const buttons = document.querySelectorAll('.grid-button');
    if (studentAnswers[index]) {
        buttons[index].classList.add('answered');
    }
}

// Radio button change handler
document.addEventListener('change', (e) => {
    if (e.target.name === 'answer') {
        studentAnswers[currentQuestionIndex] = e.target.value;
        updateGridButton(currentQuestionIndex);
    }
});

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - examStartTime;
        const remaining = EXAM_DURATION_MS - elapsed;
        
        if (remaining <= 0) {
            clearInterval(timerInterval);
            autoSubmitExam();
            return;
        }
        
        // Update display
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('timerDisplay').textContent = display;
        
        // Warning when 10 minutes left
        const timerElement = document.querySelector('.timer');
        if (remaining < 600000) {
            timerElement.classList.add('warning');
        }
    }, 1000);
}

// Submit exam
function submitExam() {
    // Save current answer
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        studentAnswers[currentQuestionIndex] = selected.value;
    }
    
    // Show confirmation modal
    document.getElementById('confirmModal').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('confirmModal').classList.add('hidden');
}

// Confirm submission
async function confirmSubmit() {
    closeModal();
    
    // Disable submit button
    document.getElementById('submitBtn').disabled = true;
    
    // Prepare answers
    const answers = [];
    studentAnswers.forEach((answer, index) => {
        if (answer) {
            answers.push({
                questionId: questions[index].id,
                selectedAnswer: answer
            });
        }
    });
    
    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - examStartTime) / 1000);
    
    try {
        const response = await fetch('/api/submit-exam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: student.id,
                regNumber: student.regNumber,
                studentName: student.name,
                subject: student.subject,
                answers: answers,
                timeSpent: timeSpent
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Display results
            clearInterval(timerInterval);
            showResults(data.result);
        } else {
            alert('Error submitting exam: ' + (data.error || 'Unknown error'));
            document.getElementById('submitBtn').disabled = false;
        }
    } catch (error) {
        alert('Error submitting exam. Please try again.');
        document.getElementById('submitBtn').disabled = false;
        console.error('Submit error:', error);
    }
}

// Auto-submit when time expires
async function autoSubmitExam() {
    // Save current answer
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        studentAnswers[currentQuestionIndex] = selected.value;
    }
    
    // Prepare answers
    const answers = [];
    studentAnswers.forEach((answer, index) => {
        if (answer) {
            answers.push({
                questionId: questions[index].id,
                selectedAnswer: answer
            });
        }
    });
    
    try {
        const response = await fetch('/api/submit-exam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: student.id,
                regNumber: student.regNumber,
                studentName: student.name,
                subject: student.subject,
                answers: answers,
                timeSpent: 7200
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showResults(data.result);
        } else {
            alert('Error submitting exam.');
        }
    } catch (error) {
        alert('Error submitting exam.');
        console.error('Auto-submit error:', error);
    }
}

// Show results
function showResults(result) {
    document.getElementById('resultRegNumber').textContent = result.regNumber;
    document.getElementById('resultName').textContent = result.studentName;
    document.getElementById('resultScore').textContent = `${result.score}/${result.totalQuestions}`;
    document.getElementById('resultPercentage').textContent = `${result.percentage}%`;
    
    const feedbackElement = document.getElementById('resultFeedback');
    if (result.feedback === 'PASSED') {
        feedbackElement.textContent = '✓ CONGRATULATIONS! YOU PASSED!';
        feedbackElement.classList.add('passed');
        feedbackElement.classList.remove('failed');
    } else {
        feedbackElement.textContent = '✗ FAILED! PLEASE TRY AGAIN.';
        feedbackElement.classList.add('failed');
        feedbackElement.classList.remove('passed');
    }
    
    // Hide exam content and show results
    document.querySelector('.exam-content').style.display = 'none';
    document.querySelector('.exam-footer').style.display = 'none';
    document.getElementById('resultsModal').classList.remove('hidden');
    
    // Clear localStorage
    localStorage.removeItem('student');
}
