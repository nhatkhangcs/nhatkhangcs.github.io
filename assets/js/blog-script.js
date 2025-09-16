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
            return;
        }

        this.blogPosts.forEach(post => {
            const title = post.querySelector('.post-title a').textContent.toLowerCase();
            const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
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
        const url = window.location.href;

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
