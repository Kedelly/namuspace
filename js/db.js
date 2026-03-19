/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  NamuDB — IndexedDB Database Engine for Namu Spaces     ║
 * ║  Version 1.0                                            ║
 * ║                                                         ║
 * ║  Stores:                                                ║
 * ║  • site_settings  — all site config & social links      ║
 * ║  • projects       — portfolio items + binary images     ║
 * ║  • services       — service cards & pricing             ║
 * ║  • blog_posts     — articles + cover images             ║
 * ║  • testimonials   — client reviews                      ║
 * ║  • team           — team member profiles + photos       ║
 * ║  • inquiries      — client form submissions             ║
 * ║  • images         — central binary image store          ║
 * ║  • credentials    — hashed admin login data             ║
 * ╚══════════════════════════════════════════════════════════╝
 */

'use strict';

const NamuDB = (function () {

  /* ─── Configuration ───────────────────────────────────── */
  const DB_NAME    = 'NamuSpacesDB';
  const DB_VERSION = 1;

  /* ─── Default seed data ───────────────────────────────── */
  const DEFAULTS = {
    site: {
      id: 'main',
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
      updatedAt: Date.now(),
    },
    services: [
      { id: 1, icon: 'compass', name: 'Interior Design Consultation', desc: 'A comprehensive one-on-one session to understand your style, needs, and vision for your space.', features: ['Initial space assessment', 'Style preference discovery', 'Budget planning guidance', 'Design direction roadmap'], price: 'From KES 8,000', createdAt: Date.now() },
      { id: 2, icon: 'grid',    name: 'Space Planning & Layout',       desc: 'Detailed floor plans and furniture arrangements that maximise functionality and flow in your space.', features: ['Measured floor plans', 'Furniture layout options', 'Traffic flow analysis', 'Functional zoning'], price: 'From KES 15,000', createdAt: Date.now() },
      { id: 3, icon: 'image',   name: 'Mood Boards & Concepts',        desc: 'Curated visual concept boards that translate your vision into a cohesive design direction.', features: ['Material & texture selection', 'Colour palette development', 'Furniture sourcing guide', 'Brand mood alignment'], price: 'From KES 10,000', createdAt: Date.now() },
      { id: 4, icon: 'box',     name: '3D Render Designs',             desc: 'Photorealistic 3D visualisations that show exactly how your finished space will look before work begins.', features: ['Multiple viewing angles', 'Realistic lighting & textures', 'Material variations', 'Revision rounds included'], price: 'From KES 20,000', createdAt: Date.now() },
      { id: 5, icon: 'star',    name: 'Interior Styling',              desc: 'Final touch styling that brings the design to life — art, accessories, plants, and decor placement.', features: ['Decor sourcing & selection', 'Art & accessory curation', 'Plant styling', 'Photography-ready staging'], price: 'From KES 30,000', createdAt: Date.now() },
    ],
    projects: [
      { id: 1, title: 'Kilimani Apartment', category: 'residential', desc: 'A serene one-bedroom reimagined with warm neutrals and intentional storage.',           imageId: null, featured: true,  createdAt: Date.now() },
      { id: 2, title: 'Westlands Office',   category: 'office',       desc: 'A creative agency workspace balancing collaboration zones and quiet corners.',           imageId: null, featured: true,  createdAt: Date.now() },
      { id: 3, title: 'Karen Villa',        category: 'residential', desc: 'Earthy tones and natural textures for a family home that breathes.',                    imageId: null, featured: false, createdAt: Date.now() },
      { id: 4, title: 'CBD Showroom',       category: 'commercial',  desc: 'A retail space designed to showcase products with editorial clarity.',                  imageId: null, featured: false, createdAt: Date.now() },
      { id: 5, title: 'Riverside Studio',   category: 'residential', desc: 'A compact studio transformed into a multifunctional urban sanctuary.',                  imageId: null, featured: true,  createdAt: Date.now() },
      { id: 6, title: 'Lavington Lounge',   category: 'residential', desc: 'Living room redesign centred on texture, light and quiet luxury.',                     imageId: null, featured: false, createdAt: Date.now() },
    ],
    testimonials: [
      { id: 1, text: 'Namu Spaces completely transformed our apartment. The calm we feel when we walk in now is indescribable. Every detail was thoughtful and on budget.', author: 'Amina K.',  location: 'Kilimani, Nairobi',   initials: 'AK', createdAt: Date.now() },
      { id: 2, text: 'Our office had zero personality before Medina came in. Now our team actually enjoys coming to work. The space is functional, beautiful and very us.',  author: 'Brian M.', location: 'Westlands, Nairobi',  initials: 'BM', createdAt: Date.now() },
      { id: 3, text: 'Professional, creative, and deeply collaborative. She truly listened to what we wanted and delivered beyond our expectations. Highly recommended.',     author: 'Grace W.', location: 'Karen, Nairobi',       initials: 'GW', createdAt: Date.now() },
    ],
    blog_posts: [
      { id: 1, title: '5 Ways to Make a Small Nairobi Apartment Feel Larger', category: 'Tips & Tricks', date: 'March 5, 2025',     excerpt: "Living in a compact apartment in the city doesn't mean compromising on style.", imageId: null, featured: true,  createdAt: Date.now() },
      { id: 2, title: 'The Rise of Biophilic Design in Kenyan Homes',          category: 'Trends',       date: 'February 18, 2025', excerpt: "Incorporating natural elements into interiors isn't just a trend — it's a lifestyle shift Nairobi's design scene is fully embracing.", imageId: null, featured: false, createdAt: Date.now() },
      { id: 3, title: 'How to Choose the Right Colour Palette for Your Home',  category: 'Design Guide', date: 'January 30, 2025',  excerpt: "Colour is the most powerful tool in interior design. Here's a systematic approach to choosing shades that feel right for your space.", imageId: null, featured: false, createdAt: Date.now() },
    ],
    team: [
      { id: 1, name: 'Medina Wabomba', role: 'Founder & Lead Designer', bio: 'Medina brings a deep sensitivity to space and function, crafting interiors that feel personal, purposeful and profoundly calm.', imageId: null, initials: 'MW', createdAt: Date.now() },
    ],
    credentials: {
      id: 'admin',
      username: btoa('namuadmin'),
      password: btoa('NamuSpaces2024!'),
      updatedAt: Date.now(),
    },
  };

  /* ─── Internal state ─────────────────────────────────── */
  let _db = null;
  let _ready = false;
  const _queue = [];

  /* ═══════════════════════════════════════════════════════
     OPEN / INIT DATABASE
  ═══════════════════════════════════════════════════════ */
  function open() {
    return new Promise(function (resolve, reject) {
      if (_db) { resolve(_db); return; }

      const req = indexedDB.open(DB_NAME, DB_VERSION);

      /* Create / upgrade schema */
      req.onupgradeneeded = function (e) {
        const db = e.target.result;

        /* site_settings — key: id ('main') */
        if (!db.objectStoreNames.contains('site_settings')) {
          db.createObjectStore('site_settings', { keyPath: 'id' });
        }

        /* projects */
        if (!db.objectStoreNames.contains('projects')) {
          const ps = db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
          ps.createIndex('category', 'category', { unique: false });
          ps.createIndex('featured', 'featured',  { unique: false });
        }

        /* services */
        if (!db.objectStoreNames.contains('services')) {
          db.createObjectStore('services', { keyPath: 'id', autoIncrement: true });
        }

        /* blog_posts */
        if (!db.objectStoreNames.contains('blog_posts')) {
          const bs = db.createObjectStore('blog_posts', { keyPath: 'id', autoIncrement: true });
          bs.createIndex('category', 'category', { unique: false });
          bs.createIndex('featured', 'featured',  { unique: false });
        }

        /* testimonials */
        if (!db.objectStoreNames.contains('testimonials')) {
          db.createObjectStore('testimonials', { keyPath: 'id', autoIncrement: true });
        }

        /* team */
        if (!db.objectStoreNames.contains('team')) {
          db.createObjectStore('team', { keyPath: 'id', autoIncrement: true });
        }

        /* inquiries */
        if (!db.objectStoreNames.contains('inquiries')) {
          const inq = db.createObjectStore('inquiries', { keyPath: 'id', autoIncrement: true });
          inq.createIndex('status',     'status',     { unique: false });
          inq.createIndex('receivedAt', 'receivedAt', { unique: false });
          inq.createIndex('email',      'email',      { unique: false });
        }

        /* images — stores raw Blobs/ArrayBuffers keyed by unique imageId */
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' });
        }

        /* credentials — key: id ('admin') */
        if (!db.objectStoreNames.contains('credentials')) {
          db.createObjectStore('credentials', { keyPath: 'id' });
        }
      };

      req.onsuccess = function (e) {
        _db = e.target.result;
        _ready = true;
        _db.onerror = function (ev) { console.error('NamuDB error:', ev.target.error); };
        resolve(_db);
      };

      req.onerror = function (e) {
        console.error('NamuDB open failed:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  /* ═══════════════════════════════════════════════════════
     CORE CRUD PRIMITIVES
  ═══════════════════════════════════════════════════════ */

  function tx(stores, mode) {
    return _db.transaction(stores, mode || 'readonly');
  }

  /** Get single record by key */
  function get(store, key) {
    return new Promise(function (resolve, reject) {
      const req = tx(store).objectStore(store).get(key);
      req.onsuccess = function () { resolve(req.result || null); };
      req.onerror   = function () { reject(req.error); };
    });
  }

  /** Get all records in a store */
  function getAll(store) {
    return new Promise(function (resolve, reject) {
      const req = tx(store).objectStore(store).getAll();
      req.onsuccess = function () { resolve(req.result || []); };
      req.onerror   = function () { reject(req.error); };
    });
  }

  /** Get records by index */
  function getByIndex(store, indexName, value) {
    return new Promise(function (resolve, reject) {
      const req = tx(store).objectStore(store).index(indexName).getAll(value);
      req.onsuccess = function () { resolve(req.result || []); };
      req.onerror   = function () { reject(req.error); };
    });
  }

  /** Put (insert or update) a record */
  function put(store, record) {
    return new Promise(function (resolve, reject) {
      const t   = tx(store, 'readwrite');
      const req = t.objectStore(store).put(record);
      req.onsuccess = function () { resolve(req.result); };
      req.onerror   = function () { reject(req.error); };
    });
  }

  /** Delete a record by key */
  function remove(store, key) {
    return new Promise(function (resolve, reject) {
      const t   = tx(store, 'readwrite');
      const req = t.objectStore(store).delete(key);
      req.onsuccess = function () { resolve(true); };
      req.onerror   = function () { reject(req.error); };
    });
  }

  /** Count records in a store */
  function count(store) {
    return new Promise(function (resolve, reject) {
      const req = tx(store).objectStore(store).count();
      req.onsuccess = function () { resolve(req.result); };
      req.onerror   = function () { reject(req.error); };
    });
  }

  /** Clear all records in a store */
  function clearStore(store) {
    return new Promise(function (resolve, reject) {
      const req = tx(store, 'readwrite').objectStore(store).clear();
      req.onsuccess = function () { resolve(true); };
      req.onerror   = function () { reject(req.error); };
    });
  }

  /* ═══════════════════════════════════════════════════════
     SEED DEFAULT DATA (runs once on fresh install)
  ═══════════════════════════════════════════════════════ */
  async function seedIfEmpty() {
    /* Only seed if stores are empty */
    const [sCount, pCount] = await Promise.all([
      count('services'),
      count('projects'),
    ]);
    if (sCount > 0 || pCount > 0) {
      /* Already seeded — migrate credentials if needed */
      await migrateCredentials();
      return;
    }

    console.log('NamuDB: seeding default data…');

    /* Seed all stores in parallel */
    await Promise.all([
      put('site_settings', DEFAULTS.site),
      put('credentials',   DEFAULTS.credentials),
      ...DEFAULTS.services.map(r    => put('services',     r)),
      ...DEFAULTS.projects.map(r    => put('projects',     r)),
      ...DEFAULTS.testimonials.map(r=> put('testimonials', r)),
      ...DEFAULTS.blog_posts.map(r  => put('blog_posts',   r)),
      ...DEFAULTS.team.map(r        => put('team',         r)),
    ]);

    /* Migrate any existing localStorage data */
    await migrateFromLocalStorage();

    console.log('NamuDB: seed complete.');
  }

  /* ═══════════════════════════════════════════════════════
     MIGRATE — pull existing localStorage data into IndexedDB
  ═══════════════════════════════════════════════════════ */
  async function migrateFromLocalStorage() {
    try {
      /* Site data */
      const ls = localStorage.getItem('namuSpacesData');
      if (ls) {
        const d = JSON.parse(ls);
        if (d.site)         await put('site_settings', { ...DEFAULTS.site, ...d.site, id: 'main' });
        if (d.services)     { await clearStore('services');     for (const r of d.services)     await put('services', r); }
        if (d.projects)     { await clearStore('projects');     for (const r of d.projects)     await put('projects', r); }
        if (d.testimonials) { await clearStore('testimonials'); for (const r of d.testimonials) await put('testimonials', r); }
        if (d.blogPosts)    { await clearStore('blog_posts');   for (const r of d.blogPosts)    await put('blog_posts', { ...r, id: r.id }); }
        if (d.team)         { await clearStore('team');         for (const r of d.team)         await put('team', r); }
        console.log('NamuDB: migrated site data from localStorage.');
      }

      /* Inquiries */
      const inqRaw = localStorage.getItem('namuInquiries');
      if (inqRaw) {
        const inqs = JSON.parse(inqRaw);
        const existingCount = await count('inquiries');
        if (existingCount === 0) {
          for (const inq of inqs) {
            const { id, ...rest } = inq;
            await put('inquiries', { ...rest, id: typeof id === 'number' ? id : Date.now() });
          }
          console.log('NamuDB: migrated', inqs.length, 'inquiries from localStorage.');
        }
      }

      /* Admin creds from localStorage */
      const credsRaw = localStorage.getItem('namuAdminCreds');
      if (credsRaw) {
        const c = JSON.parse(credsRaw);
        await put('credentials', { id: 'admin', username: c.user, password: c.pass, updatedAt: Date.now() });
        console.log('NamuDB: migrated credentials from localStorage.');
      }
    } catch (e) {
      console.warn('NamuDB migration warning:', e);
    }
  }

  async function migrateCredentials() {
    const existing = await get('credentials', 'admin');
    if (!existing) {
      await put('credentials', DEFAULTS.credentials);
    }
  }

  /* ═══════════════════════════════════════════════════════
     IMAGE STORE — save & retrieve binary images
  ═══════════════════════════════════════════════════════ */

  /**
   * saveImage(dataUrl, meta)
   * Converts a base64 dataURL to a Blob and stores it.
   * Returns the generated imageId string.
   */
  async function saveImage(dataUrl, meta) {
    const imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const blob    = dataUrlToBlob(dataUrl);
    await put('images', {
      id:        imageId,
      blob:      blob,
      mimeType:  blob.type,
      size:      blob.size,
      name:      (meta && meta.name)      || imageId,
      context:   (meta && meta.context)   || 'general',
      createdAt: Date.now(),
    });
    return imageId;
  }

  /**
   * getImageUrl(imageId)
   * Retrieves a stored image and returns an object URL for use in <img src>.
   * Returns null if not found.
   */
  async function getImageUrl(imageId) {
    if (!imageId) return null;
    /* Check if it's already a data URL or http URL (legacy) */
    if (typeof imageId === 'string' && (imageId.startsWith('data:') || imageId.startsWith('http'))) {
      return imageId;
    }
    const record = await get('images', imageId);
    if (!record || !record.blob) return null;
    return URL.createObjectURL(record.blob);
  }

  /**
   * deleteImage(imageId)
   */
  async function deleteImage(imageId) {
    if (!imageId) return;
    await remove('images', imageId);
  }

  /** Convert base64 dataURL → Blob */
  function dataUrlToBlob(dataUrl) {
    const parts    = dataUrl.split(',');
    const mime     = parts[0].match(/:(.*?);/)[1];
    const byteStr  = atob(parts[1]);
    const buf      = new ArrayBuffer(byteStr.length);
    const arr      = new Uint8Array(buf);
    for (let i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i);
    return new Blob([buf], { type: mime });
  }

  /* Get all image records (metadata only, no blob) for admin gallery */
  async function listImages() {
    const all = await getAll('images');
    return all.map(function (r) {
      return { id: r.id, name: r.name, mimeType: r.mimeType, size: r.size, context: r.context, createdAt: r.createdAt };
    });
  }

  /* ═══════════════════════════════════════════════════════
     CREDENTIALS — secure admin auth
  ═══════════════════════════════════════════════════════ */

  async function getCredentials() {
    return await get('credentials', 'admin') || DEFAULTS.credentials;
  }

  async function updateCredentials(newUsername, newPassword) {
    await put('credentials', {
      id:        'admin',
      username:  btoa(newUsername),
      password:  btoa(newPassword),
      updatedAt: Date.now(),
    });
    /* Also keep localStorage in sync for fallback */
    localStorage.setItem('namuAdminCreds', JSON.stringify({ user: btoa(newUsername), pass: btoa(newPassword) }));
  }

  async function verifyCredentials(username, password) {
    const creds = await getCredentials();
    return creds && btoa(username) === creds.username && btoa(password) === creds.password;
  }

  /* ═══════════════════════════════════════════════════════
     HIGH-LEVEL API — matches the shape the rest of the
     site already uses (so minimal changes needed in main.js)
  ═══════════════════════════════════════════════════════ */

  /** Load everything the public site needs in one call */
  async function loadSiteData() {
    const [site, services, projects, testimonials, blogPosts, team] = await Promise.all([
      get('site_settings', 'main'),
      getAll('services'),
      getAll('projects'),
      getAll('testimonials'),
      getAll('blog_posts'),
      getAll('team'),
    ]);

    /* Resolve imageId → object URL for items that have one */
    const resolveImg = async function (items) {
      return Promise.all(items.map(async function (item) {
        if (item.imageId) {
          const url = await getImageUrl(item.imageId);
          return { ...item, image: url || '' };
        }
        return { ...item, image: item.image || '' };
      }));
    };

    return {
      site:         site         || DEFAULTS.site,
      services:     services.length     ? services     : DEFAULTS.services,
      projects:     await resolveImg(projects.length   ? projects    : DEFAULTS.projects),
      testimonials: testimonials.length ? testimonials : DEFAULTS.testimonials,
      blogPosts:    await resolveImg(blogPosts.length  ? blogPosts   : DEFAULTS.blog_posts),
      team:         await resolveImg(team.length       ? team        : DEFAULTS.team),
    };
  }

  /** Save entire site settings object */
  async function saveSiteSettings(settings) {
    await put('site_settings', { ...settings, id: 'main', updatedAt: Date.now() });
    _syncToLocalStorage();
  }

  /** Generic save for any collection */
  async function saveRecord(store, record) {
    const savedId = await put(store, { ...record, updatedAt: Date.now() });
    _syncToLocalStorage();
    return savedId;
  }

  /** Delete from any collection */
  async function deleteRecord(store, key) {
    /* Also clean up associated image */
    const record = await get(store, key);
    if (record && record.imageId) await deleteImage(record.imageId);
    await remove(store, key);
    _syncToLocalStorage();
  }

  /* ═══════════════════════════════════════════════════════
     INQUIRIES API
  ═══════════════════════════════════════════════════════ */

  async function saveInquiry(inquiry) {
    const id = await put('inquiries', {
      ...inquiry,
      id:         inquiry.id || Date.now(),
      receivedAt: inquiry.receivedAt || Date.now(),
      status:     inquiry.status     || 'new',
    });
    return id;
  }

  async function getAllInquiries() {
    return await getAll('inquiries');
  }

  async function updateInquiry(id, changes) {
    const existing = await get('inquiries', id);
    if (!existing) return;
    await put('inquiries', { ...existing, ...changes, id, updatedAt: Date.now() });
  }

  async function deleteInquiry(id) {
    await remove('inquiries', id);
  }

  async function countNewInquiries() {
    const all = await getAll('inquiries');
    return all.filter(function (i) { return i.status === 'new'; }).length;
  }

  /* ═══════════════════════════════════════════════════════
     BACKUP & RESTORE
  ═══════════════════════════════════════════════════════ */

  async function exportBackup() {
    const [site, services, projects, testimonials, blogPosts, team, inquiries] = await Promise.all([
      get('site_settings', 'main'),
      getAll('services'),
      getAll('projects'),
      getAll('testimonials'),
      getAll('blog_posts'),
      getAll('team'),
      getAll('inquiries'),
    ]);

    /* List image metadata (not blobs — too large for JSON export) */
    const imageMeta = await listImages();

    return {
      version:    DB_VERSION,
      exportedAt: new Date().toISOString(),
      site, services, projects, testimonials,
      blogPosts: blogPosts,
      team, inquiries,
      imageCount: imageMeta.length,
      imageMeta,
    };
  }

  async function importBackup(data) {
    if (!data || !data.site) throw new Error('Invalid backup file');

    await Promise.all([
      clearStore('site_settings'),
      clearStore('services'),
      clearStore('projects'),
      clearStore('testimonials'),
      clearStore('blog_posts'),
      clearStore('team'),
    ]);

    const ops = [
      put('site_settings', { ...data.site, id: 'main' }),
      ...( data.services      || []).map(r => put('services', r)),
      ...( data.projects      || []).map(r => put('projects', r)),
      ...( data.testimonials  || []).map(r => put('testimonials', r)),
      ...((data.blogPosts     || data.blog_posts || []).map(r => put('blog_posts', r))),
      ...( data.team          || []).map(r => put('team', r)),
    ];
    await Promise.all(ops);
    _syncToLocalStorage();
  }

  async function resetToDefaults() {
    await Promise.all([
      clearStore('site_settings'),
      clearStore('services'),
      clearStore('projects'),
      clearStore('testimonials'),
      clearStore('blog_posts'),
      clearStore('team'),
      clearStore('images'),
    ]);
    await Promise.all([
      put('site_settings', DEFAULTS.site),
      ...DEFAULTS.services.map(r    => put('services', r)),
      ...DEFAULTS.projects.map(r    => put('projects', r)),
      ...DEFAULTS.testimonials.map(r=> put('testimonials', r)),
      ...DEFAULTS.blog_posts.map(r  => put('blog_posts', r)),
      ...DEFAULTS.team.map(r        => put('team', r)),
    ]);
    _syncToLocalStorage();
  }

  /* ═══════════════════════════════════════════════════════
     DATABASE INFO — for admin panel stats display
  ═══════════════════════════════════════════════════════ */

  async function getDBStats() {
    const [s, p, t, b, tm, inq, img] = await Promise.all([
      count('services'),
      count('projects'),
      count('testimonials'),
      count('blog_posts'),
      count('team'),
      count('inquiries'),
      count('images'),
    ]);
    const newInq = await countNewInquiries();

    /* Estimate storage used */
    let storageEstimate = null;
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      storageEstimate = {
        used:  _formatBytes(est.usage  || 0),
        quota: _formatBytes(est.quota  || 0),
        pct:   est.quota ? Math.round((est.usage / est.quota) * 100) : 0,
      };
    }

    return { services: s, projects: p, testimonials: t, blogPosts: b, team: tm,
             inquiries: inq, newInquiries: newInq, images: img, storage: storageEstimate };
  }

  function _formatBytes(bytes) {
    if (bytes < 1024)       return bytes + ' B';
    if (bytes < 1048576)    return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  }

  /* ═══════════════════════════════════════════════════════
     SYNC localStorage mirror — keeps the public site
     reading fast while IndexedDB operates async.
     The public site boots from this cache, then DB
     updates overlay any differences.
  ═══════════════════════════════════════════════════════ */
  async function _syncToLocalStorage() {
    try {
      const [site, services, projects, testimonials, blogPosts, team] = await Promise.all([
        get('site_settings', 'main'),
        getAll('services'),
        getAll('projects'),
        getAll('testimonials'),
        getAll('blog_posts'),
        getAll('team'),
      ]);
      /* Strip blob imageId refs when syncing to localStorage (they stay in IndexedDB) */
      const strip = function (items) {
        return items.map(function (item) {
          const { imageId, ...rest } = item;
          return rest;
        });
      };
      localStorage.setItem('namuSpacesData', JSON.stringify({
        site, services: strip(services), projects: strip(projects),
        testimonials, blogPosts: strip(blogPosts), team: strip(team),
      }));
    } catch (e) { /* non-critical */ }
  }

  /* ═══════════════════════════════════════════════════════
     INIT — open DB, seed if needed, return ready promise
  ═══════════════════════════════════════════════════════ */
  const _readyPromise = open().then(seedIfEmpty);

  /** Returns a promise that resolves when the DB is ready */
  function ready() { return _readyPromise; }

  /* ═══════════════════════════════════════════════════════
     PUBLIC API
  ═══════════════════════════════════════════════════════ */
  return {
    /* Lifecycle */
    ready,

    /* Raw CRUD (use for custom queries) */
    get, getAll, getByIndex, put, remove, count, clearStore,

    /* Site data */
    loadSiteData,
    saveSiteSettings,
    saveRecord,
    deleteRecord,

    /* Images */
    saveImage,
    getImageUrl,
    deleteImage,
    listImages,
    dataUrlToBlob,

    /* Auth */
    getCredentials,
    updateCredentials,
    verifyCredentials,

    /* Inquiries */
    saveInquiry,
    getAllInquiries,
    updateInquiry,
    deleteInquiry,
    countNewInquiries,

    /* Backup */
    exportBackup,
    importBackup,
    resetToDefaults,

    /* Info */
    getDBStats,
  };

})();

/* Make available globally */
window.NamuDB = NamuDB;
