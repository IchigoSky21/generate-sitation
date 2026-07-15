# 📚 Asisten Riset: Generator Sitasi

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-success?style=for-the-badge&logo=github)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet?style=for-the-badge&logo=pwa)

Aplikasi web statis berbasis *Client-Side* untuk menyusun dan mengelola daftar pustaka secara otomatis. Dirancang dengan antarmuka bergaya **Meja Kerja Akademik** — modern, informatif, dan mendukung **Dark Mode** — aplikasi ini mempercepat produktivitas penyusunan referensi akademik untuk laporan tugas kelompok, tugas akhir, hingga draf paper riset.

Sangat ideal untuk penyusunan sitasi pada karya tulis ilmiah yang menuntut format referensi ketat (IEEE / APA).

🌐 **[Coba Aplikasi Langsung (Live Demo)](https://generate-sitation-app.vercel.app/)**

---

## ✨ Fitur Lengkap

### 🔍 Input & Auto-Fill
| Fitur | Deskripsi |
|---|---|
| **DOI Auto-Fill** | Tempel DOI jurnal → metadata (Penulis, Judul, Tahun, Jurnal, Volume, Issue, Halaman) terisi otomatis via CrossRef API |
| **Deteksi DOI dari PDF** | Seret (drag & drop) atau pilih file PDF jurnal → sistem membaca 3 halaman pertama & metadata file untuk menemukan DOI, lalu auto-fill otomatis |
| **Keyword Search** | Ketik judul atau kata kunci → sistem mencari di CrossRef (jurnal/artikel) atau **Google Books** (saat tipe sumber Buku dipilih) → pilih dari hasil → form terisi otomatis |
| **5 Tipe Sumber** | Mendukung: Artikel Jurnal, Buku, Prosiding Konferensi, Website, dan Skripsi/Tesis dengan form yang menyesuaikan secara dinamis |
| **Input Manual** | Isi form secara manual jika DOI tidak tersedia |

### 🧠 Format & Algoritma
| Fitur | Deskripsi |
|---|---|
| **Smart Name Parsing** | Konversi nama otomatis: "John William Smith" → `J. W. Smith` (IEEE) atau `Smith, J. W.` (APA) |
| **Multi-Author Support** | Pisahkan penulis dengan koma; penggabungan `and` / `&` otomatis sesuai standar masing-masing format |
| **Org Author Mode** | Checkbox khusus untuk penulis berbentuk institusi/lembaga agar nama tidak diformat ulang |
| **IEEE Sentence Case** | Judul artikel IEEE otomatis diformat Sentence case (hanya huruf pertama kapital) |
| **APA Sentence Case** | Judul artikel APA juga menggunakan Sentence case sesuai standar |

### ⚡ Generate & Riwayat
| Fitur | Deskripsi |
|---|---|
| **Instant Generation** | Generate sitasi IEEE atau APA dalam satu klik; IEEE dilengkapi penomoran `[1]`, `[2]`, ... otomatis |
| **Ctrl + Enter** | Keyboard shortcut untuk langsung generate IEEE tanpa klik tombol |
| **Persistent History** | Setiap sitasi tersimpan di *Local Storage* browser dapat diakses kapan saja, bahkan setelah tab ditutup |
| **Renumber IEEE Otomatis** | Setelah item dihapus, nomor IEEE yang tersisa langsung diperbarui ulang tanpa gap: `[1][3]` → `[1][2]` |
| **Hapus Per-Item** | Hapus satu sitasi tertentu dari riwayat tanpa menghapus semua |

### 📤 Export & Import
| Fitur | Deskripsi |
|---|---|
| **Export BibTeX** | Unduh file `.bib` dengan entry type yang tepat per tipe sumber (`@article`, `@book`, `@inproceedings`, `@misc`, `@mastersthesis`) siap pakai di Mendeley, Zotero, atau EndNote |
| **Import BibTeX** | Punya file `.bib` dari Mendeley/Zotero? Import langsung ke riwayat sebagai sitasi IEEE (best-effort, mendukung banyak entri, multi-author, dan format `Nama Belakang, Nama Depan`) |
| **Export TXT** | Unduh file `.txt` terstruktur (IEEE dan APA dipisahkan) untuk langsung *paste* ke Microsoft Word |
| **Export/Import Project Bundle (.json)** | Bagikan seluruh riwayat sitasi ke anggota kelompok tanpa server cukup export file `.json`, kirim ke teman, mereka tinggal import untuk menggabungkan (merge, bukan menimpa) riwayat mereka |

### 🎨 Tampilan & UX
| Fitur | Deskripsi |
|---|---|
| **Meja Kerja Akademik Theme** | Palet indigo & amber yang konsisten di light dan dark mode; font **Inter** (sans) untuk seluruh antarmuka/tombol, font **Lora** (serif) khusus untuk teks hasil sitasi memisahkan "kontrol" dari "konten dokumen" secara visual |
| **Dark / Light Mode** | Toggle tema di pojok kanan atas viewport; preferensi tersimpan dan langsung diterapkan tanpa *flash* (Anti-FOUC) |
| **Toast Notifications** | Semua `alert()` diganti dengan notifikasi non-blocking di pojok layar; progress bar + tombol tutup manual |
| **Custom Confirm Dialog** | Semua `confirm()` diganti dengan dialog modal bergaya yang mendukung tema, keyboard (Enter/Escape), dan klik di luar |
| **Validasi Input** | Validasi field wajib dan tahun (1900–2099) dengan pesan error yang jelas |

### 🌐 PWA & SEO
| Fitur | Deskripsi |
|---|---|
| **PWA** | Dapat di-install ke homescreen (Android/iOS/Desktop) dan berjalan offline via Service Worker |
| **SEO Lengkap** | Meta title, description, keywords, Open Graph (Facebook), Twitter Card, dan `sitemap.xml` |
| **robots.txt** | Konfigurasi crawler search engine yang tepat |

---

## 🛠️ Teknologi

Dibangun *Native/Vanilla* tanpa framework eksternal ringan, tidak ada dependensi, dan siap dijalankan langsung dari browser.

| Teknologi | Kegunaan |
|---|---|
| **HTML5** | Struktur antarmuka dan form semantik yang berubah dinamis sesuai tipe sumber |
| **CSS3** | Tema Meja Kerja Akademik dengan CSS Variables, Flexbox, dark/light mode, dan transisi halus |
| **Vanilla JavaScript** | `async/await` untuk API fetching, algoritma parsing nama, DOM API, Local Storage API, Blob API, File API |
| **CrossRef REST API** | Sumber data publik untuk DOI lookup (`/works/{DOI}`) dan keyword search jurnal/artikel (`/works?query=...`) |
| **Google Books API** | Fallback keyword search khusus tipe sumber Buku (`/books/v1/volumes?q=...`), karena CrossRef kurang kuat untuk data buku |
| **pdf.js (Mozilla)** | Dimuat *lazy* dari CDN hanya saat fitur drag & drop PDF dipakai; membaca teks & metadata PDF untuk mendeteksi DOI otomatis |
| **Inter** | Typeface sans-serif via Google Fonts untuk seluruh elemen antarmuka (tombol, label, navigasi) |
| **Lora** | Typeface serif via Google Fonts, dipakai khusus untuk teks hasil sitasi & riwayat agar visualnya beda dari elemen UI |
| **BoxIcons** | Library ikon via CDN (`unpkg.com/boxicons`) |
| **Service Worker** | Cache aset untuk penggunaan offline dan peningkatan performa |

---

## 🚀 Cara Penggunaan

### Akses via Web (Rekomendasi)

1. Buka **[Live Demo](https://ichigosky21.github.io/generate-sitation/)**

2. **Pilih salah satu cara input:**

   | Cara | Kapan Digunakan |
   |---|---|
   | **DOI Auto-Fill** | Kamu sudah punya kode DOI jurnal (misal: `10.1109/TITS.2024.xxx`) |
   | **Seret File PDF** | Kamu punya file PDF jurnal tapi belum tahu/malas cari kode DOI-nya |
   | **Keyword Search** | Kamu hanya tahu judul atau topik ketik keyword, pilih dari hasil (CrossRef untuk jurnal, Google Books untuk buku) |
   | **Manual** | Sumber tidak memiliki DOI (buku tua, skripsi, website) |

3. Pilih **Tipe Sumber** (Jurnal / Buku / Konferensi / Website / Skripsi), lalu lengkapi field yang muncul.

4. Klik **Generate IEEE** atau **Generate APA** (atau tekan `Ctrl + Enter` untuk IEEE).

5. Hasil sitasi muncul di kotak bawah klik ikon salin untuk menyalinnya ke clipboard.

6. Ulangi untuk semua referensi yang dibutuhkan; semua tersimpan otomatis di bagian **Riwayat**.

7. Klik **Export .TXT** atau **Export BibTeX** saat semua referensi sudah terkumpul.

> **Sudah punya daftar pustaka dari aplikasi lain?** Klik **Import .bib** untuk membawa masuk file BibTeX dari Mendeley/Zotero. Untuk kerja kelompok, satu anggota bisa **Export Bundle** (.json) lalu anggota lain **Import Bundle** untuk menggabungkan riwayat tanpa perlu server/akun bersama.

---

### Menjalankan Secara Lokal

Tidak perlu server lokal cukup buka file HTML langsung di browser.

```bash
# 1. Clone repository ini
git clone https://github.com/IchigoSky21/generate-sitation.git

# 2. Masuk ke folder
cd generate-sitation

# 3. Buka index.html di browser
#    Klik dua kali file index.html, atau gunakan Live Server di VS Code
```

> **Catatan:** Fitur DOI Auto-Fill, Keyword Search, dan Google Books memerlukan koneksi internet aktif karena memanggil API pihak ketiga langsung dari browser. Fitur deteksi DOI dari PDF juga memerlukan koneksi saat pertama kali dipakai (untuk memuat library `pdf.js` dari CDN).

---

## 📋 Contoh Output Sitasi

### IEEE — Jurnal
```
[1] J. W. Smith and A. Doe, "Deep learning for pothole detection," IEEE Trans.
    Intell. Transp. Syst., vol. 25, no. 3, pp. 100–115, 2024.
    Available: https://doi.org/10.1109/TITS.2024.xxx.
```

### APA — Jurnal
```
Smith, J. W. & Doe, A. (2024). Deep learning for pothole detection.
IEEE Transactions on Intelligent Transportation Systems, 25(3), 100–115.
https://doi.org/10.1109/TITS.2024.xxx
```

### IEEE — Prosiding Konferensi
```
[2] J. W. Smith, "Real-time object detection using YOLO," in Proc. International
    Conference on Computer Vision (ICCV), Bali, Indonesia, 2024, pp. 55–62.
```

### APA — Buku
```
Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep learning. MIT Press.
```

### IEEE — Skripsi
```
[3] B. Santoso, "Sistem deteksi penipuan transaksi menggunakan random forest,"
    Skripsi, Binus University, 2024.
```

---

## 📂 Struktur File

```
generate-sitation/
├── index.html       # Antarmuka utama + semua elemen form + keyword search
├── style.css        # Tema Meja Kerja Akademik, dark mode, toast, confirm dialog, search panel, PDF dropzone
├── app.js           # Logika: generator sitasi, DOI fetch (teks & PDF), keyword search, import/export .bib & bundle, history, dark mode
├── sw.js            # Service Worker untuk PWA & caching offline
├── manifest.json    # PWA manifest (nama, ikon, warna tema)
├── sitemap.xml      # Sitemap untuk SEO
├── robots.txt       # Konfigurasi crawler
├── icon-192.png     # PWA icon 192×192
├── icon-512.png     # PWA icon 512×512
├── preview.png      # OG image untuk social sharing
├── README.md        # Dokumentasi proyek ini
└── LICENSE          # MIT License
```

---

## 🔄 Riwayat Pengembangan

| Versi | Perubahan Utama |
|---|---|
| **v1 — Awal** | Generator IEEE & APA dasar, Local Storage history, export BibTeX |
| **v2 — Bug Fix** | Perbaikan format nama penulis IEEE (`J. W. Smith`) dan APA (`Smith, J. W.`), Sentence case judul |
| **v3 — Multi-Source** | Dukungan 5 tipe sumber dengan form dinamis, field volume/issue/pages, validasi input |
| **v4 — DOI & API** | DOI Auto-Fill via CrossRef, multi-author support, org author mode |
| **v5 — UX Polish** | Toast notifications, custom confirm dialog, tombol hapus per-item, export TXT |
| **v6 — Tema & PWA** | Library Card Catalog theme, dark/light mode toggle, PWA, SEO lengkap |
| **v7 — Renumber** | Auto-renumber IEEE setelah hapus, sinkronisasi `ieeeCounter` |
| **v8 — Search** | **Keyword Search via CrossRef** cari jurnal by keyword, pilih dari hasil, form terisi otomatis |
| **v9 — Keamanan & Stabilitas** | Perbaikan celah XSS pada riwayat sitasi & notifikasi (escaping HTML), perbaikan *memory leak* pada dialog konfirmasi, escaping karakter khusus di export BibTeX, timeout pada permintaan DOI |
| **v10 — Tema Baru** | Desain ulang tema jadi **Meja Kerja Akademik**: palet indigo/amber konsisten light-dark, font Inter (UI) + Lora (konten sitasi), signature aksen garis di setiap kartu |
| **v11 — Import/Export & Sumber Baru** | **Import BibTeX**, **Export/Import Project Bundle** untuk kerja kelompok, fallback **Google Books** untuk tipe sumber Buku, **deteksi DOI dari file PDF** (drag & drop), perbaikan tampilan form multi-kolom yang melebihi batas kartu |

---

## 🤝 Berkontribusi

Kontribusi sangat disambut! Untuk melaporkan bug atau mengusulkan fitur baru:

1. **Fork** repository ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: deskripsi singkat'`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buka **Pull Request**

Untuk bug yang ditemukan, silakan buka [Issue baru](https://github.com/IchigoSky21/generate-sitation/issues).

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan apapun selama mencantumkan atribusi aslinya. Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

<div align="center">
  <sub>Dibuat dengan ☕ untuk mahasiswa yang lelah menyusun daftar pustaka secara manual.</sub>
  <br>
  <sub>
    <a href="https://ichigosky21.github.io/generate-sitation/">Live Demo</a> ·
    <a href="https://github.com/IchigoSky21/generate-sitation/issues">Laporkan Bug</a> ·
    <a href="https://github.com/IchigoSky21/generate-sitation/issues">Usulkan Fitur</a>
  </sub>
</div>
