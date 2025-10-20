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

// Before/After Image Comparison Slider
class BeforeAfterSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.ba-slider');
        this.beforeDiv = container.querySelector('.ba-before');
        this.beforeImg = container.querySelector('.ba-before img');
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        // Mouse events on slider
        this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
        
        // Mouse events on container (click anywhere to jump)
        this.container.addEventListener('mousedown', (e) => {
            if (e.target !== this.slider && !e.target.closest('.ba-slider-button')) {
                this.startDrag(e);
            }
        });
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        
        // Touch events for mobile
        this.slider.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        
        this.container.addEventListener('touchstart', (e) => {
            if (e.target !== this.slider && !e.target.closest('.ba-slider-button')) {
                this.startDrag(e);
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.stopDrag());
        
        // Prevent default image dragging behavior
        const images = this.container.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.container.style.cursor = 'grabbing';
        e.preventDefault();
        
        // Update position immediately on click/touch
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
        
        // Update the width of the before container (this clips the before image)
        this.beforeDiv.style.width = percentage + '%';
        
        // Move the slider line
        this.slider.style.left = percentage + '%';
        
        // CRITICAL: Adjust the before image position so it stays aligned with the after image
        // The before image is 200% width of its container, so we need to move it left
        // as the container shrinks to keep it aligned
        if (this.beforeImg) {
            const imgOffset = -(percentage / 100) * rect.width;
            this.beforeImg.style.left = imgOffset + 'px';
        }
    }
}

// Initialize all before/after sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.ba-container');
    sliders.forEach(slider => new BeforeAfterSlider(slider));
    
    console.log('Before/After sliders initialized:', sliders.length);
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

// Observe all sections for fade-in animation
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});