# 06 — Peta Jalan

## Risiko nomor satu bukan teknis

Kode untuk ini tidak sulit. Yang membunuh proyek seperti ini adalah **kepadatan**.

Pasar dua sisi punya masalah ayam-telur: warga tidak akan memesan kalau tidak ada
pekerja, pekerja tidak akan menunggu kalau tidak ada orderan. Aplikasi yang sempurna
dengan 3 pengemudi dan 2 pesanan sehari akan sunyi dalam dua minggu, dan orang tidak
akan mau mencoba untuk kedua kalinya.

Seluruh peta jalan ini disusun mengelilingi satu masalah itu.

**Aturan tunggal:** jangan buka layanan sebelum ada **minimal 8 pekerja dan 5 warung
yang berkomitmen mulai di hari yang sama**, dalam wilayah yang cukup kecil sehingga
waktu tempuh selalu di bawah 10 menit. Lebih baik menunda sebulan daripada dibuka lalu
mati. Peluncuran kedua jauh lebih sulit daripada yang pertama.

---

## Fase 0 — Satu bot, satu RW *(4–6 minggu)*

Bukan aplikasi. Bukan peta. Bukan server routing. **Satu bot Telegram, sekitar 500
baris.**

Pilih wilayah dengan komunitas yang sudah ada: satu kompleks perumahan, satu kampus,
satu pasar. Kalau orang-orangnya sudah saling kenal, verifikasi dan penyelesaian
sengketa nyaris gratis.

**Modul: kurir barang + jasa panggilan.** Bukan mengangkut penumpang — regulasinya
lebih ringan (lihat [05 §4](05-tata-kelola-dan-hukum.md)) dan manfaatnya sudah nyata
sejak hari pertama.

Yang dibangun:
- `/daftar` dengan verifikasi nomor bawaan Telegram
- `/aktif` `/nonaktif` + *share location* bawaan Telegram (tanpa peta, tanpa geocoding)
- `/pesan` → siaran gelombang → `/terima` → `/selesai`
- Jarak: haversine × 1,3
- SQLite, tanpa iuran sama sekali (biaya bulan-bulan pertama ditanggung pendiri —
  jumlahnya di bawah Rp 65.000/bulan)
- Grup Telegram untuk mode darurat sejak hari pertama

Belum dibangun: PWA, dashboard, koperasi, iuran, Dana Senyum, modul warung.

**Lulus ke fase berikutnya kalau:** ≥ 10 orderan/hari selama 14 hari berturut-turut,
dan ≥ 6 pekerja aktif tiap hari. Kalau tidak tercapai, jangan tambah fitur —
**perkecil wilayahnya** atau ganti modulnya. Menambah fitur untuk mengobati sepi
adalah cara paling umum proyek seperti ini gagal.

---

## Fase 1 — Warga tanpa Telegram *(6–8 minggu)*

Sebagian besar warga tidak akan memasang Telegram hanya untuk memesan. Pekerja mau
(itu alat kerjanya); konsumen tidak.

- PWA konsumen: buka tautan, pin lokasi di Leaflet, pesan. Tanpa unduh, tanpa daftar
  panjang (nomor HP + OTP saja).
- SSE untuk status orderan langsung.
- Alamat tersimpan berlabel sendiri ("Rumah", "Kos", "Warung Bu Tini").
- Pekerja tetap di Telegram — tidak perlu berubah.
- **Modul Warung dibuka.** Konsumen membayar warung langsung via QRIS warung sebelum
  pekerja berangkat; pekerja tidak pernah menalangi.
- Dashboard `/transparansi` versi awal, walau angkanya masih kecil. Kebiasaannya yang
  dibangun sejak awal, bukan angkanya.

**Lulus kalau:** ≥ 40 orderan/hari, ≥ 15 pekerja aktif, ≥ 8 warung, dan waktu tunggu
rata-rata di bawah 6 menit.

---

## Fase 2 — Menjadi milik bersama *(3–4 bulan)*

Pada titik ini sudah terbukti ada yang memakai. Barulah pantas menanggung biaya dan
kerumitan badan hukum.

- **Dirikan koperasi jasa.** Aset dan rekening dipindahkan ke badan hukum.
- Anggaran dasar disahkan, termasuk 10 pasal pengunci di
  [05 §6](05-tata-kelola-dan-hukum.md).
