# 03 — Arsitektur

Prinsip pengarah: **setiap komponen harus bisa dijelaskan ke satu orang relawan yang
akan memperbaikinya jam 11 malam.** Kalau tidak muat di kepala satu orang, jangan
dibangun.

---

## 1. Core Engine — empat bagian saja

```
┌─────────────────────────────────────────────────────────────┐
│  CORE ENGINE                                                │
│                                                             │
│  ① Registry      siapa aktif, di mana, melayani modul apa   │
│  ② Broker        siaran orderan → gelombang → yang pertama  │
│                  menerima, dapat                            │
│  ③ Kanal         Telegram (pekerja) · PWA/SSE (warga)       │
│  ④ Buku          catatan transaksi, jenjang iuran, laporan  │
│                  transparansi                               │
└─────────────────────────────────────────────────────────────┘
        ↑ modul hanya menyumbang: form pesanan + rumus harga
   [Transport] [Warung] [Jasa Panggilan] [Pasar Tani]
```

Sebuah modul **tidak boleh** punya logika pencocokan, notifikasi, atau iuran
sendiri. Kalau sebuah modul butuh itu, berarti core-nya yang kurang. Aturan ini
yang menjaga agar penambahan modul kelima tidak berarti membangun aplikasi kelima.

**Yang disumbang tiap modul, hanya tiga hal:**

```js
// modul/transport.js
export default {
  id: 'transport',
  nama: 'Ojek & Kurir',
  form: [ {jenis:'lokasi', k:'jemput'}, {jenis:'lokasi', k:'antar'}, {jenis:'catatan'} ],
  hargaAcuan: (o) => 5000 + Math.max(0, o.km - 2) * 2000,   // ditetapkan musyawarah
  peran: 'pengemudi',
}
```

---

## 2. Algoritma pencocokan — "Prioritas Sepi"

Diterbitkan penuh, bisa diaudit siapa saja. Ini pengganti dari "algoritma rahasia"
yang di platform komersial menjadi sumber ketidakberdayaan pengemudi.

```
Orderan masuk pada t=0.

Gelombang 0   t = 0 – 8 dtk    radius 2 km
              HANYA pekerja yang pendapatan hari ini < Rp 50.000
Gelombang 1   t = 8 – 25 dtk   radius 2 km    semua pekerja aktif
Gelombang 2   t = 25 – 45 dtk  radius 4 km    semua pekerja aktif
Gelombang 3   t > 45 dtk       radius 8 km    semua pekerja aktif
t > 3 menit   orderan kedaluwarsa, warga diberi tahu, boleh kirim ulang

Di dalam satu gelombang: yang menekan /terima pertama, mendapat orderan.
Tidak ada skor rahasia. Tidak ada peringkat. Tidak ada "prioritas premium".
```

**Kenapa Gelombang 0 penting.** Delapan detik adalah waktu yang hampir tidak
disadari konsumen, tapi cukup untuk memberi kesempatan pertama pada orang yang hari
ini belum dapat apa-apa. Sepanjang hari, keunggulan kecil itu menumpuk menjadi
selisih nyata antara pengemudi yang pulang dengan Rp 30.000 dan yang pulang dengan
Rp 80.000.

Platform komersial tidak bisa melakukan ini: memberi orderan pada yang paling sepi,
bukan yang paling cepat konversinya, menurunkan efisiensi — dan efisiensi itulah
yang mereka jual ke investor. Bagi kita, itu justru tujuannya.

**Pagar pengaman:** kalau seorang pekerja menolak/mengabaikan 3 tawaran Gelombang 0
berturut-turut, ia dilewati dari Gelombang 0 selama 2 jam. Ini mencegah orderan
tertahan pada orang yang sedang tidak benar-benar bekerja.

**Ambang Rp 50.000** dapat diatur tiap simpul lewat musyawarah dan ditampilkan di
`/transparansi`.

---

## 3. Jarak dan lokasi — tanpa server peta

Bagian termahal dari sistem geospasial adalah bagian yang paling tidak kita butuhkan.

| Kebutuhan | Solusi mahal | Yang dipakai |
| :--- | :--- | :--- |
| Alamat → koordinat | Nominatim self-hosted (puluhan GB) | **Tidak ada.** Pin di peta atau *share location* Telegram; alamat sering dipakai disimpan sebagai label ("Rumah", "Kos", "Warung Bu Tini") |
| Jarak tempuh | OSRM/Valhalla (RAM beberapa GB) | **Haversine × 1,3.** Faktor belok jalan kota; meleset beberapa ratus meter, dan tarif memang dibulatkan per km |
| Peta | Google Maps API | Fase 0 tidak butuh peta. Fase 1 Leaflet + ubin satu kota (kecil, bisa self-host) |
| Cari pekerja terdekat | PostGIS | Kotak pembatas + haversine di SQLite. Untuk beberapa ratus pekerja, ini di bawah 1 ms |

```sql
-- cari pekerja aktif dalam radius, tanpa ekstensi geospasial apa pun
SELECT id, nama,
       6371 * 2 * ASIN(SQRT(
         POWER(SIN((:lat - lat) * 0.0087266), 2) +
         COS(:lat*0.0174533) * COS(lat*0.0174533) *
         POWER(SIN((:lon - lon) * 0.0087266), 2))) AS km
FROM pekerja
WHERE aktif = 1 AND modul = :modul
  AND lat BETWEEN :lat - 0.05 AND :lat + 0.05     -- kotak pembatas dulu,
  AND lon BETWEEN :lon - 0.05 AND :lon + 0.05     -- baru hitung jarak
HAVING km <= :radius ORDER BY km LIMIT 30;
```

