/* =========================================================
   KOPI TARLING — script.js
   Data produk & pengaturan disimpan di localStorage supaya
   perubahan dari admin.html langsung tampil di halaman utama.
   ========================================================= */

const STORE_KEYS = {
  products: 'kopitarling_products',
  settings: 'kopitarling_settings',
};

/* ---------- data awal (dipakai kalau localStorage kosong) ---------- */
const DEFAULT_SETTINGS = {
  danaNumber: '087722588201',
  briNumber: '421401026353537',
  briName: 'Krisdiyansah',
  waNumber: '6287722588201', // format internasional tanpa +
  address: 'Jalan Terisi, Indramayu, Jawa Barat',
  instagramUrl: 'https://www.instagram.com/krisdynsh?igsh=b2J6NHNsZmV3enVn&utm_source=qr',
  instagramHandle: '@krisdynsh',
};

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Kopi Tarling Signature', category: 'Kopi Susu', price: 22000, desc: 'Kopi susu gula aren dengan sentuhan kayu manis, resep andalan kedai.', image: '', available: true },
  { id: 'p2', name: 'Es Kopi Senja Pesisir', category: 'Kopi Susu', price: 20000, desc: 'Kopi susu creamy dipadu karamel laut, manis lembut menemani senja.', image: '', available: true },
  { id: 'p3', name: 'Kopi Suling Vanilla', category: 'Kopi Susu', price: 24000, desc: 'Espresso vanila lembut dengan foam susu tebal di atasnya.', image: '', available: true },
  { id: 'p4', name: 'Americano Waditra', category: 'Kopi Hitam', price: 15000, desc: 'Espresso hitam murni, pahit yang bersahabat untuk pagi hari.', image: '', available: true },
  { id: 'p5', name: 'Kopi Gedong Gincu', category: 'Kopi Hitam', price: 23000, desc: 'Kopi dipadu sirup mangga gedong gincu khas Indramayu.', image: '', available: true },
  { id: 'p6', name: 'Cappuccino Senar Emas', category: 'Kopi Susu', price: 21000, desc: 'Cappuccino creamy dengan taburan bubuk kayu manis keemasan.', image: '', available: true },
  { id: 'p7', name: 'Matcha Senja', category: 'Non-Kopi', price: 20000, desc: 'Matcha creamy untuk yang ingin bersantai tanpa kafein kopi.', image: '', available: true },
  { id: 'p8', name: 'Cokelat Tarling', category: 'Non-Kopi', price: 19000, desc: 'Cokelat panas atau dingin yang creamy dan bikin nyaman.', image: '', available: true },
  { id: 'p9', name: 'Roti Bakar Pesisir', category: 'Cemilan', price: 15000, desc: 'Roti bakar srikaya kelapa, teman pas untuk kopi hitam.', image: '', available: true },
  { id: 'p10', name: 'Pisang Goreng Krispi Madu', category: 'Cemilan', price: 12000, desc: 'Pisang goreng renyah disiram madu, cemilan favorit sore.', image: '', available: true },
];

