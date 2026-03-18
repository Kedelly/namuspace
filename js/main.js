/**
 * NAMU SPACES — Main JavaScript (v2 — fully fixed)
 * Uses event delegation so ALL dynamically injected buttons work immediately.
 * No setTimeout hacks. No re-init needed after rendering.
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   DEFAULT DATA
═══════════════════════════════════════════════════════════ */
const DEFAULT_DATA = {
  site: {
    name: 'Namu Spaces',
    tagline: 'Functional. Calm. Intentional Spaces.',
    email: 'wabombamedina60@gmail.com',
    phone: '+254 796 975 533',
    whatsapp: '254796975533',
    address: 'Design Studio, Nairobi',
    instagram: 'https://www.instagram.com/namu_spaces?igsh=YzljYTk1ODg3Zg==',
    tiktok: 'https://vm.tiktok.com/ZMHKoCaAnbgMd-tQvB0/',
    facebook: '#',
    pinterest: '#',
    heroHeadline: 'Where Spaces Become Sanctuaries',
    heroSubtitle: 'We design interiors that balance beauty and practicality — spaces that feel calm, intentional, and truly lived in.',
    yearsExperience: '5+',
    projectsCompleted: '80+',
    happyClients: '60+',
    citiesServed: '3',
  },
  services: [
    { id: 1, icon: 'compass', name: 'Interior Design Consultation',
      desc: 'A comprehensive one-on-one session to understand your style, needs, and vision for your space.',
      features: ['Initial space assessment', 'Style preference discovery', 'Budget planning guidance', 'Design direction roadmap'],
      price: 'From KES 8,000' },
    { id: 2, icon: 'grid', name: 'Space Planning & Layout',
      desc: 'Detailed floor plans and furniture arrangements that maximise functionality and flow in your space.',
      features: ['Measured floor plans', 'Furniture layout options', 'Traffic flow analysis', 'Functional zoning'],
      price: 'From KES 15,000' },
    { id: 3, icon: 'image', name: 'Mood Boards & Concepts',
      desc: 'Curated visual concept boards that translate your vision into a cohesive design direction.',
      features: ['Material & texture selection', 'Colour palette development', 'Furniture sourcing guide', 'Brand mood alignment'],
      price: 'From KES 10,000' },
    { id: 4, icon: 'box', name: '3D Render Designs',
      desc: 'Photorealistic 3D visualisations that show exactly how your finished space will look before work begins.',
      features: ['Multiple viewing angles', 'Realistic lighting & textures', 'Material variations', 'Revision rounds included'],
      price: 'From KES 25,000' },
    { id: 5, icon: 'star', name: 'Interior Styling',
      desc: 'Final touch styling that brings the design to life — art, accessories, plants, and decor placement.',
      features: ['Decor sourcing & selection', 'Art & accessory curation', 'Plant styling', 'Photography-ready staging'],
      price: 'From KES 20,000' },
  ],
  projects: [
    { id: 1, title: 'Kilimani Apartment', category: 'residential', desc: 'A serene one-bedroom reimagined with warm neutrals and intentional storage.', image: '', featured: true },
    { id: 2, title: 'Westlands Office',   category: 'office',       desc: 'A creative agency workspace balancing collaboration zones and quiet corners.', image: '', featured: true },
    { id: 3, title: 'Karen Villa',        category: 'residential', desc: 'Earthy tones and natural textures for a family home that breathes.', image: '', featured: false },
    { id: 4, title: 'CBD Showroom',       category: 'commercial',  desc: 'A retail space designed to showcase products with editorial clarity.', image: '', featured: false },
    { id: 5, title: 'Riverside Studio',   category: 'residential', desc: 'A compact studio transformed into a multifunctional urban sanctuary.', image: '', featured: true },
    { id: 6, title: 'Lavington Lounge',   category: 'residential', desc: 'Living room redesign centred on texture, light and quiet luxury.', image: '', featured: false },
  ],
  testimonials: [
    { id: 1, text: 'Namu Spaces completely transformed our apartment. The calm we feel when we walk in now is indescribable. Every detail was thoughtful and on budget.', author: 'Amina K.', location: 'Kilimani, Nairobi', initials: 'AK' },
    { id: 2, text: 'Our office had zero personality before Medina came in. Now our team actually enjoys coming to work. The space is functional, beautiful and very us.', author: 'Brian M.', location: 'Westlands, Nairobi', initials: 'BM' },
    { id: 3, text: 'Professional, creative, and deeply collaborative. She truly listened to what we wanted and delivered beyond our expectations. Highly recommended.', author: 'Grace W.', location: 'Karen, Nairobi', initials: 'GW' },
  ],
  blogPosts: [
    { id: 1, title: '5 Ways to Make a Small Nairobi Apartment Feel Larger', category: 'Tips & Tricks', date: 'March 5, 2025',
      excerpt: "Living in a compact apartment in the city doesn't mean compromising on style. These five design principles will open up your space.", image: '', featured: true },
    { id: 2, title: 'The Rise of Biophilic Design in Kenyan Homes', category: 'Trends', date: 'February 18, 2025',
      excerpt: "Incorporating natural elements into interiors isn't just a trend — it's a lifestyle shift that Nairobi's design scene is fully embracing.", image: '', featured: false },
    { id: 3, title: 'How to Choose the Right Colour Palette for Your Home', category: 'Design Guide', date: 'January 30, 2025',
      excerpt: "Colour is the most powerful tool in interior design. Here's a systematic approach to choosing shades that feel right for your space and personality.", image: '', featured: false },
  ],
  team: [
    { id: 1, name: 'Medina Wabomba', role: 'Founder & Lead Designer',
      bio: 'Medina brings a deep sensitivity to space and function, crafting interiors that feel personal, purposeful and profoundly calm.', image: '', initials: 'MW' },
  ],
};

