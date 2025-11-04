document.addEventListener('DOMContentLoaded', () => {
            // Carousel Functionality
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

            // Navigation Highlight
            const navLinks = document.querySelectorAll('nav ul li a');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href');
                link.classList.remove('active', 'nav-highlight');
                if (linkPage === currentPage) {
                    link.classList.add('active');
                }

                link.addEventListener('click', () => {
                    navLinks.forEach(l => l.classList.remove('active', 'nav-highlight'));
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
                });
            }

            // Team Grid Auto-Scroll
            const teamGrid = document.querySelector('.team-grid');
            const cards = document.querySelectorAll('.team-card');
            const cardWidth = cards[0].offsetWidth + 20;
            let scrollPosition = 0;
            let isPaused = false;

            const autoScroll = () => {
                if (!isPaused) {
                    scrollPosition -= 1;
                    teamGrid.style.transform = `translateX(${scrollPosition}px)`;
                    if (Math.abs(scrollPosition) >= cardWidth * cards.length / 2) {
                        scrollPosition = 0;
                    }
                }
            };

            const interval = setInterval(autoScroll, 20);

            teamGrid.addEventListener('mouseenter', () => {
                isPaused = true;
            });
            teamGrid.addEventListener('mouseleave', () => {
                isPaused = false;
            });
        });

        document.querySelectorAll('nav ul li').forEach(item => {
            item.addEventListener('mouseover', function() {
                const subMenu = this.querySelector('.team-members');
                if (subMenu) {
                    subMenu.style.display = 'block';
                }
            });

            item.addEventListener('mouseout', function() {
                const subMenu = this.querySelector('.team-members');
                if (subMenu) {
                    subMenu.style.display = 'none';
                }
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            const sidebarLinks = document.querySelectorAll('aside.sidebar a');
            const sections = document.querySelectorAll('.team-members');
            const breadcrumbCurrent = document.getElementById('breadcrumb-current');

            sidebarLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    sections.forEach(section => section.classList.add('hidden'));
                    const targetSectionId = link.getAttribute('data-section');
                    const targetSection = document.getElementById(targetSectionId);
                    if (targetSection) {
                        targetSection.classList.remove('hidden');
                    }
                    breadcrumbCurrent.textContent = link.textContent;
                });
            });
        });

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar-link');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); // 去除 # 
            const targetSection = document.getElementById(targetId);
            
            // 平滑滚动到目标 section
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // 更新活动链接样式
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 滚动时动态高亮侧边栏链接
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.slide.content-section');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });
});

// Smooth scrolling for year and category navigation
document.querySelectorAll('.year-link, .sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }

        // Update active class for year links
        if (this.classList.contains('year-link')) {
            document.querySelectorAll('.year-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }

        // Update active class for sidebar links
        if (this.classList.contains('sidebar-link')) {
            document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Highlight active year link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.publication-content');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    if (currentSection) {
        document.querySelectorAll('.year-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
});

// Set initial active category
document.querySelector('.sidebar-link[href="#publications"]').classList.add('active');
