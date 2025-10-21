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

// Before/After Image Comparison Slider - FIXED VERSION
class BeforeAfterSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.ba-slider');
        this.beforeDiv = container.querySelector('.ba-before');
        this.isDragging = false;
        
        if (!this.slider || !this.beforeDiv) {
            console.error('Required elements not found in container');
            return;
        }
        
        this.init();
    }
    
    init() {
        // Mouse events
        this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
        this.container.addEventListener('mousedown', (e) => {
            // Allow clicking anywhere on the container to start dragging
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
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.container.style.cursor = 'grabbing';
        e.preventDefault();
        
        // Update position immediately on click
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
        
        // Update the width of the "before" div to reveal more or less of the before image
        this.beforeDiv.style.width = percentage + '%';
        
        // Move the slider line
        this.slider.style.left = percentage + '%';
    }
}

// Initialize all before/after sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.ba-container');
    sliders.forEach(slider => new BeforeAfterSlider(slider));
    
    // Remove background colors from specific sections
    const microneedlingSection = document.getElementById('microneedling');
    const packagesSection = document.getElementById('packages');
    
    if (microneedlingSection) {
        microneedlingSection.style.background = 'transparent';
    }
    if (packagesSection) {
        packagesSection.style.background = 'transparent';
    }
});

// Also initialize if script loads after DOM is ready
if (document.readyState === 'loading') {
    // Do nothing, DOMContentLoaded will fire
} else {
    // DOM is already ready, initialize now
    const sliders = document.querySelectorAll('.ba-container');
    sliders.forEach(slider => new BeforeAfterSlider(slider));
    
    // Remove background colors from specific sections
    const microneedlingSection = document.getElementById('microneedling');
    const packagesSection = document.getElementById('packages');
    
    if (microneedlingSection) {
        microneedlingSection.style.background = 'transparent';
    }
    if (packagesSection) {
        packagesSection.style.background = 'transparent';
    }
}