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
    
    // Simulate form submission
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="btn-text">Submitting...</span>';
    submitBtn.disabled = true;
    
    // Simulate API call
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

// Smooth scrolling for anchor links
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Add floating animation to feature cards
function addFloatingAnimation() {
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.animationDelay = `${index * 0.2}s`;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add form submission handler
    const form = document.getElementById('interestForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Add floating animations
    addFloatingAnimation();
    
    // Add intersection observer for timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to stats
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        stat.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});