# 04 — Kepercayaan & Keamanan

Menghapus escrow menghapus alat pemaksa terkuat yang dimiliki platform. Itu memang
tujuannya — tapi meninggalkan lubang yang harus diisi dengan cara lain. Dokumen ini
adalah jawaban atas pertanyaan **"terus kalau ada yang nakal, bagaimana?"**

Jawaban singkatnya: dengan **kedekatan**. Platform nasional harus menyelesaikan
sengketa antara dua orang asing yang berjarak 1.000 km lewat algoritma. Kita
menyelesaikan sengketa antar tetangga, dan itu berbeda secara mendasar.

---

## 1. Verifikasi berjenjang

| Tingkat | Syarat | Boleh apa |
| :--- | :--- | :--- |
| **0 — Nomor** | Akun Telegram (nomor sudah terverifikasi Telegram) | Memesan, maks. 1 orderan aktif |
| **1 — Identitas** | KTP + swafoto, diperiksa **manusia** oleh pengurus | Memesan bebas; menjadi warung |
| **2 — Dijamin** | 2 anggota tingkat 2 menjaminkan diri | Menjadi pekerja; menerima orderan |

Tingkat 2 meminjam praktik koperasi yang sudah berumur ratusan tahun: **tanggung
renteng**. Penjamin ikut menanggung akibat kalau yang dijamin berbuat curang —
skornya turun, dan haknya menjamin orang lain dibekukan.

Ini bekerja karena orang jauh lebih hati-hati menjamin nama baiknya sendiri daripada
mengisi formulir. Dan ini juga alasan kenapa proyek ini **harus** hyperlocal:
penjaminan hanya bermakna kalau orang benar-benar saling kenal.

KTP disimpan sebagai **hash + catatan "sudah diperiksa oleh <pengurus> pada
<tanggal>"**. Fotonya dihapus setelah diperiksa. Kita tidak menyimpan tumpukan KTP
warga di VPS Rp 30.000 — itu tanggung jawab yang tidak sanggup kita pikul.

---

## 2. Kalau konsumen tidak membayar

Realitanya: ini akan terjadi. Yang bisa dilakukan adalah membuatnya jarang dan tidak
menghancurkan.

**Pencegahan**
- Orderan bernilai besar (> Rp 100.000, misalnya belanja sembako yang ditalangi
  pekerja) hanya bisa dibuat oleh konsumen tingkat 1 dengan minimal 5 orderan selesai.
- Untuk modul Warung, pembayaran ke warung dilakukan **konsumen langsung via QRIS
  warung** sebelum pekerja berangkat. Pekerja tidak pernah menalangi. Ini menghapus
  seluruh kelas kerugian terbesar sekaligus.
- Pekerja boleh menolak orderan apa pun tanpa alasan dan tanpa penalti.

**Kalau tetap terjadi**
1. Pekerja menekan `/sengketa` dengan foto dan keterangan singkat.
2. Skor konsumen dibekukan otomatis, akun dijeda sampai selesai.
3. Pengurus (3 orang, bergilir) menghubungi kedua pihak dalam 48 jam.
4. Kalau terbukti dan nilainya di bawah Rp 100.000, **Dompet Senyum mengganti kerugian
   pekerja.** Angkanya kecil dan jarang; menanggungnya bersama jauh lebih murah
   daripada membangun sistem escrow.
5. Kalau berulang atau bernilai besar: dikeluarkan dari keanggotaan, dan dicatat di
   daftar bersama antar-simpul.

Butir 4 adalah pengganti fungsi escrow yang sesungguhnya: **asuransi bersama, bukan
penyanderaan uang.**

**Daftar bersama antar-simpul** perlu perlindungan agar tidak berubah jadi alat
sewenang-wenang: harus ada nomor perkara, alasan tertulis, hak membela diri, dan masa
berlaku maksimal 12 bulan yang otomatis kedaluwarsa.

---

## 3. Orderan palsu dan pekerja yang ditinggal

Kerugian pekerja bukan uang, tapi bensin dan waktu — dan itu tetap nafkah.

- Maksimal 3 orderan aktif per konsumen.
- Setelah pekerja menekan "sampai di lokasi", ada tombol `/tidak_ada_orang` setelah 10
  menit. Skor konsumen turun 15.
