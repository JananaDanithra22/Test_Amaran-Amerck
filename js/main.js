// js/main.js
document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
     HERO CAROUSEL
     - arrows
     - dots
     - autoplay with pause on hover
     - keyboard (left/right)
     - touch swipe (mobile)
     ========================================= */
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");
  const dots = Array.from(document.querySelectorAll(".carousel-dots .dot"));
  const carousel = document.querySelector(".hero-carousel");
  let currentIndex = 0;
  let autoSlideTimer = null;
  const AUTO_SLIDE_DELAY = 3000;

  function showSlide(index) {
    if (!slides.length) return;
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === currentIndex));
    dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  }

  function nextSlide() { showSlide(currentIndex + 1); }
  function prevSlide() { showSlide(currentIndex - 1); }

  // Arrows
  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoSlide(); });

  // Dots
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { showSlide(i); resetAutoSlide(); });
  });

  // Autoplay
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => { nextSlide(); }, AUTO_SLIDE_DELAY);
  }
  function stopAutoSlide() {
    if (autoSlideTimer) { clearInterval(autoSlideTimer); autoSlideTimer = null; }
  }
  function resetAutoSlide() { startAutoSlide(); }

  // Pause on hover/focus
  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", startAutoSlide);
    // Pause when any carousel control gets focus (keyboard users)
    carousel.addEventListener("focusin", stopAutoSlide);
    carousel.addEventListener("focusout", startAutoSlide);
  }

  // Keyboard navigation (left / right)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { prevSlide(); resetAutoSlide(); }
    if (e.key === "ArrowRight") { nextSlide(); resetAutoSlide(); }
  });

  // Touch swipe support (basic)
  (function addTouchSupport() {
    if (!carousel) return;
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    carousel.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length > 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = true;
      stopAutoSlide();
    }, { passive: true });

    carousel.addEventListener("touchmove", (e) => {
      // prevent vertical scroll detection turning into horizontal swipe
      if (!isSwiping || !e.touches || e.touches.length > 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        e.preventDefault();
      }
    }, { passive: false });

    carousel.addEventListener("touchend", (e) => {
      if (!isSwiping) return;
      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
      const dx = endX - startX;
      const threshold = 40; // min px to count as swipe
      if (dx > threshold) { prevSlide(); }
      else if (dx < -threshold) { nextSlide(); }
      isSwiping = false;
      resetAutoSlide();
    });
  })();

  // Initialize carousel
  showSlide(0);
  startAutoSlide();

  /* =========================================
     STICKY HEADER (overlay -> fixed)
     - header overlays hero initially (transparent)
     - when scrolling past hero, header becomes fixed + white
     - JS sets document.body.style.paddingTop to header height while sticky
     ========================================= */
  const header = document.querySelector(".main-header");

function updateStickyHeader() {
  if (!header) return;
  const hero = document.querySelector(".hero-carousel");
  let triggerPoint = 0;

  if (hero) {
    const rect = hero.getBoundingClientRect();
    const heroTop = window.pageYOffset + rect.top;
    triggerPoint = heroTop + hero.offsetHeight - 10;
  }

  if (window.pageYOffset >= triggerPoint) {
    if (!header.classList.contains("sticky")) {
      header.classList.add("sticky");
      document.body.style.paddingTop = header.offsetHeight + "px";
    }
  } else {
    if (header.classList.contains("sticky")) {
      header.classList.remove("sticky");
      document.body.style.paddingTop = "0";
    }
  }

  // Update carousel appointment buttons
  const appointmentBtns = document.querySelectorAll('.appointment-btn');
  appointmentBtns.forEach(btn => {
    if (window.pageYOffset >= triggerPoint) {
      btn.classList.add('filled');
    } else {
      btn.classList.remove('filled');
    }
  });
}

  // run initially and on scroll/resize with small debounce
  updateStickyHeader();
  let stickyTimeout = null;
  window.addEventListener("scroll", () => {
    if (stickyTimeout) clearTimeout(stickyTimeout);
    stickyTimeout = setTimeout(updateStickyHeader, 40);
  }, { passive: true });
  window.addEventListener("resize", () => { updateStickyHeader(); });

  /* =========================================
     MOBILE NAV TOGGLE
     - toggles main-nav display as a simple fallback
     - keeps aria-expanded updated
     ========================================= */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      // prefer toggling a class in CSS, but for beginner fallback toggle display:
      if (!expanded) {
        mainNav.style.display = "flex";
      } else {
        mainNav.style.display = "none";
      }
    });

    // optional: close the mobile nav when a link is clicked (useful on small screens)
    Array.from(mainNav.querySelectorAll("a")).forEach(a => {
      a.addEventListener("click", () => {
        const isMobile = window.getComputedStyle(navToggle).display !== "none";
        if (isMobile) {
          navToggle.setAttribute("aria-expanded", "false");
          mainNav.style.display = "none";
        }
      });
    });
  }

  /* =========================================
     CLEANUP ON UNLOAD (clear timers)
     ========================================= */
  window.addEventListener("beforeunload", () => {
    stopAutoSlide();
  });
});
