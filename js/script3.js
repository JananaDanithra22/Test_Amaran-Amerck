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

// Before/After Image Comparison Slider
class BeforeAfterSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.ba-slider');
        this.beforeDiv = container.querySelector('.ba-before');
        this.sliderButton = container.querySelector('.ba-slider-button');
        this.isDragging = false;
        this.currentPercent = 50; // start at 50%

        if (!this.slider || !this.beforeDiv) {
            console.error('Required elements not found in container');
            return;
        }

        // apply initial positions
        this.beforeDiv.style.width = this.currentPercent + '%';
        this.slider.style.left = this.currentPercent + '%';

        this.init();
        this.onResize = this.onResize.bind(this);
        window.addEventListener('resize', this.onResize);
    }

    init() {
        // Mouse events
        this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
        if (this.sliderButton) {
            this.sliderButton.addEventListener('mousedown', (e) => this.startDrag(e));
        }
        // Allow clicking anywhere on the container to set position / start drag
        this.container.addEventListener('mousedown', (e) => {
            // If clicking the slider button, startDrag already handled
            if (!e.target.closest('.ba-slider-button')) {
                this.startDrag(e);
            }
        });

        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // Touch events for mobile
        this.slider.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        this.container.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.stopDrag());

        // Prevent text selection while dragging
        this.container.addEventListener('selectstart', (e) => {
            if (this.isDragging) e.preventDefault();
        });

        // Optional: click on container to jump slider to that pos
        this.container.addEventListener('click', (e) => {
            // ignore clicks while dragging
            if (this.isDragging) return;
            const x = (e.type.includes('mouse') ? e.pageX : (e.touches && e.touches[0].pageX)) || 0;
            this.updatePosition(x);
        });
    }

    startDrag(e) {
        this.isDragging = true;
        this.container.style.cursor = 'grabbing';
        e.preventDefault();

        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.updatePosition(x);
    }

    stopDrag() {
        this.isDragging = false;
        this.container.style.cursor = 'grab';
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.updatePosition(x);
    }

    updatePosition(x) {
        const rect = this.container.getBoundingClientRect();
        const offsetX = x - rect.left;
        const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
        this.currentPercent = percentage;

        // Update the width of the "before" div to reveal more or less of the before image
        this.beforeDiv.style.width = percentage + '%';

        // Move the slider line
        this.slider.style.left = percentage + '%';
    }

    onResize() {
        // Ensure percentages still map correctly after resize (no action required because we use %,
        // but keeping method for future needs / recalculation)
        this.beforeDiv.style.width = this.currentPercent + '%';
        this.slider.style.left = this.currentPercent + '%';
    }

    destroy() {
        // cleanup listeners if needed
        window.removeEventListener('resize', this.onResize);
    }
}

// Initialize sliders & section tweaks
function initSlidersAndSections() {
    // Initialize only sliders inside the transformations section to avoid accidental collisions
    const sliders = document.querySelectorAll('#transformations .ba-container');
    sliders.forEach(slider => new BeforeAfterSlider(slider));

    // Remove background colors from specific sections (keeps existing inline intent)
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
