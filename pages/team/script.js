document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Navigation for team.html and profile.html
    const sidebar = document.querySelector('aside.sidebar');
    const sidebarLinks = document.querySelectorAll('aside.sidebar a');
    const sections = document.querySelectorAll('.team-members, .profile');
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');

    if (sidebarLinks.length && sections.length && sidebar) {
        // Function to update active link and section
        const updateActiveLink = (link) => {
            // Remove active class and aria-current from all sidebar links
            sidebarLinks.forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });

            // Add active class and aria-current to selected link
            link.classList.add('active');
            link.setAttribute('aria-current', 'true');

            // Hide all sections
            sections.forEach(section => section.classList.add('hidden'));

            // Show target section
            const targetSectionId = link.getAttribute('data-section');
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Update breadcrumb
            if (breadcrumbCurrent) {
                breadcrumbCurrent.textContent = link.textContent;
            }
        };

        // Click event for sidebar links
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                updateActiveLink(link);
            });
        });

        // Mouse wheel scrolling for sidebar navigation (PPT-like: up for previous, down for next)
        let isScrolling = false;
        sidebar.addEventListener('wheel', (e) => {
            e.preventDefault(); // Prevent default page scroll

            // Debounce scroll events
            if (isScrolling) return;
            isScrolling = true;
            setTimeout(() => { isScrolling = false; }, 300); // 300ms debounce

            // Determine scroll direction (reversed for PPT-like behavior)
            const delta = e.deltaY < 0 ? -1 : 1; // Up: -1 (previous), Down: 1 (next)
            const currentActive = document.querySelector('aside.sidebar a.active');
            let currentIndex = Array.from(sidebarLinks).indexOf(currentActive);
            let newIndex = currentIndex + delta;

            // Handle wrapping
            if (newIndex < 0) newIndex = sidebarLinks.length - 1;
            if (newIndex >= sidebarLinks.length) newIndex = 0;

            // Update to new active link
            const newLink = sidebarLinks[newIndex];
            updateActiveLink(newLink);
        }, { passive: false });
    }

    // Navigation Highlight for Header
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        link.classList.remove('active');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Hamburger Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');
    const navIcon = navToggle?.querySelector('i');

    if (navToggle && navMenu && navIcon) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navIcon.classList.toggle('fa-bars');
            navIcon.classList.toggle('fa-times');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // Slide-Up Animation for Sections
    const slideSections = document.querySelectorAll('.slide');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.2 });

    slideSections.forEach((section) => {
        sectionObserver.observe(section);
    });

    // Carousel Functionality (for other pages, e.g., index.html)
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        let currentSlideIndex = 1;
        let autoSlideInterval = null;

        if (!slides.length || !dots.length) {
            console.warn('Carousel initialization failed.');
            return;
        }

        function showSlide(index) {
            if (index > slides.length) currentSlideIndex = 1;
            if (index < 1) currentSlideIndex = slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('active', i + 1 === currentSlideIndex));
            dots.forEach((dot, i) => dot.classList.toggle('active', i + 1 === currentSlideIndex));
        }

        function startAutoSlide() {
            if (!autoSlideInterval) {
                autoSlideInterval = setInterval(() => {
                    currentSlideIndex++;
                    showSlide(currentSlideIndex);
                }, 5000);
            }
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        showSlide(currentSlideIndex);
        startAutoSlide();

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentSlideIndex = i + 1;
                showSlide(currentSlideIndex);
                stopAutoSlide();
                startAutoSlide();
            });
            dot.setAttribute('tabindex', '0');
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentSlideIndex = i + 1;
                    showSlide(currentSlideIndex);
                    stopAutoSlide();
                    startAutoSlide();
                }
            });
        });

        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-control prev';
        prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevButton.setAttribute('aria-label', 'Previous Slide');
        prevButton.addEventListener('click', () => {
            currentSlideIndex--;
            showSlide(currentSlideIndex);
            stopAutoSlide();
            startAutoSlide();
        });

        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-control next';
        nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextButton.setAttribute('aria-label', 'Next Slide');
        nextButton.addEventListener('click', () => {
            currentSlideIndex++;
            showSlide(currentSlideIndex);
            stopAutoSlide();
            startAutoSlide();
        });

        carousel.appendChild(prevButton);
        carousel.appendChild(nextButton);

        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) startAutoSlide();
                else stopAutoSlide();
            });
        }, { root: null, threshold: 0.5 });

        carouselObserver.observe(carousel);
        window.currentSlide = showSlide;
    }
});