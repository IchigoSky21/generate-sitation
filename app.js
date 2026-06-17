document.addEventListener('DOMContentLoaded', () => {

    /* ====================================================
       DOM ELEMENTS
    ==================================================== */
    const btnIEEE         = document.getElementById('btn-ieee');
    const btnAPA          = document.getElementById('btn-apa');
    const btnReset        = document.getElementById('btn-reset');
    const resultCard      = document.getElementById('result-card');
    const outputText      = document.getElementById('output-text');
    const citTypeLabel    = document.getElementById('citation-type-label');
    const btnCopy         = document.getElementById('btn-copy');
    const historyList     = document.getElementById('history-list');
    const historyCount    = document.getElementById('history-count');
    const btnExportBibtex = document.getElementById('btn-export-bibtex');
    const btnExportTxt    = document.getElementById('btn-export-txt');
    const btnClearHistory = document.getElementById('btn-clear-history');
    
    // Perbaikan seleksi tombol sumber HTML
    const sourceBtns      = document.querySelectorAll('.source-btn'); 
    const sourceLabelEl   = document.getElementById('source-label');
    const sourceInput     = document.getElementById('input-source');
    
    const doiInput        = document.getElementById('input-doi-quick');
    const btnDoiFetch     = document.getElementById('btn-doi-fetch');

    /* ====================================================
       STATE
    ==================================================== */
    let currentSourceType = 'journal';
    let citationHistory   = JSON.parse(localStorage.getItem('citation_history')) || [];
    let ieeeCounter       = parseInt(localStorage.getItem('ieee_counter') || '0');

    renderHistory();
    updateHistoryCount();

    /* ====================================================
       SOURCE TYPE CONFIGURATION
    ==================================================== */
    const sourceConfig = {
        journal:    { label: 'Nama Jurnal',                         placeholder: 'Contoh: IEEE Transactions on Neural Networks' },
        book:       { label: 'Nama Penerbit (Publisher)',            placeholder: 'Contoh: Springer, O\'Reilly, Gramedia' },
        conference: { label: 'Nama Konferensi / Prosiding',         placeholder: 'Contoh: International Conference on Machine Learning (ICML)' },
        website:    { label: 'Nama Situs / Organisasi (Opsional)',   placeholder: 'Contoh: Towards Data Science, Medium' },
        thesis:     { label: 'Nama Universitas',                    placeholder: 'Contoh: Binus University, Universitas Indonesia' },
    };

    sourceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sourceBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSourceType = btn.dataset.type;
            updateFormFields();
        });
    });

    function updateFormFields() {
        const cfg = sourceConfig[currentSourceType];
        sourceLabelEl.textContent = cfg.label;
        sourceInput.placeholder   = cfg.placeholder;
        document.querySelectorAll('.optional-fields').forEach(el => el.classList.add('hidden'));
        const target = document.getElementById(`fields-${currentSourceType}`);
        if (target) target.classList.remove('hidden');
    }

    /* ====================================================
       TEXT FORMATTERS & PARSING NAMA
    ==================================================== */
    const toTitleCase    = s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
    const toSentenceCase = s => s ? s.charAt(0).toUpperCase() + s.substr(1).toLowerCase() : s;

    function ieeeName(fullName) {
        const parts = fullName.trim().split(/\s+/);
        if (parts.length < 2) return toTitleCase(fullName.trim());
        const last     = toTitleCase(parts[parts.length - 1]);
        const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
        return `${initials} ${last}`;
    }

    function apaName(fullName) {
        const parts = fullName.trim().split(/\s+/);
        if (parts.length < 2) return toTitleCase(fullName.trim());
        const last     = toTitleCase(parts[parts.length - 1]);
        const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
        return `${last}, ${initials}`;
    }

    function formatIEEEAuthors(str, isOrg) {
        if (isOrg) return str.trim();
        const list = str.split(',').map(a => a.trim()).filter(Boolean).map(ieeeName);
        if (list.length === 1) return list[0];
        if (list.length === 2) return `${list[0]} and ${list[1]}`;
        return list.slice(0, -1).join(', ') + ', and ' + list[list.length - 1];
    }

    function formatAPAAuthors(str, isOrg) {
        if (isOrg) return str.trim();
        const list = str.split(',').map(a => a.trim()).filter(Boolean).map(apaName);
        if (list.length === 1) return list[0];
        if (list.length === 2) return `${list[0]} & ${list[1]}`;
        if (list.length <= 20) return list.slice(0, -1).join(', ') + ', & ' + list[list.length - 1];
        return list.slice(0, 19).join(', ') + ', ... ' + list[list.length - 1];
    }

    /* ====================================================
       FORM DATA
    ==================================================== */
    function getVal(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function getRaw() {
        return {
            author:       getVal('input-author'),
            isOrgAuthor:  document.getElementById('input-org-author')?.checked || false,
            title:        getVal('input-title'),
            year:         getVal('input-year'),
            source:       getVal('input-source'),
            volume:       getVal('input-volume'),
            issue:        getVal('input-issue'),
            pages:        getVal('input-pages'),
            url:          getVal('input-url'),
            city:         getVal('input-city'),
            edition:      getVal('input-edition'),
            confLocation: getVal('input-conf-location'),
            confPages:    getVal('input-conf-pages'),
            confUrl:      getVal('input-conf-url'),
            webUrl:       getVal('input-web-url'),
            accessDate:   getVal('input-access-date'),
            thesisType:   getVal('input-thesis-type') || 'Skripsi',
            thesisUrl:    getVal('input-thesis-url'),
        };
    }

    function validate(raw) {
        if (!raw.author) { alert('Kolom Penulis wajib diisi!'); return false; }
        if (!raw.title)  { alert('Kolom Judul wajib diisi!'); return false; }
        if (!raw.year)   { alert('Kolom Tahun wajib diisi!'); return false; }
        if (!raw.source && currentSourceType !== 'website') {
            alert(`Kolom "${sourceConfig[currentSourceType].label}" wajib diisi!`);
            return false;
        }
        return true;
    }

    /* ====================================================
       CITATION BUILDERS
    ==================================================== */
    function buildIEEE(raw, num) {
        const author = formatIEEEAuthors(raw.author, raw.isOrgAuthor);
        const source = toTitleCase(raw.source);

        switch (currentSourceType) {
            case 'journal': {
                let c = `[${num}] ${author}, "${toSentenceCase(raw.title)}," ${source}`;
                if (raw.volume) c += `, vol. ${raw.volume}`;
                if (raw.issue)  c += `, no. ${raw.issue}`;
                if (raw.pages)  c += `, pp. ${raw.pages}`;
                c += `, ${raw.year}.`;
                if (raw.url)    c += ` Available: ${raw.url}.`;
                return c;
            }
            case 'book': {
                let c = `[${num}] ${author}, ${toTitleCase(raw.title)}`;
                if (raw.edition) c += `, ${raw.edition} ed.`;
                if (raw.city && source) c += `. ${raw.city}: ${source}`;
                else if (source)        c += `. ${source}`;
                c += `, ${raw.year}.`;
                return c;
            }
            case 'conference': {
                let c = `[${num}] ${author}, "${toSentenceCase(raw.title)}," in Proc. ${source}`;
                if (raw.confLocation) c += `, ${raw.confLocation}`;
                c += `, ${raw.year}`;
                if (raw.confPages) c += `, pp. ${raw.confPages}`;
                c += `.`;
                if (raw.confUrl) c += ` Available: ${raw.confUrl}.`;
                return c;
            }
            case 'website': {
                let c = `[${num}] ${author}. (${raw.year}). "${toSentenceCase(raw.title)}." [Online]. Available: ${raw.webUrl}`;
                if (raw.accessDate) {
                    const d   = new Date(raw.accessDate + 'T00:00:00');
                    const mon = ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'][d.getMonth()];
                    c += ` [Accessed: ${d.getDate()} ${mon} ${d.getFullYear()}]`;
                }
                return c + `.`;
            }
            case 'thesis': {
                let c = `[${num}] ${author}, "${toSentenceCase(raw.title)}," ${raw.thesisType}, ${toTitleCase(raw.source)}, ${raw.year}.`;
                if (raw.thesisUrl) c += ` Available: ${raw.thesisUrl}.`;
                return c;
            }
        }
        return '';
    }

    function buildAPA(raw) {
        const author = formatAPAAuthors(raw.author, raw.isOrgAuthor);
        const source = toTitleCase(raw.source);

        switch (currentSourceType) {
            case 'journal': {
                let c = `${author}. (${raw.year}). ${toSentenceCase(raw.title)}. ${source}`;
                if (raw.volume && raw.issue) c += `, ${raw.volume}(${raw.issue})`;
                else if (raw.volume)         c += `, ${raw.volume}`;
                if (raw.pages) c += `, ${raw.pages}`;
                c += `.`;
                if (raw.url) c += ` ${raw.url}`;
                return c;
            }
            case 'book': {
                let c = `${author}. (${raw.year}). ${toSentenceCase(raw.title)}`;
                if (raw.edition) c += ` (${raw.edition} ed.)`;
                c += `.`;
                if (source) c += ` ${source}.`;
                return c;
            }
            case 'conference': {
                let c = `${author}. (${raw.year}). ${toSentenceCase(raw.title)}. In Proceedings of ${source}`;
                if (raw.confPages) c += ` (pp. ${raw.confPages})`;
                c += `.`;
                if (raw.confUrl) c += ` ${raw.confUrl}`;
                return c;
            }
            case 'website': {
                let c = `${author}. (${raw.year}). ${toSentenceCase(raw.title)}.`;
                if (source) c += ` ${source}.`;
                c += ` ${raw.webUrl}`;
                return c;
            }
            case 'thesis': {
                let c = `${author}. (${raw.year}). ${toSentenceCase(raw.title)} [${raw.thesisType}, ${toTitleCase(raw.source)}].`;
                if (raw.thesisUrl) c += ` ${raw.thesisUrl}`;
                return c;
            }
        }
        return '';
    }

    /* ====================================================
       GENERATE BUTTONS & FORMATTER
    ==================================================== */
    function setBtnActiveFormat(activeBtn) {
        btnIEEE.classList.remove('active-format');
        btnAPA.classList.remove('active-format');
        activeBtn.classList.add('active-format');
    }

    btnIEEE.addEventListener('click', () => {
        const raw = getRaw();
        if (!validate(raw)) return;
        ieeeCounter++;
        localStorage.setItem('ieee_counter', String(ieeeCounter));
        const text = buildIEEE(raw, ieeeCounter);
        displayResult(text, 'IEEE');
        saveHistory(text, 'IEEE', raw, currentSourceType, ieeeCounter);
        setBtnActiveFormat(btnIEEE);
    });

    btnAPA.addEventListener('click', () => {
        const raw = getRaw();
        if (!validate(raw)) return;
        const text = buildAPA(raw);
        displayResult(text, 'APA');
        saveHistory(text, 'APA', raw, currentSourceType, null);
        setBtnActiveFormat(btnAPA);
    });

    btnReset.addEventListener('click', () => {
        document.getElementById('citation-form').reset();
        if (doiInput) doiInput.value = '';
        sourceBtns.forEach(b => { b.classList.remove('active'); if (b.dataset.type === 'journal') b.classList.add('active'); });
        currentSourceType = 'journal';
        updateFormFields();
        resultCard.classList.add('hidden');
        btnIEEE.classList.remove('active-format');
        btnAPA.classList.remove('active-format');
    });

    /* ====================================================
       DOI AUTO-FETCH
    ==================================================== */
    btnDoiFetch.addEventListener('click', fetchDOI);
    doiInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchDOI(); });

    async function fetchDOI() {
        let val = doiInput.value.trim();
        if (!val) { alert('Tempel DOI terlebih dahulu!'); return; }
        val = val.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');

        btnDoiFetch.innerHTML  = '<i class=\'bx bx-loader-alt bx-spin\'></i> Memuat...';
        btnDoiFetch.disabled   = true;

        try {
            const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(val)}`);
            if (!res.ok) throw new Error(`DOI tidak ditemukan`);
            const { message: m } = await res.json();

            const authors = (m.author || []).map(a => [a.given, a.family].filter(Boolean).join(' ')).join(', ');
            const year    = (m.published || m['published-print'] || m['published-online'] || {})['date-parts']?.[0]?.[0] || '';
            const journal = (m['container-title'] || [''])[0];

            const typeMap = { 'journal-article':'journal', 'book':'book', 'proceedings-article':'conference', 'dissertation':'thesis' };
            const detected = typeMap[m.type] || 'journal';

            document.getElementById('input-author').value = authors;
            document.getElementById('input-title').value  = (m.title || [''])[0];
            document.getElementById('input-year').value   = year;
            document.getElementById('input-source').value = journal;

            sourceBtns.forEach(b => { b.classList.remove('active'); if (b.dataset.type === detected) b.classList.add('active'); });
            currentSourceType = detected;
            updateFormFields();

            const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            setVal('input-volume', m.volume || '');
            setVal('input-issue',  m.issue  || '');
            setVal('input-pages',  m.page   || '');
            setVal('input-url',    m.URL || '');

            btnDoiFetch.innerHTML = '<i class=\'bx bx-check\'></i> Berhasil!';
            setTimeout(() => { btnDoiFetch.innerHTML = '<i class=\'bx bx-bolt-circle\'></i> Auto-Fill'; }, 2500);
        } catch (err) {
            alert(`Gagal mengambil data DOI.`);
            btnDoiFetch.innerHTML = '<i class=\'bx bx-bolt-circle\'></i> Auto-Fill';
        }
        btnDoiFetch.disabled = false;
    }

    /* ====================================================
       HISTORY & EXPORT
    ==================================================== */
    function saveHistory(text, type, rawData, sourceType, ieeeNum) {
        citationHistory.unshift({ id: Date.now(), text, type, rawData, sourceType, ieeeNum });
        localStorage.setItem('citation_history', JSON.stringify(citationHistory));
        renderHistory();
        updateHistoryCount();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        if (!citationHistory.length) {
            historyList.innerHTML = '<p class="text-muted" style="text-align:center;padding:20px;">Belum ada riwayat sitasi.</p>';
            return;
        }
        citationHistory.forEach((item, idx) => {
            const isIEEE   = item.type === 'IEEE';
            historyList.innerHTML += `
                <div class="history-item">
                    <div style="flex: 1;">
                        <span class="history-badge" style="color: ${isIEEE ? '#569CD6' : '#C586C0'}; border-color: ${isIEEE ? '#569CD6' : '#C586C0'};">${item.type}</span>
                        <p class="history-text" id="hist-text-${idx}">${item.text}</p>
                    </div>
                    <button class="btn icon-btn" onclick="copyHistory(${idx})" title="Salin"><i class='bx bx-copy'></i></button>
                </div>`;
        });
    }

    function updateHistoryCount() {
        historyCount.textContent = citationHistory.length > 0 ? `(${citationHistory.length})` : '';
    }

    window.copyHistory = idx => {
        navigator.clipboard.writeText(document.getElementById(`hist-text-${idx}`).innerText).then(() => alert('Tersalin!'));
    };

    btnClearHistory.addEventListener('click', () => {
        if (!confirm('Hapus semua riwayat?')) return;
        citationHistory = [];
        ieeeCounter = 0;
        localStorage.removeItem('citation_history');
        localStorage.removeItem('ieee_counter');
        renderHistory();
        updateHistoryCount();
    });

    btnExportBibtex.addEventListener('click', () => {
        if (!citationHistory.length) { alert('Kosong!'); return; }
        let bib = '';
        citationHistory.forEach((item, i) => {
            const d = item.rawData;
            const key = (d.author || 'unknown').split(/[\s,]/)[0].replace(/[^a-zA-Z]/g, '') + (d.year || '0000');
            const type = { journal: '@article', book: '@book', conference: '@inproceedings', website: '@misc', thesis: '@mastersthesis' }[item.sourceType || 'journal'] || '@misc';

            bib += `${type}{${key}_${i + 1},\n  author = {${d.author || ''}},\n  title  = {${d.title  || ''}},\n  year   = {${d.year   || ''}},\n`;
            if (item.sourceType === 'book') {
                bib += `  publisher = {${d.source || ''}},\n`;
                if (d.city) bib += `  address = {${d.city}},\n`;
            } else {
                bib += `  journal = {${d.source || ''}},\n`;
            }
            if (d.url) bib += `  url = {${d.url}}\n`;
            bib += `}\n\n`;
        });
        downloadFile(bib, `references_${Date.now()}.bib`);
    });

    btnExportTxt.addEventListener('click', () => {
        if (!citationHistory.length) { alert('Kosong!'); return; }
        const ieee = [...citationHistory].filter(i => i.type === 'IEEE').sort((a, b) => (a.ieeeNum || 0) - (b.ieeeNum || 0));
        const apa  = citationHistory.filter(i => i.type === 'APA');
        let txt    = '';
        if (ieee.length) { txt += '=== DAFTAR PUSTAKA (IEEE) ===\n\n'; ieee.forEach(i => { txt += i.text + '\n\n'; }); }
        if (apa.length)  { txt += '\n=== DAFTAR PUSTAKA (APA) ===\n\n'; apa.forEach(i => { txt += i.text + '\n\n'; }); }
        downloadFile(txt, `references_${Date.now()}.txt`);
    });

    function downloadFile(content, filename) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
        a.download = filename;
        a.click();
    }

    /* ====================================================
       UX (MENAMPILKAN HASIL)
    ==================================================== */
    function displayResult(text, type) {
        outputText.innerText  = text;
        citTypeLabel.innerText = type;
        resultCard.classList.remove('hidden');
        btnCopy.innerHTML = "<i class='bx bx-copy'></i>";
        btnCopy.classList.remove('success');
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

    // Inisialisasi tampilan awal
    updateFormFields();
});
