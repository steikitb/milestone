# 01 — Analisis Konsep Awal

Dokumen asli: [`arsip/CONCEPT_UNIVERSAL_GIG_ENGINE_v0.md`](../arsip/CONCEPT_UNIVERSAL_GIG_ENGINE_v0.md)

Draf pertama sudah benar di banyak hal mendasar. Bagian ini memisahkan mana yang
dipertahankan, mana yang perlu diperbaiki, dan mana yang **akan patah** kalau
diteruskan apa adanya.

---

## A. Yang sudah benar dan dipertahankan penuh

**1. Zero Escrow.** Ini keputusan paling penting di seluruh dokumen, dan alasannya
lebih dalam dari sekadar "hemat biaya payment gateway":

- Menahan uang orang lain = butuh izin sebagai penyelenggara jasa pembayaran. Itu
  modal disetor miliaran, audit, dan kepatuhan yang mustahil untuk proyek komunitas.
- Escrow adalah **sumber kekuasaan platform**. Selama platform memegang uang, ia
  bisa menahan, mendenda, dan menekan. Tanpa escrow, platform kehilangan kemampuan
  untuk menjadi tengkulak — secara struktural, bukan karena janji.
- Biaya nol. QRIS statis pribadi dan uang tunai tidak menagih apa pun.

Konsekuensinya berat (tidak ada jaminan pembayaran, tidak ada refund otomatis), dan
itu ditangani serius di [04 — Kepercayaan & Keamanan](04-kepercayaan-dan-keamanan.md).
Tapi keputusannya tetap: **jangan pernah menyentuh uang orang.**

**2. Hyperlocal, bukan nasional.** Benar. Marketplace hidup dari kepadatan, bukan
luas wilayah. 50 pengemudi di satu kecamatan jauh lebih berguna daripada 5.000
pengemudi tersebar di 34 provinsi. Ini juga yang membuat biaya server tetap kecil
dan penyelesaian sengketa bisa dilakukan tatap muka.

**3. Satu core, banyak modul.** Ojek, antar makanan, servis AC, hasil panen — semuanya
bentuk yang sama: *permintaan berlokasi → dicocokkan dengan penyedia terdekat →
selesai → bayar langsung*. Membangun satu mesin dan mengaktifkan modul jauh lebih
murah daripada empat aplikasi.

**4. Transparansi biaya sebagai fitur produk.** Dashboard publik bukan hiasan. Ia
adalah **bukti** bahwa tidak ada yang diambil diam-diam — satu-satunya pengganti dari
kepercayaan yang biasanya dibeli dengan merek dan iklan.

---

## B. Empat hal yang akan patah

### ⚠️ B1. "Saldo Token Karcis" adalah uang elektronik — dan itu masalah hukum

Ini temuan paling serius dari draf awal.

Draf menulis: *"Saldo token teknisi di sistem berkurang 1 Karcis (Rp 200)."* Saldo
berarti pengguna **menyetor uang lebih dulu**, dan platform menyimpannya sebagai nilai
yang bisa dibelanjakan nanti. Itu adalah definisi praktis dari uang elektronik/
stored value.

Artinya seluruh manfaat "Zero Escrow" batal di modul iuran. Pintu depan dikunci,
pintu belakang dibuka lebar.

**Perbaikan — jangan ada saldo sama sekali.** Ganti prabayar dengan **iuran anggota
pascabayar**: sistem hanya *mencatat* jumlah transaksi, lalu di akhir bulan anggota
membayar iuran ke **rekening koperasi**, bukan ke platform. Platform tidak pernah
memegang nilai apa pun; ia hanya buku catatan. Koperasi memang berhak dan lazim
memungut iuran dari anggotanya.

Lebih jauh lagi, [02 — Model Ekonomi](02-model-ekonomi.md) mengusulkan menghapus
per-transaksi sepenuhnya dan menggantinya dengan iuran bulanan berjenjang — yang
sekalian menyelesaikan B2 dan B3 di bawah.

### ⚠️ B2. Tarif "gratis setelah target tercapai" menghukum yang rajin di awal bulan

Mekanik di draf: Rp 200/transaksi sampai target Rp 150.000 tercapai, lalu gratis
sampai akhir bulan.

Dengan volume 13.000 transaksi/bulan (50 pengemudi × 26 hari × 10 orderan), target
Rp 150.000 tercapai setelah **750 transaksi** — kira-kira **hari kedua**.

Hasilnya: pengemudi yang bekerja tanggal 1–2 menanggung **seluruh** biaya server satu
komunitas selama sebulan. Yang mulai tanggal 5 tidak membayar apa pun. Ini bukan
gotong royong, ini lomba lari. Dan yang kalah biasanya justru yang paling butuh —
orang yang harus keluar pagi-pagi setiap hari.

**Perbaikan:** iuran bulanan berjenjang, bukan karcis per transaksi. Adil menurut
pemakaian, bukan menurut siapa yang paling cepat.

### ⚠️ B3. Rp 200 per transaksi ± 17× lebih mahal dari biaya sebenarnya

