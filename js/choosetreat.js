// Select elements
const docCarousel = document.querySelector('.doc-carousel');
const docTrack = document.querySelector('.doc-slide-track');
const docSlides = document.querySelectorAll('.doc-slide');
const docPrev = document.querySelector('.doc-arrow.prev');
const docNext = document.querySelector('.doc-arrow.next');
const docDots = document.querySelectorAll('.doc-dot');

let docCurrentSlide = 0;
const totalSlides = docSlides.length;

// Function to update slide position
function docUpdateSlide() {
  const offset = -docCurrentSlide * 100; // move slides by 100% per slide
  docTrack.style.transform = `translateX(${offset}%)`;
  
  // Update dots
  docDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === docCurrentSlide);
  });
}

// Next slide
function docNextSlide() {
  docCurrentSlide = (docCurrentSlide + 1) % totalSlides;
  docUpdateSlide();
}

// Previous slide
function docPrevSlide() {
  docCurrentSlide = (docCurrentSlide - 1 + totalSlides) % totalSlides;
  docUpdateSlide();
}

// Arrow events
docNext.addEventListener('click', docNextSlide);
docPrev.addEventListener('click', docPrevSlide);

// Dot events
docDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    docCurrentSlide = i;
    docUpdateSlide();
  });
});

// Auto-slide every 3 seconds
let docAutoSlide = setInterval(docNextSlide, 2500);

// Pause on hover
docCarousel.addEventListener('mouseenter', () => clearInterval(docAutoSlide));
docCarousel.addEventListener('mouseleave', () => {
  docAutoSlide = setInterval(docNextSlide, 2500);
});

// Initialize
docUpdateSlide();
