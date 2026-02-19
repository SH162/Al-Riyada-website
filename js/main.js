/**
 * شركة الريادة - الملف الرئيسي للتفاعلات
 * استيراد السيارات وقطع الغيار
 * يدعم: الوضع الداكن | اللغة العربية والإنجليزية
 */

(function () {
    'use strict';

    /* ---------- مفاتيح التخزين المحلي ---------- */
    const STORAGE_THEME = 'alriyada-theme';
    const STORAGE_LANG = 'alriyada-lang';

    /* ---------- عناصر DOM ---------- */
    const htmlRoot = document.getElementById('html-root');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');

    /* ---------- الحصول على الترجمة من المسار ---------- */
    function getTranslation(lang, path) {
        const keys = path.split('.');
        let value = translations[lang];
        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            }
        }
        return typeof value === 'string' ? value : path;
    }

    /* ---------- تطبيق اللغة ---------- */
    function applyLanguage(lang) {
        if (!translations[lang]) lang = 'ar';
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            const text = getTranslation(lang, key);
            if (text && el.textContent !== undefined) {
                el.textContent = text;
            }
        });
        htmlRoot.setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
        htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        const langTexts = document.querySelectorAll('.nav__action-text');
        langTexts.forEach(function (el) {
            el.textContent = lang === 'ar' ? 'EN' : 'ع';
        });
        localStorage.setItem(STORAGE_LANG, lang);
    }

    /* ---------- تبديل اللغة ---------- */
    function toggleLanguage() {
        const current = htmlRoot.getAttribute('lang') || 'ar';
        const next = current === 'ar' ? 'en' : 'ar';
        applyLanguage(next);
    }

    /* ---------- تطبيق الوضع الداكن ---------- */
    function applyTheme(dark) {
        if (dark) {
            htmlRoot.classList.add('dark');
            localStorage.setItem(STORAGE_THEME, 'dark');
            if (themeToggle) {
                themeToggle.classList.add('active');
            }
        } else {
            htmlRoot.classList.remove('dark');
            localStorage.setItem(STORAGE_THEME, 'light');
            if (themeToggle) {
                themeToggle.classList.remove('active');
            }
        }
    }

    /* ---------- تبديل الوضع الداكن ---------- */
    function toggleTheme() {
        const isDark = htmlRoot.classList.contains('dark');
        applyTheme(!isDark);
    }

    /* ---------- تهيئة التفضيلات عند التحميل ---------- */
    function initPreferences() {
        const savedTheme = localStorage.getItem(STORAGE_THEME);
        const savedLang = localStorage.getItem(STORAGE_LANG);

        if (savedTheme === 'dark') {
            applyTheme(true);
        }

        if (savedLang === 'en') {
            applyLanguage('en');
        }
    }

    /* ---------- القائمة المنسدلة للموبايل ---------- */
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ---------- تسجيل الأحداث ---------- */
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', function () {
            toggleTheme();
        });
    }

    if (langToggleMobile) {
        langToggleMobile.addEventListener('click', function () {
            toggleLanguage();
        });
    }

    document.addEventListener('click', function (event) {
        if (
            navMenu &&
            navMenu.classList.contains('active') &&
            !navMenu.contains(event.target) &&
            !navToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    /* ---------- تغيير مظهر الهيدر عند التمرير ---------- */
    function handleHeaderScroll() {
        if (!header) return;
        const isDark = htmlRoot && htmlRoot.classList.contains('dark');
        if (window.scrollY > 50) {
            header.style.boxShadow = isDark
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 20px rgba(15, 52, 96, 0.12)';
        } else {
            header.style.boxShadow = isDark
                ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                : '0 2px 8px rgba(15, 52, 96, 0.08)';
        }
    }

    /* ---------- تشغيل التهيئة والأحداث ---------- */
    initPreferences();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
})();