/* ════════════════════════════════════════════════════════════
   DATA — dual-path loader
   Fast path : localStorage cache  (synchronous, instant render)
   Live path : NamuDB IndexedDB    (async, resolves real images)
   Pages render immediately from cache, then DB overlay patches
   in any differences (especially uploaded images).
═══════════════════════════════════════════════════════════ */
function getData() {
  /* Synchronous fast-path from localStorage cache */
  try {
    const stored = localStorage.getItem('namuSpacesData');
    if (stored) {
      const p = JSON.parse(stored);
      return {
        site:        { ...DEFAULT_DATA.site,        ...(p.site        || {}) },
        services:     p.services      || DEFAULT_DATA.services,
        projects:     p.projects      || DEFAULT_DATA.projects,
        testimonials: p.testimonials  || DEFAULT_DATA.testimonials,
        blogPosts:    p.blogPosts     || DEFAULT_DATA.blogPosts,
        team:         p.team          || DEFAULT_DATA.team,
      };
    }
  } catch (e) { /* fall through */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

/**
 * getDataLive() — async, pulls from IndexedDB via NamuDB.
 * Called after initial render to patch in uploaded images & latest edits.
 */
async function getDataLive() {
  if (window.NamuDB) {
    try {
      await NamuDB.ready();
      return await NamuDB.loadSiteData();
    } catch (e) { /* fall back to cache */ }
  }
  return getData();
}

/** Re-render the current page with live DB data (patches images etc.) */
async function patchWithLiveData() {
  const data = await getDataLive();
  const page = document.body.dataset.page;
  const renderMap = {
    home:      () => renderHome(data),
    about:     () => renderAbout(data),
    services:  () => renderServices(data),
    portfolio: () => renderPortfolio(data),
    blog:      () => renderBlog(data),
    contact:   () => renderContact(data),
  };
  if (renderMap[page]) {
    renderMap[page]();
    initReveal();
    initCounters();
    initImageFades();
  }
  renderNav(data);
  renderFooter(data);
  renderWhatsApp(data);
  renderInquiryModal(data);
}

/* ════════════════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════════════ */
const ICONS = {
  compass:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  grid:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  image:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  box:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  star:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  arrow:     '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
  tiktok:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.21 8.21 0 004.81 1.54V6.78a4.85 4.85 0 01-1.04-.09z"/></svg>',
  facebook:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>',
  whatsapp:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
};

/* ════════════════════════════════════════════════════════════
   IMAGE LIBRARY — Unsplash CDN
   Free-to-use photos (Unsplash License). Served via Unsplash's
   own CDN with auto-format, compression & responsive sizing.
   Replace any URL with your own Unsplash/Cloudinary/imgix URL.
═══════════════════════════════════════════════════════════ */
var IMAGES = {
  /* Hero full-bleed */
  hero:    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&h=1000&fit=crop&auto=format&q=85',

  /* About section stack */
  about1:  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&h=700&fit=crop&auto=format&q=80',
  about2:  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&auto=format&q=80',

  /* Team photo */
  team1:   'https://69a5fa9b581800b707fb4b6e.imgix.net/newimage/Alhamdulillahi%20Nimeiva%E2%9D%A4%EF%B8%8F%F0%9F%A5%B5%F0%9F%A4%97%F0%9F%8C%B8_MUA%20_tiffanydontez(WEBP)_0.webp?w=1080&h=1080',

  /* Portfolio projects — curated interior design photos */
  proj1:   'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=800&fit=crop&auto=format&q=80',
  proj2:   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop&auto=format&q=80',
  proj3:   'https://69a5fa9b581800b707fb4b6e.imgix.net/A-beautiful-interior-design-image-of-a-living-room.-Warm-beige-creates-a-calm-inviting-atmosphere.-Pairs-beautifully-with-wood,-brass-and-textured-fabric-measuring-1400px-by-1000px-991295.png?w=1024&h=1024',
  proj4:   'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&h=600&fit=crop&auto=format&q=80',
  proj5:   'https://images.unsplash.com/photo-1583845112203-29329902332e?w=900&h=700&fit=crop&auto=format&q=80',
  proj6:   'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&h=600&fit=crop&auto=format&q=80',

  /* Blog article covers */
  blog1:   'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&h=600&fit=crop&auto=format&q=80',
  blog2:   'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=900&h=600&fit=crop&auto=format&q=80',
  blog3:   'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&h=600&fit=crop&auto=format&q=80',
};

/* Ordered project image keys — maps project index to photo */
var PROJECT_IMGS = ['proj1','proj2','proj3','proj4','proj5','proj6'];
/* Ordered blog image keys */
var BLOG_IMGS    = ['blog1','blog2','blog3'];

/**
 * cloudImg(key, alt, style)
 * Returns a responsive <img> from the IMAGES library.
 */
function cloudImg(key, alt, style) {
  alt   = alt   || '';
  style = style || 'width:100%;height:100%;object-fit:cover;display:block';
  var src = IMAGES[key];
  if (src) return '<img src="' + src + '" alt="' + alt + '" loading="lazy" decoding="async" style="' + style + '">';
  return '';
}

/* Fallback gradient (used when no cloud image is set) */
function getBg(seed) {
  var g = [
    'linear-gradient(135deg,#C4A882,#B5714A)',
    'linear-gradient(135deg,#7A5C3E,#3D5247)',
    'linear-gradient(135deg,#E8DCC8,#C4A882)',
    'linear-gradient(135deg,#B5714A,#7A5C3E)',
    'linear-gradient(135deg,#3D5247,#2A2A2A)',
    'linear-gradient(135deg,#A8B4A0,#7A5C3E)',
  ];
  return g[Math.abs(seed) % g.length];
}

/* ════════════════════════════════════════════════════════════
   MODAL — event delegation on document (works on any dynamic content)
═══════════════════════════════════════════════════════════ */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', function(e) {
  /* Open */
  const opener = e.target.closest('[data-modal]');
  if (opener) { openModal(opener.dataset.modal); return; }
  /* Close button */
  const closer = e.target.closest('.modal-close');
  if (closer) { const m = closer.closest('.modal-overlay'); if (m) closeModal(m.id); return; }
  /* Click backdrop */
  if (e.target.classList.contains('modal-overlay')) { closeModal(e.target.id); return; }
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
});

