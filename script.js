/*
  ================================================================
  KALABE MOTORS — script.js
  
  This file controls all the interactive behaviour on the website.
  It is split into clearly labelled sections, each doing one job.
  
  SECTIONS:
    1.  DATA           — All vehicles, reviews, notifications
    2.  UTILITIES      — Small helper functions used everywhere
    3.  PROGRESS BAR   — Loading bar at the top of the page
    4.  DARK MODE      — Not used (light-only site), kept simple
    5.  CLOCKS         — Live time display
    6.  NAVBAR         — Scroll effects, mobile menu, active links
    7.  PARTICLES      — Animated dots on the hero background
    8.  TYPED TEXT     — Cycling headline in hero
    9.  COUNTERS       — Numbers that count up when visible
   10.  CHIPS          — Hero keyword chips fade in
   11.  SCROLL REVEAL  — Elements fade in as you scroll
   12.  FLEET RENDER   — Builds vehicle cards from data
   13.  FLEET FILTER   — Category tabs and live search
   14.  REVIEWS SLIDER — Auto-sliding testimonials
   15.  CALCULATOR     — Rental cost estimator
   16.  BOOKING MODAL  — Booking form popup
   17.  SUCCESS MODAL  — Confirmation popup with confetti
   18.  CONTACT FORM   — Send message form
   19.  FLOATING BTNS  — Fab buttons that appear on scroll
   20.  TOAST          — Small notification messages
   21.  QUICK SEARCH   — Top search bar
   22.  INIT           — Start everything when page loads
  ================================================================
*/

'use strict';  // catches common JavaScript mistakes

/* ════════════════════════════════════════════════════════════
   1. DATA
   All the content for the site lives here as JavaScript arrays.
   To add a vehicle: copy one object, change the values.
   ════════════════════════════════════════════════════════════ */

let VEHICLES = [
  {
    id: 1,
    name: 'Honda Fit Hybrid',
    category: 'Economy',
    seats: 5,
    pricePerDay: 550,
    fuel: 'Hybrid',
    transmission: 'Auto',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1508704019882-f9b5bb9b3dfd?auto=format&fit=crop&w=700&q=80',
    bgColor: '#1A7A2A',
    features: ['Fuel Efficient', 'GPS Tracking', 'Lane Assist'],
  },
  {
    id: 2,
    name: 'Toyota Auris Hybrid',
    category: 'SUV',
    seats: 5,
    pricePerDay: 850,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1608571425014-b0ee712f735b?auto=format&fit=crop&w=700&q=80',
    bgColor: '#0A2558',
    features: ['4WD', 'GPS Tracking' , 'LED Lights'],
  },
  {
    id: 3,
    name: 'Mercedes-Benz V-Class Marco Polo.',
    category: 'Luxury Camper Van / MPV',
    seats: 6,
    pricePerDay: 1200,
    fuel: 'Diesel',
    transmission: 'Auto',
    rating: 4.9,
    image: 'https://images.images/WhatsApp Image 2026-03-21 at 16.00.22 (1).jpeg',
    bgColor: '#163680',
    features: ['Leather Seats', '360 Camera', 'Sunroof'],
  },
  {
    id: 4,
    name: 'Toyota Mark X',
    category: 'Premium Sports Sedan',
    seats: 5,
    pricePerDay: 1000,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1597003451817-a71cae9fc687?auto=format&fit=crop&w=700&q=80',
    bgColor: '#0F4C81',
    features: ['5 Seats', 'Sporty Aesthetics', 'V6 Power'],
  },
  {
    id: 5,
    name: 'Toyota Coaster',
    category: 'BUS',
    seats: 29,
    pricePerDay: 2500,
    fuel: 'Diesel',
    transmission: 'Manual',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=700&q=80',
    bgColor: '#1A3A5C',
    features: ['Spacious Interior', 'GPS Tracker', 'Climate Control'],
  },
  {
    id: 6,
    name: 'Toyota Vitz',
    category: 'Economy',
    seats: 5,
    pricePerDay: 550,
    fuel: 'Petrol',
    transmission: 'Auto',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1462057132904-24d57b5cf5e4?auto=format&fit=crop&w=700&q=80',
    bgColor: '#0A4D2A',
    features: ['Fuel Efficient', 'GPS Tracking', 'Lane Assist'],
  },

 
];

const REVIEWS = [
  { initials: 'CM', name: 'GIFT MBOOZA', role: 'Business Executive, Lusaka', stars: 5, text: 'Immaculate Land Cruiser and top-tier service. Kalabe Motors is easily the best in Zambia!' },
  { initials: 'JN', name: 'FRANCIS PHIRI', role: 'Construction Manager, Lusaka', stars: 5, text: 'Flawless Ranger 4x4 and professional service. My top choice for any safari!.' },
  { initials: 'PM', name: 'PETER BANDA', role: 'Entrepreneur, Ndola', stars: 5, text: 'The best car hire in Zambia. Transparent pricing and a perfect HiAce Bus for our corporate event!.' },
  { initials: 'BK', name: 'EPHRAIM MUYUNDA', role: 'MEKmedia CEO, Lusaka', stars: 5, text: 'Fast MoMo payment and quick delivery. Nationwide service is a logistics game changer!' }
];

