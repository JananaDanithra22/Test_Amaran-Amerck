// choosetreat.js
console.log("Choose a Treatment section loaded");

// ===== Doctors Carousel 2 =====
const track2 = document.querySelector('.doctors-carousel-track-2');
if (track2) {
  const slides2 = Array.from(track2.children);
  let currentIndex2 = 0;

  setInterval(() => {
    currentIndex2 = (currentIndex2 + 1) % slides2.length;
    track2.style.transform = `translateX(-${currentIndex2 * 100}%)`;
  }, 2000);
}
