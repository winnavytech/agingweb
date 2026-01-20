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

    // Dynamic Data Loading (if config exists)
    // Dynamic Data Loading (if config exists)
    if (typeof SHEET_ID !== 'undefined' && SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID_HERE') {
        loadSettings();

        // Only load announcements on the announcements page
        if (window.location.pathname.includes('announcements.html')) {
            loadAnnouncements();
        } else {
            // Assume index page for other cases (or specifically check)
            loadRecentUpdates();
        }
    }
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

// ========================================
// Google Sheets Integration
// ========================================

async function loadSettings() {
    // 1. Fetch Settings Tab
    const settings = await fetchSheetData(SHEET_ID, SHEET_GIDS.settings);

    // Find 'classroom_url'
    const classroomSetting = settings.find(s => s.Key === 'classroom_url');
    if (classroomSetting && classroomSetting.Value) {
        // Update CONFIG object in memory so click handlers use it
        CONFIG.classroomUrl = classroomSetting.Value;

        // Also update any direct hrefs if they exist (optional, mostly handled by click listener)
        const classroomLinks = document.querySelectorAll('#classroomLink');
        classroomLinks.forEach(link => {
            link.href = classroomSetting.Value;
        });
    }
}

async function loadAnnouncements() {
    const container = document.getElementById('announcement-container');
    if (!container) return;

    container.innerHTML = '<p style="text-align:center;">กำลังโหลดประกาศ...</p>';

    const announcements = await fetchSheetData(SHEET_ID, SHEET_GIDS.announcements);

    container.innerHTML = ''; // Clear loading

    if (announcements.length === 0) {
        container.innerHTML = '<p style="text-align:center;">ยังไม่มีประกาศในขณะนี้</p>';
        return;
    }

    announcements.forEach(item => {
        // Create Card HTML
        const isImportant = item.Type && item.Type.toLowerCase() === 'important';
        const cardClass = isImportant ? 'announcement important' : 'announcement';

        // Icon mapping
        let icon = '📢'; // default
        if (item.Icon) icon = item.Icon;
        else if (item.Type === 'important') icon = '⭐';
        else if (item.Type === 'docs') icon = '📚';
        else if (item.Type === 'assignment') icon = '✍️';

        const card = document.createElement('div');
        card.className = cardClass;

        card.innerHTML = `
            <div class="announcement-header">
                <div class="announcement-title">
                    <span>${icon}</span>
                    <span>${item.Title}</span>
                    ${isImportant ? '<span class="announcement-badge">สำคัญ</span>' : ''}
                </div>
                <div class="announcement-date">${item.Date}</div>
            </div>
            <div class="announcement-content">
                <p>${item.Content}</p>
                ${item.Link ? `<p style="margin-top: 0.5rem;"><a href="${item.Link}" target="_blank" style="color: var(--blue-accent); font-weight: 600;">รายละเอียดเพิ่มเติม</a></p>` : ''}
            </div>
        `;

        container.appendChild(card);
    });
}

// Function to load recent updates for Index Page
async function loadRecentUpdates() {
    const container = document.getElementById('updates-container');
    if (!container) return;

    container.innerHTML = '<p style="text-align:center;">กำลังโหลดประกาศล่าสุด...</p>';

    const announcements = await fetchSheetData(SHEET_ID, SHEET_GIDS.announcements);
    container.innerHTML = '';

    if (announcements.length === 0) {
        container.innerHTML = '<p style="text-align:center;">ยังไม่มีประกาศในขณะนี้</p>';
        return;
    }

    // Take top 3 items
    const recentItems = announcements.slice(0, 3);

    recentItems.forEach(item => {
        const isImportant = item.Type && item.Type.toLowerCase() === 'important';
        const link = item.Link ? item.Link : '#'; // Use item link or # if empty
        const linkClass = item.Link ? '' : 'classroom-link'; // Trigger classroom link logic if no direct link

        // Parse Date (Assuming format "20 ม.ค. 2569")
        // We just split it for display: "20", "ม.ค."
        const dateParts = item.Date ? item.Date.split(' ') : ['-', '-'];
        const day = dateParts[0] || '-';
        const month = dateParts[1] || '-';

        const card = document.createElement('a');
        card.href = link;
        card.className = `feed-item ${linkClass}`;

        // If it's an external link, open in new tab
        if (item.Link) card.target = "_blank";

        card.innerHTML = `
            <div class="date-badge">
                <span class="date-day">${day}</span>
                <span class="date-month">${month}</span>
            </div>
            <div class="feed-content">
                <h4>
                    ${item.Title}
                    ${isImportant ? '<span class="tag tag-important">สำคัญ</span>' : ''}
                </h4>
                <p>${item.Content}</p>
            </div>
            <i class="fa-solid fa-chevron-right" style="color: var(--sky-blue); font-size: 1.25rem;"></i>
        `;

        container.appendChild(card);
    });
}
