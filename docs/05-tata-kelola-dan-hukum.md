# 05 — Tata Kelola & Hukum

> **Catatan penting:** bagian regulasi di bawah adalah kerangka berpikir dan daftar
> hal yang harus ditanyakan, **bukan nasihat hukum**. Sebelum satu simpul dibuka untuk
> publik, seluruh butir di §4 wajib dikonfirmasi ke penasihat hukum atau ke Dinas
> Koperasi setempat. Jangan menjalankan daftar ini berdasarkan dokumen ini saja.

---

## 1. Masalah kepemilikan

Draf awal tidak menjawab pertanyaan paling menentukan: **siapa pemilik VPS itu?**

Kalau jawabannya "saya", maka seluruh komunitas bergantung pada satu orang yang bisa
pindah kota, kehabisan uang, berubah pikiran, atau meninggal. Dan suatu hari nanti
akan datang seseorang menawarkan uang untuk membeli basis pengguna itu. Setiap
platform yang kini kita keluhkan dulunya juga dimulai dengan niat baik seseorang.

Niat baik bukan struktur. Yang dibutuhkan adalah bentuk kepemilikan yang membuat
pengambilalihan **tidak mungkin**, bukan sekadar tidak diinginkan.

---

## 2. Koperasi sebagai badan hukum

**Koperasi Jasa** menyelesaikan empat masalah sekaligus, dan tidak ada bentuk lain
yang begitu:

| Masalah | Bagaimana koperasi menyelesaikannya |
| :--- | :--- |
| Siapa yang boleh memungut iuran? | Koperasi berhak memungut iuran dari **anggotanya sendiri** — itu memang sifat dasarnya, bukan celah |
| Siapa pemilik aset? | Koperasi, bukan perorangan. Server, domain, dan rekening atas nama badan hukum |
| Bagaimana keputusan diambil? | Rapat Anggota, **satu anggota satu suara** — bukan satu rupiah satu suara |
| Bagaimana mencegah diambil alih? | Koperasi tidak punya saham untuk dibeli. Tidak ada pintu masuk bagi investor |

Bahwa pekerja adalah **pemilik**, bukan "mitra", juga mengubah bahasa sehari-harinya.
Di platform komersial, kata "mitra" dipakai untuk menghindari kewajiban perusahaan
terhadap pekerja. Di koperasi, kata itu benar secara harfiah.

**Urutan langkah:** jalankan Fase 0 sebagai kegiatan komunitas informal dulu (lihat
[06](06-roadmap.md)). Mendirikan koperasi butuh biaya, akta notaris, dan minimal
sejumlah anggota pendiri — jangan lakukan sebelum terbukti ada yang benar-benar
memakai. Tapi begitu iuran mulai dipungut atau Dana Senyum mulai dikumpulkan, badan
hukumnya **harus sudah ada lebih dulu**.

---

## 3. Federasi — banyak simpul, tanpa pusat

Satu instansi nasional akan mengulang persis kesalahan yang kita lawan: satu titik
kendali, satu titik kegagalan, satu titik untuk ditekan.

```
   Simpul Depok Sleman        Simpul Kampus UPN         Simpul Pasar Kotagede
   koperasi sendiri           koperasi sendiri          koperasi sendiri
   VPS sendiri                VPS sendiri               VPS sendiri
   data sendiri               data sendiri              data sendiri
        └──────────────── Daftar Simpul (publik, statis) ─────────────┘
                    hanya: nama, wilayah, URL, kontak pengurus
```

**Daftar Simpul** cuma sebuah berkas JSON di repositori — supaya warga bisa menemukan
simpul terdekat. Ia tidak memegang data, tidak memegang uang, dan tidak bisa
mematikan simpul mana pun. Kalau daftar itu hilang, semua simpul tetap jalan.

**Reputasi yang bisa dibawa pindah.** Anggota yang pindah kota mengekspor riwayatnya
sebagai berkas JSON bertanda tangan (Ed25519) dari simpul asal. Simpul tujuan boleh
menerimanya. Reputasi milik orangnya, bukan milik platform — kebalikan dari sekarang,
di mana rating 4,9 hasil kerja tiga tahun hangus begitu pindah aplikasi.

**Yang wajib sama antar simpul** (kalau tidak, ini bukan federasi, cuma nama yang
sama): tidak memegang uang; algoritma pencocokan dipublikasikan; laporan keuangan
publik bulanan; satu anggota satu suara; kode tetap AGPL. Simpul yang melanggar
dikeluarkan dari daftar dan kehilangan hak memakai nama.

---

## 4. Daftar periksa regulasi (wajib dikonfirmasi)

- [ ] **Badan hukum.** Pendirian koperasi jasa: syarat jumlah pendiri, akta notaris,
      pengesahan Kemenkumham, izin usaha. Tanyakan ke Dinas Koperasi & UKM setempat.
