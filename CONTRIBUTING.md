# Berkontribusi

Sebelum menambah fitur, baca [docs/06-roadmap.md](docs/06-roadmap.md) — proyek ini
sengaja dibatasi per fase. Aturan tunggal: **jangan tambah fitur untuk mengobati
sepi**. Kalau sebuah pilot sepi pemakai, perbaikannya memperkecil wilayah atau ganti
modul, bukan menambah kode.

Beberapa batasan yang tidak bisa ditawar (lihat [docs/05 §6](docs/05-tata-kelola-dan-hukum.md#6-anggaran-dasar--pasal-yang-mengunci)):

- Kode tidak pernah menahan atau menyalurkan pembayaran (zero-escrow).
- Semua perubahan tetap AGPL-3.0.
- Algoritma pencocokan (termasuk Prioritas Sepi) harus tetap terbuka dan berlaku
  sama untuk semua pekerja — tidak ada prioritas berbayar.

## Alur

1. Fork / branch dari `main`.
2. `npm install`, jalankan lokal dengan bot token pribadi (buat lewat @BotFather).
3. PR kecil, satu perubahan logis per PR.
