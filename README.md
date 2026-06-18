# 🖥️ Asisten Riset: Generator Sitasi

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-success?style=for-the-badge&logo=github)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

Aplikasi web statis berbasis *Client-Side* untuk menyusun dan mengelola daftar pustaka secara otomatis. Dirancang dengan antarmuka bergaya **Developer Dark Mode** (seperti tampilan IDE / code editor), aplikasi ini dibangun untuk mempercepat produktivitas penyusunan referensi akademik — mulai dari laporan tugas kelompok, tugas akhir, hingga draf paper riset.

Sangat ideal untuk penyusunan sitasi pada karya tulis ilmiah di bidang *Software Engineering*, *Machine Learning*, maupun *Computer Vision* yang menuntut format referensi ketat (IEEE / APA).

🌐 **[Coba Aplikasi Langsung (Live Demo)](https://ichigosky21.github.io/generate-sitation/)**

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| ⚡ **DOI Auto-Fill** | Input DOI jurnal → metadata (Penulis, Judul, Tahun, Jurnal) terisi otomatis via CrossRef API |
| 📚 **Multi-Source Support** | Mendukung 5 jenis sumber: Jurnal, Buku, Konferensi, Website, Skripsi/Tesis |
| 🧠 **Smart Name Parsing** | Konversi nama otomatis — "John William Smith" → "J. W. Smith" (IEEE) atau "Smith, J. W." (APA) |
| 👥 **Multi-Author Support** | Input beberapa penulis sekaligus dengan pemisah koma; penggabungan `and` / `&` otomatis sesuai standar |
| 🏛️ **Org Author Mode** | Opsi untuk penulis berbentuk institusi/lembaga agar nama tidak diformat ulang |
| ⏱️ **Instant Generation** | Generate sitasi IEEE atau APA dalam satu klik; IEEE dilengkapi penomoran `[1]`, `[2]`, ... otomatis |
| 💾 **Persistent History** | Setiap sitasi tersimpan di *Local Storage* browser dan dapat diakses kapan saja |
| 🗑️ **Delete Per Item** | Hapus sitasi tertentu dari riwayat tanpa harus menghapus semuanya |
| 📥 **Export BibTeX** | Unduh file `.bib` siap pakai untuk Mendeley, Zotero, atau EndNote |
| 📄 **Export TXT** | Unduh file `.txt` terstruktur (IEEE & APA terpisah) untuk langsung di-*paste* ke Word |
| ⌨️ **Keyboard Shortcut** | Tekan `Ctrl + Enter` untuk langsung men-*generate* format IEEE |
| ✅ **Validasi Input** | Validasi tahun (1900–2099) dan field wajib per tipe sumber |

---

## 🛠️ Teknologi

Proyek ini dibangun *Native/Vanilla* tanpa framework eksternal — ringan, tidak ada dependensi, dan siap dijalankan langsung dari browser.

| Teknologi | Kegunaan |
|---|---|
| **HTML5** | Struktur antarmuka dan form semantik yang berubah dinamis sesuai tipe sumber |
| **CSS3** | Dark IDE theme menggunakan CSS Variables, Flexbox, dan JetBrains Mono web font |
| **Vanilla JavaScript** | `async/await` untuk DOI fetching, string manipulation untuk algoritma sitasi, DOM API, Local Storage API, Blob API |
| **CrossRef REST API** | Sumber data metadata DOI publik (`api.crossref.org`) |
| **BoxIcons** | Library ikon via CDN (`unpkg.com/boxicons`) |
| **JetBrains Mono** | Typeface monospace via Google Fonts |

---

## 🚀 Cara Penggunaan

### Akses via Web (Rekomendasi)
1. Buka **[Live Demo](https://ichigosky21.github.io/generate-sitation/)**
2. **(Opsional — cara cepat)** Tempel kode DOI jurnal di kolom *Auto-Fill via DOI*, tekan Enter atau klik **Auto-Fill** — semua field terisi otomatis
3. **(Atau manual)** Pilih tipe sumber (Jurnal / Buku / Konferensi / Website / Skripsi), lalu isi form yang muncul
4. Klik **Generate IEEE** atau **Generate APA** (atau tekan `Ctrl + Enter` untuk IEEE)
5. Hasil sitasi muncul di bawah — klik ikon salin untuk menyalinnya ke clipboard
6. Ulangi untuk semua referensi yang dibutuhkan; semua tersimpan otomatis di bagian **Riwayat**
7. Klik **Export .TXT** untuk unduh semua sitasi siap pakai, atau **Export BibTeX** untuk format `.bib`

### Menjalankan Secara Lokal
Tidak perlu server lokal — cukup buka file HTML langsung di browser.

```bash
# 1. Clone repository ini
git clone https://github.com/IchigoSky21/generate-sitation.git

# 2. Masuk ke folder
cd generate-sitation

# 3. Buka index.html di browser
#    Klik dua kali file index.html, atau gunakan Live Server di VS Code
```

> **Catatan:** Fitur DOI Auto-Fill memerlukan koneksi internet aktif karena memanggil CrossRef API secara langsung dari browser.

---

## 📂 Struktur File

```
generate-sitation/
├── index.html      # Struktur antarmuka dan semua elemen form
├── style.css       # Dark IDE theme — CSS Variables, layout, komponen visual
├── app.js          # Logika utama: generator sitasi, DOI fetch, history, export
├── README.md       # Dokumentasi proyek
└── LICENSE         # MIT License
```

---

## 📋 Format Sitasi yang Dihasilkan

### IEEE — Jurnal
```
[1] J. W. Smith and A. Doe, "Deep learning for pothole detection," IEEE Trans. Intell. Transp. Syst., vol. 25, no. 3, pp. 100–115, 2024. Available: https://doi.org/...
```

### APA — Jurnal
```
Smith, J. W. & Doe, A. (2024). Deep learning for pothole detection. IEEE Transactions on Intelligent Transportation Systems, 25(3), 100–115. https://doi.org/...
```

### IEEE — Prosiding Konferensi
```
[2] J. W. Smith, "Real-time object detection using YOLO," in Proc. International Conference on Computer Vision (ICCV), Bali, Indonesia, 2024, pp. 55–62.
```

### APA — Buku
```
Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep learning. MIT Press.
```

---

## 🤝 Berkontribusi

Kontribusi sangat disambut! Untuk melaporkan bug atau mengusulkan fitur baru:

1. **Fork** repository ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m 'Tambah: deskripsi singkat'`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buka **Pull Request**

Untuk bug yang ditemukan, silakan buka [Issue baru](https://github.com/IchigoSky21/generate-sitation/issues).

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan apapun selama mencantumkan atribusi aslinya. Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

<div align="center">
  <sub>Dibuat dengan ☕ untuk mahasiswa yang lelah menyusun daftar pustaka secara manual.</sub>
</div>