- [ ] **Pendaftaran sistem elektronik (PSE).** Sistem elektronik yang melayani publik
      umumnya wajib terdaftar di kementerian terkait. Umumnya gratis, tapi harus
      dilakukan sebelum publik memakai.
- [ ] **Angkutan roda dua.** Layanan ojek berbasis aplikasi diatur, termasuk soal
      keselamatan dan batas tarif untuk penyelenggara aplikasi. **Pertanyaan kunci yang
      harus dijawab pengacara:** apakah koperasi yang tidak memungut komisi dan tidak
      memegang uang tetap dianggap "aplikator"? Ini penentu apakah modul transport
      penumpang bisa dijalankan.
      → **Mitigasi praktis:** Fase 0 mulai dari **modul kurir barang dan jasa
      panggilan**, bukan mengangkut orang. Regulasinya jauh lebih ringan, dan nilai
      manfaatnya bagi warga tetap besar sejak hari pertama.
- [ ] **Pembayaran.** Selama platform tidak pernah memegang atau menyimpan nilai,
      perizinan penyelenggara jasa pembayaran seharusnya tidak berlaku. **Ini alasan
      utama larangan saldo/dompet di [02](02-model-ekonomi.md) dan ketiadaan tabel
      saldo di [03](03-arsitektur.md).** Jangan pernah dilonggarkan "sedikit saja" demi
      kemudahan — di situlah letak keseluruhan pertahanan hukumnya.
- [ ] **Perlindungan data pribadi.** UU PDP berlaku. Butuh: dasar pemrosesan yang sah,
      hak penghapusan, penanggung jawab yang jelas, dan prosedur kalau terjadi
      kebocoran. Kebijakan retensi di [04 §5](04-kepercayaan-dan-keamanan.md#privasi)
      dirancang mengarah ke sana, tapi harus ditinjau.
- [ ] **Penggalangan dana.** Dana Senyum adalah pengumpulan uang dari publik untuk
      tujuan sosial. Ada aturannya. Paling aman: salurkan lewat badan hukum yang tepat
      dan laporkan secara terbuka. Konfirmasi dulu sebelum tombol pembulatan diaktifkan.
- [ ] **Perpajakan.** Kewajiban pajak koperasi, dan status penghasilan anggota.

---

## 5. Lisensi

**AGPL-3.0**, dipilih dengan sadar.

MIT atau Apache akan mengizinkan siapa pun mengambil kode ini, menambahkan potongan
20%, escrow, dan tarif melonjak, lalu menjalankannya sebagai layanan tertutup —
memakai kerja kita untuk membangun persis hal yang kita lawan.

AGPL menutup celah itu: siapa pun boleh memodifikasi, tapi kalau dijalankan **sebagai
layanan bagi publik**, seluruh modifikasinya wajib dibuka. Artinya potongan
tersembunyi apa pun akan terlihat di kode. Fork komersial tetap boleh — tapi ia harus
bertanding di lapangan terbuka, melawan versi yang bisa dijalankan komunitas mana pun
secara gratis.

**Merek dagang** ditangani terpisah: nama dan logo dipegang koperasi. Fork boleh
memakai kodenya, tidak boleh memakai namanya. Ini yang mencegah orang mengaku sebagai
Simpul sambil melanggar prinsipnya.

---

## 6. Anggaran dasar — pasal yang mengunci

Klausul yang hanya bisa diubah lewat Rapat Anggota dengan kuorum tinggi, dan diumumkan
14 hari sebelumnya:

1. Koperasi **tidak boleh memegang, menyimpan, atau menyalurkan** pembayaran antara
   konsumen dan pekerja.
2. Iuran anggota **tidak boleh melebihi biaya operasional nyata** ditambah cadangan
   maksimal 3 bulan.
3. Kode sumber **tetap AGPL-3.0** selamanya. Tidak boleh ada bagian tertutup.
4. Algoritma pencocokan **wajib dipublikasikan** dan berlaku sama untuk semua anggota.
   Tidak ada prioritas berbayar.
5. Laporan keuangan **wajib publik setiap bulan**, lengkap sampai tingkat mutasi.
6. **Satu anggota satu suara.** Besarnya simpanan tidak menambah hak suara.
7. Kenaikan iuran wajib diumumkan **14 hari** sebelum berlaku, disertai perhitungan.
8. Koperasi **tidak boleh menjual data anggota** kepada siapa pun, dengan alasan apa
   pun.
9. Anggota **bebas memakai platform lain** secara bersamaan. Eksklusivitas dilarang.
10. Kalau koperasi bubar, aset dan kas sisa diserahkan kepada koperasi atau lembaga
    sosial lain yang berprinsip sama — **tidak dibagikan kepada perorangan.**

Pasal 10 adalah pagar terakhir: ia menghapus motif finansial untuk mengambil alih lalu
membubarkan. Tidak ada yang bisa diuangkan di ujungnya.
