// Blog-Specific JavaScript Functionality

// Blog Search Functionality
class BlogSearch {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchBtn = document.querySelector('.search-btn');
        this.blogPosts = document.querySelectorAll('.blog-post');
        this.init();
    }

    init() {
        if (this.searchInput && this.searchBtn) {
            this.searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch();
            });

            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });

            this.searchInput.addEventListener('input', () => {
                this.performSearch();
            });
        }
    }

    performSearch() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.showAllPosts();
            this.clearSearchIndicator();
            return;
        }

        this.blogPosts.forEach(post => {
            const titleElement = post.querySelector('.post-title a') || post.querySelector('.post-title');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            const excerptElement = post.querySelector('.post-excerpt');
            const excerpt = excerptElement ? excerptElement.textContent.toLowerCase() : '';
            const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          excerpt.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));

            if (matches) {
                post.style.display = 'block';
                post.classList.add('search-highlight');
            } else {
                post.style.display = 'none';
                post.classList.remove('search-highlight');
            }
        });

        this.updateSearchResults(searchTerm);
    }

    showAllPosts() {
        this.blogPosts.forEach(post => {
            post.style.display = 'block';
            post.classList.remove('search-highlight');
        });
        this.clearSearchIndicator();
    }

    updateSearchResults(searchTerm) {
        const visiblePosts = Array.from(this.blogPosts).filter(post => 
            post.style.display !== 'none'
        );

        // Add search results indicator
        let resultsIndicator = document.querySelector('.search-results-indicator');
        if (!resultsIndicator) {
            resultsIndicator = document.createElement('div');
            resultsIndicator.className = 'search-results-indicator';
            resultsIndicator.style.cssText = `
                margin-bottom: 2rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
                font-weight: 500;
                color: #666;
            `;
            document.querySelector('.blog-main').insertBefore(resultsIndicator, document.querySelector('.blog-posts-grid'));
        }

        if (visiblePosts.length === 0) {
            resultsIndicator.innerHTML = `No posts found for "${searchTerm}"`;
            resultsIndicator.style.display = 'block';
        } else {
            resultsIndicator.innerHTML = `${visiblePosts.length} post(s) found for "${searchTerm}"`;
            resultsIndicator.style.display = 'block';
        }
    }

    clearSearchIndicator() {
        const resultsIndicator = document.querySelector('.search-results-indicator');
        if (resultsIndicator) {
            resultsIndicator.style.display = 'none';
            resultsIndicator.innerHTML = '';
        }
    }
}

// Blog Filter Functionality
class BlogFilter {
    constructor() {
        this.categoryLinks = document.querySelectorAll('.category-link');
        this.tagLinks = document.querySelectorAll('.tag-link');
        this.blogPosts = document.querySelectorAll('.blog-post');
        this.init();
    }

