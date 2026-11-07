# SEO Operations

## Publikasi artikel

1. Cari topik yang naik di Google Trends Indonesia dan validasi judulnya di TMDB atau sumber resmi.
2. Buat artikel dengan pendapat editor, rating internal, data pemeran, durasi, genre, tanggal pembaruan, dan tautan terkait.
3. Tambahkan artikel evergreen ke kartu artikel di `src/pages/Home/BlogPage.jsx`; build akan memasukkan URL ke sitemap beserta `lastmod`.
4. Setelah deploy, periksa sitemap dan inspeksi URL di Google Search Console. Minta indexing hanya untuk artikel yang sudah final.

## Pengukuran

- Pantau query dengan impression tinggi dan CTR rendah.
- Perbarui judul/meta description tanpa mengubah URL.
- Periksa Core Web Vitals setiap bulan.
- Jangan membuat halaman kota atau artikel yang belum memiliki informasi yang benar-benar berguna.

## Batasan data

Jadwal bioskop dan tren berubah cepat. Halaman kota menyediakan panduan lokal dan harus dilengkapi data jadwal terverifikasi sebelum diklaim sebagai jadwal aktual.
