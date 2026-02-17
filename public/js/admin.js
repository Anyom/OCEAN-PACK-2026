// Admin Panel JavaScript

let questionCount = 0;

// Register Student
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('studentName').value.trim();
    const subject = document.getElementById('studentSubject').value;
    const responseDiv = document.getElementById('registerResponse');
    
    if (!name || !subject) {
        responseDiv.textContent = 'Please fill in all fields.';
        responseDiv.classList.add('error');
        responseDiv.classList.remove('success');
        return;
    }
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, subject: subject })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            responseDiv.innerHTML = `
                <strong>✓ Registration Successful!</strong><br>
                Registration Number: <strong>${data.regNumber}</strong><br>
                Student Name: <strong>${data.student.name}</strong><br>
                Subject: <strong>${data.student.subject}</strong>
            `;
            responseDiv.classList.add('success');
            responseDiv.classList.remove('error');
            document.getElementById('registerForm').reset();
        } else {
            responseDiv.textContent = data.error || 'Registration failed.';
            responseDiv.classList.add('error');
            responseDiv.classList.remove('success');
        }
    } catch (error) {
        responseDiv.textContent = 'An error occurred during registration.';
        responseDiv.classList.add('error');
        responseDiv.classList.remove('success');
        console.error('Registration error:', error);
    }
});

// Add Question Input Fields
document.getElementById('addQuestionBtn').addEventListener('click', () => {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-input';
    questionDiv.id = `question-${questionCount}`;
    questionDiv.innerHTML = `
        <h4>Question ${questionCount}</h4>
        <input type="text" placeholder="Question text" class="question-text" required>
        <input type="text" placeholder="Option A" class="option-a" required>
        <input type="text" placeholder="Option B" class="option-b" required>
        <input type="text" placeholder="Option C" class="option-c" required>
        <input type="text" placeholder="Option D" class="option-d" required>
        <select class="correct-answer" required>
            <option value="">Select Correct Answer</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
        </select>
        <button type="button" class="remove-question" onclick="removeQuestion(${questionCount})">Remove Question</button>
    `;
    
    container.appendChild(questionDiv);
});

// Remove Question
function removeQuestion(id) {
    const questionDiv = document.getElementById(`question-${id}`);
    if (questionDiv) {
        questionDiv.remove();
    }
}

// Upload Questions
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const container = document.getElementById('questionsContainer');
    const questionInputs = container.querySelectorAll('.question-input');
    const responseDiv = document.getElementById('uploadResponse');
    
    if (questionInputs.length === 0) {
        responseDiv.textContent = 'Please add at least one question.';
        responseDiv.classList.add('error');
        responseDiv.classList.remove('success');
        return;
    }
    
    const questions = [];
    
    questionInputs.forEach((q) => {
        const questionText = q.querySelector('.question-text').value.trim();
        const optionA = q.querySelector('.option-a').value.trim();
        const optionB = q.querySelector('.option-b').value.trim();
        const optionC = q.querySelector('.option-c').value.trim();
        const optionD = q.querySelector('.option-d').value.trim();
        const correctAnswer = q.querySelector('.correct-answer').value;
        
        if (questionText && optionA && optionB && optionC && optionD && correctAnswer) {
            questions.push({
                question: questionText,
                optionA: optionA,
                optionB: optionB,
                optionC: optionC,
                optionD: optionD,
                correctAnswer: correctAnswer
            });
        }
    });
    
    if (questions.length === 0) {
        responseDiv.textContent = 'Please fill in all fields for each question.';
        responseDiv.classList.add('error');
        responseDiv.classList.remove('success');
        return;
    }
    
    try {
        const response = await fetch('/api/add-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ questions: questions })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            responseDiv.innerHTML = `
                <strong>✓ Questions Uploaded Successfully!</strong><br>
                Questions Added: <strong>${data.message}</strong>
            `;
            responseDiv.classList.add('success');
            responseDiv.classList.remove('error');
            container.innerHTML = '';
            questionCount = 0;
        } else {
            responseDiv.textContent = data.error || 'Upload failed.';
            responseDiv.classList.add('error');
            responseDiv.classList.remove('success');
        }
    } catch (error) {
        responseDiv.textContent = 'An error occurred during upload.';
        responseDiv.classList.add('error');
        responseDiv.classList.remove('success');
        console.error('Upload error:', error);
    }
});

// View Students
document.getElementById('viewStudentsBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/admin/students');
        const data = await response.json();
        
        const container = document.getElementById('studentsTable');
        
        if (data.students.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No students registered yet.</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Registration Number</th>
                        <th>Registered Date</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.students.forEach(student => {
            const date = new Date(student.registeredDate).toLocaleString();
            html += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.subject}</td>
                    <td><strong>${student.regNumber}</strong></td>
                    <td>${date}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        document.getElementById('studentsTable').innerHTML = '<p style="color: red;">Error loading students.</p>';
        console.error('Error:', error);
    }
});

// View Results
document.getElementById('viewResultsBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/admin/results');
        const data = await response.json();
        
        const container = document.getElementById('resultsTable');
        
        if (data.results.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No exam results yet.</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Registration #</th>
                        <th>Student Name</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Submitted</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.results.forEach(result => {
            const date = new Date(result.submittedDate).toLocaleString();
            const status = result.percentage >= 40 ? 'PASSED' : 'FAILED';
            const statusColor = result.percentage >= 40 ? '#4CAF50' : '#f44336';
            
            html += `
                <tr>
                    <td><strong>${result.regNumber}</strong></td>
                    <td>${result.studentName}</td>
                    <td>${result.subject}</td>
                    <td>${result.score}/${result.totalQuestions}</td>
                    <td><strong>${result.percentage}%</strong></td>
                    <td><span style="color: ${statusColor}; font-weight: bold;">${status}</span></td>
                    <td>${date}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        document.getElementById('resultsTable').innerHTML = '<p style="color: red;">Error loading results.</p>';
        console.error('Error:', error);
    }
});