let currentIndex = 0;
const track = document.getElementById('slider-track');
const dotsRow = document.getElementById('dots-row');

// 1. Initialize Slider Content
function initSlider() {
  REVIEWS.forEach((rev, index) => {
    // Create Slide
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="user-initials">${rev.initials}</div>
      <div class="stars">${'★'.repeat(rev.stars)}</div>
      <p class="review-text">"${rev.text}"</p>
      <div class="user-info">
        <h4>${rev.name}</h4>
        <p>${rev.role}</p>
      </div>
    `;
    track.appendChild(card);

    // Create Dot
    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.onclick = () => goToSlide(index);
    dotsRow.appendChild(dot);
  });
}

// 2. Navigation Logic
function updateSlider() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  
  // Update Dots
  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % REVIEWS.length;
  updateSlider();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + REVIEWS.length) % REVIEWS.length;
  updateSlider();
}

function goToSlide(index) {
  currentIndex = index;
  updateSlider();
}

// Start
initSlider();

/* ════════════════════════════════════════════════════════════
   2. UTILITIES
   Small helper functions used throughout this file.
   ════════════════════════════════════════════════════════════ */

// Get an element by its id — shorter than document.getElementById
function el(id) {
  return document.getElementById(id);
}

// Get all elements matching a CSS selector
function all(selector) {
  return [...document.querySelectorAll(selector)];
}

// Set the text content of an element
function setText(id, value) {
  const elem = el(id);
  if (elem) elem.textContent = value;
}

// Get the current value of an input or select
function getValue(id) {
  const elem = el(id);
  return elem ? elem.value : '';
}

// Generate a random reference code like "A3B7F2C1"
function randomRef() {
  return 'KM-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Format a date string like "2024-01-15" into "15 Jan 2024"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-ZM', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  });
}


/* ════════════════════════════════════════════════════════════
   3. PROGRESS BAR
   A thin coloured bar at the very top that fills as page loads.
   It's created and added to the page by JavaScript.
   ════════════════════════════════════════════════════════════ */
(function startProgressBar() {
  // Create the bar element
  const bar = document.createElement('div');

  // Style it as a thin strip at the top
  Object.assign(bar.style, {
    position:     'fixed',
    top:          '0',
    left:         '0',
    height:       '4px',
    width:        '0%',
    background:   'linear-gradient(90deg, #1A7A2A, #F5B800, #0A2558)',
    zIndex:       '99999',
    transition:   'width 0.3s ease',
    borderRadius: '0 3px 3px 0',
    boxShadow:    '0 0 10px rgba(245,184,0,0.6)',
  });

  document.body.prepend(bar);  // add to top of page

  // Slowly fill the bar
  let percent = 0;
  const timer = setInterval(() => {
    percent += Math.random() * 20;
    if (percent >= 88) {
      percent = 88;
      clearInterval(timer);
    }
    bar.style.width = percent + '%';
  }, 100);

  // When page fully loads, fill to 100% then fade out
  window.addEventListener('load', () => {
    clearInterval(timer);
    bar.style.width = '100%';
    setTimeout(() => {
      bar.style.opacity = '0';
      setTimeout(() => bar.remove(), 400);
    }, 500);
  });
}());


/* ════════════════════════════════════════════════════════════
   5. CLOCKS
   Updates the time display every second.
   ════════════════════════════════════════════════════════════ */

function updateAllClocks() {
  // Helper to get time in a timezone
  function timeIn(timezone) {
    try {
      return new Date().toLocaleTimeString('en', {
        timeZone: timezone,
        hour:     '2-digit',
        minute:   '2-digit',
        second:   '2-digit',
        hour12:   false,
      });
    } catch (e) {
      return '--:--:--';
    }
  }

  // Top bar clock (Lusaka time)
  const topClock = el('live-clock');
  if (topClock) topClock.textContent = '🕐 ' + timeIn('Africa/Lusaka');

  // Contact section world clocks
  setText('clock-lusaka', timeIn('Africa/Lusaka'));
  setText('clock-london',  timeIn('Europe/London'));
  setText('clock-dubai',   timeIn('Asia/Dubai'));
}

// Run immediately then every second
updateAllClocks();
setInterval(updateAllClocks, 1000);


/* ════════════════════════════════════════════════════════════
   6. NAVBAR
   Handles: scroll shadow, mobile menu, active link highlight
   ════════════════════════════════════════════════════════════ */

// Section IDs in order down the page
const PAGE_SECTIONS = [
  'home', 'fleet', 'services', 'why',
  'testimonials', 'calculator', 'payments', 'contact'
];

// Run these checks on every scroll event
window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;

  // Add shadow to navbar when scrolled down
  const navbar = el('navbar');
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);

  // Show/hide floating buttons
  const fabBook = el('fab-book');
  const fabTop  = el('fab-top');
  if (fabBook) fabBook.classList.toggle('visible', scrollY > 350);
  if (fabTop)  fabTop.classList.toggle('visible',  scrollY > 450);

  // Highlight the correct nav link for current section
  let currentSection = '';
  PAGE_SECTIONS.forEach(function(sectionId) {
    const section = el(sectionId);
    // If we've scrolled past the top of this section
    if (section && scrollY + 130 >= section.offsetTop) {
      currentSection = sectionId;
    }
  });

  all('.nav-links a').forEach(function(link) {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === '#' + currentSection);
  });

}, { passive: true });  // passive for better scroll performance

// Mobile menu toggle
function toggleMobileMenu() {
  const btn  = el('hamburger');
  const menu = el('mobileMenu');
  if (!btn || !menu) return;
  btn.classList.toggle('open');
  menu.classList.toggle('open');
}

function closeMobileMenu() {
  el('hamburger')?.classList.remove('open');
  el('mobileMenu')?.classList.remove('open');
}

// Smooth scroll to a section by ID
function goToSection(sectionId) {
  const section = el(sectionId);
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Handle all anchor link clicks for smooth scrolling
document.addEventListener('click', function(event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);  // remove #
  const target = el(targetId);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  closeMobileMenu();
});


/* ════════════════════════════════════════════════════════════
   7. HERO PARTICLES
   Draws animated dots and connecting lines on the hero canvas.
   ════════════════════════════════════════════════════════════ */

function startParticles() {
  const heroSection = document.querySelector('.hero-section');
  const canvas      = el('hero-canvas');
  if (!heroSection || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dots = [];

  // Resize canvas to match hero size
  function resizeCanvas() {
    width  = canvas.width  = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    createDots();
  }

  // Create a set of dots with random positions and speeds
  function createDots() {
    dots = [];
    const count = Math.min(60, Math.floor(width / 18));

    for (let i = 0; i < count; i++) {
      dots.push({
        x:     Math.random() * width,
        y:     Math.random() * height,
        size:  Math.random() * 2.2 + 0.7,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        // Randomly gold, green, or white
        colour: ['#F5B800', '#1A7A2A', 'rgba(255,255,255,0.8)'][
          Math.floor(Math.random() * 3)
        ],
      });
    }
  }

  // Draw one animation frame
  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    // Move each dot and draw it
    dots.forEach(function(dot) {
      dot.x += dot.speedX;
      dot.y += dot.speedY;

      // Bounce off the edges
      if (dot.x < 0 || dot.x > width)  dot.speedX *= -1;
      if (dot.y < 0 || dot.y > height) dot.speedY *= -1;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = dot.colour;
      ctx.fill();
    });

    // Draw lines between nearby dots
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx   = dots[i].x - dots[j].x;
        const dy   = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          // Closer dots = more opaque line
          ctx.beginPath();
          ctx.strokeStyle = `rgba(245,184,0,${0.22 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawFrame);  // keep animating
  }

  resizeCanvas();
  drawFrame();

  // Redo dots if window resizes
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Parallax: hero content moves slightly with mouse
  const heroContent = document.querySelector('.hero-text');
  heroSection.addEventListener('mousemove', function(event) {
    if (!heroContent) return;
    const rect = heroSection.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
    const y = (event.clientY - rect.top)  / rect.height - 0.5;
    heroContent.style.transform  = `translate(${x * 15}px, ${y * 10}px)`;
    heroContent.style.transition = 'transform 0.08s ease';
  });

  heroSection.addEventListener('mouseleave', function() {
    if (!heroContent) return;
    heroContent.style.transform  = '';
    heroContent.style.transition = 'transform 0.5s ease';
  });
}


/* ════════════════════════════════════════════════════════════
   8. TYPED TEXT
   Cycles through headline phrases with a typing animation.
   ════════════════════════════════════════════════════════════ */

function startTypingEffect() {
  const line1 = el('typed-line1');
  const line2 = el('typed-line2');
  if (!line1 || !line2) return;

  // Pairs of text: [top line, gold bottom line]
  const phrases = [
    ['Drive Your Dreams',      'With Us Today!'],
    ['Driven by Trust,',       'Powered by Innovation.'],
    ['Your All-in-One',        'Logistics Partner.'],
    ['Nationwide Coverage',    'Across Zambia.'],
    ['Professional Transport', '& Rental Services.'],
  ];

  let phraseIndex   = 0;  // which phrase pair we're on
  let charIndex     = 0;  // how many characters typed so far
  let currentLine   = 0;  // 0 = top line, 1 = bottom gold line
  let isDeleting    = false;

  function typeNext() {
    const [topText, bottomText] = phrases[phraseIndex];
    const targetText = currentLine === 0 ? topText : bottomText;
    const targetEl   = currentLine === 0 ? line1   : line2;

    if (!isDeleting) {
      // TYPE: add one character
      targetEl.textContent = targetText.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === targetText.length) {
        // Finished typing this line
        if (currentLine === 0) {
          // Move to second line
          currentLine = 1;
          charIndex   = 0;
          setTimeout(typeNext, 200);
          return;
        } else {
          // Both lines done — pause then start deleting
          isDeleting = true;
          charIndex  = targetText.length;
          setTimeout(typeNext, 2400);
          return;
        }
      }
    } else {
      // DELETE: remove one character
      if (currentLine === 1) {
        line2.textContent = bottomText.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Bottom line deleted — now delete top line
          currentLine = 0;
          charIndex   = line1.textContent.length;
          setTimeout(typeNext, 80);
          return;
        }
      } else {
        line1.textContent = topText.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Both deleted — move to next phrase
          isDeleting    = false;
          currentLine   = 0;
          charIndex     = 0;
          phraseIndex   = (phraseIndex + 1) % phrases.length;
          setTimeout(typeNext, 450);
          return;
        }
      }
    }

    // Speed: deleting is faster than typing
    setTimeout(typeNext, isDeleting ? 36 : 62);
  }

  // Start after a short delay
  setTimeout(typeNext, 1400);
}