Biaya riil per transaksi:

```
Rp 150.000 biaya bulanan ÷ 13.000 transaksi = Rp 11,5 per transaksi
```

Menetapkan Rp 200 berarti memungut ~17 kali lipat dari yang dibutuhkan. Untuk proyek
yang seluruh legitimasinya bersandar pada kata *at-cost*, angka yang tidak nyambung
dengan biaya nyata adalah kerusakan kepercayaan — persis kritik yang kita lontarkan
ke platform komersial.

**Perbaikan:** tarif apa pun harus diturunkan dari biaya nyata dan dipublikasikan
bersama perhitungannya. Kalau memang mau memungut lebih, sebut terus terang sebagai
*surplus untuk Dompet Senyum*, jangan disamarkan sebagai biaya.

### ⚠️ B4. Karcis per transaksi menciptakan insentif untuk berbohong

Selama "selesai" memicu potongan, sebagian orang akan berhenti menekan "selesai".
Lalu dibutuhkan deteksi kecurangan, sanksi, dan pengawasan — seluruh aparatus
kepolisian internal yang justru membuat platform komersial menyebalkan.

**Perbaikan:** iuran bulanan flat memutus hubungan antara "menandai selesai" dan
"membayar". Sekarang menandai selesai justru **menguntungkan** anggota, karena itulah
yang membangun reputasinya. Insentifnya searah, dan seluruh kelas masalah ini hilang
tanpa satu baris kode anti-fraud pun.

---

## C. Koreksi teknis pada draf

| Item di draf | Masalah | Perbaikan |
| :--- | :--- | :--- |
| **Nominatim self-hosted** | Butuh puluhan GB disk dan RAM besar untuk impor data. Tidak muat di VPS kecil. | **Hapus geocoding sepenuhnya.** Pengguna menyematkan pin di peta atau memakai *share location* bawaan Telegram. Alamat tersimpan diberi label sendiri ("Rumah", "Warung Bu Tini"). Tidak ada yang perlu dicari. |
| **OSRM/Valhalla self-hosted** | Praproses butuh RAM beberapa GB; menambah biaya VPS berlipat sejak hari pertama. | Fase 0–1 pakai **haversine × 1,3** (faktor belok jalan kota). Cukup akurat untuk tarif berbasis jarak. Pasang OSRM hanya kalau sengketa jarak benar-benar muncul. |
| **Ubin peta OSM publik** | Server ubin OpenStreetMap punya kebijakan pemakaian; aplikasi produksi tidak boleh menyedot gratis. | Fase 0 tidak butuh peta sama sekali (Telegram). Saat PWA dibuat, pakai penyedia ubin yang mengizinkan atau self-host ubin satu kota (ukurannya kecil). |
| **"PHP 8 atau Node.js"** | Bot Telegram butuh proses yang hidup terus; PHP klasik per-request tidak cocok tanpa worker terpisah. | **Node.js + Fastify + SQLite (WAL).** Satu proses melayani bot, API, dan SSE sekaligus. Lebih sedikit bagian yang bisa rusak. |
| **PWA Web Push** | Di iOS hanya jalan kalau PWA dipasang ke home screen (iOS 16.4+); pengiriman tidak selalu andal di HP Android murah dengan pembatasan baterai agresif. | **Telegram sebagai kanal notifikasi utama untuk pekerja.** Gratis, andal, hemat kuota, dan sudah punya lokasi + verifikasi nomor bawaan. Web Push hanya pelengkap. |

Catatan jujur soal Telegram: di Indonesia WhatsApp jauh lebih umum. Tapi WhatsApp
Business API berbayar per percakapan — persis jenis biaya yang ingin kita hindari.
Telegram gratis dan tanpa batas. Konsekuensinya adalah gesekan saat mengajak orang
memasang aplikasi baru, dan itu harus diakui sebagai biaya pendaftaran anggota, bukan
diabaikan.

---

## D. Yang hilang dari draf dan ditambahkan

1. **Badan hukum dan kepemilikan.** Siapa pemilik VPS itu? Kalau satu orang, seluruh
   komunitas bergantung pada niat baik dan umur satu orang. → [05](05-tata-kelola-dan-hukum.md)
2. **Kepercayaan tanpa escrow.** Draf menghapus escrow tapi tidak menggantikan
   fungsinya. Apa yang terjadi kalau pelanggan tidak membayar? → [04](04-kepercayaan-dan-keamanan.md)
3. **Keselamatan dan kecelakaan.** Platform komersial memberi asuransi perjalanan.
   Kita tidak bisa. Harus ada jawaban jujur. → [04](04-kepercayaan-dan-keamanan.md#keselamatan)
4. **Masalah ayam-telur.** Pasar dua sisi tanpa kepadatan akan mati sunyi dalam dua
   minggu. Ini risiko nomor satu, jauh di atas risiko teknis mana pun. → [06](06-roadmap.md)
5. **Definisi berhasil.** GMV adalah metrik yang salah untuk proyek ini. → [06](06-roadmap.md#metrik)