    init() {
        this.categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.textContent.split(' (')[0].toLowerCase();
                this.filterByCategory(category);
            });
        });

        this.tagLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tag = link.textContent.toLowerCase();
                this.filterByTag(tag);
            });
        });
    }

    filterByCategory(category) {
        this.blogPosts.forEach(post => {
            const postCategory = post.querySelector('.post-category').textContent.toLowerCase();
            if (postCategory === category || category === 'all') {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });

        this.updateActiveFilter(category, 'category');
    }

    filterByTag(tag) {
        this.blogPosts.forEach(post => {
            const postTags = Array.from(post.querySelectorAll('.tag')).map(tagEl => 
                tagEl.textContent.toLowerCase()
            );
            
            if (postTags.includes(tag)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });

        this.updateActiveFilter(tag, 'tag');
    }

    updateActiveFilter(filterValue, type) {
        // Remove active class from all filter links
        document.querySelectorAll('.category-link, .tag-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked link
        const activeLink = Array.from(document.querySelectorAll('.category-link, .tag-link'))
            .find(link => link.textContent.toLowerCase().includes(filterValue));
        
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Blog Pagination
class BlogPagination {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.blogPosts = document.querySelectorAll('.blog-post');
        this.paginationNumbers = document.querySelectorAll('.pagination-number');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.init();
    }

    init() {
        this.setupPagination();
        this.bindEvents();
    }

    setupPagination() {
        const totalPosts = this.blogPosts.length;
        const totalPages = Math.ceil(totalPosts / this.postsPerPage);
        
        // Update pagination numbers
        this.updatePaginationNumbers(totalPages);
        
        // Show first page by default
        this.showPage(1);
    }

    updatePaginationNumbers(totalPages) {
        const paginationContainer = document.querySelector('.pagination-numbers');
        if (!paginationContainer) return;

        // Clear existing numbers
        paginationContainer.innerHTML = '';

        // Add page numbers
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-number';
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => this.goToPage(i));
            paginationContainer.appendChild(pageBtn);
        }

        // Add dots and last page if needed
        if (totalPages > 5) {
            const dots = document.createElement('span');
            dots.className = 'pagination-dots';
            dots.textContent = '...';
            paginationContainer.appendChild(dots);

            const lastPageBtn = document.createElement('button');
            lastPageBtn.className = 'pagination-number';
            lastPageBtn.textContent = totalPages;
            lastPageBtn.addEventListener('click', () => this.goToPage(totalPages));
            paginationContainer.appendChild(lastPageBtn);
        }
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousPage());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextPage());
        }
    }

    showPage(pageNumber) {
        const startIndex = (pageNumber - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;

        this.blogPosts.forEach((post, index) => {
            if (index >= startIndex && index < endIndex) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });

        this.currentPage = pageNumber;
        this.updatePaginationButtons();
    }

    goToPage(pageNumber) {
        this.showPage(pageNumber);
        this.updateActivePageButton(pageNumber);
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.blogPosts.length / this.postsPerPage);
        if (this.currentPage < totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    updatePaginationButtons() {
        const totalPages = Math.ceil(this.blogPosts.length / this.postsPerPage);
        
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentPage === 1;
        }

        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentPage === totalPages;
        }
    }

    updateActivePageButton(pageNumber) {
        document.querySelectorAll('.pagination-number').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === pageNumber) {
                btn.classList.add('active');
            }
        });
    }
}

// Blog Newsletter Subscription
class BlogNewsletter {
    constructor() {
        this.newsletterForm = document.querySelector('.newsletter-form');
        this.init();
    }

    init() {
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubscription();
            });
        }
    }

    handleSubscription() {
        const emailInput = this.newsletterForm.querySelector('.newsletter-input');
        const submitBtn = this.newsletterForm.querySelector('.newsletter-btn');
        const email = emailInput.value.trim();

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate subscription process
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showMessage('Thank you for subscribing! You\'ll receive updates on new blog posts.', 'success');
            emailInput.value = '';
            submitBtn.textContent = 'Subscribe';
            submitBtn.disabled = false;
        }, 2000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `newsletter-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin-top: 1rem;
            padding: 0.75rem;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
        `;

        this.newsletterForm.appendChild(messageEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// Blog Reading Progress
class BlogReadingProgress {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress-bar');
        this.init();
    }

    init() {
        if (this.progressBar) {
            window.addEventListener('scroll', () => {
                this.updateProgress();
            });
        }
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.progressBar.style.width = scrollPercent + '%';
    }
}

// Blog Post Animations
class BlogAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
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

        // Observe blog posts
        document.querySelectorAll('.blog-post, .sidebar-widget').forEach(el => {
            observer.observe(el);
        });
    }
}

// Table of Contents Scroll-Spy and Smooth Scroll
class BlogTOCSpy {
    constructor() {
        this.tocLinks = Array.from(document.querySelectorAll('.toc-nav a'));
        this.headings = [];
        this.observer = null;
        this.navOffset = 80; // approximate fixed navbar height
        this.scrollHandler = null;
        this.tocContainer = document.querySelector('.toc-nav');
        this.init();
    }

    init() {
        if (!this.tocLinks.length) return;

        // Collect target headings from toc hrefs
        this.headings = this.tocLinks
            .map(link => document.querySelector(link.getAttribute('href')))
            .filter(Boolean);

        if (!this.headings.length) return;

        this.bindClicks();
        this.createObserver();
        this.bindScrollFallback();
    }