/* ════════════════════════════════════════════════════════════
   9. COUNTERS
   Stats in the hero bar count up from 0 when visible.
   ════════════════════════════════════════════════════════════ */

function startCounters() {
  let alreadyRan = false;

  // Use IntersectionObserver to detect when stat items are on screen
  const observer = new IntersectionObserver(function(entries) {
    if (alreadyRan) return;
    if (!entries.some(e => e.isIntersecting)) return;

    alreadyRan = true;  // only run once

    // Counter definitions: [element-id, target-number, suffix]
    const counters = [
      ['stat0', 50, '+'],
      ['stat1', 3,  'yr+'],
      ['stat2', 24,  '/7'],
    ];

    counters.forEach(function([id, target, suffix]) {
      const element = el(id);
      if (!element) return;

      let current = 0;
      const increment = Math.ceil(target / 72);  // 72 steps

      function tick() {
        current = Math.min(current + increment, target);
        element.textContent = current + suffix;
        if (current < target) requestAnimationFrame(tick);
      }

      tick();
    });

  }, { threshold: 0.5 });

  // Observe all stat items
  all('.stat').forEach(item => observer.observe(item));
}


/* ════════════════════════════════════════════════════════════
   10. CHIPS
   Hero keyword chips fade in with a stagger (one by one).
   ════════════════════════════════════════════════════════════ */