/* ════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
function showToast(msg, dur = 3500) {
  let t = document.getElementById('global-toast');
  if (!t) { t = document.createElement('div'); t.id = 'global-toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

/* ════════════════════════════════════════════════════════════
   PAGE LOADER
═══════════════════════════════════════════════════════════ */
function initLoader() {
  const hide = () => { const l = document.getElementById('page-loader'); if (l) l.classList.add('hidden'); };
  if (document.readyState === 'complete') setTimeout(hide, 600);
  else window.addEventListener('load', () => setTimeout(hide, 600));
}

/* ════════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════ */
function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger toggle — delegated */
  document.addEventListener('click', function(e) {
    const toggle = e.target.closest('.nav-toggle');
    if (!toggle) return;
    const isOpen = toggle.classList.toggle('active');
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
      if (isOpen) menu.classList.add('open');
      else menu.classList.remove('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  });

  /* Close mobile menu on link click */
  document.addEventListener('click', function(e) {
    const link = e.target.closest('.mobile-menu a, .mobile-menu button');
    if (!link) return;
    const menu = document.querySelector('.mobile-menu');
    const toggle = document.querySelector('.nav-toggle');
    if (menu) menu.classList.remove('open');
    if (toggle) toggle.classList.remove('active');
    document.body.style.overflow = '';
  });
}

/* ════════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════ */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════════════════ */
function initCounters() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.dataset.target || el.textContent;
      const num = parseInt(raw.replace(/\D/g, ''), 10);
      if (isNaN(num)) return;
      obs.unobserve(el);
      const start = performance.now();
      const dur = 1800;
      (function tick(now) {
        const progress = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * num) + (progress >= 1 ? '+' : '');
        if (progress < 1) requestAnimationFrame(tick);
      })(start);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number[data-target]').forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════════════════════
   PORTFOLIO FILTER — delegated
═══════════════════════════════════════════════════════════ */
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cat = btn.dataset.filter;
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
  });
});

/* ════════════════════════════════════════════════════════════
   SAVE INQUIRY — stores to IndexedDB (NamuDB) and falls back
   to localStorage so the admin panel always receives it.
═══════════════════════════════════════════════════════════ */
function saveInquiryToStorage(formEl, source) {
  /* Collect field values by their label text */
  var fields = {};
  formEl.querySelectorAll('.form-group').forEach(function(group) {
    var lbl = group.querySelector('label');
    var inp = group.querySelector('input, select, textarea');
    if (lbl && inp && inp.value.trim()) {
      var key = lbl.textContent.replace(/\*/g,'').trim().toLowerCase();
      fields[key] = inp.value.trim();
    }
  });

  var inquiry = {
    id:         Date.now() + Math.floor(Math.random() * 9999),
    name:       fields['your name']        || fields['full name']  || fields['name']    || 'Unknown',
    email:      fields['email address']    || fields['email']      || '',
    phone:      fields['phone / whatsapp'] || fields['phone number'] || fields['phone'] || '',
    service:    fields['service interested in'] || fields['service'] || '',
    message:    fields['your message']     || fields['tell us about your space'] || fields['message'] || '',
    source:     source || 'Website Form',
    status:     'new',
    receivedAt: Date.now(),
    readAt:     null,
    completedAt:null,
    notes:      '',
  };

  /* Primary: IndexedDB via NamuDB */
  if (window.NamuDB) {
    NamuDB.ready().then(function() {
      NamuDB.saveInquiry(inquiry);
    }).catch(function() {});
  }

  /* Fallback mirror: localStorage (also keeps admin panel polling working) */
  try {
    var existing = [];
    try { existing = JSON.parse(localStorage.getItem('namuInquiries') || '[]'); } catch(x) {}
    existing.push(inquiry);
    localStorage.setItem('namuInquiries', JSON.stringify(existing));
  } catch(e) {}
}

/* ════════════════════════════════════════════════════════════
   CONTACT / INQUIRY FORMS — delegated submit handler
═══════════════════════════════════════════════════════════ */
document.addEventListener('submit', async function(e) {
  if (!e.target.matches('.contact-form, .inquiry-form')) return;
  e.preventDefault();
  const form   = e.target;
  const source = form.classList.contains('inquiry-form') ? 'Book Consultation Modal' : 'Contact Page Form';
  const btn    = form.querySelector('button[type="submit"]');
  const orig   = btn.innerHTML;

  btn.textContent = 'Sending\u2026';
  btn.disabled    = true;

  /* Save to localStorage for admin panel */
  saveInquiryToStorage(form, source);

  await new Promise(r => setTimeout(r, 1200));
  btn.innerHTML = orig;
  btn.disabled  = false;
  showToast('\u2713 Thank you! We\u2019ll be in touch within 24 hours.');
  form.reset();
  const overlay = form.closest('.modal-overlay');
  if (overlay) closeModal(overlay.id);
});