    bindClicks() {
        this.tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const targetTop = target.getBoundingClientRect().top + window.pageYOffset - this.navOffset - 20;
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            });
        });
    }

    createObserver() {
        const options = {
            root: null,
            rootMargin: `-${this.navOffset + 40}px 0px -60% 0px`,
            threshold: [0, 0.5, 1.0]
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                if (!id) return;
                const link = this.tocLinks.find(a => a.getAttribute('href') === `#${id}`);
                if (!link) return;

                if (entry.isIntersecting) {
                    this.setActive(link);
                }
            });
        }, options);

        this.headings.forEach(h => this.observer.observe(h));
    }

    setActive(activeLink) {
        this.tocLinks.forEach(a => a.classList.remove('active'));
        activeLink.classList.add('active');
        this.scrollActiveIntoView(activeLink);
    }

    bindScrollFallback() {
        // Fallback scroll-spy in case IntersectionObserver misses due to dynamic layout
        this.scrollHandler = () => {
            let current = null;
            const viewportTop = window.pageYOffset + this.navOffset + 10;
            for (const heading of this.headings) {
                const top = heading.offsetTop;
                if (top <= viewportTop) {
                    current = heading;
                } else {
                    break;
                }
            }
            if (current) {
                const link = this.tocLinks.find(a => a.getAttribute('href') === `#${current.id}`);
                if (link) this.setActive(link);
            }
        };
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
        // Initial highlight
        this.scrollHandler();
    }

    scrollActiveIntoView(activeLink) {
        try {
            if (!this.tocContainer || !activeLink) return;
            const container = this.tocContainer;
            // Find nearest scrollable ancestor (toc might be inside .post-sidebar which scrolls)
            let scrollParent = container;
            while (scrollParent && scrollParent !== document.body) {
                const style = getComputedStyle(scrollParent);
                const canScroll = /(auto|scroll)/.test(style.overflowY);
                if (canScroll) break;
                scrollParent = scrollParent.parentElement;
            }
            if (!scrollParent) scrollParent = container;

            const parentRect = scrollParent.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();

            const linkTopInParent = linkRect.top - parentRect.top + scrollParent.scrollTop;
            const linkBottomInParent = linkTopInParent + linkRect.height;
            const visibleTop = scrollParent.scrollTop;
            const visibleBottom = visibleTop + scrollParent.clientHeight;

            const padding = 24; // keep some breathing room
            if (linkTopInParent < visibleTop + padding || linkBottomInParent > visibleBottom - padding) {
                const targetScrollTop = linkTopInParent - (scrollParent.clientHeight / 2) + (linkRect.height / 2);
                scrollParent.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
            }
        } catch (_) {
            // fail silently
        }
    }
}

// Blog Share Functionality
class BlogShare {
    constructor() {
        this.init();
    }

    init() {
        this.addShareButtons();
    }

    addShareButtons() {
        const blogPosts = document.querySelectorAll('.blog-post');
        
        blogPosts.forEach(post => {
            if (!post) return;
            const shareContainer = document.createElement('div');
            shareContainer.className = 'post-share';
            shareContainer.style.cssText = `
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #e9ecef;
                display: flex;
                gap: 0.5rem;
                align-items: center;
            `;

            const shareLabel = document.createElement('span');
            shareLabel.textContent = 'Share:';
            shareLabel.style.cssText = 'font-size: 0.85rem; color: #666; font-weight: 500;';

            const shareButtons = this.createShareButtons(post);
            
            shareContainer.appendChild(shareLabel);
            shareContainer.appendChild(shareButtons);
            
            const postContent = post.querySelector('.post-content');
            if (postContent) {
                postContent.appendChild(shareContainer);
            }
        });
    }

