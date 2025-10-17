// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scrollIndicator').style.width = scrolled + '%';
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
        this.beforeImage = container.querySelector('.ba-before');
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        // Mouse events
        this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        
        // Touch events for mobile
        this.slider.addEventListener('touchstart', (e) => this.startDrag(e));
        document.addEventListener('touchmove', (e) => this.drag(e));
        document.addEventListener('touchend', () => this.stopDrag());
        
        // Click on container to move slider
        this.container.addEventListener('click', (e) => this.jumpTo(e));
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.container.style.cursor = 'grabbing';
        e.preventDefault();
    }
    
    stopDrag() {
        this.isDragging = false;
        this.container.style.cursor = 'grab';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.updatePosition(x);
    }
    
    jumpTo(e) {
        if (e.target === this.slider) return;
        
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.updatePosition(x);
    }
    
    updatePosition(x) {
        const rect = this.container.getBoundingClientRect();
        const offsetX = x - rect.left;
        const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
        
        this.beforeImage.style.width = percentage + '%';
        this.slider.style.left = percentage + '%';
    }
}

// Initialize all before/after sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.ba-container');
    sliders.forEach(slider => new BeforeAfterSlider(slider));
});