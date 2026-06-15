/* ============================================================
   EDITORIAL TERMINAL — Portfolio JS
   Full version: theme toggle, scroll progress, terminal,
   skills bars, copy email, project modal, reveal, stats
   ============================================================ */

'use strict';

// ===== THEME TOGGLE — Light / Dark =====
(function initTheme() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    btn.addEventListener('click', function() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}());


// ===== SCROLL PROGRESS BAR =====
(function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function() {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = pct + '%';
    }, { passive: true });
}());


// ===== NAVIGATION =====
(function initNav() {
    var toggle = document.getElementById('navToggle');
    var links  = document.getElementById('navLinks');
    var navbar = document.getElementById('navbar');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function() {
        var isOpen = links.classList.toggle('active');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    var navLinksAll = links.querySelectorAll('a');
    navLinksAll.forEach(function(a) {
        a.addEventListener('click', function() {
            links.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', function(e) {
        if (links.classList.contains('active') && !links.contains(e.target) && !toggle.contains(e.target)) {
            links.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    var onScroll = function() { if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Scroll spy
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (sections.length && navLinks.length) {
        var spy = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function(l) { l.classList.remove('active-nav'); });
                    var active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
                    if (active) active.classList.add('active-nav');
                }
            });
        }, { threshold: 0.4 });
        sections.forEach(function(s) { spy.observe(s); });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); }
        });
    });
}());


// ===== PAGE LOAD ANIMATION =====
(function pageLoad() {
    document.documentElement.style.opacity = '0';
    document.documentElement.style.transition = 'opacity 0.5s ease';
    window.addEventListener('load', function() {
        requestAnimationFrame(function() { document.documentElement.style.opacity = '1'; });
    });
}());


// ===== INTERSECTION OBSERVER — Scroll Reveals =====
(function initReveal() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    var leftEls   = document.querySelectorAll('.hero-left, .about-left, .contact-left, .exp-header');
    var rightEls = document.querySelectorAll('.hero-right, .about-right, .contact-right');
    var centerEls = document.querySelectorAll(
        '.about-heading, .about-body, .about-actions, .exp-sub, ' +
        '.skills-heading, .skills-sub, .work-header, .form-header'
    );

    leftEls.forEach(function(el) { el.classList.add('reveal-left'); observer.observe(el); });
    rightEls.forEach(function(el) { el.classList.add('reveal-right'); observer.observe(el); });
    centerEls.forEach(function(el) { el.classList.add('reveal'); observer.observe(el); });

    // Section transitions
    var transEls = document.querySelectorAll('.section-transition');
    var transObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                transObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.01 });
    transEls.forEach(function(el) { transObs.observe(el); });

    // Project cards stagger
    var cards = document.querySelectorAll('.project-card');
    var cardObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, idx) {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = (idx * 0.12) + 's';
                entry.target.classList.add('visible');
                cardObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    cards.forEach(function(c) { c.classList.add('reveal'); cardObs.observe(c); });

    // Timeline items stagger
    var timelineItems = document.querySelectorAll('.timeline-item');
    var timelineObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, idx) {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = (idx * 0.1) + 's';
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                timelineObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    timelineItems.forEach(function(el) {
        el.classList.add('reveal');
        el.style.opacity = '0';
        el.style.transform = 'translateX(-20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObs.observe(el);
    });

    // Tech cards stagger
    var techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(function(card, i) { card.style.transitionDelay = (i * 0.05) + 's'; });
}());


