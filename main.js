/* ============================================================
   COLLAB PACKAGING PVT LTD — MAIN.JS
   ============================================================ */

(function () {
    'use strict';

    // Signal JS is active (for any future progressive enhancement needs)
    document.body.classList.add('js-ready');

    /* ── NAVBAR SCROLL BEHAVIOUR ── */
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');

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

    function onScroll() {
        const y = window.scrollY;
        if (navbar) {
            if (y > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        if (scrollTopBtn) {
            if (y > 60) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
        updateActiveNavLink(y);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── SCROLL TO TOP ── */
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
    (function () {
        var btnLabels   = document.getElementById('tab-labels');
        var btnBoxes    = document.getElementById('tab-boxes');
        var panelLabels = document.getElementById('content-labels');
        var panelBoxes  = document.getElementById('content-boxes');

        if (!btnLabels || !btnBoxes || !panelLabels || !panelBoxes) return;

        function forceReveal(panel) {
            panel.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right').forEach(function (el, i) {
                el.style.opacity = '';
                el.style.transform = '';
                el.style.transitionDelay = '';
                el.classList.remove('visible');
                requestAnimationFrame(function () {
                    el.style.transitionDelay = (i * 0.06) + 's';
                    el.classList.add('visible');
                });
            });
        }

        function showTab(tabName) {
            var show, hide, activateBtn, deactivateBtn;
            if (tabName === 'labels') {
                show = panelLabels; hide = panelBoxes;
                activateBtn = btnLabels; deactivateBtn = btnBoxes;
            } else {
                show = panelBoxes; hide = panelLabels;
                activateBtn = btnBoxes; deactivateBtn = btnLabels;
            }
            deactivateBtn.classList.remove('active');
            activateBtn.classList.add('active');
            hide.classList.remove('active');
            show.classList.add('active');
            forceReveal(show);
        }

        // Expose globally — inline onclick="window.switchProductTab('labels')" calls this directly
        window.switchProductTab = showTab;

        // Also attach via addEventListener as backup
        btnLabels.addEventListener('click', function () { showTab('labels'); });
        btnBoxes.addEventListener('click', function () { showTab('boxes'); });

        // Init: reveal the default active panel
        var initPanel = panelLabels.classList.contains('active') ? panelLabels : panelBoxes;
        initPanel.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right').forEach(function (el) {
            el.style.opacity = '';
            el.style.transform = '';
            el.classList.add('visible');
        });
    }());



    /* ── SCROLL ANIMATIONS (IntersectionObserver + fallback) ── */
    const animatedEls = document.querySelectorAll(
        '.animate-fade-up, .animate-slide-left, .animate-slide-right, .industry-card'
    );

    // Initialize: set initial hidden state ONLY for elements below the viewport
    function initAnimations() {
        animatedEls.forEach(el => {
            // Skip elements inside inactive tabs
            const parentTab = el.closest('.tab-content');
            if (parentTab && !parentTab.classList.contains('active')) return;

            const rect = el.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight + 100 && rect.bottom > 0;

            if (isInView) {
                // Already visible — mark as visible immediately with no animation
                el.classList.add('visible');
            } else {
                // Below viewport — set initial hidden state via inline style
                if (el.classList.contains('animate-fade-up') || el.classList.contains('industry-card')) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                } else if (el.classList.contains('animate-slide-left')) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateX(-40px)';
                } else if (el.classList.contains('animate-slide-right')) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateX(40px)';
                }
            }
        });
    }

    function revealElement(el) {
        if (el.classList.contains('visible')) return true;
        // Skip elements inside inactive tabs (they'll be revealed when tab activates)
        const parentTab = el.closest('.tab-content');
        if (parentTab && !parentTab.classList.contains('active')) return false;

        const delay = el.dataset.delay || el.style.getPropertyValue('--delay') || '0s';
        el.style.transitionDelay = delay;
        // Clear the inline hidden styles — CSS .visible class will take over
        el.style.opacity = '';
        el.style.transform = '';
        el.classList.add('visible');
        return true;
    }

    // Check which elements are in the viewport
    function revealInViewport() {
        animatedEls.forEach(el => {
            if (el.classList.contains('visible')) return;
            const parentTab = el.closest('.tab-content');
            if (parentTab && !parentTab.classList.contains('active')) return;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                revealElement(el);
            }
        });
    }

    // Initialize hidden states first
    initAnimations();

    // Set up IntersectionObserver
    if ('IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.01, rootMargin: '0px 0px 200px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const revealed = revealElement(entry.target);
                    if (revealed !== false) observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedEls.forEach(el => {
            if (!el.classList.contains('visible')) observer.observe(el);
        });
    }

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

    // Ultimate fallback: make ALL non-tab elements visible after 1200ms
    setTimeout(() => {
        animatedEls.forEach(el => {
            const parentTab = el.closest('.tab-content');
            if (parentTab && !parentTab.classList.contains('active')) return;
            if (!el.classList.contains('visible')) {
                el.style.transitionDelay = '0s';
                el.style.opacity = '';
                el.style.transform = '';
                el.classList.add('visible');
            }
        });
    }, 1200);

    /* ── HERO INTRO ANIMATION ── */
    const heroContent = document.querySelector('.hero-content');
    const heroLottie = document.querySelector('.hero-lottie-wrap');

    function animateHeroEl(el, delay) {
        if (!el) return;
        // On mobile (<= 768px), skip the translate-in animation — CSS already
        // guarantees visibility and JS timing is unreliable during first paint.
        if (window.innerWidth <= 768) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.classList.add('visible');
            return;
        }
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'none';
        setTimeout(() => {
            el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.classList.add('visible');
        }, delay);
    }

    animateHeroEl(heroContent, 200);
    animateHeroEl(heroLottie, 500);

    // Ensure hero elements are always visible after 800ms regardless
    setTimeout(() => {
        if (heroContent) { heroContent.style.opacity = '1'; heroContent.style.transform = 'translateY(0)'; heroContent.classList.add('visible'); }
        if (heroLottie)  { heroLottie.style.opacity  = '1'; heroLottie.style.transform  = 'translateY(0)'; heroLottie.classList.add('visible'); }
    }, 800);

    /* ── HERO CARD SWITCHER (alternates every 4 seconds with smooth crossfade) ── */
    (function () {
        var cards = document.querySelectorAll('.hcs-card');
        var dots  = document.querySelectorAll('.hcs-dot');
        if (!cards.length) return;

        var currentIdx = 0;
        var isAnimating = false;
        var switchTimer = null;

        function showCard(nextIdx) {
            if (isAnimating || nextIdx === currentIdx) return;
            isAnimating = true;

            var outCard  = cards[currentIdx];
            var inCard   = cards[nextIdx];
            var outDot   = dots[currentIdx];
            var inDot    = dots[nextIdx];

            // 1. Mark outgoing card as exiting
            outCard.classList.remove('hcs-active');
            outCard.classList.add('hcs-exit');
            if (outDot) outDot.classList.remove('hcs-dot--active');

            // 2. After outgoing card has started fading, bring in the new card
            setTimeout(function () {
                outCard.classList.remove('hcs-exit');
                inCard.classList.add('hcs-active');
                if (inDot) inDot.classList.add('hcs-dot--active');
                currentIdx = nextIdx;

                // Release animation lock after transition completes
                setTimeout(function () { isAnimating = false; }, 600);
            }, 250);
        }

        function next() {
            showCard((currentIdx + 1) % cards.length);
        }

        function startTimer() {
            clearInterval(switchTimer);
            switchTimer = setInterval(next, 4000);
        }

        // Dot clicks allow manual switching
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                if (i !== currentIdx) {
                    showCard(i);
                    startTimer();
                }
            });
        });

        // Start auto-switch after page load settles
        setTimeout(startTimer, 1500);
    })();



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


    /* ── CONTACT FORM VALIDATION & SUBMISSION ── */
    const form = document.getElementById('inquiryForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (!validateForm()) return;

            // Sync email field into _replyto so Formspree uses it as reply-to
            const emailInput   = document.getElementById('email');
            const replyToField = document.getElementById('_replyto');
            if (emailInput && replyToField) replyToField.value = emailInput.value;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                const response = await fetch('https://formspree.io/f/xrejlepp', {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // ✅ Success — show thank-you message
                    form.querySelector('.form-actions').style.display = 'none';
                    formSuccess.classList.remove('hidden');
                    form.reset();
                } else {
                    // ❌ Server rejected — show inline error
                    const data = await response.json();
                    const msg = (data.errors || []).map(e => e.message).join(', ')
                                || 'Submission failed. Please try again.';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry';
                    alert('⚠️ ' + msg);
                }
            } catch (err) {
                // ❌ Network error
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry';
                alert('⚠️ Network error. Please check your connection and try again.');
            }
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
