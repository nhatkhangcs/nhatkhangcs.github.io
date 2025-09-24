// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on internal anchor links only
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // Only close menu for internal anchor links (starting with #)
        if (href && href.startsWith('#')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        // For external page links (like blog.html), let the page navigate normally
        // without closing the menu immediately
    });
});



// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for fade-in animations
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

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add loading animation to the page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Add scroll-to-top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll-to-top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll-to-top button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
    scrollToTopBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
    scrollToTopBtn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
});

// Add CSS for scroll-to-top button
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
    }
`;
document.head.appendChild(style);

// Real Visitor Counter Functionality
class RealVisitorCounter {
    constructor() {
        this.storageKey = 'nhatkhangcs-visitor-data';
        this.sessionKey = 'nhatkhangcs-session';
        this.init();
    }

    init() {
        this.trackVisitor();
        this.updateDisplay();
    }

    trackVisitor() {
        const now = Date.now();
        const sessionId = this.getOrCreateSessionId();
        const visitorData = this.getVisitorData();
        
        // Check if this is a new session (not visited in last 30 minutes)
        const lastVisit = visitorData.lastVisit || 0;
        const isNewSession = (now - lastVisit) > (30 * 60 * 1000); // 30 minutes
        
        if (isNewSession) {
            // Increment unique visitor count
            visitorData.uniqueVisitors = (visitorData.uniqueVisitors || 0) + 1;
            visitorData.lastVisit = now;
            visitorData.lastSessionId = sessionId;
            
            // Store visitor data
            this.saveVisitorData(visitorData);
            
            // Also track page views
            this.trackPageView();
        } else {
            // Update last visit time for existing session
            visitorData.lastVisit = now;
            this.saveVisitorData(visitorData);
        }
    }

    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem(this.sessionKey);
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(this.sessionKey, sessionId);
        }
        return sessionId;
    }

    trackPageView() {
        const pageViewData = this.getPageViewData();
        const today = new Date().toDateString();
        
        if (!pageViewData[today]) {
            pageViewData[today] = 0;
        }
        pageViewData[today]++;
        
        this.savePageViewData(pageViewData);
    }

    getVisitorData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : { uniqueVisitors: 0, lastVisit: 0 };
        } catch (error) {
            console.error('Error reading visitor data:', error);
            return { uniqueVisitors: 0, lastVisit: 0 };
        }
    }

    saveVisitorData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving visitor data:', error);
        }
    }

    getPageViewData() {
        try {
            const data = localStorage.getItem('nhatkhangcs-pageviews');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error reading page view data:', error);
            return {};
        }
    }

    savePageViewData(data) {
        try {
            localStorage.setItem('nhatkhangcs-pageviews', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving page view data:', error);
        }
    }

    updateDisplay() {
        const visitorCountElement = document.getElementById('visitor-count');
        if (!visitorCountElement) return;

        const visitorData = this.getVisitorData();
        const count = visitorData.uniqueVisitors || 0;
        
        visitorCountElement.textContent = this.formatNumber(count);
        this.animateCounter(visitorCountElement);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    animateCounter(element) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#4CAF50';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '#667eea';
        }, 500);
    }

    // Method to get analytics data (for debugging)
    getAnalytics() {
        const visitorData = this.getVisitorData();
        const pageViewData = this.getPageViewData();
        
        return {
            uniqueVisitors: visitorData.uniqueVisitors || 0,
            lastVisit: new Date(visitorData.lastVisit || 0),
            pageViewsByDay: pageViewData,
            totalPageViews: Object.values(pageViewData).reduce((sum, views) => sum + views, 0)
        };
    }
}

// Initialize real visitor counter when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.visitorCounter = new RealVisitorCounter();
});

// Cool Features Implementation

// 1. Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return; // Exit if progress bar doesn't exist
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// 2. Dark Mode Toggle
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.classList.toggle('dark-mode', currentTheme === 'dark');
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark ? 'dark' : 'light');
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// 3. Floating Particles Animation
function initFloatingParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return; // Exit if container doesn't exist (e.g., on blog page)
    
    const particleCount = 9;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.left = Math.random() * 100 + '%';
        particlesContainer.appendChild(particle);
    }
}

// 4. Enhanced Typing Animation
function initEnhancedTyping() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid #667eea';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 1000);
}

// 5. Map Integration (using embedded iframe - no JavaScript needed)

// 6. Enhanced Hover Effects
function initEnhancedHoverEffects() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 7. Parallax Scrolling Effect
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.animated-bg, .floating-particles');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// 8. Smooth Reveal Animations
function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    document.querySelectorAll('section, .research-card, .project-card, .educational-card, .media-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize all cool features
document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initDarkMode();
    initFloatingParticles();
    initEnhancedTyping();
    initEnhancedHoverEffects();
    initParallaxEffect();
    initRevealAnimations();
});

// Map is now handled by embedded iframe - no JavaScript needed