// ===== ANIMATED TERMINAL — Role Typer =====
(function initTerminal() {
    var roles = [
        'Software Developer',
        'Full Stack Developer',
        'MERN Stack Developer',
        'Software Engineer',
        'React Developer',
        'Node.js Developer',
        'Problem Solver'
    ];
    var termEl = document.getElementById('termRole');
    if (!termEl) return;

    var roleIdx = 0, charIdx = 0, isDeleting = false, speed = 70;

    function type() {
        var current = roles[roleIdx];
        if (isDeleting) {
            termEl.textContent = current.substring(0, charIdx - 1) + '_';
            charIdx--;
            speed = 35;
        } else {
            termEl.textContent = current.substring(0, charIdx + 1) + '_';
            charIdx++;
            speed = 70;
        }
        if (!isDeleting && charIdx === current.length) {
            termEl.textContent = current + '_';
            speed = 2400;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 500;
        }
        setTimeout(type, speed);
    }
    type();
}());


// ===== TYPEWRITER — Role (fallback) =====
(function initTypewriter() {
    var el = document.getElementById('roleValue');
    if (!el) return;
    var roles = ['Software Developer', 'Full Stack Developer', 'MERN Stack Developer', 'Software Engineer', 'React Developer', 'Node.js Developer', 'Problem Solver'];
    var roleIdx = 0, charIdx = 0, isDeleting = false, speed = 80;

    function type() {
        var current = roles[roleIdx];
        if (isDeleting) { el.textContent = current.substring(0, charIdx - 1); charIdx--; speed = 40; }
        else { el.textContent = current.substring(0, charIdx + 1); charIdx++; speed = 80; }
        if (!isDeleting && charIdx === current.length) { speed = 2200; isDeleting = true; }
        else if (isDeleting && charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; speed = 400; }
        setTimeout(type, speed);
    }
    type();
}());


// ===== STATS COUNTER ANIMATION =====
(function initStats() {
    var stats = document.querySelectorAll('.stat-val[data-target]');
    if (!stats.length) return;

    var animate = function(el) {
        var target = parseInt(el.dataset.target, 10);
        var duration = 1800, start = performance.now();
        function step(now) {
            var p = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(step); else el.textContent = target;
        }
        requestAnimationFrame(step);
    };

    var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
        });
    }, { threshold: 0.5 });
    stats.forEach(function(s) { obs.observe(s); });
}());


// ===== SKILLS BAR ANIMATION =====
(function initSkills() {
    var skillItems = document.querySelectorAll('.skill-item');
    var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.2 });
    skillItems.forEach(function(el) { obs.observe(el); });
}());


// ===== COPY EMAIL TO CLIPBOARD + TOAST =====
(function initCopyEmail() {
    var btn   = document.getElementById('copyEmail');
    var toast = document.getElementById('toast');
    var msg   = document.getElementById('toastMsg');
    if (!btn || !toast) return;

    var showToast = function(text) {
        if (msg) msg.textContent = text;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    };

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var email = 'soham.bamane.1129@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(function() {
                btn.classList.add('copied');
                showToast('Email copied to clipboard!');
                setTimeout(function() { btn.classList.remove('copied'); }, 2000);
            });
        } else {
            var ta = document.createElement('textarea');
            ta.value = email;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            btn.classList.add('copied');
            showToast('Email copied!');
            setTimeout(function() { btn.classList.remove('copied'); }, 2000);
        }
    });
}());


