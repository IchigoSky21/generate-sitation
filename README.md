# 📜 Asisten Riset: Generator Sitasi (Retro Edition)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-success?style=for-the-badge&logo=github)

Aplikasi web statis berbasis *Client-Side* untuk merakit daftar pustaka standar **IEEE** dan **APA** secara otomatis. Dirancang dengan antarmuka bergaya *Retro Vintage / Neobrutalism*, web ini dibangun untuk membantu mempercepat produktivitas penyusunan referensi akademik, laporan tugas akhir, hingga persiapan makalah.

Sangat ideal digunakan untuk perakitan sitasi pada paper riset berbasis teknologi yang membutuhkan standar sitasi ketat, seperti pada ranah *Software Engineering*, *Machine Learning*, maupun *Computer Vision*.

🌐 **[Coba Aplikasi Langsung (Live Demo) Di Sini](https://ichigosky21.github.io/generate-sitation/)**

---

## ✨ Fitur Utama

- **⏱️ Instant Generation:** Merakit sitasi standar IEEE (fokus penomoran) dan APA (fokus penulis-tahun) hanya dengan satu kali klik.
- **🧠 Smart Text Formatter:** Dilengkapi pemrosesan teks otomatis yang mendeteksi dan mengonversi input pengguna menjadi kapitalisasi baku akademik (*Title Case* untuk nama jurnal, *Sentence Case* untuk judul artikel APA), sehingga meminimalisir *typo*.
- **💾 Local Storage History:** Setiap sitasi yang di-generate akan otomatis tersimpan di riwayat *browser* sebagai satu kesatuan daftar pustaka yang bisa diakses kapan saja.
- **📥 Export ke BibTeX:** Mendukung integrasi dengan alur kerja perangkat lunak riset lanjutan. Unduh seluruh riwayat sitasi ke dalam format `.bib` dalam hitungan detik.
- **🎨 Retro Interactive UI:** Tampilan Neobrutalism klasik dengan tombol interaktif bergaya mekanik mesin tik.
- **📖 Pojok Literasi:** Menyediakan konteks edukatif mengenai integritas akademik, pentingnya sitasi, dan perbedaan format sitasi untuk pengguna awam.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini sepenuhnya dibangun secara *Native/Vanilla* tanpa *framework* eksternal untuk memastikan performa yang sangat ringan dan aksesibilitas *offline-ready*:
* **HTML5:** Kerangka antarmuka dan formulir semantik.
* **CSS3:** Desain kustom menggunakan *CSS Variables*, *Flexbox*, tata letak responsif, dan *web fonts* (Courier Prime & Playfair Display).
* **Vanilla JavaScript:** Logika *Template Literals* untuk perakitan string, *DOM Manipulation*, *Local Storage API*, dan *Blob API* untuk mengunduh file BibTeX.

---

## 🚀 Cara Penggunaan

### Akses via Web (Rekomendasi)
1. Buka tautan **[Live Demo](https://ichigosky21.github.io/generate-sitation/)**.
2. Masukkan data referensi jurnal, buku, atau repositori *code* Anda ke dalam formulir.
3. Klik tombol **Generate IEEE** atau **Generate APA**. 
4. Hasil akan muncul di kotak bawah. Klik ikon 📄 untuk langsung menyalin (Copy) teks ke *clipboard*.
5. Kumpulkan beberapa sitasi, lalu klik **Export BibTeX** di menu riwayat jika ingin memindahkannya ke aplikasi *Reference Manager* Anda.

### Menjalankan Secara Lokal
Karena proyek ini adalah file statis, Anda tidak memerlukan instalasi *server* lokal (seperti Node.js atau XAMPP).
1. *Clone repository* ini:
   ```bash
   git clone [https://github.com/ichigosky21/generate-sitation.git](https://github.com/ichigosky21/generate-sitation.git)
