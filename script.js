// Pricing Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const onetimePlans = document.getElementById('onetime-plans');
    const subscriptionPlans = document.getElementById('subscription-plans');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Toggle plan visibility
            const planType = this.getAttribute('data-plan');
            if (planType === 'onetime') {
                onetimePlans.classList.remove('hidden');
                subscriptionPlans.classList.add('hidden');
            } else {
                onetimePlans.classList.add('hidden');
                subscriptionPlans.classList.remove('hidden');
            }
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Contact Form Handling with FormSubmit
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const response = await fetch('https://formsubmit.co/hello@bidguardsolutions.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('success', 'Message sent successfully! We\'ll get back to you within 24 hours.');
                form.reset();

                // Track successful form submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit_success', {
                        'form_name': 'contact_form',
                        'event_category': 'conversion',
                        'event_label': 'Contact Form Submission'
                    });
                }
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('error', 'Oops! Something went wrong. Please email us directly at hello@bidguardsolutions.com');

            // Track failed form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit_error', {
                    'form_name': 'contact_form',
                    'event_category': 'error',
                    'event_label': 'Contact Form Error'
                });
            }
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Notification Display Function
function showNotification(type, message) {
    const notification = document.getElementById('formNotification');
    const icon = notification.querySelector('.notification-icon');
    const messageEl = notification.querySelector('.notification-message');

    // Set icon based on type
    icon.textContent = type === 'success' ? '✓' : '✕';
    messageEl.textContent = message;

    // Update notification class
    notification.className = `form-notification ${type}`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

// Google Analytics Event Tracking
if (typeof gtag !== 'undefined') {
    // Track CTA button clicks
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-pricing, .btn-primary-small').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const buttonText = this.textContent.trim();
            const section = this.closest('section');
            const sectionId = section ? section.id || section.className : 'unknown';

            gtag('event', 'cta_click', {
                'button_text': buttonText,
                'button_location': sectionId,
                'event_category': 'engagement',
                'event_label': buttonText
            });
        });
    });

    // Track form start (first field interaction)
    const contactFormFields = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    let formStarted = false;
    contactFormFields.forEach(field => {
        field.addEventListener('focus', function () {
            if (!formStarted) {
                formStarted = true;
                gtag('event', 'form_start', {
                    'form_name': 'contact_form',
                    'event_category': 'engagement'
                });
            }
        });
    });

    // Track navigation clicks
    document.querySelectorAll('.nav-links a, .footer-column a').forEach(link => {
        link.addEventListener('click', function (e) {
            const linkText = this.textContent.trim();
            const linkHref = this.getAttribute('href');

            gtag('event', 'navigation_click', {
                'link_text': linkText,
                'link_url': linkHref,
                'event_category': 'navigation'
            });
        });
    });

    // Track scroll depth
    let scrollDepths = [25, 50, 75, 100];
    let trackedDepths = [];

    window.addEventListener('scroll', function () {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
                trackedDepths.push(depth);
                gtag('event', 'scroll', {
                    'event_category': 'engagement',
                    'event_label': depth + '%',
                    'value': depth
                });
            }
        });
    });
}


// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.problem-card, .step-card, .pricing-card, .trust-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add hover effect to pricing cards
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.3s ease';
    });
});

// Stats Counter Animation (optional enhancement)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                if (!isNaN(target)) {
                    stat.dataset.suffix = stat.textContent.replace(/[0-9]/g, '');
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}