- Pengurus 3 orang, dipilih, dengan honorarium.
- **Iuran berjenjang mulai berlaku** — pascabayar ke rekening koperasi, jenjang Bibit
  Rp 0.
- **Dana Senyum** diaktifkan setelah aspek hukumnya beres.
- Pendampingan pendaftaran BPJS Ketenagakerjaan untuk anggota.
- Dashboard transparansi lengkap sampai tingkat mutasi.
- Prosedur sengketa tertulis dan sudah pernah diuji pada perkara sungguhan.

**Lulus kalau:** iuran menutup biaya operasional, koperasi sah, dan satu sengketa
nyata sudah diselesaikan sesuai prosedur tanpa ada yang keluar.

---

## Fase 3 — Simpul kedua *(setelah Fase 2 stabil 6 bulan)*

Ini ujian sesungguhnya: apakah ini sebuah **model**, atau sekadar satu komunitas
beruntung dengan satu penggerak yang gigih?

- Kemas menjadi mudah dipasang: satu berkas `docker-compose.yml`, satu berkas
  konfigurasi, panduan setengah halaman.
- **Buku panduan pendirian simpul** — bagian tersulit bukan teknisnya, tapi cara
  mengumpulkan 8 pekerja pertama.
- Daftar Simpul (JSON publik).
- Ekspor reputasi antar-simpul.
- Modul Pasar Tani (petani/nelayan langsung ke warga).
- Migrasi ke PostgreSQL + PostGIS **hanya kalau** ada simpul yang benar-benar
  menabrak batas SQLite.

**Berhasil kalau:** ada satu simpul yang berjalan lebih dari 3 bulan **tanpa
keterlibatan pendiri simpul pertama sama sekali.**

---

## Metrik

**Metrik utama — Rupiah Tertahan:**

```
Rupiah Tertahan = GMV × (tarif komersial pembanding − tarif kita)
```

Ini satu-satunya angka yang benar-benar mengukur tujuan proyek. GMV, jumlah unduhan,
dan jumlah pengguna terdaftar adalah metrik pinjaman dari model bisnis yang kita
tolak, dan mengejarnya akan pelan-pelan mengubah kita menjadi mereka.

**Metrik pendukung:**

| Metrik | Kenapa diukur |
| :--- | :--- |
| % anggota jenjang Bibit | Apakah kita benar-benar menjangkau yang paling kecil, atau hanya melayani yang sudah mapan |
| Sebaran pendapatan harian antar pekerja | Apakah "Prioritas Sepi" benar-benar bekerja — pantau selisih kuartil bawah dan atas |
| Waktu tunggu rata-rata | Ukuran kepadatan; ini yang menentukan warga mau kembali atau tidak |
| Pekerja aktif tiap hari | Berhentinya orang adalah gejala paling awal sebelum semuanya runtuh |
| Sengketa per 1.000 orderan | Apakah kepercayaan tanpa escrow benar-benar bertahan |
| Berapa hari kas bertahan | Kesehatan operasional |
| Anggota yang membuka `/transparansi` | Apakah transparansi benar-benar dipakai, atau cuma hiasan |

**Yang sengaja tidak diukur:** waktu yang dihabiskan di aplikasi, tingkat konversi,
tingkat penerimaan orderan per pekerja. Metrik keterlibatan adalah alat untuk
memerah pengguna. Aplikasi yang baik di sini adalah aplikasi yang cepat ditutup.

---

## Kalau gagal

Kemungkinan besar penyebabnya salah satu dari ini — dan mengenalinya lebih awal lebih
berharga daripada bertahan terlalu lama:

1. **Tidak pernah mencapai kepadatan.** Paling mungkin. Obatnya: perkecil wilayah,
   jangan tambah fitur.
2. **Pengurus kelelahan.** Obatnya: bertiga sejak awal, honorarium sejak ada surplus,
   panduan tertulis untuk semuanya.
3. **Satu insiden buruk merusak kepercayaan.** Obatnya: siapkan prosedur sebelum
   dibutuhkan, dan tanggapi terbuka, bukan defensif.
4. **Hambatan hukum.** Obatnya: mulai dari kurir dan jasa (bukan penumpang), jangan
   pernah menyentuh uang, urus badan hukum sebelum memungut iuran.

Kalau memang berhenti: publikasikan apa yang terjadi. Catatan kegagalan yang jujur
dari satu percobaan nyata lebih berguna bagi orang berikutnya daripada dokumen konsep
yang rapi — termasuk dokumen ini.
