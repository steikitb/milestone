# Milestone — Infrastruktur Ekonomi Lokal Tanpa Tengkulak Digital

> Nama kerja sebelumnya untuk proyek ini adalah **Simpul**; ide dan seluruh dokumen
> desain di [`docs/`](docs/) dan [`arsip/`](arsip/) ditulis dengan nama itu. Rebrand
> ke **Milestone** baru terjadi belakangan — isi dokumen belum disunting ulang, jadi
> anggap "Simpul" = "Milestone" saat membaca.

Ojek online memotong ~20% dari tiap orderan. Biaya server yang sebenarnya jauh lebih
kecil dari itu — hitungannya ada di [docs/02](docs/02-model-ekonomi.md). Milestone
mencoba mengambil kembali selisih itu: koperasi anggota, zero-escrow (uang tidak
pernah disentuh platform), dan tarif yang turun seiring pertumbuhan, bukan naik.

Rasionalnya lebih lengkap di [`docs/`](docs/) (lihat peta dokumen di bawah). Repo ini
adalah **implementasi kode Fase 0**: satu bot Telegram, ~500 baris, dijelaskan di
[docs/06-roadmap.md](docs/06-roadmap.md).

## Modul

Modul-modul dipakai lewat pola nama "Mi-":

| Modul | Fungsi |
| :--- | :--- |
| **Mijek** | Kurir barang / jasa antar (bukan angkut penumpang di Fase 0) |
| **Mibeli** | Jasa titip-beli (makanan, belanja warung) |
| **Miservis** | Jasa panggilan (servis, reparasi, tukang) |

## Status

**Fase 0 — sudah diuji dengan 2 akun Telegram asli**, siklus penuh
menunggu→diterima→selesai berhasil. Yang sudah ada:

- `/daftar` — verifikasi kontak bawaan Telegram
- `/aktif` `/nonaktif` + share location bawaan Telegram (tanpa peta, tanpa geocoding)
- `/pesan` → pilih modul lewat tombol → ketik deskripsi → share lokasi → siaran
  gelombang dengan tombol "✅ Terima" / "✅ Tandai Selesai" (format lama
  `/pesan <modul> <deskripsi>` dan `/terima_<id>` `/selesai_<id>` tetap didukung)
- Order yang menunggu tetap ditawarkan ke pekerja yang baru aktif belakangan
  (tidak "terkubur" kalau dibuat sebelum ada pekerja aktif)
- Jarak: haversine × 1,3 (lihat [docs/01](docs/01-analisis-konsep-awal.md))
- Prioritas Sepi: 8 detik pertama hanya ke pekerja aktif dengan orderan tersedikit
  hari ini, baru dibuka ke semua yang aktif dalam radius
- SQLite (WAL) lokal, tanpa iuran/ledger sama sekali
- **Web pemesanan mandiri** (`src/web/`) — tambahan di luar Telegram, tanpa install
  apa pun: buka halaman, pilih modul, isi deskripsi, pakai lokasi browser, kirim.
  Status dipantau lewat halaman `order.html` yang polling, bukan notifikasi push.
  Tanpa OTP/verifikasi (dummy, sesuai skala Fase 0) — jalan di proses Node yang sama
  dengan bot lewat Fastify, sesuai [docs/03](docs/03-arsitektur.md).

**Belum ada** (sengaja, per roadmap): peta/Leaflet di web, dashboard transparansi,
koperasi, iuran berjenjang, Dana Senyum, modul warung. Juga belum ada reset harian
`orders_completed_today` (perlu cron/job terpisah sebelum dipakai lintas hari).

## Menjalankan

```bash
npm install
cp .env.example .env   # isi TELEGRAM_BOT_TOKEN dari @BotFather
npm start
```

Bot Telegram dan web pemesanan (default `http://localhost:8787`) jalan bersamaan
dari perintah yang sama.

## Peta dokumen

| Dokumen | Isi |
| :--- | :--- |
| [01 — Analisis Konsep Awal](docs/01-analisis-konsep-awal.md) | Apa yang kuat dari draf pertama, dan 4 hal yang akan patah kalau diteruskan apa adanya |
| [02 — Model Ekonomi](docs/02-model-ekonomi.md) | Rumus tarif, iuran berjenjang, Dompet Senyum |
| [03 — Arsitektur](docs/03-arsitektur.md) | Core engine, algoritma pencocokan, tumpukan teknologi |
| [04 — Kepercayaan & Keamanan](docs/04-kepercayaan-dan-keamanan.md) | Kepercayaan tanpa escrow; sengketa, penipuan, kecelakaan, privasi |
| [05 — Tata Kelola & Hukum](docs/05-tata-kelola-dan-hukum.md) | Koperasi, federasi, lisensi AGPL, daftar periksa regulasi |
| [06 — Peta Jalan](docs/06-roadmap.md) | Fase 0–3, kriteria lulus tiap fase, metrik |
| [arsip/](arsip/) | Draf konsep awal, disimpan utuh sebagai rujukan |

## Lisensi

**AGPL-3.0** — alasannya di [docs/05](docs/05-tata-kelola-dan-hukum.md#5-lisensi).
Siapa pun boleh memakai dan memodifikasi, tapi kalau dijalankan sebagai layanan
untuk publik, modifikasinya wajib dibuka.
