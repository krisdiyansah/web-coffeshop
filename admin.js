/* =========================================================
   KOPI TARLING — admin.js
   Sistem CRUD produk + pengaturan pembayaran.
   Data disimpan di localStorage (browser) sebagai "database"
   demo. Lihat database.sql untuk skema jika ingin dihubungkan
   ke backend & database sungguhan (MySQL/PostgreSQL).
   ========================================================= */

const STORE_KEYS = {
  products: 'kopitarling_products',
  settings: 'kopitarling_settings',
  auth: 'kopitarling_admin_auth',
  session: 'kopitarling_admin_session',
};

const DEFAULT_SETTINGS = {
  danaNumber: '087722588201',
  briNumber: '421401026353537',
  briName: 'Krisdiyansah',
  waNumber: '6287722588201',
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

const DEFAULT_AUTH = { username: 'admin', password: 'kopitarling123' };

/* ---------- storage helpers ---------- */
function getAuth() {
  try {
    const raw = localStorage.getItem(STORE_KEYS.auth);
    return raw ? JSON.parse(raw) : { ...DEFAULT_AUTH };
  } catch (e) {
    return { ...DEFAULT_AUTH };
  }
}
function setAuth(auth) {
  localStorage.setItem(STORE_KEYS.auth, JSON.stringify(auth));
}

function getSettings() {
  try {
    const raw = localStorage.getItem(STORE_KEYS.settings);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}
function setSettings(s) {
  localStorage.setItem(STORE_KEYS.settings, JSON.stringify(s));
}

function getProducts() {
  try {
    const raw = localStorage.getItem(STORE_KEYS.products);
    if (!raw) {
      localStorage.setItem(STORE_KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
      return [...DEFAULT_PRODUCTS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_PRODUCTS];
  } catch (e) {
    return [...DEFAULT_PRODUCTS];
  }
}
function setProducts(list) {
  localStorage.setItem(STORE_KEYS.products, JSON.stringify(list));
}

function formatRupiah(num) {
  return 'Rp' + Number(num || 0).toLocaleString('id-ID');
}
function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ============ AUTH / LOGIN ============ */
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');

function isLoggedIn() {
  return sessionStorage.getItem(STORE_KEYS.session) === 'true';
}

function showDashboard() {
  loginScreen.style.display = 'none';
  dashboardScreen.hidden = false;
  renderAll();
}

function showLogin() {
  dashboardScreen.hidden = true;
  loginScreen.style.display = 'flex';
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const auth = getAuth();
  const errorEl = document.getElementById('loginError');

  if (user === auth.username && pass === auth.password) {
    sessionStorage.setItem(STORE_KEYS.session, 'true');
    errorEl.classList.remove('is-visible');
    showDashboard();
  } else {
    errorEl.classList.add('is-visible');
  }
});

document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  sessionStorage.removeItem(STORE_KEYS.session);
  showLogin();
});

/* ============ NAV antar panel ============ */
function switchPanel(panelId) {
  document.querySelectorAll('.admin-panel').forEach((p) => p.classList.toggle('is-active', p.id === panelId));
  document.querySelectorAll('.admin-nav button').forEach((b) => b.classList.toggle('is-active', b.dataset.panel === panelId));
  document.getElementById('adminSidebar')?.classList.remove('is-open');
}

document.querySelectorAll('.admin-nav button').forEach((btn) => {
  btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
});
document.querySelectorAll('[data-goto]').forEach((btn) => {
  btn.addEventListener('click', () => switchPanel(btn.dataset.goto));
});
document.getElementById('mobileSidebarToggle')?.addEventListener('click', () => {
  document.getElementById('adminSidebar').classList.toggle('is-open');
});

/* ============ DASHBOARD STATS ============ */
function renderStats() {
  const products = getProducts();
  const available = products.filter((p) => p.available !== false);
  const categories = new Set(products.map((p) => p.category));
  const avg = products.length ? products.reduce((sum, p) => sum + Number(p.price || 0), 0) / products.length : 0;

  document.getElementById('statTotal').textContent = products.length;
  document.getElementById('statAvailable').textContent = available.length;
  document.getElementById('statCategories').textContent = categories.size;
  document.getElementById('statAvgPrice').textContent = formatRupiah(Math.round(avg));
}

/* ============ TABEL PRODUK ============ */
let searchTerm = '';

function renderProductTable() {
  const tbody = document.getElementById('productTableBody');
  const products = getProducts().filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!products.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Belum ada produk. Klik "Tambah Produk" untuk mulai.</td></tr>`;
    return;
  }

  tbody.innerHTML = products
    .map((p) => {
      const thumb = p.image
        ? `<img class="prod-thumb" src="${p.image}" alt="">`
        : `<div class="prod-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--amber-400);font-size:.7rem;">☕</div>`;
      return `
      <tr data-id="${p.id}">
        <td>
          <div class="prod-name-cell">
            ${thumb}
            <div>
              <strong>${escapeHTML(p.name)}</strong>
              <span>${escapeHTML((p.desc || '').slice(0, 46))}${p.desc && p.desc.length > 46 ? '…' : ''}</span>
            </div>
          </div>
        </td>
        <td>${escapeHTML(p.category)}</td>
        <td>${formatRupiah(p.price)}</td>
        <td><span class="badge ${p.available !== false ? 'badge-on' : 'badge-off'}">${p.available !== false ? 'Tampil' : 'Disembunyikan'}</span></td>
        <td>
          <div class="row-actions">
            <button type="button" class="icon-btn edit-btn" title="Ubah" data-id="${p.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" class="icon-btn danger delete-btn" title="Hapus" data-id="${p.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('.edit-btn').forEach((b) => b.addEventListener('click', () => openProductModal(b.dataset.id)));
  tbody.querySelectorAll('.delete-btn').forEach((b) => b.addEventListener('click', () => deleteProduct(b.dataset.id)));
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

document.getElementById('searchProduct').addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderProductTable();
});

