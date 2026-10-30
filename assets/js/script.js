// Mobile navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    const setOpen = (open) => {
        hamburger.classList.toggle('active', open);
        navMenu.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    hamburger.addEventListener('click', () => {
        setOpen(!navMenu.classList.contains('active'));
    });

    navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });
}

// Theme: saved preference, otherwise the system setting
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    let saved = null;
    try {
        saved = localStorage.getItem('theme');
    } catch (e) {}
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));

    themeToggle.addEventListener('click', () => {
        const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) {}
    });
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    const icon = document.querySelector('#theme-toggle i');
    if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    document.dispatchEvent(new Event('themechange'));
}

// Navbar border once the page scrolls
function updateNavbarState() {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('navbar-scrolled', window.scrollY > 8);
}

// Highlight the nav link for the section in view
function initActiveNavLinks() {
    const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!navLinks.length || !sections.length) return;

    const setActiveLink = (id) => {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    const updateActiveLinkOnScroll = () => {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 64;
        const markerY = window.scrollY + navbarHeight + 24;
        const atPageBottom = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 2);

        if (atPageBottom) {
            setActiveLink(sections[sections.length - 1].id);
            return;
        }

        let currentSectionId = sections[0].id;
        for (const section of sections) {
            if (section.offsetTop <= markerY) {
                currentSectionId = section.id;
            } else {
                break;
            }
        }
        setActiveLink(currentSectionId);
    };

    window.addEventListener('scroll', updateActiveLinkOnScroll, { passive: true });
    window.addEventListener('resize', updateActiveLinkOnScroll);
    updateActiveLinkOnScroll();
}

// Back-to-top button
function initScrollToTop() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    button.hidden = true;
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        button.hidden = window.scrollY < 600;
    }, { passive: true });
}

// Fade sections in as they scroll into view
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.section-title, .section-note, .latest-entry, .publication-entry, .record-row, .contact-list'
    );
    if (!targets.length) return;

    // Stagger rows within the same list
    document.querySelectorAll('.record-list').forEach(list => {
        Array.from(list.children).forEach((row, i) => {
            row.style.setProperty('--reveal-index', Math.min(i, 8));
        });
    });

    if (!('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(el => observer.observe(el));
}

// Page background: drifting points linked to neighbours and to the cursor
function initBackgroundGraph() {
    const canvas = document.querySelector('.bg-graph');
    if (!canvas || !canvas.getContext) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const LINK_DIST = 130;
    const CURSOR_DIST = 170;
    const pointer = { x: 0, y: 0, active: false };
    let points = [];
    let width = 0;
    let height = 0;
    let rgb = '31, 58, 104';
    let running = false;
    let frame = 0;
    let lastWidth = 0;

    const readColor = () => {
        const probe = getComputedStyle(document.body).getPropertyValue('--accent').trim();
        const hex = probe.replace('#', '');
        if (hex.length === 6) {
            rgb = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)).join(', ');
        }
    };

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Mobile toolbars change the height while scrolling; keep the points then
        if (points.length && width === lastWidth) return;
        lastWidth = width;

        const count = Math.round(Math.min(80, Math.max(24, (width * height) / 14000)));
        points = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: 1.2 + Math.random() * 1.2
        }));
    };

    const step = () => {
        if (!running) return;
        ctx.clearRect(0, 0, width, height);

        for (const p of points) {
            // Gentle pull toward the cursor
            if (pointer.active) {
                const dx = pointer.x - p.x;
                const dy = pointer.y - p.y;
                const d = Math.hypot(dx, dy);
                if (d < CURSOR_DIST && d > 1) {
                    p.vx += (dx / d) * 0.012;
                    p.vy += (dy / d) * 0.012;
                }
            }

            // Keep speed bounded so the field stays calm
            const speed = Math.hypot(p.vx, p.vy);
            if (speed > 0.6) {
                p.vx *= 0.6 / speed;
                p.vy *= 0.6 / speed;
            }

            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));
        }

        ctx.lineWidth = 1;
        for (let i = 0; i < points.length; i++) {
            const a = points[i];
            for (let j = i + 1; j < points.length; j++) {
                const b = points[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < LINK_DIST) {
                    ctx.strokeStyle = `rgba(${rgb}, ${0.13 * (1 - d / LINK_DIST)})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            if (pointer.active) {
                const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
                if (d < CURSOR_DIST) {
                    ctx.strokeStyle = `rgba(${rgb}, ${0.28 * (1 - d / CURSOR_DIST)})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                }
            }
        }

        ctx.fillStyle = `rgba(${rgb}, 0.32)`;
        for (const p of points) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        frame = requestAnimationFrame(step);
    };

    const start = () => {
        if (running) return;
        running = true;
        frame = requestAnimationFrame(step);
    };

    const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
    };

    window.addEventListener('pointermove', (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = e.pointerType === 'mouse';
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => {
        pointer.active = false;
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });
    document.addEventListener('themechange', readColor);

    // Pause while the tab is in the background
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : start();
    });

    readColor();
    resize();
    start();
}

// Refresh GitHub star counts; the numbers in the HTML stay if the request fails
function initStarCounts() {
    document.querySelectorAll('.star-count[data-repo]').forEach(badge => {
        fetch(`https://api.github.com/repos/${badge.dataset.repo}`)
            .then(res => (res.ok ? res.json() : null))
            .then(data => {
                if (!data || typeof data.stargazers_count !== 'number') return;
                const count = data.stargazers_count;
                badge.querySelector('.star-number').textContent =
                    count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
                badge.setAttribute('aria-label', `${count} GitHub stars`);
            })
            .catch(() => {});
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initStarCounts();
    initScrollReveal();
    initMobileNav();
    initDarkMode();
    updateNavbarState();
    initActiveNavLinks();
    initScrollToTop();
    initBackgroundGraph();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
});
