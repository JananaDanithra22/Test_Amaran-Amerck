
(function () {
  try {
    var mapEl = document.getElementById('map');
    if (!mapEl) return; // nothing to do if element is missing

    // ensure the container has an explicit height via CSS; footer.css already sets a .map-container height
    var map = L.map('map', { scrollWheelZoom: false }).setView([6.91218399210865, 79.86792516931244], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([6.91218399210865, 79.86792516931244]).addTo(map)
      .bindPopup('Amaran Medical & Aesthetic Centre').openPopup();
  } catch (e) {
    // fail silently in environments without Leaflet or DOM access
    console.error('Map initialization error:', e);
  }
})();
