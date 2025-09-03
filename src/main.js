// Email validation for UWaterloo domain
function validateUWaterlooEmail(email) {
    const uwaterlooPattern = /^[a-zA-Z0-9._%+-]+@uwaterloo\.ca$/;
    return uwaterlooPattern.test(email);
}

// Form submission handler
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const name = formData.get('name');
    const program = formData.get('program');
    const year = formData.get('year');
    
    // Validate UWaterloo email
    if (!validateUWaterlooEmail(email)) {
        alert('Please enter a valid @uwaterloo.ca email address');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        document.getElementById('successMessage').classList.add('show');
        
        // Store submission data (in real app, this would go to a backend)
        const submissionData = {
            email,
            name,
            program,
            year,
            timestamp: new Date().toISOString()
        };
        
        console.log('Interest registered:', submissionData);
        
        // In a real application, you would send this data to your backend
        // fetch('/api/register-interest', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(submissionData)
        // });
        
    }, 1500);
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add form validation feedback
function setupFormValidation() {
    const emailInput = document.getElementById('email');
    const form = document.getElementById('interestForm');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            if (email && !validateUWaterlooEmail(email)) {
                this.style.borderColor = '#d32f2f';
                
                // Add error message if it doesn't exist
                let errorMsg = this.parentNode.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('small');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = '#d32f2f';
                    errorMsg.textContent = 'Please enter a valid @uwaterloo.ca email address';
                    this.parentNode.appendChild(errorMsg);
                }
            } else {
                this.style.borderColor = '#ddd';
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add form submission handler
    const form = document.getElementById('interestForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup form validation
    setupFormValidation();
    
    // Add subtle animations to content sections
    const sections = document.querySelectorAll('.content-section, .sidebar-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation for form
    const formInputs = document.querySelectorAll('input, select, button');
    formInputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.tagName !== 'BUTTON') {
                e.preventDefault();
                const nextInput = formInputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
    
    // Add focus indicators for better accessibility
    const focusableElements = document.querySelectorAll('a, button, input, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #ffd320';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});