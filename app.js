// ===== PANADERÍA MATATLÁN - INTERACTIVE FEATURES =====

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== MOBILE NAVIGATION DRAWER =====
const initDrawer = () => {
    const menuBtn = $('#menuBtn');
    const closeDrawer = $('#closeDrawer');
    const drawer = $('#navDrawer');
    const scrim = $('#drawerScrim');
    
    if (!menuBtn || !drawer || !scrim) return;
    
    const openDrawer = () => {
        drawer.classList.add('open');
        scrim.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeDrawerFunc = () => {
        drawer.classList.remove('open');
        scrim.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    menuBtn.addEventListener('click', openDrawer);
    closeDrawer?.addEventListener('click', closeDrawerFunc);
    scrim.addEventListener('click', closeDrawerFunc);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawerFunc();
        }
    });
};

// ===== THEME TOGGLE (DARK MODE) =====
const initThemeToggle = () => {
    const themeToggle = $('#themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('.material-icons');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    icon.textContent = currentTheme === 'dark' ? 'light_mode' : 'dark_mode';
    
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        icon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        showSnackbar(`Tema ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
    });
};

// ===== RIPPLE EFFECT =====
const initRippleEffect = () => {
    const rippleElements = $$('.nav-ripple, .btn-ripple, .card-ripple, .drawer-item');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
};

// ===== SNACKBAR NOTIFICATIONS =====
const showSnackbar = (message, duration = 3000) => {
    const snackbar = $('#snackbar');
    const snackbarText = snackbar?.querySelector('.snackbar-text');
    
    if (!snackbar || !snackbarText) return;
    
    snackbarText.textContent = message;
    snackbar.classList.add('show');
    
    setTimeout(() => {
        snackbar.classList.remove('show');
    }, duration);
};

// ===== SCROLL REVEAL ANIMATION =====
const initScrollReveal = () => {
    const revealElements = $$('.scroll-reveal');
    
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                el.classList.add('revealed');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
};

// ===== COUNTER ANIMATION =====
const initCounters = () => {
    const counters = $$('.counter');
    let animated = false;
    
    const animateCounters = () => {
        if (animated) return;
        
        const firstCounter = counters[0];
        if (!firstCounter) return;
        
        const rect = firstCounter.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            animated = true;
            
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
            });
        }
    };
    
    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Initial check
};

// ===== SCROLL TO TOP BUTTON =====
const initScrollTop = () => {
    const scrollTop = $('#scrollTop');
    if (!scrollTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTop.classList.add('show');
        } else {
            scrollTop.classList.remove('show');
        }
    });
    
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ===== FAB HIDE ON SCROLL DOWN =====
const initFabScroll = () => {
    const fab = $('#fabContact');
    if (!fab) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            fab.classList.add('hide');
        } else {
            fab.classList.remove('hide');
        }
        
        lastScrollY = currentScrollY;
    });
};

// ===== SHARE FUNCTIONALITY =====
const initShareBtn = () => {
    const shareBtn = $('#shareBtn');
    if (!shareBtn) return;
    
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Panadería Matatlán',
                    text: 'Pan artesanal con inspiración japonesa',
                    url: window.location.href
                });
                showSnackbar('¡Gracias por compartir!');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error al compartir:', err);
                }
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                showSnackbar('Link copiado al portapapeles');
            } catch (err) {
                showSnackbar('No se pudo compartir');
            }
        }
    });
};

// ===== LAZY LOADING IMAGES =====
const initLazyLoading = () => {
    const images = $$('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = $(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// ===== HEADER ELEVATION ON SCROLL =====
const initHeaderElevation = () => {
    const header = $('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('elevated');
        } else {
            header.classList.remove('elevated');
        }
    });
};

// ===== FORM VALIDATION =====
const initFormValidation = () => {
    const form = $('form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Form data:', data);
        showSnackbar('¡Formulario enviado exitosamente!');
        
        // Reset form after 2 seconds
        setTimeout(() => {
            form.reset();
        }, 2000);
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.validity.valid) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    });
};

// ===== GALLERY KEYBOARD NAVIGATION =====
const initGalleryNavigation = () => {
    const carousel = $('.carrusel');
    if (!carousel) return;
    
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            carousel.scrollBy({ left: -320, behavior: 'smooth' });
        } else if (e.key === 'ArrowRight') {
            carousel.scrollBy({ left: 320, behavior: 'smooth' });
        }
    });
};

// ===== PREFERS REDUCED MOTION =====
const initReducedMotion = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--md-sys-motion-duration-short1', '0ms');
        document.documentElement.style.setProperty('--md-sys-motion-duration-short2', '0ms');
        document.documentElement.style.setProperty('--md-sys-motion-duration-medium1', '0ms');
        document.documentElement.style.setProperty('--md-sys-motion-duration-medium2', '0ms');
    }
};

// ===== PROGRESS BAR ANIMATION =====
const initProgressBars = () => {
    const progressBars = $$('.progress-bar');
    let animated = false;
    
    const animateProgress = () => {
        if (animated) return;
        
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                animated = true;
                bar.style.animation = 'progressLoad 1s ease-out forwards';
            }
        });
    };
    
    window.addEventListener('scroll', animateProgress);
    animateProgress();
};

// ===== SNACKBAR ACTION HANDLER =====
const initSnackbarAction = () => {
    const snackbarAction = $('#snackbarAction');
    if (!snackbarAction) return;
    
    snackbarAction.addEventListener('click', () => {
        const snackbar = $('#snackbar');
        snackbar?.classList.remove('show');
    });
};

// ===== SERVICE WORKER REGISTRATION =====
const initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Commented out for now - uncomment when you have a service worker
            // navigator.serviceWorker.register('/sw.js')
            //     .then(reg => console.log('Service Worker registered'))
            //     .catch(err => console.error('Service Worker registration failed:', err));
        });
    }
};

// ===== INITIALIZE ALL FEATURES =====
const init = () => {
    // Core functionality
    initDrawer();
    initThemeToggle();
    initRippleEffect();
    initScrollReveal();
    initCounters();
    initScrollTop();
    initFabScroll();
    initShareBtn();
    initHeaderElevation();
    initProgressBars();
    initSnackbarAction();
    
    // Enhanced features
    initLazyLoading();
    initSmoothScroll();
    initFormValidation();
    initGalleryNavigation();
    initReducedMotion();
    initServiceWorker();
    
    // Show welcome message
    setTimeout(() => {
        showSnackbar('¡Bienvenido a Panadería Matatlán! 🍞');
    }, 1000);
};

// ===== START APPLICATION =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== EXPORT FOR MODULES =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showSnackbar };
}

