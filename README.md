# 🛒 Admin Pembelian System

Sistem admin sederhana berbasis web untuk manajemen produk, stok, dan transaksi pembelian. Aplikasi ini dibangun menggunakan Node.js, Express.js, PostgreSQL, dan EJS sebagai templating engine.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- EJS (Embedded JavaScript Templates)
- Bootstrap 5

---

## 📌 Features

### 📊 Dashboard
- Menampilkan total produk
- Menampilkan total transaksi
- Menampilkan total revenue (transaksi aktif)

### 🛍️ Produk Management
- Menampilkan daftar produk
- Menampilkan stok produk
- Relasi data produk dan stok

### 💳 Sistem Pembelian
- Membuat transaksi pembelian
- Otomatis mengurangi stok produk
- Validasi stok sebelum transaksi

### ❌ Cancel Pembelian
- Membatalkan transaksi
- Status berubah menjadi CANCELLED
- Stok otomatis kembali (rollback)

### 📜 Riwayat Transaksi
- Menampilkan semua transaksi
- Status ACTIVE / CANCELLED
- Informasi detail pembelian

---

## 🗄️ Database Structure

### 1. Products
- id (PK)
- name
- price

### 2. Stocks
- id (PK)
- product_id (FK)
- quantity

### 3. Purchases
- id (PK)
- product_id (FK)
- qty
- total_price
- status (ACTIVE / CANCELLED)

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME/admin-pembelian.git
cd admin-pembelian



### 2. Install Dependencies
npm install
### 3. Setup Database (PostgreSQL)

Buat database:

CREATE DATABASE store_db;

Buat tabel:

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price NUMERIC
);

CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    product_id INT UNIQUE,
    quantity INT DEFAULT 10
);

CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    product_id INT,
    qty INT,
    total_price NUMERIC,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
4. Insert Data Produk (10 Produk)
INSERT INTO products (name, price) VALUES
('Laptop Asus', 9000000),
('Laptop Lenovo', 8500000),
('Mouse Logitech', 250000),
('Keyboard Mechanical', 500000),
('Monitor LG', 2200000),
('SSD Samsung', 1000000),
('RAM Kingston', 600000),
('Headset Gaming', 750000),
('Printer Epson', 1800000),
('Webcam Logitech', 400000);
5. Setup Stock Awal
INSERT INTO stocks (product_id, quantity) VALUES
(1,10),(2,10),(3,10),(4,10),(5,10),
(6,10),(7,10),(8,10),(9,10),(10,10);
6. Run Project
npm run dev
7. Open Browser
http://localhost:3000

📊 Business Logic
Pembelian mengurangi stok
Cancel pembelian mengembalikan stok
Revenue hanya dihitung dari transaksi ACTIVE


👨‍💻 Author
Fahmi Rosadi

Catatan

Project ini merupakan simulasi sistem transaksi sederhana yang menyerupai aplikasi kasir atau inventory management system pada level dasar hingga menengah.
