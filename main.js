/* ============================================================
   COLLAB PACKAGING PVT LTD — MAIN.JS
   ============================================================ */

(function () {
    'use strict';

    /* ── NAVBAR SCROLL BEHAVIOUR ── */
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');

    function onScroll() {
        const y = window.scrollY;
        if (y > 60) {
            navbar.classList.add('scrolled');
            scrollTopBtn.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            scrollTopBtn.classList.remove('visible');
        }
        updateActiveNavLink(y);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── SCROLL TO TOP ── */
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ── ACTIVE NAV LINK ── */
    const sections = ['home', 'about', 'products', 'manufacturing', 'industries', 'quality', 'contact'];

    function updateActiveNavLink(scrollY) {
        let current = 'home';
        for (const id of sections) {
            const el = document.getElementById(id);
            if (el && el.offsetTop - 100 <= scrollY) current = id;
        }
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    }

    /* ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72');
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            // Close mobile menu if open
            closeMobileMenu();
        });
    });

    /* ── MOBILE MENU ── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }

    /* ── MOBILE MENU LINKS ── */
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    /* ── PRODUCT TABS ── */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function revealTabContent(contentEl) {
        if (!contentEl) return;
        // Make all animated elements inside this tab visible with staggered delays
        const animEls = contentEl.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right');
        animEls.forEach((el, i) => {
            el.classList.remove('visible');
            void el.offsetWidth; // force reflow
            setTimeout(() => {
                el.style.transitionDelay = `${i * 0.08}s`;
                el.classList.add('visible');
            }, 50);
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const content = document.getElementById(`content-${target}`);
            if (content) {
                content.classList.add('active');
                revealTabContent(content);
            }
        });
    });

    // Reveal the initially active tab content
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        activeTab.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right').forEach(el => {
            el.classList.add('visible');
        });
    }

    /* ── SCROLL ANIMATIONS (IntersectionObserver + fallback) ── */
    const animatedEls = document.querySelectorAll(
        '.animate-fade-up, .animate-slide-left, .animate-slide-right, .industry-card'
    );

    function revealElement(el) {
        if (el.classList.contains('visible')) return true;
        // Skip elements inside inactive tabs (they'll be revealed when tab activates)
        const parentTab = el.closest('.tab-content');
        if (parentTab && !parentTab.classList.contains('active')) return false;

        const delay = el.dataset.delay || el.style.getPropertyValue('--delay') || '0s';
        el.style.transitionDelay = delay;
        el.classList.add('visible');
        return true;
    }

    // Check which elements are already in the viewport
    function revealInViewport() {
        animatedEls.forEach(el => {
            if (el.classList.contains('visible')) return;
            const parentTab = el.closest('.tab-content');
            if (parentTab && !parentTab.classList.contains('active')) return;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
                revealElement(el);
            }
        });
    }

    if ('IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.01, rootMargin: '50px 0px 0px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const revealed = revealElement(entry.target);
                    if (revealed !== false) observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedEls.forEach(el => observer.observe(el));
    }

    // Immediately reveal elements already in viewport on load
    revealInViewport();

    // Also check on scroll for any elements the observer might miss
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                revealInViewport();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Ultimate fallback: make ALL elements visible after 2 seconds
    setTimeout(() => {
        animatedEls.forEach(el => {
            const parentTab = el.closest('.tab-content');
            if (parentTab && !parentTab.classList.contains('active')) return;
            if (!el.classList.contains('visible')) {
                el.style.transitionDelay = '0s';
                el.classList.add('visible');
            }
        });
    }, 2000);

    /* ── HERO INTRO ANIMATION ── */
    const heroContent = document.querySelector('.hero-content');
    const heroLottie = document.querySelector('.hero-lottie-wrap');

    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
            heroContent.classList.add('visible');
        }, 200);
    }
    if (heroLottie) {
        heroLottie.style.opacity = '0';
        heroLottie.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroLottie.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            heroLottie.style.opacity = '1';
            heroLottie.style.transform = 'translateY(0)';
            heroLottie.classList.add('visible');
        }, 500);
    }

    /* ── COUNTER ANIMATION ── */
    const counters = document.querySelectorAll('[data-target]');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    const heroSection = document.getElementById('home');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) startCounters();
        }, { threshold: 0.3 });
        heroObserver.observe(heroSection);
    }
    // Fallback: start counters after 3 seconds regardless
    setTimeout(startCounters, 3000);

    /* ── PARTICLES ── */
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.width = p.style.height = `${Math.random() * 4 + 2}px`;
            p.style.animationDuration = `${Math.random() * 12 + 8}s`;
            p.style.animationDelay = `${Math.random() * 10}s`;
            p.style.opacity = `${Math.random() * 0.5 + 0.2}`;
            particleContainer.appendChild(p);
        }
    }

    /* ── GALLERY IMAGE UPLOAD ── */
    window.handleGalleryUpload = function (input, galleryId) {
        if (!input.files || !input.files[0]) return;
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const container = document.getElementById(galleryId);
            if (!container) return;
            container.innerHTML = `
                <div class="gallery-placeholder-content" style="height:100%;position:relative;">
                    <img src="${e.target.result}" alt="Factory Image" style="width:100%;height:100%;object-fit:cover;" />
                    <div class="gallery-caption">${sanitize(file.name.replace(/\.[^.]+$/, ''))}</div>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    };

    function sanitize(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /* ── CONTACT FORM VALIDATION & SUBMISSION ── */
    const form = document.getElementById('inquiryForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateForm()) return;

            // Simulate submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            setTimeout(() => {
                form.querySelector('.form-actions').style.display = 'none';
                formSuccess.classList.remove('hidden');
                form.reset();
            }, 1400);
        });

        // Real-time validation
        ['name', 'phone', 'requirement'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('blur', () => validateField(id));
                el.addEventListener('input', () => clearError(id));
            }
        });
    }

    function validateForm() {
        let valid = true;
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const req = document.getElementById('requirement');

        if (name && name.value.trim().length < 2) {
            showError('name', 'Please enter your full name.');
            valid = false;
        }
        if (phone && !/^[6-9]\d{9}$/.test(phone.value.replace(/\s|\+91|-/g, ''))) {
            showError('phone', 'Please enter a valid 10-digit Indian mobile number.');
            valid = false;
        }
        if (req && req.value.trim().length < 10) {
            showError('requirement', 'Please describe your requirement (min. 10 characters).');
            valid = false;
        }
        return valid;
    }

    function validateField(id) {
        const el = document.getElementById(id);
        if (!el) return;
        const val = el.value.trim();
        if (id === 'name' && val.length < 2) showError(id, 'Name is required.');
        if (id === 'phone' && val && !/^[6-9]\d{9}$/.test(val.replace(/\s|\+91|-/g, ''))) showError(id, 'Enter valid 10-digit mobile number.');
        if (id === 'requirement' && val.length < 10) showError(id, 'Please add more details.');
    }

    function showError(id, message) {
        const errEl = document.getElementById(`${id}-error`);
        const el = document.getElementById(id);
        if (errEl) errEl.textContent = message;
        if (el) el.style.borderColor = 'var(--accent-red)';
    }

    function clearError(id) {
        const errEl = document.getElementById(`${id}-error`);
        const el = document.getElementById(id);
        if (errEl) errEl.textContent = '';
        if (el) el.style.borderColor = '';
    }

    /* ── LAZY LOAD IMAGES ── */
    if ('IntersectionObserver' in window) {
        const lazyImgs = document.querySelectorAll('img[data-src]');
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.src = entry.target.dataset.src;
                    imgObserver.unobserve(entry.target);
                }
            });
        });
        lazyImgs.forEach(img => imgObserver.observe(img));
    }

    /* ── HERO CTA ripple effect ── */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute; border-radius: 50%;
                width: 10px; height: 10px;
                background: rgba(255,255,255,.4);
                transform: scale(0); animation: ripple-anim .6s linear;
                left: ${e.offsetX - 5}px; top: ${e.offsetY - 5}px;
                pointer-events: none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    /* Ripple keyframe */
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes ripple-anim {
            to { transform: scale(30); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    console.log('✅ Collab Packaging — All systems initialized.');
})();