function animateChips() {
  all('.chip').forEach(function(chip, index) {
    // Each chip waits a bit longer than the previous one
    setTimeout(function() {
      chip.style.opacity   = '1';
      chip.style.transform = 'translateY(0)';
    }, 700 + index * 120);
  });
}


/* ════════════════════════════════════════════════════════════
   11. SCROLL REVEAL
   Elements with class "fade-in" become visible as you scroll.
   ════════════════════════════════════════════════════════════ */

function setupScrollReveal() {
  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);  // stop watching after visible
        }
      });
    },
    { threshold: 0.1 }  // trigger when 10% is visible
  );

  // Watch all fade-in elements
  all('.fade-in').forEach(element => observer.observe(element));
}

// Watch newly created elements (called after rendering fleet/services/etc)
function watchNewElements(elements) {
  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  elements.forEach(elem => observer.observe(elem));
}


/* ════════════════════════════════════════════════════════════
   12. FLEET RENDER
   Builds all the vehicle cards from the VEHICLES array.
   Also fills the vehicle dropdowns in the booking modal
   and the calculator.
   ════════════════════════════════════════════════════════════ */

function buildFleetGrid() {
  const grid = el('fleet-grid');
  if (!grid) return;

  // Build HTML for each vehicle
  grid.innerHTML = VEHICLES.map(function(vehicle) {
    // Icon for category (friendly fallback)
    const categoryIcons = {
      Economy: 'fa-solid fa-car',
      SUV: 'fa-solid fa-car-side',
      Luxury: 'fa-solid fa-gem',
      Bus: 'fa-solid fa-bus',
      Truck: 'fa-solid fa-truck',
      Pickup: 'fa-solid fa-truck-moving',
    };
    const iconClass = categoryIcons[vehicle.category] || 'fa-solid fa-car';

    // Build the feature tag HTML
    const featureTagsHTML = vehicle.features
      .map(f => `<span class="feature-tag">${f}</span>`)
      .join('');

    // Force fleet images from local images folder (by ID), regardless of name
    const imageSrc = `images/${vehicle.id}.jpg`;

    return `
      <div class="vehicle-card fade-in" data-category="${vehicle.category}" data-id="${vehicle.id}">

        <!-- Image area -->
        <div class="vehicle-image">
          <img class="vehicle-photo" src="${imageSrc}" alt="${vehicle.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80'" />
          <i class="vehicle-icon ${iconClass}"></i>
          <span class="vehicle-cat">${vehicle.category}</span>
        </div>

        <!-- Text content -->
        <div class="vehicle-body">
          <h3 class="vehicle-name">${vehicle.name}</h3>

          <!-- Quick specs -->
          <div class="vehicle-specs">
            <span><i class="fa-solid fa-user"></i> ${vehicle.seats} seats</span>
            <span><i class="fa-solid fa-gas-pump"></i> ${vehicle.fuel}</span>
            <span><i class="fa-solid fa-gear"></i> ${vehicle.transmission}</span>
          </div>

          <!-- Feature tags -->
          <div class="vehicle-features">${featureTagsHTML}</div>

          <!-- Price and hire button -->
          <div class="vehicle-footer">
            <div class="vehicle-price">
              <span class="price-amount">K${vehicle.pricePerDay}</span>
              <span class="price-period">/day</span>
            </div>
            <button
              class="btn-hire"
              onclick="openBookingModal(${vehicle.id}, '${vehicle.name}', ${vehicle.pricePerDay})"
            >
              Hire Now
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  // Also fill the vehicle select menus
  const optionsHTML = VEHICLES.map(v =>
    `<option value="${v.id}" data-price="${v.pricePerDay}" data-name="${v.name}">
       ${v.name} — K${v.pricePerDay}/day
     </option>`
  ).join('');

  const calcSelect = el('calc-vehicle');
  const bookSelect = el('b-vehicle');
  if (calcSelect) calcSelect.innerHTML = optionsHTML;
  if (bookSelect) bookSelect.innerHTML = optionsHTML;

  // Watch the new cards for scroll reveal
  watchNewElements(all('.vehicle-card.fade-in'));

  // Apply 3D tilt effect to cards
  applyTiltEffect();
}

// 3D tilt when hovering a card
function applyTiltEffect() {
  all('.vehicle-card').forEach(function(card) {
    card.addEventListener('mousemove', function(event) {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
      const y = (event.clientY - rect.top)  / rect.height - 0.5;

      card.style.transform  = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px) scale(1.03)`;
      card.style.boxShadow  = `${-x * 14}px ${y * 14}px 40px rgba(10,37,88,0.2)`;
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}


/* ════════════════════════════════════════════════════════════
   13. FLEET FILTER
   Filter tabs and search box to find vehicles.
   ════════════════════════════════════════════════════════════ */

// Called when a filter tab is clicked
function filterVehicles(category, clickedButton) {
  // Update which tab looks active
  all('.tab').forEach(tab => tab.classList.remove('active'));
  clickedButton.classList.add('active');

  // Clear the search box
  const searchBox = el('fleet-search');
  if (searchBox) searchBox.value = '';

  // Show/hide cards
  all('.vehicle-card').forEach(function(card) {
    const shouldShow = category === 'all' || card.dataset.category === category;

    if (shouldShow) {
      card.style.display = '';

      // Animate in smoothly
      requestAnimationFrame(function() {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(14px) scale(0.97)';
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

        requestAnimationFrame(function() {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0) scale(1)';
        });
      });

    } else {
      // Fade out then hide
      card.style.opacity   = '0';
      card.style.transform = 'scale(0.94)';
      setTimeout(() => card.style.display = 'none', 270);
    }
  });
}

// Called on every keypress in the fleet search box
function searchFleet(searchText) {
  const query = searchText.toLowerCase().trim();

  all('.vehicle-card').forEach(function(card) {
    const cardText = card.textContent.toLowerCase();
    card.style.display = (!query || cardText.includes(query)) ? '' : 'none';
  });

  // Deactivate filter tabs when searching
  if (query) {
    all('.tab').forEach(tab => tab.classList.remove('active'));
  } else {
    // Reactivate the "All" tab
    const allTab = document.querySelector('.tab[data-cat="all"]');
    if (allTab) allTab.classList.add('active');
  }
}


/* ════════════════════════════════════════════════════════════
   14. REVIEWS SLIDER
   Auto-advancing testimonials with previous/next buttons.
   ════════════════════════════════════════════════════════════ */

let currentSlide = 0;        // which review is showing
let slideTimer;              // for auto-advance

function buildReviewSlider() {
  const track    = el('slider-track');
  const dotsRow  = el('dots-row');
  if (!track || !dotsRow) return;

  // Build each review slide
  track.innerHTML = REVIEWS.map(function(review) {
    const stars = '★'.repeat(review.stars);
    return `
      <div class="review-slide">
        <div class="review-quote-mark">"</div>
        <p class="review-text">${review.text}</p>
        <div class="review-author">
          <div class="author-avatar">${review.initials}</div>
          <div>
            <div class="author-name">${review.name}</div>
            <div class="author-role">${review.role}</div>
          </div>
          <div class="author-stars">${stars}</div>
        </div>
      </div>
    `;
  }).join('');

  // Build dot buttons (one per review)
  dotsRow.innerHTML = '';
  REVIEWS.forEach(function(_, index) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (index === 0 ? ' active' : '');
    dot.onclick   = function() { goToSlide(index); restartSlideTimer(); };
    dotsRow.appendChild(dot);
  });

  // Auto-advance every 5 seconds
  restartSlideTimer();

  // Touch swipe support
  const viewport = track.parentElement;
  let touchStartX = 0;

  viewport.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', function(e) {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      // Swipe left = next, swipe right = prev
      nextSlide(deltaX < 0 ? 1 : -1);
    }
  }, { passive: true });
}

