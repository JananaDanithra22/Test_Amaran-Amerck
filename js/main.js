document.addEventListener("DOMContentLoaded", function () {
  /* ---------------------------
     HERO CAROUSEL
     --------------------------- */
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");
  const dots = Array.from(document.querySelectorAll(".carousel-dots .dot"));
  let currentIndex = 0;
  let autoSlideTimer = null;
  const AUTO_SLIDE_DELAY = 5000;

  function showSlide(index) {
    if (!slides.length) return;
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === currentIndex));
    dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }
  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoSlide(); });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { showSlide(i); resetAutoSlide(); });
  });

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => { nextSlide(); }, AUTO_SLIDE_DELAY);
  }
  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }
  function resetAutoSlide() {
    startAutoSlide();
  }

  const carousel = document.querySelector(".hero-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", startAutoSlide);
  }

  showSlide(0);
  startAutoSlide();

  /* ---------------------------
     STICKY NAVBAR
     --------------------------- */
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
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  updateStickyHeader();
  window.addEventListener("scroll", () => { updateStickyHeader(); });
  window.addEventListener("resize", () => { updateStickyHeader(); });

  /* ---------------------------
     MOBILE MENU TOGGLE
     --------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !expanded);
      mainNav.style.display = expanded ? "none" : "flex";
    });
  }
});
