// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const indicator = document.getElementById('scrollIndicator');
    if (indicator) {
        indicator.style.width = scrolled + '%';
    }
});

// Smooth fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Robust Before/After Image Comparison Slider
class BeforeAfterSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.ba-slider');
        this.beforeDiv = container.querySelector('.ba-before');
        this.sliderButton = container.querySelector('.ba-slider-button');
        this.isDragging = false;
        this.currentPercent = 50; // start at center

        if (!this.slider || !this.beforeDiv) {
            console.error('BeforeAfterSlider: required elements missing in', container);
            return;
        }

        // Ensure initial positions
        this.setPercent(this.currentPercent, false);

        // Bind instance handlers
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.init();
        window.addEventListener('resize', this.onResize);
    }

    init() {
        // start drag from slider or handle
        this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
        if (this.sliderButton) this.sliderButton.addEventListener('mousedown', (e) => this.startDrag(e));

        // touch start
        this.slider.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        if (this.sliderButton) this.sliderButton.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });

        // allow clicking anywhere on container to jump to that spot (but ignore clicks while dragging)
        this.container.addEventListener('click', (e) => {
            if (this.isDragging) return;
            // ignore clicks if they target the slider/button (already handled)
            if (e.target.closest('.ba-slider') || e.target.closest('.ba-slider-button')) return;
            const pageX = e.pageX || (e.touches && e.touches[0] && e.touches[0].pageX);
            if (pageX) this.updatePosition(pageX);
        });

        // prevent text selection while interacting
        this.container.addEventListener('selectstart', (e) => {
            if (this.isDragging) e.preventDefault();
        });

        // keyboard access: left/right arrow when slider focused
        this.slider.setAttribute('tabindex', '0');
        this.slider.addEventListener('keydown', this.onKeyDown);
        // also make handle focusable for convenience
        if (this.sliderButton) {
            this.sliderButton.setAttribute('tabindex', '0');
            this.sliderButton.addEventListener('keydown', this.onKeyDown);
        }
    }

    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('touchmove', this.onTouchMove, { passive: false });
        document.addEventListener('touchend', this.onTouchEnd);

        // Update immediately to where user pressed
        const pageX = e.type.includes('mouse') ? e.pageX : (e.touches && e.touches[0] && e.touches[0].pageX);
        if (pageX !== undefined) this.updatePosition(pageX);
        this.container.style.cursor = 'grabbing';
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        this.updatePosition(e.pageX);
    }

    onTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        if (e.touches && e.touches[0]) this.updatePosition(e.touches[0].pageX);
    }

    onMouseUp() { this.stopDrag(); }
    onTouchEnd() { this.stopDrag(); }

    stopDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
        this.container.style.cursor = 'grab';
    }

    updatePosition(pageX) {
        const rect = this.container.getBoundingClientRect();
        const offsetX = pageX - rect.left;
        const percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
        this.setPercent(percent);
    }

    setPercent(percent, updateAria = true) {
        this.currentPercent = percent;
        this.beforeDiv.style.width = percent + '%';
        this.slider.style.left = percent + '%';
        if (this.sliderButton) {
            // keep button visually aligned; CSS transform centers it
            this.sliderButton.style.left = percent + '%';
        }
        if (updateAria) {
            // update accessible value
            this.slider.setAttribute('aria-valuenow', Math.round(percent));
            if (this.sliderButton) this.sliderButton.setAttribute('aria-valuenow', Math.round(percent));
        }
    }

    onKeyDown(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.setPercent(Math.max(0, this.currentPercent - 5));
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.setPercent(Math.min(100, this.currentPercent + 5));
        } else if (e.key === 'Home') {
            e.preventDefault();
            this.setPercent(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            this.setPercent(100);
        }
    }

    onResize() {
        // Re-apply percent so layout recalculates correctly
        this.setPercent(this.currentPercent, false);
    }

    destroy() {
        // remove listeners & cleanup
        this.stopDrag();
        this.slider.removeEventListener('mousedown', this.startDrag);
        this.slider.removeEventListener('touchstart', this.startDrag);
        this.container.removeEventListener('click', this.updatePosition);
        this.container.removeEventListener('selectstart', this.preventSelect);
        this.slider.removeEventListener('keydown', this.onKeyDown);
        if (this.sliderButton) {
            this.sliderButton.removeEventListener('mousedown', this.startDrag);
            this.sliderButton.removeEventListener('touchstart', this.startDrag);
            this.sliderButton.removeEventListener('keydown', this.onKeyDown);
        }
        window.removeEventListener('resize', this.onResize);
    }
}

// Initialize sliders & section tweaks
function initSlidersAndSections() {
    // Initialize only sliders inside the transformations section to avoid accidental collisions
    const sliders = document.querySelectorAll('#transformations .ba-container');
    sliders.forEach(slider => new BeforeAfterSlider(slider));

    // Preserve intended transparent backgrounds
    const microneedlingSection = document.getElementById('microneedling');
    const packagesSection = document.getElementById('packages');

    if (microneedlingSection) {
        microneedlingSection.style.background = 'transparent';
    }
    if (packagesSection) {
        packagesSection.style.background = 'transparent';
    }
}

// DOM-ready init (single unified init)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlidersAndSections);
} else {
    initSlidersAndSections();
}
