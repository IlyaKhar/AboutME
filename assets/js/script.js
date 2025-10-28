// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const navToggle = document.querySelector('.nav-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
const skillBars = document.querySelectorAll('.skill-progress');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const contactForm = document.querySelector('.contact-form');

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initCustomCursor();
    initMobileMenu();
    initScrollAnimations();
    initSkillBars();
    initPortfolioFilter();
    initPortfolioLinks();
    initContactForm();
    initSmoothScrolling();
    initNavigation();
});

// ===== АНИМАЦИЯ ЗАГРУЗКИ =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Показываем загрузку на 4 секунды
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Удаляем элемент из DOM после анимации
        setTimeout(() => {
            loadingScreen.remove();
        }, 800);
    }, 4000);
}

// ===== КАСТОМНЫЙ КУРСОР =====
function initCustomCursor() {
    // Создаем элементы курсора
    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    
    cursor.className = 'cursor';
    cursorFollower.className = 'cursor-follower';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);

    // Переменные для позиции курсора
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    // Обновляем позицию основного курсора
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX - 10 + 'px';
        cursor.style.top = mouseY - 10 + 'px';
    });

    // Анимация следящего курсора
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX - 20 + 'px';
        cursorFollower.style.top = followerY - 20 + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Эффекты при наведении на интерактивные элементы
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .filter-btn, .portfolio-item, .blog-card, .service-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    // Скрываем курсор при выходе за пределы окна
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Создаем overlay если его нет
            if (!document.querySelector('.overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                document.body.appendChild(overlay);
            }
            
            const overlay = document.querySelector('.overlay');
            overlay.classList.toggle('active');
        });
    }

    // Закрытие меню при клике на overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('overlay')) {
            sidebar.classList.remove('active');
            navToggle.classList.remove('active');
            e.target.classList.remove('active');
        }
    });

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebar.classList.remove('active');
            navToggle.classList.remove('active');
            const overlay = document.querySelector('.overlay');
            if (overlay) overlay.classList.remove('active');
        });
    });
}

// ===== НАВИГАЦИЯ =====
function initNavigation() {
    // Клик по ссылкам навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showTab(targetId);
        });
    });

    // Инициализация первой вкладки
    showTab('about');
    
    // Обработка URL hash при загрузке страницы
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showTab(hash);
    }

    // Обработка кнопок браузера (назад/вперед)
    window.addEventListener('popstate', function(e) {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showTab(hash);
        }
    });
}

function showTab(tabId) {
    // Скрыть все вкладки
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });

    // Показать выбранную вкладку
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Обновить активную ссылку в навигации
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${tabId}`) {
            link.classList.add('active');
        }
    });

    // Обновить URL без перезагрузки страницы
    if (history.pushState) {
        history.pushState(null, null, `#${tabId}`);
    }

    // Прокрутить к началу контента
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Инициализировать анимации для новой вкладки
    setTimeout(() => {
        initTabAnimations(tabId);
    }, 100);
}

function initTabAnimations(tabId) {
    const activeTab = document.getElementById(tabId);
    if (!activeTab) return;

    // Анимация появления элементов с задержкой
    const animatedElements = activeTab.querySelectorAll('.service-card, .testimonial-card, .portfolio-item, .blog-card, .resume-item, .skill-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 150 + index * 100);
    });

    // Анимация прогресс-баров навыков
    if (tabId === 'resume') {
        const skillBars = activeTab.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width;
            }, 800 + index * 200);
        });
    }

    // Анимация для секций заголовков
    const sectionHeaders = activeTab.querySelectorAll('.section-header');
    sectionHeaders.forEach((header, index) => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 100 + index * 150);
    });
}

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Анимация для навыков
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Наблюдение за элементами
    const animatedElements = document.querySelectorAll('.skill-progress, .stat-item, .portfolio-item, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== АНИМАЦИЯ ПОЛОС НАВЫКОВ =====
function initSkillBars() {
    // Инициализация навыков перенесена в initTabAnimations
    // для работы с системой вкладок
}

function animateSkillBar(skillBar) {
    const width = skillBar.getAttribute('data-width');
    skillBar.style.width = width;
}

// ===== ФИЛЬТРАЦИЯ ПОРТФОЛИО =====
function initPortfolioFilter() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Обновление активной кнопки
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтрация элементов
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ===== КЛИКАБЕЛЬНЫЕ КАРТОЧКИ ПОРТФОЛИО =====
function initPortfolioLinks() {
    const linkItems = document.querySelectorAll('.portfolio-item[data-repo]');
    linkItems.forEach(item => {
        const url = item.getAttribute('data-repo');
        if (!url) return;

        const open = () => window.open(url, '_blank', 'noopener');

        item.addEventListener('click', open);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });
    });
}

// ===== ОБРАБОТКА ФОРМЫ КОНТАКТОВ =====
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получение данных формы
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelectorAll('input[type="text"]')[1].value;
            const message = this.querySelector('textarea').value;
            
            // Валидация
            if (!name || !email || !message) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Пожалуйста, введите корректный email', 'error');
                return;
            }
            
            // Имитация отправки
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Сообщение успешно отправлено!', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Удаление через 5 секунд
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Учитываем высоту навбара
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ИНДИКАТОР СКРОЛЛА =====
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Скрытие индикатора при скролле
        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// ===== ЭФФЕКТ ПЕЧАТИ =====
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Запуск через 1 секунду после загрузки
        setTimeout(typeWriter, 1000);
    }
}

// ===== ПАРАЛЛАКС ЭФФЕКТ =====
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-icon');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== ПРЕДЗАГРУЗКА ИЗОБРАЖЕНИЙ =====
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Запуск предзагрузки
preloadImages();

// ===== ОБРАБОТКА КЛАВИАТУРЫ =====
document.addEventListener('keydown', function(e) {
    // ESC для закрытия мобильного меню
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Стрелки для навигации по секциям
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigateSections(e.key === 'ArrowDown' ? 1 : -1);
    }
});

function navigateSections(direction) {
    const currentSection = getCurrentSection();
    if (!currentSection) return;
    
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const currentIndex = sections.indexOf(currentSection);
    const nextIndex = currentIndex + direction;
    
    if (nextIndex >= 0 && nextIndex < sections.length) {
        const targetSection = sections[nextIndex];
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Обновление активной ссылки
        const targetLink = document.querySelector(`a[href="#${targetSection.id}"]`);
        if (targetLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            targetLink.classList.add('active');
        }
    }
}

function getCurrentSection() {
    let current = null;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
        }
    });
    
    return current;
}

// ===== ОБРАБОТКА TOUCH СОБЫТИЙ =====
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Свайп вверх - следующая секция
            navigateSections(1);
        } else {
            // Свайп вниз - предыдущая секция
            navigateSections(-1);
        }
    }
}

// ===== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ =====
// Throttle функция для оптимизации скролла
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Применение throttle к обработчикам скролла
const throttledScrollHandler = throttle(function() {
    updateActiveNavLink();
    handleParallax();
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-icon');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// ===== ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ДОБАВЛЕНИЕ CSS АНИМАЦИЙ =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// ===== ИНИЦИАЛИЗАЦИЯ ЛЕНИВОЙ ЗАГРУЗКИ =====
initLazyLoading();
