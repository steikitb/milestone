> **ARSIP.** Draf konsep awal, disimpan utuh sebagai rujukan. Versi yang berlaku ada di [../README.md](../README.md); analisis kritis atas dokumen ini ada di [../docs/01-analisis-konsep-awal.md](../docs/01-analisis-konsep-awal.md).

# The Universal Gig Local Commerce Engine (At-Cost)
**Visi:** Membangun infrastruktur publik (platform *cooperativism*) yang mengembalikan kedaulatan ekonomi kepada pekerja lepas, pedagang kecil, dan warga lokal dengan memangkas habis peran "tengkulak digital" (platform komersial yang memotong 20-30% pendapatan).

## 1. Filosofi Prinsip Inti

*   **Radical Transparency:** Seluruh biaya operasional server (VPS, domain, routing) dibuka secara transparan kepada semua pihak di dashboard publik.
*   **Zero Escrow (Pembayaran 100% P2P):** Platform TIDAK memegang uang. Pembayaran dilakukan 100% langsung antara Konsumen dan Penyedia Jasa/Barang (via Tunai atau QRIS pribadi). Bebas izin OJK, bebas biaya admin payment gateway.
*   **At-Cost Maintenance (Iuran Gotong Royong):** Biaya operasional ditanggung bersama melalui "Token Karcis" mikroskopis (misal Rp 200/transaksi). Jika target biaya server bulan ini (misal Rp 150.000) sudah tercapai, sistem menggratiskan (Rp 0) seluruh transaksi di sisa bulan tersebut.
*   **Hyperlocal Focus:** Deployment dilakukan per-komunitas/wilayah/kampus untuk membangun ekonomi sirkular lokal yang kuat, bukan mengejar dominasi nasional yang membakar uang.

## 2. Arsitektur Universal (Satu Core, Banyak Wujud)

Alih-alih membuat aplikasi terpisah untuk ojol, makanan, dan jasa, kita membangun **Satu Core Engine** yang menangani fondasi transaksi geospasial.

### Core Engine (Fondasi)
1.  **Geo-Location Engine:** (Tanpa Google Maps). Menggunakan Leaflet.js (Peta), Nominatim/Pelias (Geocoding), dan OSRM/Valhalla (Hitung jarak routing).
2.  **Order Broker (Penengah):** Sistem antrean dan *matching* berbasis kedekatan radius (spatial query) antara Peminta dan Penyedia.
3.  **Communication Hub:** Sistem notifikasi ringan (PWA Web Push atau Bot Telegram) untuk broadcast pekerjaan.
4.  **At-Cost Ledger:** Modul transparansi yang menghitung iuran server kolektif secara *real-time*.

### Modul Layanan (Pluggable)
Di atas *Core Engine*, kita bisa mengaktifkan berbagai modul:

*   **[Modul Transport Kurir]** Ojek, becak motor, angkut barang pindahan.
*   **[Modul Warung 0% Markup]** Pesan makanan/sembako. Warung jual dengan harga aslinya (100%), kurir mendapat ongkir utuh, pembeli mendapat makanan murah.
*   **[Modul Jasa Panggilan]** Tukang servis AC, ledeng, tambal ban, hingga guru les privat.
*   **[Modul Pasar Petani Lokal]** Petani/nelayan lokal posting hasil panen, warga langsung beli (direct-to-consumer).

## 3. Komparasi Teknologi (Anti-Bangkrut)

Startup komersial bangkrut karena biaya infrastruktur pihak ketiga. Kita menggunakan 100% *Open Source Self-Hosted*.

| Kebutuhan | Solusi Mahal (Ditinggalkan) | Solusi "At-Cost" (Yang Digunakan) |
| :--- | :--- | :--- |
| **Peta (Tiles)** | Google Maps API | OpenStreetMap (OSM) via Leaflet.js |
| **Routing / Jarak** | Google Directions API | OSRM / Valhalla (Self-hosted di VPS) |
| **Pencarian Alamat** | Google Geocoding API | Nominatim (OSM) / Pelias |
| **Aplikasi Pekerja** | Native Android/iOS | Telegram Bot / PWA (Ringan, Hemat Kuota) |
| **Aplikasi Warga** | Native Android/iOS | Progressive Web App (PWA) |
| **Payment Gateway**| Xendit / Midtrans | Tunai / QRIS Pribadi Pekerja (100% P2P) |

## 4. Alur Kerja Universal (Contoh: Pesan Servis AC)

1.  **Warga (PWA):** Buka web `lokal.id`, pilih modul "Jasa", ketik "Servis AC Netes". Pin lokasi rumah.
2.  **Core Engine:** Mencari teknisi AC terdaftar di radius 3 KM.
3.  **Teknisi (Telegram Bot):** Notifikasi masuk: *"Panggilan Servis AC di [Alamat] jarak 1.5 KM. Terima?"*
4.  **Matching:** Teknisi pertama membalas `/terima`. PWA warga mendapat update nama teknisi.
5.  **Eksekusi Bayar:** Teknisi datang, memperbaiki AC, warga membayar ongkos jasa Rp 100.000 (Tunai/QRIS langsung ke teknisi).
6.  **Iuran (Gotong Royong):** Teknisi menandai "Selesai" di Telegram. Saldo token teknisi di sistem berkurang 1 Karcis (Rp 200) untuk bantu bayar server. Uang Rp 100.000 utuh jadi milik teknisi.

## 5. Dashboard Transparansi (Public Utility Proof)

Bisa diakses publik (URL `/transparansi`):
*   **Target Operasional Server (Bulan Ini):** Rp 150.000 (VPS Domain)
*   **Dana Terkumpul via Karcis:** Rp 120.000 (80%)
*   **Status Karcis Hari Ini:** BERBAYAR (Rp 200/trx)
*   *(Ketika Dana Terkumpul = Rp 150.000, Status Karcis berubah menjadi **GRATIS (Rp 0)** untuk seluruh transaksi di kota tersebut hingga akhir bulan).*

## 6. MVP (Minimum Viable Product) Tech Stack
Sistem yang dirancang agar sanggup berjalan di VPS spesifikasi rendah:
*   **Frontend User:** HTML, TailwindCSS, Alpine.js (Ringan, tanpa *build step* rumit).
*   **Backend:** PHP 8 (Modular/API-first) atau Node.js Fastify.
*   **Database:** SQLite (Sangat cepat untuk skala hyperlocal/Satu Kota) atau PostgreSQL (dengan PostGIS).
*   **Infrastruktur:** Caddy Server (Reverse Proxy Auto HTTPS).
