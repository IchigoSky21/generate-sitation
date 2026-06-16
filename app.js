document.addEventListener('DOMContentLoaded', () => {
    // Menangkap elemen HTML
    const btnIEEE = document.getElementById('btn-ieee');
    const btnAPA = document.getElementById('btn-apa');
    const resultCard = document.getElementById('result-card');
    const outputText = document.getElementById('output-text');
    const typeLabel = document.getElementById('citation-type-label');
    const btnCopy = document.getElementById('btn-copy');

    // Fungsi untuk mengambil dan membersihkan data dari form
    function getFormData() {
        return {
            author: document.getElementById('input-author').value.trim(),
            title: document.getElementById('input-title').value.trim(),
            year: document.getElementById('input-year').value.trim(),
            source: document.getElementById('input-source').value.trim(),
            url: document.getElementById('input-url').value.trim()
        };
    }

    // Aksi saat tombol "Generate IEEE" ditekan
    btnIEEE.addEventListener('click', () => {
        const data = getFormData();
        
        // Validasi sederhana
        if (!data.author || !data.title || !data.year || !data.source) {
            alert('Mohon isi kolom wajib (Penulis, Judul, Tahun, dan Sumber)!');
            return;
        }

        // Merakit Format IEEE: J. K. Author, "Title of paper," Title of Journal, year.
        let citation = `${data.author}, "${data.title}," ${data.source}, ${data.year}.`;
        
        if (data.url) {
            citation += ` Available: ${data.url}.`;
        }

        displayResult(citation, 'IEEE');
    });

    // Aksi saat tombol "Generate APA" ditekan
    btnAPA.addEventListener('click', () => {
        const data = getFormData();
        
        // Validasi sederhana
        if (!data.author || !data.title || !data.year || !data.source) {
            alert('Mohon isi kolom wajib (Penulis, Judul, Tahun, dan Sumber)!');
            return;
        }

        // Merakit Format APA: Author, A. A. (Year). Title of article. Title of Periodical.
        let citation = `${data.author}. (${data.year}). ${data.title}. ${data.source}.`;
        
        if (data.url) {
            citation += ` ${data.url}`;
        }

        displayResult(citation, 'APA');
    });

    // Fungsi untuk memunculkan kotak hasil
    function displayResult(text, type) {
        outputText.innerText = text;
        typeLabel.innerText = type;
        resultCard.classList.remove('hidden'); // Membuka elemen yang disembunyikan
        
        // Mengembalikan tombol copy ke wujud semula jika sebelumnya habis ditekan
        btnCopy.innerHTML = "<i class='bx bx-copy'></i>";
        btnCopy.classList.remove('success');
    }

    // Fitur Salin (Copy) ke Clipboard
    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(outputText.innerText).then(() => {
            // Ubah ikon dan warna tombol sejenak sebagai tanda sukses
            btnCopy.innerHTML = "<i class='bx bx-check'></i>";
            btnCopy.classList.add('success');
            
            // Kembalikan ke ikon awal setelah 2 detik
            setTimeout(() => {
                btnCopy.innerHTML = "<i class='bx bx-copy'></i>";
                btnCopy.classList.remove('success');
            }, 2000);
        }).catch(err => {
            console.error('Gagal menyalin teks: ', err);
            alert('Gagal menyalin teks.');
        });
    });
});