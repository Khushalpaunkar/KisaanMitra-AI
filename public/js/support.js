/**
 * KisaanMitra AI - Support Us Page
 * Vanilla JavaScript for animations, form handling, and interactivity
 */

// ===== SCROLL REVEAL ANIMATION =====
// Initialize scroll reveal animations for elements
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with fadeInUp class
    document.querySelectorAll('.fadeInUp').forEach((el) => {
        observer.observe(el);
    });
}

// ===== FORM HANDLING =====
// Handle feedback form submission
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                name: document.getElementById('feedbackName').value,
                userType: document.getElementById('userType').value,
                location: document.getElementById('location').value,
                features: Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value),
                rating: document.getElementById('rating').value,
                message: document.getElementById('feedbackMessage').value,
                timestamp: new Date().toISOString()
            };
            
            // Validate form
            if (!validateFeedbackForm(formData)) {
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
            
            // Simulate API call (or replace with actual backend endpoint)
            setTimeout(() => {
                // In production, send to backend:
                // fetch('/api/feedback', { method: 'POST', body: JSON.stringify(formData) })
                
                // For now, store in localStorage and show success
                saveFeedbackLocally(formData);
                
                // Show success message
                feedbackForm.classList.add('d-none');
                successMessage.classList.remove('d-none');
                
                // Log success
                console.log('Feedback submitted:', formData);
                
                // Optional: Reset form after delay
                setTimeout(() => {
                    feedbackForm.reset();
                    feedbackForm.classList.remove('d-none');
                    successMessage.classList.add('d-none');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit Feedback';
                }, 3000);
            }, 800);
        });
    }
}

// Validate feedback form
function validateFeedbackForm(data) {
    if (!data.name.trim()) {
        showAlert('Please enter your name', 'warning');
        return false;
    }
    if (!data.userType) {
        showAlert('Please select your role', 'warning');
        return false;
    }
    if (!data.rating) {
        showAlert('Please rate your experience', 'warning');
        return false;
    }
    if (!data.message.trim() || data.message.trim().length < 10) {
        showAlert('Please provide at least 10 characters of feedback', 'warning');
        return false;
    }
    return true;
}

// Save feedback to localStorage (for demonstration)
function saveFeedbackLocally(data) {
    const existingFeedback = JSON.parse(localStorage.getItem('kisaanmitra_feedback')) || [];
    existingFeedback.push(data);
    localStorage.setItem('kisaanmitra_feedback', JSON.stringify(existingFeedback));
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    const alertContainer = document.createElement('div');
    alertContainer.className = 'position-fixed top-0 start-50 translate-middle-x mt-3';
    alertContainer.style.zIndex = '9999';
    alertContainer.innerHTML = alertHTML;
    
    document.body.appendChild(alertContainer);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        alertContainer.remove();
    }, 5000);
}

// ===== SHARE FUNCTIONALITY =====
function shareProject() {
    const shareText = 'Check out KisaanMitra AI - an AI-powered digital farming assistant for Indian farmers! 🌾';
    const shareUrl = window.location.origin;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'KisaanMitra AI',
            text: shareText,
            url: shareUrl
        }).catch((err) => {
            console.log('Share failed:', err);
            fallbackShare(shareText, shareUrl);
        });
    } else {
        fallbackShare(shareText, shareUrl);
    }
}

// Fallback share method (copy to clipboard)
function fallbackShare(text, url) {
    const shareMessage = `${text} ${url}`;
    
    navigator.clipboard.writeText(shareMessage).then(() => {
        showAlert('Link copied to clipboard! Share it with your network.', 'success');
    }).catch(() => {
        // Fallback: Alert
        alert(shareMessage);
    });
}

// ===== SMOOTH SCROLL TO FORM =====
function smoothScrollToForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== ACTIVE NAV LINK HIGHLIGHTING =====
function updateActiveNavLink() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== NAVBAR BACKGROUND ON SCROLL =====
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('shadow-sm');
        }
    });
}

// ===== FORM INPUT VALIDATION =====
function setupFormValidation() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        // Real-time validation for name
        const nameInput = document.getElementById('feedbackName');
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                if (this.value.trim().length < 2) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        }
        
        // Real-time validation for message
        const messageInput = document.getElementById('feedbackMessage');
        if (messageInput) {
            messageInput.addEventListener('blur', function() {
                if (this.value.trim().length < 10) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        }
    }
}

// ===== BUTTON HOVER EFFECTS =====
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.transform = 'scale(1)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation to stylesheet
function addRippleAnimation() {
    if (!document.getElementById('ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.innerHTML = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== KEYBOARD NAVIGATION =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key to close modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const bsModal = new bootstrap.Modal(modal);
                bsModal.hide();
            });
        }
    });
}

// ===== PERFORMANCE: LAZY LOAD IMAGES =====
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== COUNTER ANIMATION (if needed) =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ===== TRACK ANALYTICS EVENT =====
function trackEvent(eventName, eventData = {}) {
    // Replace with your analytics service
    console.log(`Event: ${eventName}`, eventData);
    
    // Example: Send to Google Analytics (if available)
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
}

// ===== INITIALIZE ON DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('KisaanMitra AI Support Page Loaded');
    
    // Initialize all features
    initScrollReveal();
    initFeedbackForm();
    setupFormValidation();
    updateActiveNavLink();
    handleNavbarScroll();
    setupButtonEffects();
    addRippleAnimation();
    setupKeyboardNavigation();
    setupLazyLoading();
    
    // Track page view
    trackEvent('page_view', {
        page_title: 'Support Us - KisaanMitra AI'
    });
});

// ===== UTILITY: PRINT FEEDBACK DATA =====
window.printFeedbackData = function() {
    const feedback = JSON.parse(localStorage.getItem('kisaanmitra_feedback')) || [];
    console.table(feedback);
};

// ===== UTILITY: EXPORT FEEDBACK =====
window.exportFeedbackCSV = function() {
    const feedback = JSON.parse(localStorage.getItem('kisaanmitra_feedback')) || [];
    
    if (feedback.length === 0) {
        alert('No feedback collected yet.');
        return;
    }
    
    let csv = 'Name,User Type,Location,Features,Rating,Message,Timestamp\n';
    
    feedback.forEach(item => {
        const features = item.features.join('; ');
        const row = `"${item.name}","${item.userType}","${item.location}","${features}","${item.rating}","${item.message}","${item.timestamp}"`;
        csv += row + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kisaanmitra_feedback_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert('Feedback exported successfully!');
};

// Make functions globally available
window.shareProject = shareProject;
window.smoothScrollToForm = smoothScrollToForm;