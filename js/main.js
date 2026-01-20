// ========================================
// Configuration
// ========================================

// TODO: ใส่ลิงก์ Google Classroom ของคุณที่นี่
const CONFIG = {
    classroomUrl: 'https://classroom.google.com/',
    scrollOffset: 100 // การชดเชยเมื่อ scroll (เพราะมี navbar บัง)
};

// ========================================
// Classroom Link Handler
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // จัดการลิงก์ทั้งหมดที่มี class 'classroom-link' หรือ id ที่เกี่ยวกับ classroom
    const classroomLinks = document.querySelectorAll('.classroom-link, #classroomLoginBtn, #classroomMainBtn');

    classroomLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // ดึงลิงก์จาก href
            const href = link.getAttribute('href');

            // ถ้ามีลิงก์เฉพาะเจาะจง (ที่ไม่ใช่ #) ให้ใช้ลิงก์นั้น
            // ถ้าไม่มี ให้ใช้ลิงก์หลักจาก CONFIG
            const targetUrl = (href && href !== '#') ? href : CONFIG.classroomUrl;

            window.open(targetUrl, '_blank');
        });
    });

    // Animate elements on scroll
    initScrollAnimations();
});

// ========================================
// Navbar Transparency Effect
// ========================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.9)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.6)';
        navbar.style.boxShadow = 'none';
    }
});

// ========================================
// Smooth Scroll with Offset
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - CONFIG.scrollOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation style and observe elements
    const elementsToAnimate = document.querySelectorAll('.card, .feed-item, .section-title');

    elementsToAnimate.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

        // Add staggering delay based on index
        // el.style.transitionDelay = `${index * 0.1}s`; 
        // (Optional: staggering might be too consistent, doing per-section basic fade is safer)

        observer.observe(el);
    });
}

// ========================================
// Console Welcome
// ========================================
console.log(
    '%c⚓ Royal Thai Navy Nursing College %c\nElderly Nursing Course Hub Ready.',
    'color: #38bdf8; font-size: 20px; font-weight: bold; background: #0f172a; padding: 10px; border-radius: 5px;',
    'color: #fbbf24; font-size: 14px;'
);