Pasang OSRM hanya kalau sengketa jarak benar-benar terjadi berulang — bukan karena
membayangkan itu akan terjadi.

---

## 4. Tumpukan teknologi

| Lapis | Pilihan | Alasan |
| :--- | :--- | :--- |
| Aplikasi pekerja | **Bot Telegram** | Gratis, push andal, hemat kuota, jalan di HP Rp 700.000, sudah punya verifikasi nomor + *share location* bawaan |
| Aplikasi warga | **PWA** (HTML + Tailwind + Alpine.js) | Tanpa toko aplikasi, tanpa *build step*, tanpa unduhan 40 MB |
| Backend | **Node.js 22 + Fastify** | Satu proses melayani bot, API, dan SSE. PHP butuh worker terpisah untuk bot yang hidup terus |
| Basis data | **SQLite (WAL)** | Nol administrasi, cadangan = salin satu berkas. Cukup untuk puluhan ribu orderan/hari di satu kota |
| Realtime ke warga | **SSE** | Satu arah sudah cukup; jauh lebih ringan dari WebSocket |
| Web server | **Caddy** | HTTPS otomatis, konfigurasi 3 baris |
| Proses | **systemd** | Sudah ada, tidak menambah apa pun |
| Pemantauan | **Uptime Kuma** atau ping cron ke healthchecks.io | Tahu server mati sebelum pengemudi yang memberi tahu |

**Migrasi ke PostgreSQL + PostGIS** baru dilakukan kalau salah satu terjadi: >200
orderan bersamaan, atau butuh replikasi baca. Sebelum itu, SQLite lebih unggul —
terutama karena pemulihan bencana berarti menyalin satu berkas.

**Biaya nyata:**

```
Fase 0  VPS 1 vCPU / 1 GB          ± Rp  30.000 – 60.000 / bulan
        Domain .my.id              ± Rp  15.000 / TAHUN
                                   ─────────────────────────────
                                   di bawah Rp 65.000 / bulan

Fase 2  VPS 2 vCPU / 4 GB          ± Rp 120.000 / bulan
        Cadangan object storage    ± Rp  15.000 / bulan
```

*(Kisaran harga penyedia lokal per pertengahan 2026; harus dicek ulang sebelum
dianggarkan.)*

---

## 5. Skema basis data (inti)

```sql
CREATE TABLE anggota (
  id INTEGER PRIMARY KEY,
  telegram_id INTEGER UNIQUE,
  nama TEXT NOT NULL,
  hp TEXT,
  peran TEXT NOT NULL,              -- warga | pekerja | warung | pengurus
  modul TEXT,                       -- transport,jasa  (CSV, pekerja saja)
  tingkat_verifikasi INTEGER DEFAULT 0,   -- 0 hp · 1 ktp · 2 dijamin anggota
  penjamin_id INTEGER REFERENCES anggota(id),
  qris_url TEXT,                    -- QRIS pribadi pekerja; platform TIDAK menyimpan uang
  aktif INTEGER DEFAULT 0,
  lat REAL, lon REAL, lokasi_diperbarui INTEGER,
  skor INTEGER DEFAULT 100,
  dibuat INTEGER
);

CREATE TABLE orderan (
  id INTEGER PRIMARY KEY,
  modul TEXT NOT NULL,
  warga_id INTEGER REFERENCES anggota(id),
  pekerja_id INTEGER REFERENCES anggota(id),
  status TEXT NOT NULL,             -- siaran|diterima|jalan|selesai|batal|sengketa
  jemput_lat REAL, jemput_lon REAL,
  antar_lat REAL, antar_lon REAL,
  km REAL,
  harga INTEGER,                    -- CATATAN saja; uang tidak lewat sistem
  gelombang INTEGER,                -- gelombang saat diterima (untuk audit)
  dibuat INTEGER, diterima INTEGER, selesai INTEGER
);

-- Lokasi presisi dihapus otomatis; lihat 04 §Privasi
CREATE TABLE iuran (
  id INTEGER PRIMARY KEY,
  anggota_id INTEGER REFERENCES anggota(id),
  periode TEXT,                     -- '2026-07'
  jumlah_transaksi INTEGER,
  jenjang TEXT,                     -- bibit | tumbuh | rimbun
  tagihan INTEGER,
  dibayar INTEGER DEFAULT 0,
  bukti TEXT                        -- catatan bendahara koperasi
);

CREATE TABLE kas (                  -- sumber data /transparansi
  id INTEGER PRIMARY KEY,
  periode TEXT, arah TEXT,          -- masuk | keluar
  kategori TEXT, keterangan TEXT, jumlah INTEGER, tanggal INTEGER
);
```

Perhatikan: **tidak ada tabel saldo, tidak ada tabel dompet.** Ketiadaan itu
disengaja dan merupakan bagian dari desain hukum
([05](05-tata-kelola-dan-hukum.md)), bukan kealpaan.

---

## 6. Mode darurat

Kalau server mati, pendapatan orang berhenti. Karena itu harus ada jalan mundur yang
tidak bergantung pada kode kita sama sekali:

**Mode Grup.** Tiap simpul memelihara satu grup Telegram berisi semua pekerja aktif.
Kalau bot tidak merespons > 5 menit, pengurus mengumumkan mode manual: warga
mengirim permintaan ke grup, pekerja menjawab "saya ambil". Lebih berisik, tapi
uangnya tetap mengalir hari itu. Sistem yang canggih boleh mati; nafkah orang tidak
boleh.