// Move to a specific slide index
function goToSlide(index) {
  currentSlide = index;

  // Move the track
  const track = el('slider-track');
  if (track) track.style.transform = `translateX(-${index * 100}%)`;

  // Update dots
  all('.dot').forEach(function(dot, i) {
    dot.classList.toggle('active', i === index);
  });
}

// Move forward (+1) or backward (-1)
function nextSlide(direction) {
  const newIndex = (currentSlide + direction + REVIEWS.length) % REVIEWS.length;
  goToSlide(newIndex);
  restartSlideTimer();
}

// Button handlers (used in HTML onclick)
function prevSlide() { nextSlide(-1); }
function slide(dir)  { nextSlide(dir); }

function restartSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => nextSlide(1), 5000);
}

/* ════════════════════════════════════════════════════════════
   15. CALCULATOR
   Updates the cost estimate whenever user changes something.
   ════════════════════════════════════════════════════════════ */

// Stored so booking modal can use the same vehicle
let calculatorVehicleName  = 'Honda Fit Hybrid';
let calculatorVehiclePrice = 55;

function updateCalc() {
  // Get selected vehicle
  const vehicleSelect = el('calc-vehicle');
  if (vehicleSelect) {
    const selectedOption    = vehicleSelect.options[vehicleSelect.selectedIndex];
    calculatorVehiclePrice  = parseInt(selectedOption.value) || 55;
    calculatorVehicleName   = selectedOption.dataset.name   || selectedOption.text.split(' — ')[0];
  }

  // Get number of days
  const days = parseInt(getValue('calc-days') || 1);
  setText('days-display', days);

  // Calculate daily rate with add-ons
  let dailyRate = calculatorVehiclePrice;
  if (el('addon-gps')?.checked)    dailyRate += 5;
  if (el('addon-driver')?.checked) dailyRate += 30;
  if (el('addon-ins')?.checked)    dailyRate += 10;

  // Calculate totals
  const totalCost = days * dailyRate;
  const saving    = days >= 7 ? Math.round(calculatorVehiclePrice * 7 * 0.05) : 0;

  // Update the result boxes
  setText('result-total', 'K' + totalCost.toLocaleString());
  setText('result-rate',  'K' + dailyRate);
  setText('result-days',  days + (days === 1 ? ' day' : ' days'));
  setText('result-save',  saving > 0 ? '-K' + saving : '—');

  // Show helpful tip tags
  const tips = [];
  if (days >= 30) tips.push('Monthly rental — ask about discounts');
  else if (days >= 14) tips.push('2-week rental — great value');
  else if (days >= 7)  tips.push('7-day rate applied');
  if (dailyRate > calculatorVehiclePrice) tips.push('Add-ons included in total');
  if (totalCost > 500) tips.push('Corporate billing available');

  const tipsContainer = el('calc-tips');
  if (tipsContainer) {
    tipsContainer.innerHTML = tips.map(t => `<span class="tip-tag">${t}</span>`).join('');
  }

  // Animate the results box briefly
  const resultsBox = el('calc-results');
  if (resultsBox) {
    resultsBox.style.transform = 'scale(1.02)';
    setTimeout(() => resultsBox.style.transform = '', 200);
  }
}

