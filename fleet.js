// Fleet page script
function initFleetPage() {
  // Try loading vehicles from DB API; fallback to static data in script.js
  fetch('get_vehicles.php')
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        VEHICLES = data.map(v => ({
          id: Number(v.id) || 0,
          name: `${v.make || ''} ${v.model || ''} ${v.year || ''}`.trim(),
          category: v.category || 'Economy',
          seats: Number(v.seats) || 5,
          pricePerDay: Number(v.price_per_day || v.pricePerDay || 0),
          fuel: v.fuel || 'Petrol',
          transmission: v.transmission || 'Auto',
          rating: Number(v.rating) || 4.5,
          image: v.image_url || `images/${v.id}.jpg`,
          bgColor: v.bgColor || '#1A7A2A',
          features: Array.isArray(v.features) ? v.features : ['Reliable', 'Well maintained', 'Insurance included'],
        }));
      }
    })
    .catch(err => {
      console.warn('Could not fetch vehicles from DB; using local fallback.', err);
    })
    .finally(() => {
      if (typeof buildFleetGrid === 'function') buildFleetGrid();
      if (typeof setupScrollReveal === 'function') setupScrollReveal();
    });
}

document.addEventListener('DOMContentLoaded', initFleetPage);
