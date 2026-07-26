# 02 — Model Ekonomi

## 1. Kurva tarif terbalik

Perbedaan struktural antara platform komersial dan Simpul dapat ditulis sebagai dua
rumus.

**Platform komersial:**

```
potongan = 20% × pendapatan          → persentasenya TETAP selamanya
```

Volume naik dua kali lipat, potongan tetap 20%. Pertumbuhan tidak pernah
menguntungkan pekerja; pertumbuhan hanya memperbesar angka absolut yang diambil.

**Simpul:**

```
potongan = biaya server bulanan ÷ total pendapatan komunitas
```

Pembilangnya nyaris tidak bergerak. Penyebutnya tumbuh bersama komunitas. Maka
persentasenya **turun terus mendekati nol**.

| Jumlah pengemudi aktif | Biaya bulanan | Total pendapatan komunitas | Potongan efektif |
| ---: | ---: | ---: | ---: |
| 10 | Rp 60.000 | Rp 26 juta | 0,23 % |
| 50 | Rp 150.000 | Rp 130 juta | 0,12 % |
| 200 | Rp 300.000 | Rp 520 juta | 0,06 % |
| 1.000 | Rp 900.000 | Rp 2,6 miliar | 0,03 % |

*(Asumsi: 10 orderan/hari @ Rp 10.000, 26 hari kerja. Biaya server naik bertahap
mengikuti kebutuhan RAM dan bandwidth, tidak linear.)*

Inilah alasan mengajak tetangga bergabung menjadi tindakan yang menguntungkan semua
orang, bukan sekadar menambah pesaing. Di platform komersial, anggota baru berarti
saingan berebut orderan. Di sini, anggota baru berarti tagihan semua orang turun.

**Bandingkan pada satu pengemudi, per bulan:**

```
Pendapatan kotor        Rp 2.600.000
Platform komersial −20% Rp   520.000  hilang
Simpul                  Rp     3.000  iuran
────────────────────────────────────────────
Selisih di kantong      Rp   517.000 / bulan
                        Rp 6.204.000 / tahun
```

Rp 517.000 per bulan, untuk keluarga dengan pendapatan Rp 2,6 juta, adalah selisih
antara "cukup" dan "tidak cukup". Itu SPP, itu sepatu baru, itu berobat tanpa
berutang.

---

## 2. Iuran berjenjang — yang paling kecil membayar nol

