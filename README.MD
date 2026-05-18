📋 Cara Menjalankan
Metode 1: Menggunakan Live Server (Rekomendasi)
Buat struktur folder seperti di atas:

zet-id-project/
├── index.html
├── pilih-paket.html
├── resi-angin.html
├── resi-manual.html
├── resiko-fo.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── data.js
└── data/
    └── config.json
Salin kode ke masing-masing file

Jalankan dengan Live Server:

Jika pakai VS Code: Install extension "Live Server", klik kanan pada index.html → "Open with Live Server"

Atau gunakan npx live-server di terminal

Metode 2: Langsung Buka di Browser
Buka file index.html langsung dengan double-click (tapi beberapa fitur mungkin terbatas karena CORS)

Metode 3: Menggunakan Python
bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
Lalu buka http://localhost:8000

🔧 Panduan Mengedit
File	Fungsi	Bagian yang Bisa Diedit
js/main.js	Konfigurasi utama	CONFIG object (nomor WA, rekening, dll)
css/style.css	Tampilan & tema	Warna di :root, ukuran font, padding
index.html	Konten & struktur	Teks, harga paket, fitur, testimoni
Cara Mengubah Data (Paling Penting):
Buka js/main.js dan edit bagian CONFIG:

javascript
const CONFIG = {
    whatsappNumber: '6285921632214',     // Ganti dengan nomor WA asli
    seaBankAccount: {
        bank: 'SeaBank Indonesia',        // Nama bank
        number: '901234567890',          // Ganti dengan rekening asli
        name: 'ZET ID OFFICIAL'          // Nama pemilik rekening
    },
    danaNumber: '085921632214',          // Ganti dengan nomor DANA asli
};
Cara Mengubah Harga Paket:
Buka index.html, cari dan edit:

html
<span class="price-value">Rp 50K</span>   <!-- Ganti angka 50K -->
Cara Mengubah Warna Tema:
Buka css/style.css, cari :root dan ganti nilai variabel:

css
:root {
    --bg: #0a0a0f;        /* Warna background */
    --accent: #ff6b35;    /* Warna utama (oranye) */
    --success: #22c55e;   /* Warna sukses (hijau) */
}
⚠️ Catatan Penting: Pastikan folder css dan js berada di level yang sama dengan index.html, atau sesuaikan path di tag <link> dan <script> jika berbeda.

Metode 2: Install Live-Server Python Package (Dengan Auto-Reload)
Ini solusi jika ingin auto-refresh seperti Live Server asli, tapi pakai Python.

Langkah-langkah:
Install package live-server dari PyPI:

bash
pip install live-server
Atau jika pakai pip3:

bash
pip3 install live-server
Jalankan di terminal VS Code:

bash
live-server
Fitur yang didapat:

✅ Auto-refresh saat file berubah

✅ Bisa akses dari HP via QR code

✅ Support Markdown rendering

✅ Bisa custom port (--port 9000)

Contoh perintah lengkap:
bash
# Port default 8000 dengan auto-reload
live-server

# Custom port
live-server --port 3000

# Tampilkan QR code untuk akses dari HP
live-server --show-qrcode

# Dengan CORS enabled
live-server --cors
Catatan: Package ini berbeda dengan Live Server di VS Code. Ini adalah implementasi Python dari fitur serupa .