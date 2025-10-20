// js/map.js
function initFooterMap() {
  try {
    var mapEl = document.getElementById('map');
    if (!mapEl) return;

    var map = L.map('map', { scrollWheelZoom: false }).setView([6.9066, 79.8667], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([6.9066, 79.8667])
      .addTo(map)
      .bindPopup('Amaran Medical & Aesthetic Centre')
      .openPopup();
  } catch (e) {
    console.error('Map initialization error:', e);
  }
}