// Book Now button inside calculator opens the booking modal
function bookFromCalc() {
  openBookingModal(null, calculatorVehicleName, calculatorVehiclePrice);
}


/* ════════════════════════════════════════════════════════════
   16. BOOKING MODAL
   The popup form where users enter booking details.
   ════════════════════════════════════════════════════════════ */

let currentBookingPrice = 55;  // tracks selected vehicle price

// Open the booking modal (optionally pre-select a vehicle)
function openBookingModal(vehicleId, vehicleName, vehiclePrice) {
  currentBookingPrice = vehiclePrice || 55;

  // Set the subtitle text
  const subtitle = el('booking-subtitle');
  if (subtitle) {
    subtitle.textContent = vehicleName
      ? `${vehicleName} — K${vehiclePrice}/day`
      : 'Complete your reservation below';
  }

  // Pre-select the vehicle in the dropdown and update current vehicle price
  const vehicleSelect = el('b-vehicle');
  if (vehicleSelect) {
    if (vehicleId) {
      for (let i = 0; i < vehicleSelect.options.length; i++) {
        if (parseInt(vehicleSelect.options[i].value, 10) === vehicleId) {
          vehicleSelect.selectedIndex = i;
          break;
        }
      }
    }

    const selectedOption = vehicleSelect.options[vehicleSelect.selectedIndex];
    if (selectedOption && selectedOption.dataset.price) {
      currentBookingPrice = parseInt(selectedOption.dataset.price, 10);
    }
  }

  // Reset the price display
  setText('p-rate',  'K' + currentBookingPrice + '/day');
  setText('p-days',  '—');
  setText('p-total', '—');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  const pickupInput = el('b-pickup');
  const returnInput = el('b-return');
  if (pickupInput) { pickupInput.min = today; pickupInput.value = ''; }
  if (returnInput) { returnInput.min = today; returnInput.value = ''; }

  // Clear other fields
  ['b-first-name', 'b-last-name', 'b-email', 'b-phone', 'b-nrc', 'b-purpose'].forEach(function(id) {
    const input = el(id);
    if (input) input.value = '';
  });

  const nrcFile = el('b-nrc-file');
  if (nrcFile) nrcFile.value = '';

  openModal('booking-modal');
}

function closeBookingModal() {
  closeModal('booking-modal');
}