function updateCategoryList() {
  const list = document.getElementById('categoryList');
  const categories = [...new Set(getProducts().map((p) => p.category))];
  list.innerHTML = categories.map((c) => `<option value="${escapeHTML(c)}">`).join('');
}

/* ============ MODAL TAMBAH/UBAH PRODUK ============ */
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
let pendingImageData = '';

function openProductModal(id) {
  updateCategoryList();
  productForm.reset();
  pendingImageData = '';
  document.getElementById('imagePreview').textContent = 'Belum ada foto';
  document.getElementById('imagePreview').style.backgroundImage = '';

  if (id) {
    const product = getProducts().find((p) => p.id === id);
    if (product) {
      document.getElementById('modalTitle').textContent = 'Ubah Produk';
      document.getElementById('prodId').value = product.id;
      document.getElementById('prodName').value = product.name;
      document.getElementById('prodCategory').value = product.category;
      document.getElementById('prodPrice').value = product.price;
      document.getElementById('prodDesc').value = product.desc || '';
      document.getElementById('prodAvailable').checked = product.available !== false;
      pendingImageData = product.image || '';
      if (pendingImageData) setPreviewImage(pendingImageData);
    }
  } else {
    document.getElementById('modalTitle').textContent = 'Tambah Produk';
    document.getElementById('prodId').value = '';
  }

  productModal.classList.add('is-open');
}

function closeProductModal() {
  productModal.classList.remove('is-open');
}

function setPreviewImage(dataUrl) {
  const preview = document.getElementById('imagePreview');
  preview.textContent = '';
  preview.style.backgroundImage = `url(${dataUrl})`;
  preview.style.backgroundSize = 'cover';
  preview.style.backgroundPosition = 'center';
}

document.getElementById('addProductBtn').addEventListener('click', () => openProductModal(null));
document.getElementById('modalCloseBtn').addEventListener('click', closeProductModal);
document.getElementById('modalCancelBtn').addEventListener('click', closeProductModal);
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) closeProductModal();
});

document.getElementById('prodImage').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 900000) {
    showToast('Ukuran foto terlalu besar, pilih di bawah ±600KB');
    e.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    pendingImageData = reader.result;
    setPreviewImage(pendingImageData);
  };
  reader.readAsDataURL(file);
});

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('prodId').value;
  const products = getProducts();

  const data = {
    name: document.getElementById('prodName').value.trim(),
    category: document.getElementById('prodCategory').value.trim(),
    price: Number(document.getElementById('prodPrice').value) || 0,
    desc: document.getElementById('prodDesc').value.trim(),
    available: document.getElementById('prodAvailable').checked,
    image: pendingImageData,
  };

  if (id) {
    const idx = products.findIndex((p) => p.id === id);
    if (idx > -1) products[idx] = { ...products[idx], ...data };
    showToast('Produk berhasil diperbarui');
  } else {
    products.push({ id: uid(), ...data });
    showToast('Produk baru berhasil ditambahkan');
  }

  setProducts(products);
  closeProductModal();
  renderAll();
});

function deleteProduct(id) {
  const product = getProducts().find((p) => p.id === id);
  if (!product) return;
  if (!confirm(`Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
  const remaining = getProducts().filter((p) => p.id !== id);
  setProducts(remaining);
  showToast('Produk dihapus');
  renderAll();
}

/* ============ PENGATURAN PEMBAYARAN ============ */
function fillSettingsForm() {
  const s = getSettings();
  document.getElementById('setDana').value = s.danaNumber;
  document.getElementById('setWa').value = s.waNumber;
  document.getElementById('setBri').value = s.briNumber;
  document.getElementById('setBriName').value = s.briName;
  document.getElementById('setAddress').value = s.address;
  document.getElementById('setIg').value = s.instagramUrl;
}

document.getElementById('settingsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const settings = {
    danaNumber: document.getElementById('setDana').value.trim(),
    waNumber: document.getElementById('setWa').value.trim(),
    briNumber: document.getElementById('setBri').value.trim(),
    briName: document.getElementById('setBriName').value.trim(),
    address: document.getElementById('setAddress').value.trim(),
    instagramUrl: document.getElementById('setIg').value.trim(),
    instagramHandle: getSettings().instagramHandle,
  };
  setSettings(settings);
  flashSaveMsg('settingsSaveMsg');
  showToast('Pengaturan pembayaran tersimpan');
});

document.getElementById('passwordForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('newUser').value.trim();
  const password = document.getElementById('newPass').value;
  if (!username || password.length < 6) {
    showToast('Kata sandi minimal 6 karakter');
    return;
  }
  setAuth({ username, password });
  flashSaveMsg('passwordSaveMsg');
  showToast('Kata sandi admin diperbarui');
  document.getElementById('passwordForm').reset();
});

function flashSaveMsg(id) {
  const el = document.getElementById(id);
  el.classList.add('is-visible');
  setTimeout(() => el.classList.remove('is-visible'), 2000);
}

/* ============ toast ============ */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

/* ============ render semua ============ */
function renderAll() {
  renderStats();
  renderProductTable();
  updateCategoryList();
  fillSettingsForm();
}

/* ============ init ============ */
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }
});
