# Kopi Tarling — Website Kedai Kopi

Website lengkap untuk kedai kopi **Kopi Tarling** (nama terinspirasi musik *tarling* — gitar & suling — khas Indramayu/Cirebon, dicek dan belum dipakai sebagai brand coffee shop manapun).

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Halaman utama website (hero, tentang, menu, pemesanan, lokasi, footer) |
| `style.css` | Semua styling & animasi halaman utama |
| `script.js` | Menampilkan produk secara dinamis, filter menu, tombol pesan WhatsApp, animasi scroll |
| `admin.html` | Dashboard admin (login, CRUD produk, pengaturan pembayaran) |
| `admin.css` | Styling khusus dashboard admin |
| `admin.js` | Logika login, tambah/ubah/hapus produk, ubah info pembayaran |
| `database.sql` | Skema database MySQL untuk versi produksi (opsional, lihat di bawah) |

## Cara pakai (langsung, tanpa install apa pun)

1. Buka `index.html` di browser — website langsung jalan.
2. Buka `admin.html` untuk masuk ke dashboard admin.
   - **Username:** `admin`
   - **Kata sandi:** `kopitarling123`
   - Segera ganti lewat menu **Pengaturan Bayar → Ubah Kata Sandi Admin** setelah login.
3. Tambah/ubah/hapus produk dari dashboard — perubahan langsung tampil di `index.html` (buka di tab/browser yang sama).

> Catatan: data produk & pengaturan disimpan di **localStorage** browser (bukan server), supaya website ini bisa langsung dipakai tanpa hosting/backend. Ini artinya data tersimpan per-browser/per-perangkat. Kalau membuka website dari HP dan laptop berbeda, datanya tidak otomatis sinkron.

## Metode pembayaran yang sudah diatur

- **DANA:** 0877-2258-8201
- **Transfer BRI:** 4214 0102 6353 537 a.n. Krisdiyansah
- **COD:** via WhatsApp 0877-2258-8201

Semua nomor ini bisa diubah kapan saja lewat dashboard admin → panel **Pengaturan Bayar**, dan otomatis akan berubah di seluruh halaman (footer, section pemesanan, tombol pesan produk).

## Kalau ingin naik ke versi produksi (database sungguhan)

Saat ini semua data disimpan di browser (localStorage) — cocok untuk demo atau kedai kecil yang admin-nya memesan dari satu perangkat saja. Jika ke depannya butuh:
- Banyak admin mengelola dari perangkat berbeda,
- Data tidak hilang saat cache browser dibersihkan,
- Riwayat pesanan yang tersimpan rapi,

maka `database.sql` sudah disiapkan sebagai skema MySQL (tabel `products`, `categories`, `settings`, `admins`, `orders`) yang strukturnya sengaja dibuat sama dengan struktur data di `script.js`/`admin.js`, supaya tinggal dibuatkan backend (PHP, Node.js/Express, Laravel, dll.) yang menjembatani form admin ke database tersebut lewat API.

## Keamanan (penting sebelum go-live ke publik)

Login admin saat ini murni di sisi browser (untuk kebutuhan demo) — cukup untuk pemakaian pribadi/internal, tapi **jangan andalkan ini sebagai proteksi serius kalau website sudah online ke publik** karena kredensial tersimpan di localStorage, bukan divalidasi server. Untuk produksi, hubungkan ke backend dengan hash kata sandi (bcrypt) seperti dicontohkan di `database.sql`, dan tempatkan `admin.html` di balik autentikasi server-side.