    createShareButtons(post) {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; gap: 0.5rem;';

        const titleElement = post.querySelector('.post-title a, h2.post-title a, h3.post-title a');
        const title = titleElement ? titleElement.textContent : 'Blog Post';
        // Prefer the specific post link on listing pages; fallback to current URL
        const linkElement = post.querySelector('.post-title a, .post-image a');
        const url = linkElement && linkElement.getAttribute('href')
            ? new URL(linkElement.getAttribute('href'), window.location.href).href
            : window.location.href;

        const platforms = [
            { name: 'Twitter', icon: 'fab fa-twitter', color: '#1da1f2' },
            { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0077b5' },
            { name: 'Facebook', icon: 'fab fa-facebook', color: '#4267b2' },
            { name: 'Copy Link', icon: 'fas fa-link', color: '#667eea' }
        ];

        platforms.forEach(platform => {
            const button = document.createElement('button');
            button.className = 'share-btn';
            button.innerHTML = `<i class="${platform.icon}"></i>`;
            button.setAttribute('aria-label', `Share on ${platform.name}`);
            button.title = `Share on ${platform.name}`;
            button.style.cssText = `
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: none;
                background: ${platform.color};
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease;
            `;

            button.addEventListener('click', () => {
                this.sharePost(platform.name, title, url);
            });

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.1)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });

            container.appendChild(button);
        });

        return container;
    }

    sharePost(platform, title, url) {
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(url);

        let shareUrl = '';

        switch (platform) {
            case 'Twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
                break;
            case 'LinkedIn':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'Facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'Copy Link':
                navigator.clipboard.writeText(url).then(() => {
                    this.showCopyMessage();
                });
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    showCopyMessage() {
        const message = document.createElement('div');
        message.textContent = 'Link copied to clipboard!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Initialize all blog functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogSearch();
    new BlogFilter();
    new BlogPagination();
    new BlogNewsletter();
    new BlogReadingProgress();
    new BlogAnimations();
    new BlogShare();
    new BlogTOCSpy();
    new BlogPostNavigation();
    // Initialize Python runners (Pyodide)
    PythonRunner.bootstrap();
    // TOC toggle handler
    initTOCToggle();
});

// Add CSS for animations
const blogStyle = document.createElement('style');
blogStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .search-highlight {
        animation: highlight 0.5s ease;
    }

    @keyframes highlight {
        0% { background-color: rgba(102, 126, 234, 0.1); }
        100% { background-color: transparent; }
    }

    .category-link.active,
    .tag-link.active {
        color: #667eea !important;
        font-weight: 600;
    }

    .pagination-number.active {
        background: #667eea !important;
        color: white !important;
        border-color: #667eea !important;
    }
`;
document.head.appendChild(blogStyle);

// Global share helpers for inline buttons in single post templates
window.sharePost = function(platform) {
    try {
        const rawTitleEl = document.querySelector('.post-title, .post-header .post-title, h1.post-title');
        const title = (rawTitleEl && rawTitleEl.textContent.trim()) || document.title || 'Blog Post';
        const url = window.location.href;

        const p = String(platform || '').toLowerCase();
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(url);

        let shareUrl = '';
        if (p === 'twitter' || p === 'x') {
            shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        } else if (p === 'linkedin') {
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        } else if (p === 'facebook' || p === 'fb') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        } else if (p === 'copy' || p === 'copy link' || p === 'link') {
            window.copyLink();
            return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    } catch (err) {
        // fail silently
    }
};

window.copyLink = function() {
    const url = window.location.href;
    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => { if (toast && toast.parentNode) toast.remove(); }, 3000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => showToast('Link copied to clipboard!'))
            .catch(() => {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = url;
                document.body.appendChild(textarea);
                textarea.select();
                try { document.execCommand('copy'); } catch (e) {}
                textarea.remove();
                showToast('Link copied to clipboard!');
            });
    } else {
        // Older browsers fallback
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); } catch (e) {}
        textarea.remove();
        showToast('Link copied to clipboard!');
    }
};

// Previous/Next navigation for single blog posts
class BlogPostNavigation {
    constructor() {
        this.posts = [
            { slug: 'transformer-analysis.html', title: 'Attention is All You Need: The Transformer Architecture' },
            { slug: 'clip-analysis.html', title: 'CLIP: Learning Transferable Visual Models From Natural Language Supervision' },
        ];
        this.init();
    }

    init() {
        try {
            // Only run on single post pages (which include .post-article)
            const postArticle = document.querySelector('.post-article');
            if (!postArticle) return;

            // Determine current slug relative to /blog/
            const url = new URL(window.location.href);
            const path = url.pathname;
            const lastSegment = path.split('/').filter(Boolean).pop() || '';
            const currentIndex = this.posts.findIndex(p => p.slug === lastSegment);
            if (currentIndex === -1) return;

            const prev = this.posts[currentIndex - 1] || null;
            const next = this.posts[currentIndex + 1] || null;

            // Build navigation HTML
            const nav = document.createElement('div');
            nav.className = 'post-navigation';
            nav.innerHTML = `
                ${prev ? `
                <a href="${prev.slug}" class="nav-link prev">
                    <i class="fas fa-chevron-left" aria-hidden="true"></i>
                    <div class="nav-content">
                        <span class="nav-label">Previous</span>
                        <span class="nav-title">${this.escape(prev.title)}</span>
                    </div>
                </a>
                ` : ''}
                ${next ? `
                <a href="${next.slug}" class="nav-link next">
                    <div class="nav-content">
                        <span class="nav-label">Next</span>
                        <span class="nav-title">${this.escape(next.title)}</span>
                    </div>
                    <i class="fas fa-chevron-right" aria-hidden="true"></i>
                </a>
                ` : ''}
            `;

            // Insert into .post-footer (replace existing .post-navigation if present)
            const footer = document.querySelector('.post-footer');
            if (!footer) return;
            const existing = footer.querySelector('.post-navigation');
            if (existing) {
                existing.replaceWith(nav);
            } else {
                footer.appendChild(nav);
            }
        } catch (_) {
            // fail silently
        }
    }

    escape(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// TOC toggle implementation
function initTOCToggle() {
    // Create floating button
    const fab = document.createElement('button');
    fab.className = 'toc-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Toggle Table of Contents');
    fab.title = 'Toggle Table of Contents';
    fab.innerHTML = '<i class="icon fas fa-list"></i>';
    document.body.appendChild(fab);

    const updateFab = () => {
        const show = window.scrollY > 300; // show after scrolling down a bit
        fab.classList.toggle('show', show);
        // Update icon based on collapsed state
        const collapsed = document.body.classList.contains('toc-collapsed');
        const icon = fab.querySelector('.icon');
        if (icon) icon.className = collapsed ? 'icon fas fa-list-ul' : 'icon fas fa-list';
    };

    window.addEventListener('scroll', updateFab, { passive: true });
    window.addEventListener('load', updateFab);

    fab.addEventListener('click', () => {
        document.body.classList.toggle('toc-collapsed');
        updateFab();
    });
}

// ---- Interactive Python Runner (Pyodide) ----
class PythonRunner {
    static pyodide = null;
    static isLoading = false;
    static readyPromise = null;
    static cmReadyPromise = null;

    static bootstrap() {
        // Find any .py-runner on page; if present, ensure Pyodide loads and mount widgets
        const blocks = document.querySelectorAll('.py-runner');
        if (!blocks.length) return;
        this.ensurePyodide();
        this.ensureCodeMirror();
        this.mountAll(blocks);
    }

    static ensurePyodide() {
        if (this.readyPromise) return this.readyPromise;
        this.isLoading = true;
        // Inject pyodide script once
        if (!window.loadPyodide) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
            script.defer = true;
            document.head.appendChild(script);
        }
        this.readyPromise = new Promise((resolve) => {
            const wait = async () => {
                if (window.loadPyodide) {
                    try {
                        PythonRunner.pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/' });
                        resolve(PythonRunner.pyodide);
                    } catch (e) {
                        console.error('Pyodide failed to load', e);
                        resolve(null);
                    }
                } else {
                    setTimeout(wait, 50);
                }
            };
            wait();
        });
        return this.readyPromise;
    }

    static ensureCodeMirror() {
        if (this.cmReadyPromise) return this.cmReadyPromise;
        this.cmReadyPromise = new Promise((resolve) => {
            // Inject CSS
            if (!document.querySelector('link[data-cm="base"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.min.css';
                link.setAttribute('data-cm', 'base');
                document.head.appendChild(link);
            }
            // Inject JS and mode
            const loadScript = (src, attr) => new Promise((res) => {
                if (document.querySelector(`script[data-cm="${attr}"]`)) return res();
                const s = document.createElement('script');
                s.src = src;
                s.defer = true;
                s.setAttribute('data-cm', attr);
                s.onload = () => res();
                document.head.appendChild(s);
            });

            const waitFor = (cond) => new Promise((res) => {
                const tick = () => (cond() ? res() : setTimeout(tick, 50));
                tick();
            });

            (async () => {
                await loadScript('https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.min.js', 'core');
                await loadScript('https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/python/python.min.js', 'mode-python');
                await waitFor(() => window.CodeMirror && window.CodeMirror.fromTextArea);
                resolve(window.CodeMirror);
            })();
        });
        return this.cmReadyPromise;
    }

    static mountAll(blocks) {
        blocks.forEach((el) => new PythonRunner(el));
    }

    constructor(container) {
        this.container = container;
        this.code = (container.dataset.code || '').trim();
        this.template = (container.dataset.template || '').trim();
        this.packages = (container.dataset.packages || '').split(',').map(s => s.trim()).filter(Boolean);
        this.editor = null;
        this.output = null;
        this.runBtn = null;
        this.stopRequested = false;
        this.render();
    }

    render() {
        // Structure: header + textarea + controls + output
        const wrapper = document.createElement('div');
        wrapper.className = 'py-box';

        const header = document.createElement('div');
        header.className = 'py-box-header';
        header.innerHTML = '<span class="py-title"><i class="fas fa-code"></i> Python</span><span class="py-badge">Pyodide</span>';

        const editor = document.createElement('textarea');
        editor.className = 'py-editor';
        editor.setAttribute('spellcheck', 'false');
        editor.value = this.code || this.getTemplateCode() || `# Example: scaled dot-product attention (toy)
import math

def attention(q, k, v):
    scale = 1.0 / math.sqrt(len(k[0]))
    scores = [[sum(qi*kj for qi,kj in zip(qv, kv))*scale for kv in k] for qv in q]
    # softmax row-wise
    def softmax(row):
        m = max(row)
        ex = [math.exp(x-m) for x in row]
        s = sum(ex)
        return [e/s for e in ex]
    weights = [softmax(r) for r in scores]
    out = []
    for w in weights:
        out.append([sum(wj * vj[i] for wj, vj in zip(w, v)) for i in range(len(v[0]))])
    return out

q = [[1,0,0],[0,1,0]]
k = [[1,0,0],[0.9,0.1,0],[0,1,0]]
v = [[1,2],[3,4],[5,6]]
print(attention(q,k,v))
`;

        const controls = document.createElement('div');
        controls.className = 'py-controls';
        const actions = document.createElement('div');
        actions.className = 'py-actions';
        const runBtn = document.createElement('button');
        runBtn.className = 'py-run';
        runBtn.textContent = 'Run';
        const copyBtn = document.createElement('button');
        copyBtn.className = 'py-copy';
        copyBtn.textContent = 'Copy';
        const clearBtn = document.createElement('button');
        clearBtn.className = 'py-clear';
        clearBtn.textContent = 'Clear';
        actions.appendChild(runBtn);
        actions.appendChild(copyBtn);
        actions.appendChild(clearBtn);
        const status = document.createElement('span');
        status.className = 'py-status';
        status.textContent = '';
        controls.appendChild(actions);
        controls.appendChild(status);

        const output = document.createElement('pre');
        output.className = 'py-output';
        output.textContent = '';

        wrapper.appendChild(header);
        wrapper.appendChild(editor);
        wrapper.appendChild(controls);
        wrapper.appendChild(output);
        this.container.appendChild(wrapper);

        this.editor = editor;
        this.output = output;
        this.runBtn = runBtn;
        this.status = status;
        this.bind(copyBtn, clearBtn);
        // Upgrade to CodeMirror if available
        PythonRunner.ensureCodeMirror().then((CM) => {
            if (!CM || this.cm) return;
            this.cm = CM.fromTextArea(this.editor, {
                mode: 'python',
                lineNumbers: true,
                indentUnit: 4,
                lineWrapping: true,
                tabSize: 4,
                viewportMargin: Infinity,
            });
            // Ensure height follows CSS
            this.cm.setSize('100%', '300px');
        });
    }

    getTemplateCode() {
        const t = this.template.toLowerCase();
        if (!t) return '';
        const templates = {
            overview: `# Quick demo: simple attention weights over three tokens
import math
q = [[1,0,0]]
k = [[1,0,0],[0,1,0],[0,0,1]]
v = [[1],[2],[3]]
scale = 1/math.sqrt(1)
scores = [sum(qi*kj for qi,kj in zip(q[0], kv))*scale for kv in k]
ex = [math.exp(s - max(scores)) for s in scores]
weights = [e/sum(ex) for e in ex]
out = sum(w*v[i][0] for i,w in enumerate(weights))
print('weights:', [round(w,3) for w in weights])
print('output:', round(out,3))
`,
            motivation: `# RNN (sequential) vs attention-style (parallelizable) toy
# RNN update depends on previous state
def rnn(xs):
    h = 0
    for x in xs:
        h = 0.8*h + x
    return h

# Attention combines all inputs at once via weights
def attn(xs):
    w = [1/len(xs)]*len(xs)
    return sum(w[i]*xs[i] for i in range(len(xs)))

xs = [1,2,3,4]
print('rnn:', rnn(xs))
print('attn:', attn(xs))
`,
            self_attention: `# Scaled dot-product attention
import math
def attention(q, k, v):
    dk = len(k[0])
    scale = 1.0 / math.sqrt(dk)
    def softmax(row):
        m = max(row)
        ex = [math.exp(x-m) for x in row]
        s = sum(ex)
        return [e/s for e in ex]
    scores = [[sum(qi*kj for qi,kj in zip(qv, kv))*scale for kv in k] for qv in q]
    w = [softmax(r) for r in scores]
    out = [[sum(wi*vj[i] for wi, vj in zip(wr, v)) for i in range(len(v[0]))] for wr in w]
    return w, out

q = [[1,0,0],[0,1,0]]
k = [[1,0,0],[0.9,0.1,0],[0,1,0]]
v = [[1,2],[3,4],[5,6]]
w, out = attention(q,k,v)
print('weights:', [[round(x,3) for x in r] for r in w])
print('out:', out)
`,
            multihead: `# Minimal multi-head attention split/concat (2 heads)
import math

def split_heads(x, h):
    # x: seq x d_model, return heads: h x seq x d_head
    d_model = len(x[0])
    d_head = d_model // h
    heads = []
    for i in range(h):
        heads.append([row[i*d_head:(i+1)*d_head] for row in x])
    return heads

def concat_heads(heads):
    # heads: h x seq x d_head -> seq x (h*d_head)
    seq = len(heads[0])
    return [[v for head in heads for v in head[t]] for t in range(seq)]

x = [[1,2,3,4],[5,6,7,8]]
hs = split_heads(x, 2)
print('heads:', hs)
print('concat:', concat_heads(hs))
`,
            architecture: `# Encoder block skeleton (no real attention math)
def layer_norm(x):
    mu = sum(x)/len(x)
    var = sum((xi-mu)**2 for xi in x)/len(x)
    eps=1e-5
    return [(xi-mu)/((var+eps)**0.5) for xi in x]

def ffn(x):
    return [max(0, xi*2-0.5) for xi in x]

x = [0.2, 0.5, 0.9]
attn_out = [xi*1.0 for xi in x]  # pretend attention
x = layer_norm([xi+yi for xi,yi in zip(x, attn_out)])
ffn_out = ffn(x)
x = layer_norm([xi+yi for xi,yi in zip(x, ffn_out)])
print('encoder_out:', [round(v,3) for v in x])
`,
            positional: `# Sinusoidal positional encoding (first 6 dims)
import math
def pe(pos, i, d_model):
    if i % 2 == 0:
        return math.sin(pos / (10000 ** (i/d_model)))
    else:
        return math.cos(pos / (10000 ** ((i-1)/d_model)))

d_model=6
for pos in range(5):
    row = [round(pe(pos,i,d_model),4) for i in range(d_model)]
    print(pos, row)
`,
            math: `# Verify attention weights sum to 1
import math
row = [0.2, 1.0, -0.5]
m = max(row)
ex = [math.exp(x-m) for x in row]
w = [e/sum(ex) for e in ex]
print('weights:', [round(x,6) for x in w], 'sum=', round(sum(w),6))
`,
            training: `# Transformer learning rate schedule
def lr(step, d_model=512, warmup=4000):
    import math
    step = max(1, step)
    return (d_model ** -0.5) * min(step ** -0.5, step * (warmup ** -1.5))

for s in [1, 1000, 4000, 8000, 16000]:
    print(s, round(lr(s), 8))
`,
            results: `# Example: compute relative improvement
base=25.16
trans=28.4
impr = (trans-base)/base*100
print('EN-DE BLEU improvement over ConvS2S: ', round(impr,2), '%')
`,
            advantages: `# Show direct long-range interaction via attention weights
import math
q = [[0,1,0,0,0]]
k = [[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,0,0,1]]
v = [[i] for i in range(5)]
scale=1
scores=[sum(q[0][i]*kv[i] for i in range(5))*scale for kv in k]
ex=[math.exp(s-max(scores)) for s in scores]
w=[e/sum(ex) for e in ex]
print('focused on index 1:', [round(x,2) for x in w])
`,
            limitations: `# Demonstrate quadratic pairs growth
def pairs(n):
    return n*n
for n in [8,16,32,64]:
    print(n, '->', pairs(n), 'attention pairs')
`,
            patterns: `# Diagonal vs shifted attention patterns
def pattern(n, shift=0):
    return [[1 if j==(i+shift)%n else 0 for j in range(n)] for i in range(n)]
for p in [pattern(5,0), pattern(5,1)]:
    for row in p: print(row)
    print()
`,
            tips: `# Label smoothing example
def label_smooth(y, classes=5, eps=0.1):
    return [(1-eps) if i==y else eps/(classes-1) for i in range(classes)]
print(label_smooth(2, classes=5, eps=0.1))
`,
            impact: `# Models built on Transformer
models = ['BERT','GPT','T5','ViT','PaLM']
print(', '.join(models))
`,
            variants: `# Efficient attention catalog
print('Variants:', ['Sparse', 'Linear', 'Performer', 'Longformer', 'BigBird'])
`,
            future: `# Open questions list
topics = ['Long context', 'Efficiency', 'Reasoning', 'Multimodality', 'Interpretability']
for t in topics: print('-', t)
`,
            intuition: `# Step-by-step attention computation
import math
q = [1,0]
k = [[1,0],[0.5,0.5]]
v = [[1],[3]]
scale = 1/math.sqrt(2)
scores = [q[0]*kv[0] + q[1]*kv[1] for kv in k]
scores = [s*scale for s in scores]
ex = [math.exp(s-max(scores)) for s in scores]
w = [e/sum(ex) for e in ex]
out = sum(w[i]*v[i][0] for i in range(2))
print('scores:', [round(s,3) for s in scores])
print('weights:', [round(x,3) for x in w])
print('out:', round(out,3))
`,
            citation: `# Paper reference
print('Vaswani et al., Attention is All You Need (2017)')
`
        };
        return templates[t] || '';
    }

    bind(copyBtn, clearBtn) {
        this.runBtn.addEventListener('click', async () => {
            await this.execute();
        });
        copyBtn.addEventListener('click', async () => {
            const code = this.cm ? this.cm.getValue() : this.editor.value;
            try {
                await navigator.clipboard.writeText(code);
                this.flashStatus('Copied');
            } catch (e) {
                this.flashStatus('Copy failed');
            }
        });
        clearBtn.addEventListener('click', () => {
            this.output.textContent = '';
        });
    }

    async ensurePackages() {
        if (!PythonRunner.pyodide) return;
        if (!this.packages.length) return;
        try {
            await PythonRunner.pyodide.loadPackage(this.packages);
        } catch (e) {
            // Best-effort: show warning but continue
            this.append(`Package load error: ${e}\n`);
        }
    }

    async execute() {
        this.output.textContent = '';
        this.status.textContent = 'Starting Python...';
        const py = await PythonRunner.ensurePyodide();
        if (!py) {
            this.status.textContent = 'Failed to load Python';
            return;
        }
        this.status.textContent = 'Running...';
        this.runBtn.disabled = true;
        await this.ensurePackages();

        // Redirect stdout/stderr
        try {
            const code = this.cm ? this.cm.getValue() : this.editor.value;
            const wrapped = `import sys\nfrom js import console\n\nclass W:\n    def write(self, s):\n        if s:\n            console.log(s)\n    def flush(self):\n        pass\n\nsys.stdout = W()\nsys.stderr = W()\n\n` + code;
            // Capture logs to output
            const originalLog = console.log;
            console.log = (msg) => { this.append(String(msg)); };
            await py.runPythonAsync(wrapped);
            console.log = originalLog;
            this.status.textContent = 'Done';
        } catch (e) {
            this.append(String(e));
            this.status.textContent = 'Error';
        } finally {
            this.runBtn.disabled = false;
        }
    }

    append(text) {
        if (text == null) return;
        this.output.textContent += text.endsWith('\n') ? text : (text + '\n');
    }

    flashStatus(msg) {
        const previous = this.status.textContent;
        this.status.textContent = msg;
        setTimeout(() => { this.status.textContent = previous; }, 1000);
    }
}