// Called when user changes vehicle in the modal dropdown
function onVehicleSelect() {
  const select = el('b-vehicle');
  if (!select) return;
  const selectedOption = select.options[select.selectedIndex];
  currentBookingPrice = selectedOption && selectedOption.dataset.price
    ? parseInt(selectedOption.dataset.price, 10)
    : 55;
  setText('p-rate', 'K' + currentBookingPrice + '/day');
  recalcBooking();
}

// Called when user picks dates — updates price summary
function recalcBooking() {
  const pickupDate = getValue('b-pickup');
  const returnDate = getValue('b-return');
  if (!pickupDate || !returnDate) return;

  const days = Math.round(
    (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
  );

  if (days > 0) {
    setText('p-days',  days + (days === 1 ? ' day' : ' days'));
    setText('p-total', 'K' + (days * currentBookingPrice).toLocaleString());

    // Briefly animate the price box
    const priceBox = el('price-box');
    if (priceBox) {
      priceBox.style.transform = 'scale(1.03)';
      setTimeout(() => priceBox.style.transform = '', 220);
    }
  } else {
    setText('p-days',  '—');
    setText('p-total', '—');
  }
}

// Submit the booking via native form POST (no AJAX)
function submitBooking(event) {
  // Validate required fields
  const firstName = getValue('b-first-name').trim();
  const lastName = getValue('b-last-name').trim();
  const email = getValue('b-email').trim();
  const phone = getValue('b-phone').trim();
  const pickup = getValue('b-pickup');
  const ret = getValue('b-return');
  const vehicleSelect = el('b-vehicle');

  if (!firstName || !lastName || !email || !phone) {
    showToast('Please fill in all required fields.', 'error');
    if (event) event.preventDefault();
    return;
  }

  if (!pickup || !ret || pickup >= ret) {
    showToast('Please select valid pick-up and return dates.', 'error');
    if (event) event.preventDefault();
    return;
  }

  if (!vehicleSelect || !vehicleSelect.value) {
    showToast('Please select a vehicle.', 'error');
    if (event) event.preventDefault();
    return;
  }

  // Allow default form submission to book_vehicle.php
}

// Bind form submit validation in one place
document.addEventListener('DOMContentLoaded', function() {
  const form = el('booking-form');
  if (form) {
    form.addEventListener('submit', submitBooking);
  }
});


/* ════════════════════════════════════════════════════════════
   17. SUCCESS MODAL
   Shows after booking is confirmed, with confetti!

   WE HAVE TO REMOVE ALL THE AIDS WHICH WERE ADD IN THE FORM OF COMMENTS IN THE HTML FILE BECAUSE THEY ARE NOT NEEDED IN THE FINAL CODE AND THEY ARE MAKING THE CODE LOOK MESSY AND UNPROFESSIONAL.
   ════════════════════════════════════════════════════════════ */

function showSuccessModal(booking) {
  const detailsContainer = el('booking-details');
  if (!detailsContainer) return;

  // Build the details table
  detailsContainer.innerHTML = `
    <div class="booking-row">
      <span class="booking-label">Booking Ref</span>
      <span class="ref-chip">${booking.ref}</span>
    </div>
    <div class="booking-row">
      <span class="booking-label">Vehicle</span>
      <span class="booking-value">${booking.vehicle}</span>
    </div>
    <div class="booking-row">
      <span class="booking-label">Name</span>
      <span class="booking-value">${booking.name}</span>
    </div>
    <div class="booking-row">
      <span class="booking-label">Pick-Up</span>
      <span class="booking-value">${formatDate(booking.pickup)}</span>
    </div>
    <div class="booking-row">
      <span class="booking-label">Return</span>
      <span class="booking-value">${formatDate(booking.return)}</span>
    </div>
    <div class="booking-row">
      <span class="booking-label">Duration</span>
      <span class="booking-value">${booking.days} day${booking.days > 1 ? 's' : ''}</span>
    </div>
    <div class="booking-row">
      <span class="booking-label">Total Cost</span>
      <span class="booking-value" style="color:#1A7A2A; font-size:1.05rem">
        K${booking.total.toLocaleString()}
      </span>
    </div>
  `;

  // Update the WhatsApp confirmation link with the ref
  const waLink = el('whatsapp-confirm-link');
  if (waLink) {
    waLink.href = `https://wa.me/260970402241?text=Hello%20Kalabe%20Motors!%20My%20booking%20ref%20is%20${booking.ref}`;
  }

  openModal('success-modal');
  launchConfetti();
}

function closeSuccessModal() {
  closeModal('success-modal');
}

// Confetti burst animation — coloured particles fly out
function launchConfetti() {
  const colours = ['#F5B800','#1A7A2A','#0A2558','#FFFFFF','#D4A000','#22A03A','#4ade80'];

  for (let i = 0; i < 90; i++) {
    const particle = document.createElement('div');
    const size     = Math.random() * 12 + 5;

    // Style each particle
    Object.assign(particle.style, {
      position:     'fixed',
      top:          '35%',
      left:         '50%',
      width:        size + 'px',
      height:       size + 'px',
      borderRadius: Math.random() > 0.4 ? '50%' : '3px',
      background:   colours[Math.floor(Math.random() * colours.length)],
      pointerEvents:'none',
      zIndex:       '99999',
      transform:    'translate(-50%, -50%)',
      transition:   'none',
    });

    document.body.appendChild(particle);

    // Calculate random trajectory
    const angle    = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 300;
    const tx       = Math.cos(angle) * distance;
    const ty       = Math.sin(angle) * distance - 140;
    const rotation = Math.random() * 760 - 380;

    // After tiny delay, animate the particle flying out
    setTimeout(function() {
      Object.assign(particle.style, {
        transition: `transform ${0.6 + Math.random() * 0.6}s cubic-bezier(0.2,0.8,0.4,1), opacity 1s ease`,
        transform:  `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rotation}deg)`,
        opacity:    '0',
      });
    }, 10 + i * 7);

    // Remove from DOM after animation
    setTimeout(() => particle.remove(), 1800);
  }
}


/* ════════════════════════════════════════════════════════════
   18. CONTACT FORM
   Simple form with validation — simulates sending.
   ════════════════════════════════════════════════════════════ */

function sendMessage(event) {
  if (event) event.preventDefault();

  const name    = getValue('c-name').trim();
  const email   = getValue('c-email').trim();
  const subject = getValue('c-subject').trim();
  const message = getValue('c-message').trim();

  // Validate
  if (!name || !email || !message) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // allow the form to submit to submit_contact.php
  const form = document.getElementById('contact-form');
  if (form) {
    form.submit();
  }
}

// Contact form submit binding
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', sendMessage);
  }
});


