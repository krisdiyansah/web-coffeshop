-- =========================================================
-- KOPI TARLING — database.sql
-- Skema database untuk backend produksi (MySQL / MariaDB).
--
-- Catatan penting:
-- Website yang disertakan (index.html + admin.html) berjalan
-- sepenuhnya di sisi browser dan memakai localStorage sebagai
-- "database" agar bisa langsung dipakai tanpa server/hosting.
-- File SQL ini adalah skema untuk versi produksi, saat Anda
-- siap menghubungkan website ke backend sungguhan (contoh:
-- PHP/Laravel, Node.js/Express, dsb.) yang terhubung ke
-- MySQL. Struktur tabel & kolom sengaja dibuat sama persis
-- dengan struktur data di localStorage supaya migrasinya mudah.
-- =========================================================

CREATE DATABASE IF NOT EXISTS kopi_tarling
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kopi_tarling;

-- ---------------------------------------------------------
-- Tabel: admins
-- Akun untuk login ke dashboard admin.
-- PENTING: kolom password_hash harus diisi hash (mis. bcrypt),
-- JANGAN pernah menyimpan kata sandi polos di database asli.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(100) DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Akun contoh (username: admin / kata sandi asli: kopitarling123)
-- Ganti hash ini dengan hasil bcrypt kata sandi baru Anda sebelum go-live.
INSERT INTO admins (username, password_hash, full_name) VALUES
('admin', '$2y$10$replace.this.with.a.real.bcrypt.hash.value..........', 'Admin Kopi Tarling');

-- ---------------------------------------------------------
-- Tabel: categories
-- Kategori menu (Kopi Susu, Kopi Hitam, Non-Kopi, Cemilan, dst).
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO categories (name) VALUES
('Kopi Susu'), ('Kopi Hitam'), ('Non-Kopi'), ('Cemilan');

-- ---------------------------------------------------------
-- Tabel: products
-- Menu yang dikelola lewat sistem CRUD di dashboard admin.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id           VARCHAR(40)     PRIMARY KEY,          -- contoh: 'p1', atau UUID
  name         VARCHAR(150)    NOT NULL,
  category_id  INT UNSIGNED    NOT NULL,
  price        DECIMAL(10,2)   NOT NULL DEFAULT 0,
  description  VARCHAR(255)    DEFAULT NULL,
  image_url    VARCHAR(500)    DEFAULT NULL,          -- URL gambar, atau path file upload
  is_available TINYINT(1)      NOT NULL DEFAULT 1,
  created_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Data menu awal (sinkron dengan DEFAULT_PRODUCTS di script.js)
INSERT INTO products (id, name, category_id, price, description, image_url, is_available) VALUES
('p1',  'Kopi Tarling Signature',      1, 22000, 'Kopi susu gula aren dengan sentuhan kayu manis, resep andalan kedai.', NULL, 1),
('p2',  'Es Kopi Senja Pesisir',       1, 20000, 'Kopi susu creamy dipadu karamel laut, manis lembut menemani senja.',   NULL, 1),
('p3',  'Kopi Suling Vanilla',         1, 24000, 'Espresso vanila lembut dengan foam susu tebal di atasnya.',            NULL, 1),
('p4',  'Americano Waditra',           2, 15000, 'Espresso hitam murni, pahit yang bersahabat untuk pagi hari.',         NULL, 1),
('p5',  'Kopi Gedong Gincu',           2, 23000, 'Kopi dipadu sirup mangga gedong gincu khas Indramayu.',                NULL, 1),
('p6',  'Cappuccino Senar Emas',       1, 21000, 'Cappuccino creamy dengan taburan bubuk kayu manis keemasan.',          NULL, 1),
('p7',  'Matcha Senja',                3, 20000, 'Matcha creamy untuk yang ingin bersantai tanpa kafein kopi.',          NULL, 1),
('p8',  'Cokelat Tarling',             3, 19000, 'Cokelat panas atau dingin yang creamy dan bikin nyaman.',              NULL, 1),
('p9',  'Roti Bakar Pesisir',          4, 15000, 'Roti bakar srikaya kelapa, teman pas untuk kopi hitam.',               NULL, 1),
('p10', 'Pisang Goreng Krispi Madu',   4, 12000, 'Pisang goreng renyah disiram madu, cemilan favorit sore.',             NULL, 1);

-- ---------------------------------------------------------
-- Tabel: settings
-- Pengaturan pembayaran & kontak (key-value), diisi/diubah
-- lewat panel "Pengaturan Bayar" di dashboard admin.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  setting_key   VARCHAR(60)  PRIMARY KEY,
  setting_value VARCHAR(500) NOT NULL
) ENGINE=InnoDB;

INSERT INTO settings (setting_key, setting_value) VALUES
('dana_number',        '087722588201'),
('bri_number',         '421401026353537'),
('bri_account_name',   'Krisdiyansah'),
('whatsapp_number',    '6287722588201'),
('address',            'Jalan Terisi, Indramayu, Jawa Barat'),
('instagram_url',      'https://www.instagram.com/krisdynsh?igsh=b2J6NHNsZmV3enVn&utm_source=qr'),
('instagram_handle',   '@krisdynsh');

-- ---------------------------------------------------------
-- Tabel: orders (opsional)
-- Kalau ke depannya ingin mencatat histori pesanan yang masuk
-- lewat WhatsApp/COD/transfer, bukan hanya memicu chat WA.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id     VARCHAR(40)   NOT NULL,
  customer_name  VARCHAR(100)  DEFAULT NULL,
  customer_phone VARCHAR(30)   DEFAULT NULL,
  quantity       INT UNSIGNED  NOT NULL DEFAULT 1,
  payment_method ENUM('dana','bri_transfer','cod') NOT NULL DEFAULT 'cod',
  status         ENUM('menunggu','dibayar','diproses','selesai','dibatalkan') NOT NULL DEFAULT 'menunggu',
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Contoh query yang dipakai fitur CRUD di dashboard admin
-- ---------------------------------------------------------

-- Ambil semua produk beserta nama kategorinya (untuk tabel admin & menu di website)
-- SELECT p.id, p.name, c.name AS category, p.price, p.description, p.image_url, p.is_available
-- FROM products p JOIN categories c ON p.category_id = c.id
-- ORDER BY p.created_at DESC;

-- Tambah produk baru
-- INSERT INTO products (id, name, category_id, price, description, image_url, is_available)
-- VALUES (UUID(), 'Nama Menu Baru', 1, 18000, 'Deskripsi singkat', NULL, 1);

-- Ubah produk
-- UPDATE products SET name=?, category_id=?, price=?, description=?, image_url=?, is_available=?
-- WHERE id = ?;

-- Hapus produk
-- DELETE FROM products WHERE id = ?;

-- Ubah info pembayaran
-- UPDATE settings SET setting_value = ? WHERE setting_key = 'dana_number';
