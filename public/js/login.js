// Login Page JavaScript

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const regNumber = document.getElementById('regNumber').value.trim();
    const errorDiv = document.getElementById('loginError');
    const successDiv = document.getElementById('loginSuccess');
    
    // Clear previous messages
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');
    
    // Validate input
    if (regNumber.length !== 10 || !/^\d+$/.test(regNumber)) {
        errorDiv.textContent = 'Registration Number must be exactly 10 digits.';
        errorDiv.classList.add('show');
        return;
    }
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ regNumber: regNumber })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store student info in localStorage
            localStorage.setItem('student', JSON.stringify(data.student));
            
            successDiv.textContent = `Welcome, ${data.student.name}! Redirecting to exam...`;
            successDiv.classList.add('show');
            
            // Redirect to exam page after 1.5 seconds
            setTimeout(() => {
                window.location.href = '/exam.html';
            }, 1500);
        } else {
            errorDiv.textContent = data.error || 'Login failed. Please check your registration number.';
            errorDiv.classList.add('show');
        }
    } catch (error) {
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.add('show');
        console.error('Login error:', error);
    }
});

// Allow Enter key to submit
document.getElementById('regNumber').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});