/* ════════════════════════════════════════════════════════════
   RENDER — NAV
═══════════════════════════════════════════════════════════ */
function renderNav(data) {
  const el = document.getElementById('navbar');
  if (!el) return;
  const d = data.site;
  const cur = location.pathname.split('/').pop() || 'index.html';
  const pages = [
    { href: 'index.html',     label: 'Home' },
    { href: 'about.html',     label: 'About' },
    { href: 'services.html',  label: 'Services' },
    { href: 'portfolio.html', label: 'Portfolio' },
    { href: 'blog.html',      label: 'Blog' },
    { href: 'contact.html',   label: 'Contact' },
  ];
  el.innerHTML = `
    <div class="container">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">
          <img src="images/namu-logo.jpg" alt="Namu Spaces Logo" class="nav-logo-img">
          <div class="nav-logo-text">
            <span class="nav-logo-name">${d.name}</span>
            <span class="nav-logo-tagline">Interior Design Studio</span>
          </div>
        </a>
        <nav class="nav-links">
          ${pages.map(p => `<a href="${p.href}"${p.href === cur ? ' style="color:var(--terracotta)"' : ''}>${p.label}</a>`).join('')}
          <button class="btn nav-cta" data-modal="inquiry-modal">Book Consultation</button>
        </nav>
        <button class="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
      </div>
    </div>
    <div class="mobile-menu">
      <img src="images/namu-logo.jpg" alt="Namu Spaces" class="mobile-menu-logo">
      ${pages.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}
      <button class="btn btn-primary" data-modal="inquiry-modal" style="margin-top:8px">Book Consultation</button>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   RENDER — FOOTER
═══════════════════════════════════════════════════════════ */
function renderFooter(data) {
  const el = document.getElementById('footer');
  if (!el) return;
  const d = data.site;
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="footer-logo-wrap">
            <img src="images/namu-logo.jpg" alt="Namu Spaces" class="footer-logo-img">
            <div class="footer-logo-text">
              <span class="logo-mark">${d.name}</span>
              <span class="logo-tagline">Interior Design · Nairobi</span>
            </div>
          </a>
          <p>Thoughtful interiors for how you actually live. From consultation to final styling, we shape spaces that feel like home.</p>
          <div class="footer-social">
            <a href="${d.instagram}" target="_blank" rel="noopener" class="social-link" title="Instagram">${ICONS.instagram}</a>
            <a href="${d.tiktok}"    target="_blank" rel="noopener" class="social-link" title="TikTok">${ICONS.tiktok}</a>
            <a href="${d.facebook}"  target="_blank" rel="noopener" class="social-link" title="Facebook">${ICONS.facebook}</a>
            <a href="${d.pinterest}" target="_blank" rel="noopener" class="social-link" title="Pinterest">${ICONS.pinterest}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Pages</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="portfolio.html">Portfolio</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Services</h4>
          <ul>${data.services.map(s => `<li><a href="services.html">${s.name}</a></li>`).join('')}</ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:${d.email}">${d.email}</a></li>
            <li><a href="tel:${d.phone.replace(/\s/g, '')}">${d.phone}</a></li>
            <li><span style="color:rgba(245,240,232,.5)">${d.address}</span></li>
            <li style="margin-top:16px"><a href="https://wa.me/${d.whatsapp}" target="_blank" rel="noopener" style="color:var(--mist)">WhatsApp us \u2192</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-copy">\u00a9 ${new Date().getFullYear()} ${d.name}. All rights reserved.</span>
        <span class="footer-copy">Nairobi, Kenya \u00b7 Interior Design</span>
      </div>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   RENDER — WHATSAPP
═══════════════════════════════════════════════════════════ */
function renderWhatsApp(data) {
  const el = document.getElementById('whatsapp-float');
  if (!el) return;
  const msg = encodeURIComponent("Hello Namu Spaces! I'd like to enquire about your interior design services.");
  el.innerHTML = `
    <span class="whatsapp-tooltip">Chat on WhatsApp</span>
    <a href="https://wa.me/${data.site.whatsapp}?text=${msg}" target="_blank" rel="noopener" class="whatsapp-btn" aria-label="WhatsApp">${ICONS.whatsapp}</a>`;
}

/* ════════════════════════════════════════════════════════════
   RENDER — INQUIRY MODAL
═══════════════════════════════════════════════════════════ */
function renderInquiryModal(data) {
  const el = document.getElementById('inquiry-modal');
  if (!el) return;
  el.innerHTML = `
    <div class="modal">
      <button class="modal-close" aria-label="Close">\u2715</button>
      <span class="section-label">Get Started</span>
      <h3 class="display-sm">Book a Consultation</h3>
      <p style="color:var(--bark);margin-bottom:32px">Let's talk about your space. Fill in the form and we'll reach out within 24 hours.</p>
      <form class="inquiry-form">
        <div class="form-row">
          <div class="form-group"><label>Your Name *</label><input type="text" placeholder="Full name" required></div>
          <div class="form-group"><label>Phone / WhatsApp *</label><input type="tel" placeholder="+254 700 000 000" required></div>
        </div>
        <div class="form-group"><label>Email Address *</label><input type="email" placeholder="your@email.com" required></div>
        <div class="form-group">
          <label>Service Interested In</label>
          <select><option value="">Select a service\u2026</option>${data.services.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Tell Us About Your Space</label><textarea placeholder="Location, size, style preferences, budget range\u2026"></textarea></div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Send Inquiry ${ICONS.arrow}</button>
      </form>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   PAGE: HOME
═══════════════════════════════════════════════════════════ */
function renderHome(data) {
  const d = data.site;

  var hero = document.getElementById('hero');
  if (hero) {
    hero.innerHTML = `
      <div class="hero-bg">
        <div class="hero-bg-img" style="background-image:url('${IMAGES.hero}');background-size:cover;background-position:center"></div>
        <div class="hero-image-overlay"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-eyebrow">
          <div class="hero-eyebrow-line"></div>
          <span class="hero-eyebrow-text">Interior Design Studio \u00b7 Nairobi, Kenya</span>
        </div>
        <h1 class="display-xl hero-title">${d.heroHeadline}</h1>
        <p class="hero-desc">${d.heroSubtitle}</p>
        <div class="hero-ctas">
          <button class="btn btn-primary" data-modal="inquiry-modal">Book a Consultation ${ICONS.arrow}</button>
          <a href="portfolio.html" class="btn btn-outline-white">View Our Work</a>
        </div>
      </div>
      <div class="hero-scroll"><span class="hero-scroll-text">Scroll</span><div class="hero-scroll-line"></div></div>`;
  }

  const statsBar = document.getElementById('stats-bar');
  if (statsBar) {
    const items = [
      { n: d.yearsExperience,   l: 'Years of Experience' },
      { n: d.projectsCompleted, l: 'Projects Completed' },
      { n: d.happyClients,      l: 'Happy Clients' },
      { n: d.citiesServed,      l: 'Cities Served' },
    ];
    statsBar.innerHTML = `<div class="container"><div class="stats-inner">${
      items.map((s, i) => `
        <div class="stat-item reveal reveal-delay-${i+1}">
          <div class="stat-number" data-target="${s.n}">${s.n}</div>
          <div class="stat-label">${s.l}</div>
        </div>`).join('')
    }</div></div>`;
  }

  const svc = document.getElementById('services-preview');
  if (svc) {
    svc.innerHTML = `<div class="container">
      <div class="section-header reveal">
        <span class="section-label">What We Do</span>
        <h2 class="display-md section-title">Our Services</h2>
        <p class="section-subtitle">From first consultation to final styling, we handle every aspect of your interior transformation.</p>
      </div>
      <div class="services-grid">
        ${data.services.map((s, i) => `
          <div class="service-card reveal reveal-delay-${(i%3)+1}">
            <div class="service-icon">${ICONS[s.icon] || ICONS.star}</div>
            <span class="service-number">0${i+1}</span>
            <h3 class="service-name">${s.name}</h3>
            <p class="service-desc">${s.desc}</p>
            <span class="service-price">${s.price}</span>
          </div>`).join('')}
      </div>
      <div style="text-align:center;margin-top:56px" class="reveal">
        <a href="services.html" class="btn btn-secondary">All Services ${ICONS.arrow}</a>
      </div>
    </div>`;
  }

  const port = document.getElementById('portfolio-preview');
  if (port) {
    const featured = data.projects.filter(p => p.featured).slice(0, 5);
    const layouts = ['span-8 tall', 'span-4', 'span-4', 'span-4 tall', 'span-8'];
    port.innerHTML = `<div class="container">
      <div class="section-header reveal">
        <span class="section-label">Our Work</span>
        <h2 class="display-md section-title">Featured Projects</h2>
      </div>
      <div class="portfolio-grid">
        ${featured.map((p, i) => `
          <div class="portfolio-item ${layouts[i] || 'span-6'}" data-category="${p.category}">
            <div class="portfolio-img" style="background:${getBg(p.id)}">
              ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : cloudImg(PROJECT_IMGS[i] || PROJECT_IMGS[0], p.title)}
            </div>
            <div class="portfolio-overlay">
              <span class="portfolio-tag">${p.category}</span>
              <h3 class="portfolio-title-card">${p.title}</h3>
            </div>
          </div>`).join('')}
      </div>
      <div style="text-align:center;margin-top:56px" class="reveal">
        <a href="portfolio.html" class="btn btn-secondary">View Full Portfolio ${ICONS.arrow}</a>
      </div>
    </div>`;
  }

  const abt = document.getElementById('about-preview');
  if (abt) {
    abt.innerHTML = `<div class="container">
      <div class="grid-2" style="gap:80px;align-items:center">
        <div class="about-image-stack reveal" style="height:520px">
          <div class="about-img-main" style="background:${getBg(1)}">
            ${data.team[0] && data.team[0].image ? `<img src="${data.team[0].image}" alt="${data.team[0].name}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : cloudImg('about1','Namu Spaces interior')}
          </div>
          <div class="about-img-accent" style="background:${getBg(2)}">
            ${cloudImg('about2','Beautiful interior design')}
          </div>
          <div class="about-accent-badge">
            <span class="badge-number">${d.yearsExperience}</span>
            <span class="badge-text">Years Creating<br>Beautiful Spaces</span>
          </div>
        </div>
        <div class="reveal">
          <span class="section-label">About Us</span>
          <h2 class="display-md section-title" style="margin-top:16px">Spaces That Feel Like Home</h2>
          <p style="font-size:17px;color:var(--bark);line-height:1.8;margin-bottom:20px">Namu Spaces is a Kenyan interior design studio focused on creating thoughtful, functional and beautiful interiors that balance aesthetics and practicality.</p>
          <p style="font-size:15px;color:var(--bark);line-height:1.8;margin-bottom:40px">From concept development to space planning and styling, we work closely with our clients to bring their vision to life while respecting their budget and lifestyle.</p>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <a href="about.html" class="btn btn-primary">Our Story ${ICONS.arrow}</a>
            <button class="btn btn-ghost" data-modal="inquiry-modal">Get in Touch</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  const testi = document.getElementById('testimonials');
  if (testi) {
    testi.innerHTML = `<div class="container">
      <div class="section-header centered reveal">
        <span class="section-label">Client Stories</span>
        <h2 class="display-md section-title" style="color:var(--cream)">What Our Clients Say</h2>
      </div>
      <div class="testimonial-grid">
        ${data.testimonials.map((t, i) => `
          <div class="testimonial-card reveal reveal-delay-${i+1}">
            <span class="testimonial-quote-mark">"</span>
            <div class="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <p class="testimonial-text">${t.text}</p>
            <div class="testimonial-author">
              <div class="author-avatar">${t.initials}</div>
              <div><div class="author-name">${t.author}</div><div class="author-location">${t.location}</div></div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  }

  const blg = document.getElementById('blog-preview');
  if (blg) {
    const posts = data.blogPosts.slice(0, 3);
    blg.innerHTML = `<div class="container">
      <div class="section-header reveal" style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;flex-wrap:wrap;gap:16px">
        <div><span class="section-label">Journal</span><h2 class="display-md section-title" style="margin:0">Design Insights</h2></div>
        <a href="blog.html" class="btn btn-ghost">All Articles</a>
      </div>
      <div class="blog-grid">
        ${posts.map((p, i) => `
          <div class="blog-card ${i === 0 ? 'featured' : ''} reveal reveal-delay-${i+1}">
            <div class="blog-img" style="background:${getBg(p.id+5)}">
              ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : cloudImg(BLOG_IMGS[i] || BLOG_IMGS[0], p.title)}
            </div>
            <div class="blog-content">
              <div class="blog-meta"><span class="blog-cat">${p.category}</span><span class="blog-date">${p.date}</span></div>
              <h3 class="blog-title">${p.title}</h3>
              <p class="blog-excerpt">${p.excerpt}</p>
              <a href="blog.html" class="read-more">Read Article ${ICONS.arrow}</a>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  }
}

/* ════════════════════════════════════════════════════════════
   PAGE: ABOUT
═══════════════════════════════════════════════════════════ */
function renderAbout(data) {
  const main = document.getElementById('about-main');
  if (!main) return;
  main.innerHTML = `
    <section style="background:var(--cream);padding:var(--section-pad) 0">
      <div class="container">
        <div class="grid-2" style="gap:80px;align-items:center">
          <div class="reveal">
            <span class="section-label">Our Story</span>
            <h2 class="display-md section-title" style="margin:16px 0 24px">Born From a Love of Thoughtful Spaces</h2>
            <p style="font-size:17px;color:var(--bark);line-height:1.85;margin-bottom:20px">Namu Spaces is a Kenyan interior design studio focused on creating thoughtful, functional and beautiful interiors. We design spaces that balance aesthetics and practicality ensuring every room feels calm, intentional and truly lived in.</p>
            <p style="font-size:16px;color:var(--bark);line-height:1.85;margin-bottom:20px">From concept development to space planning and styling, we work closely with our clients to bring their vision to life while respecting their budget and lifestyle.</p>
            <p style="font-size:16px;color:var(--bark);line-height:1.85">At Namu Spaces, we believe that good design is not about creating trends \u2014 it is about creating spaces that feel like home.</p>
          </div>
          <div class="about-image-stack reveal" style="height:500px">
            <div class="about-img-main" style="background:${getBg(3)}">${cloudImg('about1','Interior design studio')}</div>
            <div class="about-img-accent" style="background:${getBg(4)}">${cloudImg('about2','Beautiful living space')}</div>
            <div class="about-accent-badge">
              <span class="badge-number">${data.site.projectsCompleted}</span>
              <span class="badge-text">Projects<br>Completed</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style="padding:var(--section-pad) 0">
      <div class="container">
        <div class="grid-2" style="gap:80px;align-items:start">
          <div class="reveal">
            <span class="section-label">Mission</span>
            <h2 class="display-sm section-title" style="margin:16px 0 24px">Our Mission</h2>
            <p style="font-size:17px;color:var(--bark);line-height:1.85">To create functional, calm, and intentional interiors that reflect each client's lifestyle and personality.</p>
          </div>
          <div class="reveal reveal-delay-2">
            <span class="section-label">Vision</span>
            <h2 class="display-sm section-title" style="margin:16px 0 24px">Our Vision</h2>
            <p style="font-size:17px;color:var(--bark);line-height:1.85">To be a trusted interior design studio in Kenya, transforming everyday spaces into beautiful, practical homes.</p>
          </div>
        </div>
      </div>
    </section>

    <section style="background:var(--cream);padding:var(--section-pad) 0">
      <div class="container">
        <div class="section-header centered reveal">
          <span class="section-label">Our Values</span>
          <h2 class="display-md section-title">What We Believe In</h2>
        </div>
        <div class="values-grid">
          ${[
            { icon: '\u25ce', title: 'Intentionality', desc: 'Every design decision has a purpose. We think deeply about how you live before placing a single piece of furniture.' },
            { icon: '\u25c8', title: 'Functionality',  desc: "Beautiful design means nothing if it doesn't work for your life. Practicality is always at the core of our process." },
            { icon: '\u25c7', title: 'Calm Aesthetic', desc: 'We create spaces that feel restful \u2014 spaces that lower your heart rate the moment you walk through the door.' },
            { icon: '\u25fb', title: 'Collaboration',  desc: 'Your input shapes every design. We listen deeply and translate your vision into spaces that feel authentically you.' },
          ].map((v, i) => `
            <div class="value-item reveal reveal-delay-${i+1}">
              <div style="font-size:28px;color:var(--terracotta)">${v.icon}</div>
              <h3 class="value-title">${v.title}</h3>
              <p class="value-desc">${v.desc}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section style="padding:var(--section-pad) 0">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-label">The Team</span>
          <h2 class="display-md section-title">The People Behind Namu</h2>
        </div>
        <div class="team-grid">
          ${data.team.map((m, i) => `
            <div class="team-card reveal reveal-delay-${i+1}">
              <div class="team-photo" style="background:${getBg(m.id + 10)}">
                ${m.image
                  ? `<img src="${m.image}" alt="${m.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`
                  : (i === 0 ? cloudImg('team1', m.name) : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:80px;color:rgba(255,255,255,.3)">${m.initials}</div>`)}
              </div>
              <h3 class="team-name">${m.name}</h3>
              <div class="team-role">${m.role}</div>
              <p class="team-bio">${m.bio}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
}

/* ════════════════════════════════════════════════════════════
   PAGE: SERVICES
═══════════════════════════════════════════════════════════ */
function renderServices(data) {
  const main = document.getElementById('services-main');
  if (!main) return;
  main.innerHTML = `
    <section style="padding:var(--section-pad) 0">
      <div class="container">
        <div class="section-header centered reveal" style="margin-bottom:80px">
          <span class="section-label">What We Offer</span>
          <h2 class="display-md section-title">Our Services</h2>
          <p class="section-subtitle">Every project is unique. Our services are designed to meet you wherever you are in your design journey.</p>
        </div>
        <div class="services-page-grid">
          ${data.services.map((s, i) => `
            <div class="service-page-card reveal reveal-delay-${(i%3)+1}">
              <div class="service-page-icon">${ICONS[s.icon] || ICONS.star}</div>
              <h3 class="service-page-name">${s.name}</h3>
              <p class="service-page-desc">${s.desc}</p>
              <ul class="service-features">
                ${s.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-top:24px">
                <span class="service-page-price">${s.price}</span>
                <button class="btn btn-ghost" data-modal="inquiry-modal" style="padding:10px 20px">Enquire</button>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </section>
    <section class="cta-banner">
      <div class="container" style="position:relative;z-index:1">
        <h2>Not Sure Where to Start?</h2>
        <p>Book a free 20-minute discovery call and we'll point you in the right direction.</p>
        <button class="btn btn-outline-white" data-modal="inquiry-modal">Book a Free Call ${ICONS.arrow}</button>
      </div>
    </section>`;
}

/* ════════════════════════════════════════════════════════════
   PAGE: PORTFOLIO
═══════════════════════════════════════════════════════════ */
function renderPortfolio(data) {
  const main = document.getElementById('portfolio-main');
  if (!main) return;
  const layouts = ['span-8 tall', 'span-4', 'span-6', 'span-6', 'span-4', 'span-8'];
  main.innerHTML = `
    <section style="padding:var(--section-pad) 0">
      <div class="container">
        <div class="section-header reveal" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:24px;margin-bottom:48px">
          <div>
            <span class="section-label">Our Projects</span>
            <h2 class="display-md section-title" style="margin:0">Portfolio</h2>
          </div>
          <div class="portfolio-filters">
            <button class="filter-btn active" data-filter="all">All Work</button>
            <button class="filter-btn" data-filter="residential">Residential</button>
            <button class="filter-btn" data-filter="commercial">Commercial</button>
            <button class="filter-btn" data-filter="office">Office</button>
          </div>
        </div>
        ${data.projects.length
          ? `<div class="portfolio-grid">${data.projects.map((p, i) => `
              <div class="portfolio-item ${layouts[i % layouts.length]}" data-category="${p.category}">
                <div class="portfolio-img" style="background:${getBg(p.id)}">
                  ${p.image
                    ? `<img src="${p.image}" alt="${p.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`
                    : cloudImg(PROJECT_IMGS[i] || PROJECT_IMGS[i % PROJECT_IMGS.length], p.title)}
                </div>
                <div class="portfolio-overlay">
                  <span class="portfolio-tag">${p.category}</span>
                  <h3 class="portfolio-title-card">${p.title}</h3>
                  <p style="font-size:13px;color:rgba(245,240,232,.7);margin-top:8px">${p.desc}</p>
                </div>
              </div>`).join('')}
            </div>`
          : `<p style="text-align:center;color:var(--bark);padding:80px 0">Projects coming soon.</p>`}
      </div>
    </section>
    <section class="cta-banner">
      <div class="container" style="position:relative;z-index:1">
        <h2>Have a Project in Mind?</h2>
        <p>Let's bring your vision to life.</p>
        <button class="btn btn-outline-white" data-modal="inquiry-modal">Start a Project ${ICONS.arrow}</button>
      </div>
    </section>`;
}

/* ════════════════════════════════════════════════════════════
   PAGE: BLOG
═══════════════════════════════════════════════════════════ */
function renderBlog(data) {
  const main = document.getElementById('blog-main');
  if (!main) return;
  main.innerHTML = `
    <section style="padding:var(--section-pad) 0">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-label">Design Journal</span>
          <h2 class="display-md section-title">Insights &amp; Inspiration</h2>
          <p class="section-subtitle">Thoughts on interior design, Nairobi living, and how to create spaces you love.</p>
        </div>
        ${data.blogPosts.length
          ? `<div class="blog-page-grid">${data.blogPosts.map((p, i) => `
              <div class="blog-card reveal reveal-delay-${(i%3)+1}">
                <div class="blog-img" style="background:${getBg(p.id+5)}">
                  ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : cloudImg(BLOG_IMGS[i % BLOG_IMGS.length], p.title)}
                </div>
                <div class="blog-content">
                  <div class="blog-meta"><span class="blog-cat">${p.category}</span><span class="blog-date">${p.date}</span></div>
                  <h3 class="blog-title">${p.title}</h3>
                  <p class="blog-excerpt">${p.excerpt}</p>
                  <a href="#" class="read-more">Read Article ${ICONS.arrow}</a>
                </div>
              </div>`).join('')}
            </div>`
          : `<p style="text-align:center;color:var(--bark);padding:80px 0">Articles coming soon.</p>`}
      </div>
    </section>
    <section class="cta-banner">
      <div class="container" style="position:relative;z-index:1">
        <h2>Ready to Transform Your Space?</h2>
        <p>Let's create something beautiful, functional and uniquely yours.</p>
        <button class="btn btn-outline-white" data-modal="inquiry-modal">Book a Consultation ${ICONS.arrow}</button>
      </div>
    </section>`;
}

/* ════════════════════════════════════════════════════════════
   PAGE: CONTACT
═══════════════════════════════════════════════════════════ */
function renderContact(data) {
  const main = document.getElementById('contact-main');
  if (!main) return;
  const d = data.site;
  main.innerHTML = `
    <section style="padding:var(--section-pad) 0;background:var(--cream)">
      <div class="container">
        <div class="contact-grid">
          <div class="reveal">
            <span class="section-label">Get In Touch</span>
            <h2 class="display-md section-title" style="margin:16px 0 32px">Let's Talk About Your Space</h2>
            <p style="font-size:17px;color:var(--bark);line-height:1.8;margin-bottom:48px">Whether you have a clear vision or no idea where to start, we'd love to hear from you.</p>

            <div class="contact-info-item">
              <div class="contact-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div class="contact-detail-label">Email</div>
                <a href="mailto:${d.email}" class="contact-detail-value">${d.email}</a>
              </div>
            </div>
            <div class="contact-info-item">
              <div class="contact-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.1 2.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
              </div>
              <div>
                <div class="contact-detail-label">Phone &amp; WhatsApp</div>
                <a href="tel:${d.phone.replace(/\s/g,'')}" class="contact-detail-value">${d.phone}</a>
              </div>
            </div>
            <div class="contact-info-item">
              <div class="contact-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div class="contact-detail-label">Location</div>
                <div class="contact-detail-value">${d.address}</div>
              </div>
            </div>

            <div class="business-hours">
              <h4 style="font-family:var(--font-body);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--bark);margin-bottom:8px;font-weight:500">Business Hours</h4>
              ${[
                { day: 'Monday \u2013 Friday', time: '8:00 AM \u2013 6:00 PM' },
                { day: 'Saturday',             time: '9:00 AM \u2013 3:00 PM' },
                { day: 'Sunday',               time: 'By Appointment' },
              ].map(h => `<div class="hours-row"><span class="day">${h.day}</span><span class="time">${h.time}</span></div>`).join('')}
            </div>

            <div style="margin-top:40px;display:flex;gap:12px;flex-wrap:wrap">
              <a href="https://wa.me/${d.whatsapp}" target="_blank" rel="noopener" class="btn btn-primary">${ICONS.whatsapp} WhatsApp Us</a>
              <a href="mailto:${d.email}" class="btn btn-secondary">Send Email ${ICONS.arrow}</a>
            </div>
          </div>

          <div class="reveal reveal-delay-2">
            <div class="contact-form-wrap">
              <h3 class="display-sm" style="margin-bottom:8px">Send a Message</h3>
              <p style="color:var(--bark);font-size:15px;margin-bottom:36px">We'll respond within 24 hours.</p>
              <form class="contact-form">
                <div class="form-row">
                  <div class="form-group"><label>Your Name *</label><input type="text" placeholder="Full name" required></div>
                  <div class="form-group"><label>Phone Number</label><input type="tel" placeholder="+254 700 000 000"></div>
                </div>
                <div class="form-group"><label>Email Address *</label><input type="email" placeholder="your@email.com" required></div>
                <div class="form-group">
                  <label>Service Interested In</label>
                  <select><option value="">Select a service\u2026</option>${data.services.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select>
                </div>
                <div class="form-group"><label>Your Message *</label><textarea placeholder="Tell us about your project or just say hello\u2026" required></textarea></div>
                <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Send Message ${ICONS.arrow}</button>
              </form>
            </div>
          </div>
        </div>

        <div class="map-placeholder reveal" style="margin-top:80px">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19891799643!2d36.70730744863286!3d-1.3028617917853957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1700000000000"
            width="100%" height="320" style="border:0;display:block" allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade" title="Namu Spaces \u2014 Nairobi, Kenya">
          </iframe>
        </div>
      </div>
    </section>`;
}

/* ════════════════════════════════════════════════════════════
   IMAGE LOAD HANDLER — fires .loaded on every <img> so
   the CSS shimmer fades out and the photo fades in smoothly.
═══════════════════════════════════════════════════════════ */
function initImageFades() {
  document.querySelectorAll(
    '.portfolio-img img, .blog-img img, .team-photo img, .about-img-main img, .about-img-accent img'
  ).forEach(function(img) {
    if (img.complete && img.naturalWidth) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load',  function() { img.classList.add('loaded'); });
      img.addEventListener('error', function() { img.style.display = 'none'; });
    }
  });
}

/* ════════════════════════════════════════════════════════════
   BOOT — DOMContentLoaded
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  /* 1. Instant render from localStorage cache */
  var data = getData();
  renderNav(data);
  renderFooter(data);
  renderWhatsApp(data);
  renderInquiryModal(data);

  var page = document.body.dataset.page;
  if (page === 'home')      renderHome(data);
  if (page === 'about')     renderAbout(data);
  if (page === 'services')  renderServices(data);
  if (page === 'portfolio') renderPortfolio(data);
  if (page === 'blog')      renderBlog(data);
  if (page === 'contact')   renderContact(data);

  /* 2. Init all interactive behaviours */
  initLoader();
  initNav();
  initReveal();
  initCounters();
  initImageFades();

  /* 3. Async patch — loads live data from IndexedDB (resolves uploaded images etc.) */
  if (window.NamuDB) {
    NamuDB.ready().then(function() {
      patchWithLiveData();
    }).catch(function() { /* stay on cache data */ });
  }
});

/* Expose globally */
window.NamuSpaces = { openModal: openModal, closeModal: closeModal, showToast: showToast, getData: getData };
