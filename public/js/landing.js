// Landing Page JavaScript

// Smooth scroll for nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        if (target !== '#' && target.startsWith('#')) {
            const section = document.querySelector(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Scroll function for CTA buttons
function scrollToSection(sectionId) {
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Add navbar shadow on scroll
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// Add initial active state to first nav link
window.addEventListener('load', () => {
    const firstLink = document.querySelector('.nav-link');
    if (firstLink) {
        firstLink.classList.add('active');
    }
    // Load initial sample question
    generateSampleQuestion();
});

// Function to generate and display a sample JAMB question
async function generateSampleQuestion() {
    const previewContent = document.getElementById('preview-content');
    
    // Show loading state
    previewContent.innerHTML = `
        <p class="q-number">Loading from JAMB past questions database...</p>
        <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0, 136, 255, 0.2); border-top-color: #0088ff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
    `;
    
    try {
        const response = await fetch('/api/past-questions?count=1');
        const data = await response.json();
        
        if (data.success && data.questions.length > 0) {
            const question = data.questions[0];
            
            previewContent.innerHTML = `
                <p class="q-number">${question.subject} • Difficulty: ${question.difficulty}</p>
                <p class="q-text">${question.question}</p>
                <div class="options">
                    <label><input type="radio" name="demo" disabled> A) ${question.optionA}</label>
                    <label><input type="radio" name="demo" disabled> B) ${question.optionB}</label>
                    <label><input type="radio" name="demo" disabled> C) ${question.optionC}</label>
                    <label><input type="radio" name="demo" disabled> D) ${question.optionD}</label>
                </div>
                <p class="answer-hint">✓ Answer: ${question.correctAnswer} | Year: ${question.year}</p>
                <p class="source-info">📡 Source: ${data.source || 'JAMB Past Questions Database'}</p>
            `;
        } else {
            previewContent.innerHTML = `
                <p class="q-number">Database service status</p>
                <p class="q-text">The system is loading cached questions. Try again shortly!</p>
            `;
        }
    } catch (error) {
        console.error('Error loading question:', error);
        previewContent.innerHTML = `
            <p class="q-number">⚠️ Connection Status</p>
            <p class="q-text">Unable to fetch from database. Retrying with backup...</p>
            <div style="text-align: center; margin: 20px 0;">
                <button onclick="generateSampleQuestion()" class="btn btn-secondary" style="margin-top: 10px;">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// Function to filter and load questions by year/subject
async function filterAndLoadQuestion() {
    const yearFilter = document.getElementById('yearFilter')?.value || '';
    const subjectFilter = document.getElementById('subjectFilter')?.value || '';
    
    let url = '/api/past-questions?count=1';
    if (subjectFilter) url += `&subject=${subjectFilter}`;
    if (yearFilter) url += `&year=${yearFilter}`;
    
    const previewContent = document.getElementById('preview-content');
    
    // Show loading state
    previewContent.innerHTML = `
        <p class="q-number">Loading filtered questions...</p>
        <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0, 136, 255, 0.2); border-top-color: #0088ff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
    `;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success && data.questions.length > 0) {
            const question = data.questions[0];
            
            previewContent.innerHTML = `
                <p class="q-number">${question.subject} • Difficulty: ${question.difficulty}</p>
                <p class="q-text">${question.question}</p>
                <div class="options">
                    <label><input type="radio" name="demo" disabled> A) ${question.optionA}</label>
                    <label><input type="radio" name="demo" disabled> B) ${question.optionB}</label>
                    <label><input type="radio" name="demo" disabled> C) ${question.optionC}</label>
                    <label><input type="radio" name="demo" disabled> D) ${question.optionD}</label>
                </div>
                <p class="answer-hint">✓ Answer: ${question.correctAnswer} | Year: ${question.year}</p>
                <p class="source-info">📡 Source: ${data.source || 'JAMB Past Questions Database'}</p>
            `;
        } else {
            previewContent.innerHTML = `
                <p class="q-number">No questions found</p>
                <p class="q-text">Try adjusting your filters to find more questions.</p>
            `;
        }
    } catch (error) {
        console.error('Error loading filtered question:', error);
        previewContent.innerHTML = `
            <p class="q-number">⚠️ Error</p>
            <p class="q-text">Unable to fetch filtered questions. Please try again.</p>
        `;
    }
}

