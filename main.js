// DOM Elements
const leadFormToggle = document.getElementById('lead-form-toggle');
const leadFormWrapper = document.getElementById('lead-form-wrapper');
const closeForm = document.getElementById('close-form');
const leadForm = document.getElementById('lead-form');
const contactForm = document.getElementById('contact-form');
const faqItems = document.querySelectorAll('.faq-item');

// Sticky Lead Form Functionality
function openLeadForm() {
  leadFormWrapper.classList.add('active');
  leadFormToggle.style.opacity = '0.7';
}

function closeLeadForm() {
  leadFormWrapper.classList.remove('active');
  leadFormToggle.style.opacity = '1';
}

// Event Listeners for Lead Form
leadFormToggle.addEventListener('click', openLeadForm);
closeForm.addEventListener('click', closeLeadForm);

// Close form when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.sticky-lead-form')) {
    closeLeadForm();
  }
});

// Prevent form from closing when clicking inside
leadFormWrapper.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Form Submissions
function handleFormSubmission(form, successMessage) {
  const submitBtn = form.querySelector('.form-submit-btn, button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  
  // Simulate API call
  setTimeout(() => {
    showNotification(successMessage, 'success');
    form.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    
    // Close lead form if it was submitted
    if (form.closest('.lead-form')) {
      closeLeadForm();
    }
  }, 2000);
}

// Lead Form Submission
leadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!validateForm(leadForm)) {
    showNotification('Please fill in all required fields correctly', 'error');
    return;
  }
  
  handleFormSubmission(leadForm, 'Thank you! We\'ll send you detailed program information within 24 hours.');
});

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!validateForm(contactForm)) {
    showNotification('Please fill in all required fields correctly', 'error');
    return;
  }
  
  handleFormSubmission(contactForm, 'Thank you for your inquiry! Our admissions team will contact you within 24 hours.');
});

// FAQ Functionality
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all FAQ items
    faqItems.forEach(faqItem => {
      faqItem.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Smooth scrolling for navigation
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = section.offsetTop - navHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Mobile menu functionality
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('mobile-active');
}

// Video play functionality
function playIntroVideo() {
  showNotification('Video feature coming soon! Contact us for a live demo.', 'info');
}

// Schedule visit functionality
function scheduleVisit() {
  showNotification('Campus visit scheduling coming soon! Please call us to arrange a visit.', 'info');
}

// Make functions available globally
window.scrollToSection = scrollToSection;
window.openLeadForm = openLeadForm;
window.toggleMobileMenu = toggleMobileMenu;
window.playIntroVideo = playIntroVideo;
window.scheduleVisit = scheduleVisit;

// Form Validation
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    // Reset previous error states
    input.style.borderColor = '';
    
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#e53e3e';
      input.focus();
    } else {
      // Email validation
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          isValid = false;
          input.style.borderColor = '#e53e3e';
          showNotification('Please enter a valid email address', 'error');
        }
      }
      
      // Phone validation
      if (input.type === 'tel' && input.value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(input.value)) {
          isValid = false;
          input.style.borderColor = '#e53e3e';
          showNotification('Please enter a valid phone number', 'error');
        }
      }
    }
  });
  
  return isValid;
}

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '90px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    zIndex: '10001',
    maxWidth: '400px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transform: 'translateX(100%)',
    opacity: '0',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    lineHeight: '1.4'
  });
  
  // Set background color based on type
  const colors = {
    success: '#38a169',
    error: '#e53e3e',
    warning: '#d69e2e',
    info: '#3182ce'
  };
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 100);
  
  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}, observerOptions);

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Add/remove scrolled class for navbar styling
  if (scrollTop > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Hide/show sticky form based on scroll direction
  const stickyForm = document.querySelector('.sticky-lead-form');
  if (scrollTop > lastScrollTop && scrollTop > 200) {
    // Scrolling down
    stickyForm.style.transform = 'translateY(-50%) translateX(50px)';
    stickyForm.style.opacity = '0.8';
  } else {
    // Scrolling up
    stickyForm.style.transform = 'translateY(-50%) translateX(0)';
    stickyForm.style.opacity = '1';
  }
  
  lastScrollTop = scrollTop;
});

// Statistics counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = counter.textContent.replace(/\d+/, target);
        clearInterval(timer);
      } else {
        counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
      }
    }, 16);
  });
}

// Trigger counter animation when hero section is visible
const heroSection = document.querySelector('.hero');
if (heroSection) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 500); // Delay for better effect
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  heroObserver.observe(heroSection);
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Academic City EV Engineering Landing Page Loaded');
  
  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    '.curriculum-card, .why-card, .career-card, .faq-item, .career-stat'
  );
  
  animateElements.forEach(el => {
    observer.observe(el);
  });
  
  // Add navbar scroll class styles
  const style = document.createElement('style');
  style.textContent = `
    .navbar.scrolled {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-active {
      display: flex !important;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      flex-direction: column;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-top: 1px solid var(--border-color);
    }
    
    .mobile-active a {
      padding: 12px 0;
      border-bottom: 1px solid var(--border-light);
    }
    
    .mobile-active .nav-cta {
      margin-top: 16px;
      align-self: flex-start;
    }
  `;
  document.head.appendChild(style);
});

// Handle form input focus effects
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = '#3182ce';
      input.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.style.borderColor = '#e2e8f0';
        input.style.boxShadow = 'none';
      }
    });
    
    input.addEventListener('input', () => {
      if (input.style.borderColor === 'rgb(229, 62, 62)') {
        input.style.borderColor = '#e2e8f0';
      }
    });
  });
});

// Enhanced error handling for forms
function showFieldError(field, message) {
  // Remove existing error
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: #e53e3e;
    font-size: 12px;
    margin-top: 4px;
    font-weight: 500;
  `;
  
  field.style.borderColor = '#e53e3e';
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearFieldError(field) {
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  field.style.borderColor = '#e2e8f0';
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  const stickyForm = document.querySelector('.sticky-lead-form');
  if (scrollTop > lastScrollTop && scrollTop > 200) {
    stickyForm.style.transform = 'translateY(-50%) translateX(50px)';
    stickyForm.style.opacity = '0.8';
  } else {
    stickyForm.style.transform = 'translateY(-50%) translateX(0)';
    stickyForm.style.opacity = '1';
  }
  
  lastScrollTop = scrollTop;
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);