Menggantikan skema "Karcis Rp 200/transaksi" dari draf awal (alasannya di
[01 §B](01-analisis-konsep-awal.md#b-empat-hal-yang-akan-patah)).

| Jenjang | Transaksi selesai / bulan | Iuran / bulan | Untuk siapa |
| :--- | ---: | ---: | :--- |
| **Bibit** | 0 – 30 | **Rp 0** | Sambilan, lansia, anggota baru, yang sedang sakit |
| **Tumbuh** | 31 – 150 | **Rp 3.000** | Paruh waktu |
| **Rimbun** | > 150 | **Rp 7.000** | Penuh waktu |
| **Warung / pedagang** | berapa pun | **Rp 0** | Merekalah pasokannya; jangan pernah dibebani |
| **Konsumen** | berapa pun | **Rp 0** | Selamanya |

**Cek apakah angkanya menutup biaya** — komunitas 50 pengemudi:

```
10 orang Bibit  × Rp 0      = Rp       0
30 orang Tumbuh × Rp 3.000  = Rp  90.000
10 orang Rimbun × Rp 7.000  = Rp  70.000
                            ─────────────
                       Total  Rp 160.000   ≥ Rp 150.000 biaya bulanan ✓
```

Menutup, dengan sedikit kelebihan. Sifat-sifat penting dari skema ini:

- **Progresif.** Yang paling sedikit berpenghasilan membayar nol. Kebalikan total dari
  potongan persentase, yang justru paling terasa bagi yang paling kecil.
- **Bisa diperkirakan.** Rp 3.000/bulan bisa direncanakan. Potongan variabel tidak.
- **Tidak ada insentif berbohong.** Iuran tidak terikat pada tombol "selesai", jadi
  tidak ada gunanya menyembunyikan orderan. Seluruh kebutuhan sistem anti-kecurangan
  lenyap. (Lihat [01 §B4](01-analisis-konsep-awal.md).)
- **Murah ditagih.** 40 tagihan per bulan, bukan 13.000 mikrotransaksi. Bisa dikelola
  satu bendahara dengan satu tabel.

**Cara menagih:** pascabayar, ke **rekening koperasi** — bukan ke platform. Sistem
menampilkan "Iuran Juli: Rp 3.000, bayar sebelum 10 Agustus" beserta QRIS koperasi.
Platform hanya mencatat, tidak pernah memegang nilai. Telat > 30 hari → akun
dijeda (bukan dihapus, bukan didenda), dan pengurus menghubungi orangnya — karena
biasanya penyebabnya memang sedang kesulitan, dan itu perkara manusia, bukan perkara
sistem.

---

## 3. Dana Senyum — pembulatan sukarela dari konsumen

Saat membayar, konsumen ditawari membulatkan ke ribuan terdekat:

```
Ongkos kirim   Rp 8.500
Bulatkan jadi  Rp 9.000  (+Rp 500 untuk Dana Senyum)   [ Ya ]  [ Tidak ]
```

Dengan 13.000 transaksi/bulan dan hanya 20% yang setuju, rata-rata Rp 500:

```
13.000 × 20% × Rp 500 = Rp 1.300.000 / bulan
```

Delapan kali lipat biaya server — dari satu kecamatan. Kalau ini berjalan, **iuran
anggota turun ke Rp 0 untuk semua jenjang**, dan pekerja tidak membayar apa pun.

Bawaannya harus **tidak dicentang**. Tidak ada rasa bersalah, tidak ada layar penuh
foto anak-anak. Satu baris, sekali, boleh dimatikan permanen di pengaturan. Begitu
sumbangan mulai dipaksakan, ia berubah menjadi biaya tersembunyi — hal yang persis
kita lawan.

Uangnya masuk ke rekening koperasi/yayasan, **bukan ke platform**. (Lihat batasan
hukum penggalangan dana di [05](05-tata-kelola-dan-hukum.md).)

---

## 4. Aturan surplus — kelebihan uang tidak boleh menumpuk

Setiap kas yang menganggur pada akhirnya akan menarik seseorang untuk menguasainya.
Karena itu surplus punya urutan wajib, ditulis di anggaran dasar:

```
1. Cadangan operasional        → sampai 3× biaya bulanan, TIDAK LEBIH
2. Turunkan jenjang iuran      → Rimbun Rp 7.000 → Rp 5.000 → … → Rp 0
3. Dompet Senyum               → sisanya, seluruhnya
```

**Isi Dompet Senyum** (diputuskan musyawarah anggota, diumumkan tiap bulan):

- Perlengkapan sekolah anak anggota menjelang tahun ajaran baru
- Bantuan iuran BPJS Ketenagakerjaan bagi anggota jenjang Bibit
- Dana darurat kecelakaan dan sakit (tanggung renteng — lihat [04](04-kepercayaan-dan-keamanan.md#keselamatan))
- Perbaikan kendaraan bagi anggota yang motornya rusak dan kehilangan mata pencaharian

Setiap rupiah masuk dan keluar tampil di dashboard publik `/transparansi`. Cadangan
punya **batas atas** justru supaya tidak ada yang tergoda menjaganya.

---

## 5. Dashboard transparansi

Bisa dibuka siapa saja tanpa login, di `/transparansi`:

```
BIAYA BULAN INI                     Simpul Kec. Depok Sleman · Juli 2026
──────────────────────────────────────────────────────────────────────
  VPS 2 vCPU / 4 GB (Biznet)                            Rp 120.000
  Domain simpul-sleman.my.id (1/12 tahun)               Rp   1.250
  Cadangan backup (object storage)                      Rp  15.000
  Honorarium pengurus (3 org × Rp 50.000)               Rp 150.000
                                                        ───────────
  Total                                                 Rp 286.250

PEMASUKAN
  Iuran anggota (41 dari 47 anggota membayar)           Rp 158.000
  Dana Senyum (2.104 pembulatan)                        Rp 1.043.500
                                                        ───────────
  Total                                                 Rp 1.201.500

SURPLUS                                                 Rp 915.250
  → Cadangan (sudah penuh 3 bulan, tidak diisi)         Rp       0
  → Penurunan iuran Agustus: Rimbun Rp 7.000 → Rp 4.000
  → Dompet Senyum                                       Rp 915.250

POTONGAN EFEKTIF BULAN INI                              0,09 %
  Pembanding platform komersial                         20 %
  RUPIAH YANG TETAP DI TANGAN WARGA         Rp 25.883.750
──────────────────────────────────────────────────────────────────────
  Riwayat mutasi lengkap · Kode sumber · Notulen musyawarah
```

Baris terakhir adalah metrik utama proyek ini. Bukan GMV, bukan jumlah unduhan.
**Berapa rupiah yang tidak jadi diambil.**

---

## 6. Apa yang sengaja tidak akan pernah dibangun

Daftar ini bagian dari desain, sama mengikatnya dengan yang lain:

- ❌ **Escrow / dompet / saldo.** Platform tidak pernah menyentuh uang.
- ❌ **Tarif melonjak saat ramai.** Harga ditetapkan komunitas lewat musyawarah dan dipublikasikan.
- ❌ **Iklan dan urutan berbayar.** Tidak ada yang bisa membeli posisi lebih atas.
- ❌ **Eksklusivitas.** Anggota bebas memakai Gojek, Grab, Maxim bersamaan. Menuntut kesetiaan adalah perilaku tengkulak. Kalau kita hanya bertahan karena orang terkunci, kita sudah gagal.
- ❌ **Penjualan data.** Lokasi presisi dihapus otomatis; lihat [04](04-kepercayaan-dan-keamanan.md#privasi).
- ❌ **Modal ventura.** Investor menuntut imbal hasil, dan satu-satunya sumber imbal hasil di sini adalah kantong pekerja.
- ❌ **Penalti untuk menolak orderan.** Orang boleh istirahat, salat, makan, atau menolak tanpa alasan.
