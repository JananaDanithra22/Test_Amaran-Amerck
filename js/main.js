// Sticky navbar after scrolling past carousel
window.addEventListener("scroll", function() {
  const header = document.querySelector(".main-header");
  const scrollPosition = window.scrollY;

  // Change this value to your carousel height
  const carouselHeight = 400; // example height in px

  if (scrollPosition >= carouselHeight) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});