// ===== PROJECT MODAL =====
(function initModal() {
    var modal     = document.getElementById('projectModal');
    var backdrop  = document.getElementById('modalBackdrop');
    var closeBtn  = document.getElementById('modalClose');
    var modalBody = document.getElementById('modalBody');
    if (!modal) return;

    var projectData = {
        careerly: {
            title: 'Careerly — AI Career Roadmap Platform',
            desc: 'A full-featured AI-powered career development app that generates personalized learning paths based on user goals, skill assessments, and market demand. Integrates multiple LLM providers via OpenRouter for diverse AI responses.',
            tech: ['Flutter', 'Node.js', 'Express', 'MongoDB', 'JWT Auth', 'OpenRouter API', 'YouTube Data API'],
            features: [
                'Skill assessment engine with adaptive questioning',
                'AI-generated roadmaps with milestone tracking',
                'YouTube video resource curation per topic',
                'Resume builder with ATS-optimized templates',
                'Multi-model AI (Claude, Gemini, Llama) via OpenRouter',
                'JWT-based authentication with role management'
            ]
        },
        konkan: {
            title: 'Konkan Voyage — Travel Booking Platform',
            desc: 'A comprehensive travel management platform for Konkan coastal destinations, combining booking, administration, and reporting in one unified system.',
            tech: ['Spring Boot', 'Java', 'MySQL', 'Thymeleaf', 'Apache POI', 'REST API'],
            features: [
                'Admin dashboard with real-time booking overview',
                'User registration and profile management',
                'Package booking with date-based availability',
                'Automated Excel report generation via Apache POI',
                'Email notifications for booking confirmations',
                'Mobile-responsive Thymeleaf templates'
            ]
        },
        falling: {
            title: 'Falling Star Game — Browser Canvas Game',
            desc: 'A polished HTML5 Canvas game with physics-based gameplay, progressive difficulty scaling, sound effects, and cross-device support including touch controls for mobile.',
            tech: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Web Audio API', 'Local Storage', 'Touch Events'],
            features: [
                'Canvas-based rendering at 60fps',
                'Progressive difficulty with 5+ levels',
                'Sound effects via Web Audio API',
                'Responsive design with touch + keyboard support',
                'High score tracking with local storage',
                'Particle effects and visual feedback'
            ]
        },
        weather: {
            title: 'Weather Dashboard — React + TypeScript',
            desc: 'A modern weather application providing location-based forecasts, historical data visualization, and severe weather alerts with a focus on clean, data-driven UI design.',
            tech: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API', 'React Query', 'CSS Modules'],
            features: [
                'Location-based current conditions & 7-day forecast',
                'Interactive charts for temperature and precipitation trends',
                'Weather alerts and severe condition notifications',
                'Search by city or geolocation',
                'Dark/light theme with system preference detection',
                'Offline support via service worker caching'
            ]
        }
    };

    function openModal(key) {
        var data = projectData[key];
        if (!data) return;

        var techHTML = data.tech.map(function(t) {
            return '<span style="padding:0.25rem 0.7rem;background:var(--bg-secondary);border:1px solid var(--border);border-radius:3px;font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-light)">' + t + '</span>';
        }).join('');

        var featHTML = data.features.map(function(f) {
            return '<li style="font-family:var(--font-mono);font-size:0.82rem;color:var(--ink-light);padding-left:1.2rem;position:relative;line-height:1.5;margin-bottom:0.4rem"><span style="position:absolute;left:0;color:var(--accent)">→</span>' + f + '</li>';
        }).join('');

        modalBody.innerHTML =
            '<h2 style="font-family:var(--font-display);font-size:1.6rem;font-weight:700;color:var(--ink);margin-bottom:1rem;letter-spacing:-0.02em">' + data.title + '</h2>' +
            '<p style="font-family:var(--font-mono);font-size:0.85rem;color:var(--ink-light);line-height:1.8;margin-bottom:1.5rem">' + data.desc + '</p>' +
            '<h3 style="font-family:var(--font-mono);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-muted);margin-bottom:0.75rem">Features</h3>' +
            '<ul style="list-style:none;margin-bottom:1.5rem">' + featHTML + '</ul>' +
            '<h3 style="font-family:var(--font-mono);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-muted);margin-bottom:0.75rem">Tech Stack</h3>' +
            '<div style="display:flex;flex-wrap:wrap;gap:0.4rem">' + techHTML + '</div>';

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.project-expand-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(btn.dataset.project);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
}());


// ===== 3D PROJECT CARD TILT =====
(function initProjectTilt() {
    var cards = document.querySelectorAll('.project-card');
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var r = card.getBoundingClientRect();
            var x = e.clientX - r.left, y = e.clientY - r.top;
            var cx = r.width / 2, cy = r.height / 2;
            card.style.transform = 'perspective(1000px) rotateX(' + (((y - cy) / cy) * -5) + 'deg) rotateY(' + (((x - cx) / cx) * 5) + 'deg)';
        });
        card.addEventListener('mouseleave', function() { card.style.transform = ''; });
    });
}());


