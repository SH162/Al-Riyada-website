(function () {
    function renderGallery(containerSelector, images = []) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        container.innerHTML = '';
        images.forEach((src, i) => {
            const item = document.createElement('div');
            item.className = 'parts-gallery__item';
            const img = document.createElement('img');
            img.src = src;
            img.alt = `صورة قطع غيار ${i + 1}`;
            img.loading = 'lazy';
            img.style.cursor = 'zoom-in';
            img.onerror = function () {
                // صورة احتياطية عند فشل التحميل
                this.src = `https://picsum.photos/seed/fallback-${i}/600/400`;
            };

            // فتح الصورة في lightbox عند الضغط
            img.addEventListener('click', () => {
                openLightbox(src, img.alt);
            });

            item.appendChild(img);
            container.appendChild(item);
        });
    }

    // Lightbox بسيط مدمج
    let _lightboxEl = null;
    function createLightbox() {
        if (_lightboxEl) return _lightboxEl;
        const lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = `
            <div class="lightbox__backdrop" data-close></div>
            <div class="lightbox__content">
                <img class="lightbox__img" src="" alt="">
                <button class="lightbox__close" aria-label="إغلاق" data-close>×</button>
            </div>
        `;
        document.body.appendChild(lb);

        // إغلاق بالنقر على الخلفية أو زر الإغلاق
        lb.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-close')) closeLightbox();
        });

        // إغلاق بالـ ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });

        _lightboxEl = lb;
        return lb;
    }

    function openLightbox(src, alt = '') {
        const lb = createLightbox();
        const img = lb.querySelector('.lightbox__img');
        img.src = src;
        img.alt = alt || '';
        // عرض
        lb.classList.add('open');
        document.documentElement.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!_lightboxEl) return;
        _lightboxEl.classList.remove('open');
        // ازالة src لتخفيف الذاكرة
        const img = _lightboxEl.querySelector('.lightbox__img');
        if (img) img.src = '';
        document.documentElement.style.overflow = '';
    }

    // واجهة للوصول من صفحات HTML
    window.renderGallery = renderGallery;
})();