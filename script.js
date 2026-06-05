document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // AUTO-APPLY REVEAL CLASSES FOR SCROLL ANIMATIONS
    // ==========================================================================
    const animElements = [
        '.hero-typography', 
        '.hero-image-wrapper', 
        '.section-header-centered', 
        '.education-grid', 
        '.achievement-card', 
        '.ambition-content-wrapper', 
        '.contact-card'
    ];

    animElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
        });
    });

    // Add staggered delay to achievement cards
    document.querySelectorAll('.achievement-card').forEach((card, idx) => {
        card.classList.add(`reveal-delay-${(idx % 3) + 1}`);
    });

    // ==========================================================================
    // INTERSECTION OBSERVER FOR SCROLL REVEAL (Pre-configured)
    // ==========================================================================
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stop observing once animation has run to ensure smooth scrolling
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% is visible
        rootMargin: '0px 0px -40px 0px'
    });

    // ==========================================================================
    // PRELOADER & INITIAL ANIMATION FLOW
    // ==========================================================================
    document.body.classList.add('preloader-active');
    
    // Animate loader bar
    const loadBar = document.getElementById('preloader-load-bar');
    if (loadBar) {
        setTimeout(() => {
            loadBar.style.width = '100%';
        }, 150);
    }
    
    // Stagger preloader character fade-ins
    const preloaderChars = document.querySelectorAll('.p-char');
    preloaderChars.forEach((char, index) => {
        setTimeout(() => {
            char.classList.add('visible');
        }, index * 60 + 100); // 60ms delay per letter
    });

    // Function to dismiss preloader and trigger entrance animations
    function dismissPreloader() {
        if (document.body.classList.contains('loaded')) return;
        
        document.body.classList.add('loaded');
        document.body.classList.remove('preloader-active');
        
        // Start scroll reveal animations for sections AFTER preloader has fully slid away
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => {
                revealOnScroll.observe(el);
            });
            // Initial calculations
            updateActiveNav();
            updateScrollProgress();
        }, 1000);
    }

    // Dismiss preloader after a minimum display duration (1.8s) for visual appeal
    window.addEventListener('load', () => {
        setTimeout(dismissPreloader, 1800);
    });

    // Fail-safe preloader dismiss in case assets load slowly
    setTimeout(dismissPreloader, 3500);

    // ==========================================================================
    // SCROLL PROGRESS INDICATOR
    // ==========================================================================
    const progressBar = document.getElementById('scroll-progress-bar');
    
    const updateScrollProgress = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            const scrolled = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        }
    };
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ==========================================================================
    // NAVIGATION ACTIVE STATUS ON SCROLL
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 250) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-nav-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-nav-link');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ==========================================================================
    // COPY TO CLIPBOARD EMAIL INTEGRATION
    // ==========================================================================
    const copyBtn = document.getElementById('copy-email-btn');
    const emailAddress = document.getElementById('email-address').textContent.trim();
    const copyBtnText = document.getElementById('copy-btn-text');
    const toast = document.getElementById('toast-notification');

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailAddress)
                .then(() => {
                    // Update Button UI
                    copyBtnText.textContent = 'Copied';
                    copyBtn.style.color = 'var(--color-bg-dark)';
                    
                    // Show Toast Notification
                    toast.classList.add('show');
                    
                    // Reset Button UI & Toast after delay
                    setTimeout(() => {
                        copyBtnText.textContent = 'Copy Email';
                        copyBtn.style.color = '';
                        toast.classList.remove('show');
                    }, 2500);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        });
    }

    // ==========================================================================
    // INTERACTIVE IMAGE PARALLAX/SHADOW ROTATION EFFECT
    // ==========================================================================
    const heroImageFrame = document.querySelector('.image-frame');
    if (heroImageFrame) {
        heroImageFrame.addEventListener('mousemove', (e) => {
            const { width, height, left, top } = heroImageFrame.getBoundingClientRect();
            const mouseX = e.clientX - left;
            const mouseY = e.clientY - top;
            
            // Convert to coordinates from center (-0.5 to 0.5)
            const xPercent = (mouseX / width) - 0.5;
            const yPercent = (mouseY / height) - 0.5;
            
            // Set rotation transformation (max 6 degrees rotation)
            const rotateX = yPercent * -6;
            const rotateY = xPercent * 6;
            
            heroImageFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            heroImageFrame.style.boxShadow = `${-rotateY * 4}px ${rotateX * 4}px 50px rgba(0, 0, 0, 0.08)`;
        });

        heroImageFrame.addEventListener('mouseleave', () => {
            heroImageFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            heroImageFrame.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.04)';
        });
    }
});