// ===== 3D TECH CARD TILT =====
(function initTechTilt() {
    var cards = document.querySelectorAll('.tech-card');
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var r = card.getBoundingClientRect();
            var x = e.clientX - r.left, y = e.clientY - r.top;
            var cx = r.width / 2, cy = r.height / 2;
            card.style.transform = 'perspective(400px) rotateX(' + (((y - cy) / cy) * -7) + 'deg) rotateY(' + (((x - cx) / cx) * 7) + 'deg) translateY(-3px) translateZ(10px)';
        });
        card.addEventListener('mouseleave', function() { card.style.transform = ''; });
    });
}());


// ===== CONTACT FORM =====
(function initForm() {
    var form = document.getElementById('contactForm');
    var btn  = document.getElementById('formSubmit');
    var statusEl = document.getElementById('formStatus');
    if (!form || !btn || !statusEl) return;

    function showStatus(msg, type) {
        statusEl.textContent = msg;
        statusEl.className = 'form-status show ' + type;
        if (type === 'success') setTimeout(function() { statusEl.classList.remove('show'); }, 6000);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var nameField    = form.querySelector('#cf-name');
        var emailField   = form.querySelector('#cf-email');
        var messageField = form.querySelector('#cf-message');
        var valid = true;
        [nameField, emailField, messageField].forEach(function(f) {
            f.classList.remove('error');
            if (!f.value.trim()) { f.classList.add('error'); valid = false; }
        });
        if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
            emailField.classList.add('error'); valid = false;
        }
        if (!valid) { showStatus('Please fill in all required fields.', 'error'); return; }

        btn.classList.add('loading');
        btn.disabled = true;

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(function(res) {
            if (res.ok) {
                showStatus("Message sent! I'll get back to you soon.", 'success');
                form.reset();
            } else { throw new Error(); }
        }).catch(function() {
            showStatus('Failed to send. Please email me directly.', 'error');
        }).finally(function() {
            btn.classList.remove('loading');
            btn.disabled = false;
        });
    });
}());


// ===== SCROLL TO TOP BUTTON =====
(function initScrollTop() {
    var btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '2rem', right: '2rem',
        width: '46px', height: '46px', borderRadius: '4px',
        background: 'var(--bg-dark)', color: 'var(--bg-secondary)',
        border: 'none', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        opacity: '0', transform: 'translateY(12px)',
        transition: 'opacity 0.3s, transform 0.3s, background 0.2s',
        zIndex: '800', boxShadow: '0 4px 16px rgba(26,22,18,0.2)'
    });
    document.body.appendChild(btn);

    btn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    btn.addEventListener('mouseenter', function() {
        btn.style.background = 'var(--accent)';
        btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', function() {
        btn.style.background = 'var(--bg-dark)';
        btn.style.transform = 'translateY(0)';
    });

    window.addEventListener('scroll', function() {
        var show = window.scrollY > 500;
        btn.style.opacity = show ? '1' : '0';
        btn.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
    }, { passive: true });
}());


// ===== CONSOLE SIGNATURE =====
(function consoleSig() {
    console.log('%c// Hey there, developer!', 'color: #C4622D; font-size: 20px; font-weight: bold;');
    console.log('%c// Built with vanilla JS, CSS 3D transforms & Fraunces + DM Mono', 'color: #1A1612; font-size: 13px;');
    console.log('%c// Let\'s build something great → soham.bamane.1129@gmail.com', 'color: #5C5347; font-size: 13px; font-weight: bold;');
    console.log('%c\u{1F680} Portfolio ready.', 'color: #C4622D; font-size: 13px;');
}());
