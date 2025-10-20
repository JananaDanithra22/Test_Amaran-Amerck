    // Doctors Carousel Functionality
    const track = document.querySelector('.doctors-carousel-track-2');
    const slides = Array.from(document.querySelectorAll('.doctors-carousel-slide-2'));
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
    const likeBadges = Array.from(document.querySelectorAll('.like-badge'));

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
      const offset = -currentSlide * 100;
      track.style.transform = `translateX(${offset}%)`;

      slides.forEach((slide, index) => {
        slide.classList.toggle('active-slide', index === currentSlide);
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentSlide = parseInt(dot.dataset.slide);
        updateCarousel();
      });
    });

    // Like Badge Functionality
    likeBadges.forEach(badge => {
      badge.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('liked');
        
        // Change icon between regular and solid thumbs up
        const icon = this.querySelector('i');
        if (this.classList.contains('liked')) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
        } else {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
        }
      });
    });

    // touch / swipe support
    let startX = 0;
    let isTouching = false;

    function onTouchStart(e) {
      isTouching = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
    }

    function onTouchMove(e) {
      if (!isTouching) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = x - startX;
      // small drag feedback (optional)
      track.style.transform = `translateX(${ -currentSlide * 100 + (delta / track.clientWidth) * 100 }%)`;
    }

    function onTouchEnd(e) {
      if (!isTouching) return;
      isTouching = false;
      const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) nextSlide(); else prevSlide();
      } else {
        updateCarousel();
      }
    }

    // attach listeners for mouse and touch for desktop/mobile swiping
    track.addEventListener('touchstart', onTouchStart, {passive: true});
    track.addEventListener('touchmove', onTouchMove, {passive: true});
    track.addEventListener('touchend', onTouchEnd);
    track.addEventListener('mousedown', onTouchStart);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchEnd);

    // Auto-advance carousel every 5 seconds
    let autoTimer = setInterval(nextSlide, 5000);

    // pause auto-advance on interaction
    [prevBtn, nextBtn, ...dots].forEach(el => el && el.addEventListener('click', () => { clearInterval(autoTimer); autoTimer = setInterval(nextSlide, 5000); }));