/* ---------- helpers penyimpanan ---------- */
function getSettings() {
  try {
    const raw = localStorage.getItem(STORE_KEYS.settings);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}

function getProducts() {
  try {
    const raw = localStorage.getItem(STORE_KEYS.products);
    if (!raw) {
      localStorage.setItem(STORE_KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
      return [...DEFAULT_PRODUCTS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : [...DEFAULT_PRODUCTS];
  } catch (e) {
    return [...DEFAULT_PRODUCTS];
  }
}

function formatRupiah(num) {
  return 'Rp' + Number(num || 0).toLocaleString('id-ID');
}

/* ---------- ikon cangkir default untuk produk tanpa gambar ---------- */
function cupIconSVG() {
  return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:56%;height:56%;margin:auto;">
    <path d="M28 40h44v18a22 22 0 0 1-22 22 22 22 0 0 1-22-22z" stroke="#e7a33e" stroke-width="3" fill="none"/>
    <path d="M72 44h6a9 9 0 0 1 0 18h-4" stroke="#e7a33e" stroke-width="3" fill="none"/>
    <path d="M36 32c0-4 4-4 4-8M50 32c0-4 4-4 4-8M64 32c0-4 4-4 4-8" stroke="#f0b85c" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

/* ============ RENDER: pengaturan pembayaran ============ */
function applySettingsToDOM() {
  const s = getSettings();

  const danaEl = document.getElementById('danaNumber');
  const briEl = document.getElementById('briNumber');
  const waEl = document.getElementById('waNumber');
  if (danaEl) danaEl.textContent = formatPhoneDisplay(s.danaNumber);
  if (briEl) briEl.textContent = formatBriDisplay(s.briNumber);
  if (waEl) waEl.textContent = formatPhoneDisplay(s.danaNumber);

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    if (btn.closest('.pay-card')?.querySelector('h3')?.textContent.includes('DANA')) btn.setAttribute('data-copy', s.danaNumber);
    if (btn.closest('.pay-card')?.querySelector('h3')?.textContent.includes('BRI')) btn.setAttribute('data-copy', s.briNumber);
    if (btn.closest('.pay-card')?.querySelector('h3')?.textContent.includes('COD')) btn.setAttribute('data-copy', s.danaNumber);
  });

  const codBtn = document.getElementById('waCodBtn');
  if (codBtn) codBtn.href = `https://wa.me/${s.waNumber}?text=${encodeURIComponent('Halo Kopi Tarling, saya mau pesan dan COD ya.')}`;

  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((a) => {
    if (a.id === 'waCodBtn') return;
    if (!a.href.includes('text=')) {
      a.href = a.href.replace(/https:\/\/wa\.me\/\d+/, `https://wa.me/${s.waNumber}`);
    }
  });

  const briNameEls = document.querySelectorAll('.pay-card strong');
}

function formatPhoneDisplay(num) {
  const n = String(num).replace(/\D/g, '');
  return n.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
}
function formatBriDisplay(num) {
  const n = String(num).replace(/\D/g, '');
  return n.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/* ============ RENDER: menu ============ */
let currentFilter = 'Semua';

function renderFilters(products) {
  const wrap = document.getElementById('menuFilters');
  if (!wrap) return;
  const categories = ['Semua', ...new Set(products.map((p) => p.category))];
  wrap.innerHTML = categories
    .map((c) => `<button type="button" class="filter-chip${c === currentFilter ? ' is-active' : ''}" data-filter="${c}">${c}</button>`)
    .join('');

  wrap.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      currentFilter = chip.getAttribute('data-filter');
      wrap.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      renderMenu();
    });
  });
}

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  const settings = getSettings();
  const products = getProducts().filter((p) => p.available !== false);
  const list = currentFilter === 'Semua' ? products : products.filter((p) => p.category === currentFilter);

  if (!list.length) {
    grid.innerHTML = `<div class="menu-empty">Belum ada menu di kategori ini. Cek kategori lain, ya.</div>`;
    return;
  }

  grid.innerHTML = list
    .map((p, i) => {
      const media = p.image
        ? `<img src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy">`
        : cupIconSVG();
      const waText = encodeURIComponent(
        `Halo Kopi Tarling! Saya ingin memesan *${p.name}* seharga ${formatRupiah(p.price)}. Mohon info selanjutnya ya 🙏`
      );
      return `
      <div class="menu-card" style="--i:${i}">
        <div class="menu-card-media">
          <span class="menu-card-tag">${escapeHTML(p.category)}</span>
          ${media}
        </div>
        <div class="menu-card-body">
          <h3>${escapeHTML(p.name)}</h3>
          <p>${escapeHTML(p.desc || '')}</p>
          <div class="menu-card-foot">
            <span class="menu-price">${formatRupiah(p.price)}</span>
            <a class="menu-order-btn" target="_blank" rel="noopener" href="https://wa.me/${settings.waNumber}?text=${waText}">
              Pesan
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
      </div>`;
    })
    .join('');

  observeReveals();
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============ header scroll + nav mobile ============ */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  });

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('is-open');
    links.classList.toggle('is-open');
  });

  links?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      toggle?.classList.remove('is-open');
      links.classList.remove('is-open');
    })
  );
}

/* ============ reveal on scroll ============ */
function observeReveals() {
  const items = document.querySelectorAll('.reveal:not(.is-visible), .reveal-stagger:not(.is-visible)');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  items.forEach((el) => io.observe(el));
}

/* ============ steam particles di hero ============ */
function initSteamParticles() {
  const wrap = document.getElementById('steamParticles');
  if (!wrap) return;
  const count = 14;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.style.left = 15 + Math.random() * 70 + '%';
    span.style.animationDelay = Math.random() * 7 + 's';
    span.style.animationDuration = 5 + Math.random() * 4 + 's';
    wrap.appendChild(span);
  }
}

/* ============ salin ke clipboard ============ */
function initCopyButtons() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const value = btn.getAttribute('data-copy');
    navigator.clipboard
      ?.writeText(value)
      .then(() => showToast('Nomor tersalin: ' + value))
      .catch(() => showToast('Gagal menyalin, salin manual ya'));
  });
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

/* ============ init ============ */
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  applySettingsToDOM();
  renderFilters(getProducts());
  renderMenu();
  initHeader();
  initSteamParticles();
  initCopyButtons();
  observeReveals();
});

/* refresh otomatis kalau ada perubahan dari admin (tab lain) */
window.addEventListener('storage', (e) => {
  if (e.key === STORE_KEYS.products) renderMenu();
  if (e.key === STORE_KEYS.settings) applySettingsToDOM();
});