- 3 kejadian dalam 30 hari → dijeda 7 hari, boleh mengajukan banding ke pengurus.
- Skor pulih 5 poin per bulan tanpa masalah. Kesalahan tidak boleh permanen; orang
  bisa sedang mengalami hari yang buruk.

---

## 4. Keselamatan

Di sini kita harus jujur: **kita tidak bisa menyamai asuransi perjalanan yang
diberikan platform komersial.** Menjanjikannya adalah kebohongan. Yang bisa dilakukan
justru lebih tahan lama.

**a. BPJS Ketenagakerjaan — Bukan Penerima Upah.** Program pemerintah untuk pekerja
mandiri, mencakup Jaminan Kecelakaan Kerja dan Jaminan Kematian, dengan iuran sekitar
belasan ribu rupiah per bulan — jauh lebih murah dari asuransi swasta, dan berlaku
24 jam, bukan hanya saat sedang mengantar orderan. Perlindungannya lebih luas
daripada asuransi platform.

*Simpul tidak menjual asuransi.* Yang dilakukan: mendampingi pendaftaran, mengingatkan
pembayaran, dan **membayarkan iuran anggota jenjang Bibit dari Dompet Senyum.**
(Angka iuran dan cakupan program wajib diverifikasi ke BPJS TK sebelum dijanjikan ke
siapa pun.)

**b. Tanggung renteng.** Dompet Senyum menyediakan santunan langsung untuk kecelakaan
— uang yang cair dalam hitungan hari, bukan klaim yang diproses berminggu-minggu.
Besarannya diputuskan musyawarah sesuai isi kas.

**c. Tombol darurat.** Di dalam orderan berjalan, tombol `/darurat` mengirim lokasi
terakhir ke grup pengurus dan ke satu kontak keluarga yang didaftarkan. Bukan
pengganti 112, tapi tetangga biasanya sampai lebih dulu.

**d. Batas jam malam.** Orderan setelah pukul 22.00 hanya ditawarkan kepada pekerja
yang mengaktifkan "siap malam", dan lokasi antar ditampilkan penuh sebelum diterima —
supaya orang bisa menolak wilayah yang ia tahu berisiko. Informasi penuh sebelum
memutuskan; kebalikan dari praktik menyembunyikan tujuan agar orderan diambil.

---

## 5. Privasi

Data lokasi warga miskin adalah data yang justru paling mudah disalahgunakan.

| Data | Disimpan | Dihapus |
| :--- | :--- | :--- |
| Lokasi pekerja saat aktif | ya, diperbarui saat aktif | begitu status non-aktif |
| Titik jemput/antar (presisi) | ya | **otomatis setelah 24 jam** |
| Titik jemput/antar (dibulatkan ~1 km) | ya, untuk statistik | 12 bulan |
| Riwayat jalur perjalanan | **tidak pernah direkam** | — |
| Nomor HP kedua pihak | ditampilkan hanya setelah cocok | ditutup 6 jam setelah selesai |
| Foto KTP | tidak (hanya hash + catatan pemeriksa) | dihapus setelah diperiksa |

Sengketa membekukan penghapusan sampai perkara selesai. Dashboard publik hanya
menampilkan angka agregat — tidak pernah cukup untuk mengenali satu orang.

Penghapusan dijalankan tugas terjadwal harian, dan **kodenya ada di repositori
publik** — sehingga klaim ini bisa diperiksa, bukan sekadar dipercaya. Itu bedanya
kebijakan privasi open source dengan kebijakan privasi 12 halaman.

---

## 6. Perlindungan bagi pengurus

Yang paling sering membunuh proyek komunitas bukan penipuan, tapi **kelelahan
relawan**.

- Pengurus **3 orang**, tidak boleh 1. Bergilir tiap 6 bulan.
- Pengurus dibayar honorarium dari surplus. Kerja tanpa upah tidak berkelanjutan, dan
  membayarnya secara terbuka jauh lebih sehat daripada berpura-pura ini semua gratis.
- Ada buku panduan tertulis untuk: server mati, sengketa, anggota baru, tutup buku
  bulanan. Kalau hanya ada di kepala satu orang, satu simpul mati saat orang itu pindah
  kota.
- Kunci akses (VPS, domain, rekening) dipegang minimal 2 orang, tercatat di anggaran
  dasar.
