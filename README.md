# 📜 Asisten Riset: Generator Sitasi (Retro Edition)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-success?style=for-the-badge&logo=github)

Aplikasi web statis berbasis *Client-Side* untuk manajemen dan perakitan daftar pustaka secara otomatis. Dirancang dengan antarmuka bergaya *Retro Vintage / Neobrutalism* (layaknya mesin tik klasik), web ini dibangun untuk membantu mempercepat produktivitas penyusunan referensi akademik, laporan tugas kelompok, hingga draf proposal proyek riset.

Sangat ideal digunakan untuk perakitan sitasi pada paper riset berbasis teknologi yang membutuhkan standar ketat, seperti pada ranah *Software Engineering*, *Machine Learning*, maupun *Computer Vision*.

🌐 **[Coba Aplikasi Langsung (Live Demo) Di Sini](https://ichigosky21.github.io/generate-sitation/)**

---

## ✨ Fitur Utama (Major Update)

- **⚡ DOI Auto-Fill (Integrasi CrossRef API):** Tidak perlu mengetik manual! Cukup masukkan tautan DOI jurnal, dan sistem akan menarik metadata (Penulis, Judul, Tahun, Jurnal) secara otomatis melalui metode *asynchronous fetching*.
- **📚 Multi-Source Support:** Mendukung pembuatan sitasi dari berbagai sumber: Artikel Jurnal, Buku, Prosiding Konferensi, Skripsi/Tesis, dan Website. Formulir akan menyesuaikan secara dinamis (*Dynamic UI*) sesuai jenis sumber yang dipilih pengguna.
- **🧠 Smart Name Parsing:** Algoritma cerdas yang mendeteksi dan mengonversi input nama penulis menjadi format baku secara otomatis (misal: mengubah "John William Smith" menjadi "J. W. Smith" untuk format IEEE, atau "Smith, J. W." untuk format APA).
- **⏱️ Instant Generation:** Merakit sitasi standar **IEEE** dan **APA** hanya dengan satu kali klik, lengkap dengan penanda visual (indikator tombol aktif).
- **💾 Local Storage History:** Setiap sitasi yang di-*generate* akan otomatis tersimpan di riwayat *browser* sebagai satu kesatuan daftar pustaka yang bisa diakses kapan saja.
- **📥 Export ke BibTeX & TXT:** 
  - Unduh format `.bib` untuk integrasi mudah dengan *Reference Manager* seperti Mendeley, Zotero, atau EndNote.
  - Unduh format `.txt` yang sudah terstruktur rapi untuk langsung di-*copy-paste* ke laporan Microsoft Word Anda.
- **🎨 Retro Interactive UI:** Tampilan visual klasik dengan tombol interaktif bergaya blok mekanik mesin tik.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini sepenuhnya dibangun secara *Native/Vanilla* tanpa *framework* eksternal untuk memastikan performa yang ringan dan struktur kode yang bersih:
* **HTML5:** Kerangka antarmuka dan formulir semantik yang dinamis.
* **CSS3:** Desain *custom* bergaya Neobrutalism menggunakan *CSS Variables*, *Flexbox*, dan tipografi *web fonts* klasik (Courier Prime & Playfair Display).
* **Vanilla JavaScript:** Menggunakan `async/await` untuk pemrosesan API pihak ketiga, manipulasi *String/Array* tingkat lanjut untuk algoritma perakitan sitasi, *DOM Manipulation*, *Local Storage API*, dan pembuatan file via *Blob API*.

---

## 🚀 Cara Penggunaan

### Akses via Web (Rekomendasi)
1. Buka tautan **[Live Demo](https://ichigosky21.github.io/generate-sitation/)**.
2. (Opsional) Masukkan kode DOI jurnal dan klik ikon pencarian untuk melakukan *auto-fill* data.
3. Atau, pilih jenis referensi (Jurnal, Buku, dll) pada *dropdown* dan masukkan data secara manual.
4. Klik tombol **Generate IEEE** atau **Generate APA**.
5. Hasil akan muncul di kotak bawah dan langsung tersimpan di bagian Riwayat.
6. Kumpulkan seluruh referensi Anda, lalu klik **Export BibTeX** atau **Export .TXT** sesuai kebutuhan.

### Menjalankan Secara Lokal
Karena proyek ini adalah file statis, Anda tidak memerlukan instalasi *server* lokal (*backend*).
1. *Clone repository* ini:
```bash
   git clone [https://github.com/ichigosky21/generate-sitation.git](https://github.com/ichigosky21/generate-sitation.git)
