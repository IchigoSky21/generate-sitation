document.addEventListener('DOMContentLoaded', () => {
    const btnIEEE = document.getElementById('btn-ieee');
    const btnAPA = document.getElementById('btn-apa');
    const resultCard = document.getElementById('result-card');
    const outputText = document.getElementById('output-text');
    const typeLabel = document.getElementById('citation-type-label');
    const btnCopy = document.getElementById('btn-copy');
    
    // Elemen Riwayat
    const historyList = document.getElementById('history-list');
    const btnExportBibtex = document.getElementById('btn-export-bibtex');
    const btnClearHistory = document.getElementById('btn-clear-history');

    // Load riwayat dari Local Storage
    let citationHistory = JSON.parse(localStorage.getItem('citation_history')) || [];
    renderHistory();

    /* =========================================
       FITUR 3: SMART TEXT FORMATTER
    ========================================= */
    // Mengubah setiap awal kata menjadi kapital (Title Case)
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    // Mengubah hanya huruf pertama kalimat yang kapital (Sentence Case)
    function toSentenceCase(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    }

    function getRawFormData() {
        return {
            author: document.getElementById('input-author').value.trim(),
            title: document.getElementById('input-title').value.trim(),
            year: document.getElementById('input-year').value.trim(),
            source: document.getElementById('input-source').value.trim(),
            url: document.getElementById('input-url').value.trim()
        };
    }

    /* =========================================
       LOGIKA GENERATOR SITASI
    ========================================= */
    btnIEEE.addEventListener('click', () => {
        const raw = getRawFormData();
        if (!raw.author || !raw.title || !raw.year || !raw.source) {
            alert('Mohon isi kolom wajib (Penulis, Judul, Tahun, dan Sumber)!'); return;
        }

        // Format Cerdas: Nama & Jurnal selalu Title Case. Untuk IEEE, Judul Artikel juga Title Case.
        const author = toTitleCase(raw.author);
        const title = toTitleCase(raw.title); 
        const source = toTitleCase(raw.source);

        let citation = `${author}, "${title}," ${source}, ${raw.year}.`;
        if (raw.url) citation += ` Available: ${raw.url}.`;

        displayResult(citation, 'IEEE');
        saveToHistory(citation, 'IEEE', { author, title, source, year: raw.year, url: raw.url });
    });

    btnAPA.addEventListener('click', () => {
        const raw = getRawFormData();
        if (!raw.author || !raw.title || !raw.year || !raw.source) {
            alert('Mohon isi kolom wajib (Penulis, Judul, Tahun, dan Sumber)!'); return;
        }

        // Format Cerdas: APA mensyaratkan Judul Artikel menggunakan Sentence Case (huruf kecil kecuali awal).
        const author = toTitleCase(raw.author);
        const title = toSentenceCase(raw.title); 
        const source = toTitleCase(raw.source);

        let citation = `${author}. (${raw.year}). ${title}. ${source}.`;
        if (raw.url) citation += ` ${raw.url}`;

        displayResult(citation, 'APA');
        saveToHistory(citation, 'APA', { author, title, source, year: raw.year, url: raw.url });
    });

    /* =========================================
       FITUR 1: MANAJEMEN RIWAYAT (LOCAL STORAGE)
    ========================================= */
    function saveToHistory(text, type, rawData) {
        citationHistory.unshift({ id: Date.now(), text, type, rawData });
        localStorage.setItem('citation_history', JSON.stringify(citationHistory));
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        if(citationHistory.length === 0) {
            historyList.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px;">Belum ada riwayat sitasi.</p>';
            return;
        }

        citationHistory.forEach((item, index) => {
            const isIEEE = item.type === 'IEEE';
            historyList.innerHTML += `
                <div class="history-item ${isIEEE ? '' : 'apa-style'}">
                    <div>
                        <span class="history-badge ${isIEEE ? 'text-primary' : 'text-success'}">${item.type}</span>
                        <p class="history-text" id="hist-text-${index}">${item.text}</p>
                    </div>
                    <button class="btn icon-btn" onclick="copyHistory(${index})" title="Salin">
                        <i class='bx bx-copy'></i>
                    </button>
                </div>
            `;
        });
    }

    // Fungsi global agar bisa dipanggil dari atribut onclick di HTML
    window.copyHistory = function(index) {
        const textToCopy = document.getElementById(`hist-text-${index}`).innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Sitasi disalin ke clipboard!');
        });
    };

    btnClearHistory.addEventListener('click', () => {
        if(confirm('Hapus semua riwayat sitasi?')) {
            citationHistory = [];
            localStorage.removeItem('citation_history');
            renderHistory();
        }
    });

    /* =========================================
       FITUR 2: EXPORT KE BIBTEX
    ========================================= */
    btnExportBibtex.addEventListener('click', () => {
        if (citationHistory.length === 0) {
            alert('Tidak ada data sitasi untuk diekspor!');
            return;
        }

        let bibContent = '';
        citationHistory.forEach((item, index) => {
            const d = item.rawData;
            // Membuat identifier unik otomatis (misal: Santoso2026_0)
            const authorKey = d.author.split(' ')[0].replace(/[^a-zA-Z]/g, '') + d.year;
            
            bibContent += `@article{${authorKey}_${index},\n`;
            bibContent += `  author = {${d.author}},\n`;
            bibContent += `  title = {${d.title}},\n`;
            bibContent += `  journal = {${d.source}},\n`;
            bibContent += `  year = {${d.year}},\n`;
            if(d.url) bibContent += `  url = {${d.url}}\n`;
            bibContent += `}\n\n`;
        });

        // Membuat file Blob virtual lalu mengunduhnya
        const blob = new Blob([bibContent], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `references_${new Date().getTime()}.bib`;
        link.click();
    });

    /* =========================================
       FUNGSI UX LAINNYA
    ========================================= */
    function displayResult(text, type) {
        outputText.innerText = text;
        typeLabel.innerText = type;
        resultCard.classList.remove('hidden');
        btnCopy.innerHTML = "<i class='bx bx-copy'></i>";
        btnCopy.classList.remove('success');
    }

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(outputText.innerText).then(() => {
            btnCopy.innerHTML = "<i class='bx bx-check'></i>";
            btnCopy.classList.add('success');
            setTimeout(() => {
                btnCopy.innerHTML = "<i class='bx bx-copy'></i>";
                btnCopy.classList.remove('success');
            }, 2000);
        });
    });
});