/* ════════════════════════════════════════════════════════════
   19. FLOATING BUTTONS
   Fab buttons appear/disappear based on scroll position.
   (Most scroll logic is already in the navbar scroll handler)
   ════════════════════════════════════════════════════════════ */
// Handled in section 6 (navbar scroll listener above)


/* ════════════════════════════════════════════════════════════
   20. TOAST NOTIFICATIONS
   Small message bar that pops up at the bottom.
   ════════════════════════════════════════════════════════════ */

function showToast(message, type) {
  const toast = el('toast');
  if (!toast) return;

  // Set the message and colour class
  toast.textContent = (type === 'success' ? '✓  ' : '✕  ') + message;
  toast.className   = 'toast show ' + type;

  // Clear any existing hide timer
  clearTimeout(toast._hideTimer);

  // Hide after 4 seconds
  toast._hideTimer = setTimeout(function() {
    toast.classList.remove('show');
  }, 4000);
}


/* ════════════════════════════════════════════════════════════
   MODAL HELPERS
   Open and close any modal backdrop by its ID.
   ════════════════════════════════════════════════════════════ */

function openModal(modalId) {
  const modal = el(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';  // prevent background scroll
  }
}

function closeModal(modalId) {
  const modal = el(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Close modal when clicking the backdrop (outside the white box)
['booking-modal', 'success-modal'].forEach(function(id) {
  const modal = el(id);
  if (!modal) return;

  modal.addEventListener('click', function(event) {
    if (event.target === modal) closeModal(id);  // only if backdrop clicked
  });
});

// ESC key closes any open modal
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal('booking-modal');
    closeModal('success-modal');
  }
});


/* ════════════════════════════════════════════════════════════
   21. QUICK SEARCH
   The search bar above the fleet section.
   ════════════════════════════════════════════════════════════ */

function runSearch() {
  const city     = getValue('search-city');
  const from     = getValue('search-from');
  const to       = getValue('search-to');
  const type     = getValue('search-type');

  // Validate dates
  if (from && to && from >= to) {
    showToast('Return date must be after pick-up date.', 'error');
    return;
  }

  // Scroll down to fleet section
  el('fleet')?.scrollIntoView({ behavior: 'smooth' });

  // Apply category filter if a type was selected
  if (type) {
    const tabButton = document.querySelector(`.tab[data-cat="${type}"]`);
    if (tabButton) {
      setTimeout(() => filterVehicles(type, tabButton), 600);
    }
  }

  showToast(
    `Showing${type ? ' ' + type : ' all'} vehicles${city ? ' in ' + city : ''}! ✓`,
    'success'
  );
}


/* ════════════════════════════════════════════════════════════
   FOOTER YEAR
   Sets the year automatically so we don't need to update it.
   ════════════════════════════════════════════════════════════ */
const yearSpan = el('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


/* ════════════════════════════════════════════════════════════
   22. INIT — START EVERYTHING
   This runs when the HTML page has fully loaded.
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {

  // Build dynamic content from data
  buildFleetGrid();
  buildReviewSlider();

  // Start visual effects
  startParticles();
  startTypingEffect();
  startCounters();
  animateChips();
  setupScrollReveal();

  // Start the calculator with default values
  // updateCalc();

  // Set default dates in the quick search bar
  const today    = new Date();
  const tomorrow = new Date(today);
  const nextWeek = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  nextWeek.setDate(today.getDate() + 7);

  const formatISO = d => d.toISOString().split('T')[0];

  const searchFrom = el('search-from');
  const searchTo   = el('search-to');
  if (searchFrom) { searchFrom.min = formatISO(today); searchFrom.value = formatISO(tomorrow); }
  if (searchTo)   { searchTo.min   = formatISO(tomorrow); searchTo.value = formatISO(nextWeek); }

});
