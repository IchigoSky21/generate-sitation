document.addEventListener('DOMContentLoaded', () => {

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
    const sourceBtns      = document.querySelectorAll('.source-btn');
    const sourceLabelEl   = document.getElementById('source-label');
    const sourceInput     = document.getElementById('input-source');
    const doiInput        = document.getElementById('input-doi-quick');
    const btnDoiFetch     = document.getElementById('btn-doi-fetch');
    const titleSearchInput = document.getElementById('input-title-search');
    const btnTitleSearch   = document.getElementById('btn-title-search');
    const searchResultsEl  = document.getElementById('search-results');

    /* ====================================================
       HTML ESCAPING (XSS PREVENTION)
       Dipakai untuk setiap data dari input user / API eksternal
       sebelum dimasukkan lewat innerHTML.
    ==================================================== */
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /* ====================================================
       DARK/LIGHT THEME TOGGLE
    ==================================================== */
    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    const themeIcon      = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const metaThemeColor = document.getElementById('meta-theme-color');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app_theme', theme);
        
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'bx bx-sun';
                if(metaThemeColor) metaThemeColor.setAttribute('content', '#1E1E1E');
            } else {
                themeIcon.className = 'bx bx-moon';
                if(metaThemeColor) metaThemeColor.setAttribute('content', '#6B3A1F');
            }
        }
    }

    const savedTheme = localStorage.getItem('app_theme') || 'light';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    /* ====================================================
       STATE VARIABLES
    ==================================================== */
    let currentSourceType = 'journal';
    let citationHistory   = JSON.parse(localStorage.getItem('citation_history')) || [];
    let ieeeCounter       = parseInt(localStorage.getItem('ieee_counter') || '0');

    /* ====================================================
       TOAST NOTIFICATION SYSTEM
    ==================================================== */
    function toast(message, type = 'info', duration = 3500, subtitle = '') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const iconMap = {
            success: 'bx bx-check-circle',
            error:   'bx bx-x-circle',
            warning: 'bx bx-error',
            info:    'bx bx-info-circle',
        };

        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.innerHTML = `
            <i class="${iconMap[type] || iconMap.info} toast-icon" aria-hidden="true"></i>
            <div class="toast-body">
                <div class="toast-title">${escapeHtml(message)}</div>
                ${subtitle ? `<div class="toast-sub">${escapeHtml(subtitle)}</div>` : ''}
            </div>
            <button class="toast-close" aria-label="Tutup notifikasi">×</button>
            <div class="toast-progress" style="animation-duration:${duration}ms"></div>
        `;

        container.appendChild(el);

        const dismiss = () => {
            clearTimeout(timer);
            el.classList.add('removing');
            el.addEventListener('animationend', () => el.remove(), { once: true });
        };

        const timer = setTimeout(dismiss, duration);
        el.querySelector('.toast-close').addEventListener('click', dismiss);
        return el;
    }

    /* ====================================================
       CONFIRM DIALOG
    ==================================================== */
    function showConfirm(title, message, confirmLabel = 'Hapus', type = 'danger') {
        return new Promise(resolve => {
            let overlay = document.getElementById('confirm-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'confirm-overlay';
                overlay.setAttribute('role', 'dialog');
                overlay.setAttribute('aria-modal', 'true');
                overlay.innerHTML = `
                    <div class="confirm-box">
                        <div class="confirm-header">
                            <div class="confirm-icon-wrap confirm-icon-${type}" id="conf-icon-wrap">
                                <i class="bx bx-trash" id="conf-icon" aria-hidden="true"></i>
                            </div>
                            <div>
                                <div class="confirm-title" id="conf-title"></div>
                                <div class="confirm-message" id="conf-msg"></div>
                            </div>
                        </div>
                        <div class="confirm-divider"></div>
                        <div class="confirm-actions">
                            <button class="btn btn-secondary" id="conf-cancel">Batal</button>
                            <button class="btn btn-danger"    id="conf-ok"></button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);
            }

            const iconWrap = document.getElementById('conf-icon-wrap');
            const icon     = document.getElementById('conf-icon');
            iconWrap.className = `confirm-icon-wrap confirm-icon-${type}`;
            icon.className = type === 'danger' ? 'bx bx-trash' : 'bx bx-error';

            document.getElementById('conf-title').textContent = title;
            document.getElementById('conf-msg').textContent   = message;
            document.getElementById('conf-ok').textContent    = confirmLabel;

            function close(result) {
                document.removeEventListener('keydown', keyHandler);
                overlay.classList.remove('visible');
                overlay.addEventListener('transitionend', () => {
                    overlay.style.display = 'none';
                    resolve(result);
                }, { once: true });
            }

            document.getElementById('conf-ok').onclick     = () => close(true);
            document.getElementById('conf-cancel').onclick = () => close(false);
            overlay.onclick = e => { if (e.target === overlay) close(false); };

            const keyHandler = e => {
                if (e.key === 'Escape') close(false);
                if (e.key === 'Enter')  close(true);
            };
            document.addEventListener('keydown', keyHandler);

            overlay.style.display = 'flex';
            requestAnimationFrame(() => overlay.classList.add('visible'));
            document.getElementById('conf-ok').focus();
        });
    }

    /* ====================================================
       SOURCE TYPE CONFIGURATION
    ==================================================== */
    const sourceConfig = {
        journal:    { label: 'Nama Jurnal',                        placeholder: 'Contoh: IEEE Transactions on Neural Networks' },
        book:       { label: 'Nama Penerbit (Publisher)',          placeholder: 'Contoh: Springer, O\'Reilly, Gramedia' },
        conference: { label: 'Nama Konferensi / Prosiding',        placeholder: 'Contoh: International Conference on Machine Learning (ICML)' },
        website:    { label: 'Nama Situs / Organisasi (Opsional)', placeholder: 'Contoh: Towards Data Science, Medium' },
        thesis:     { label: 'Nama Universitas',                   placeholder: 'Contoh: Binus University, Universitas Indonesia' },
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
       TEXT FORMATTERS
    ==================================================== */
    const toTitleCase    = s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
    const toSentenceCase = s => s ? s.charAt(0).toUpperCase() + s.substr(1).toLowerCase() : s;

    function formatPersonName(fullName, style) {
        const parts = fullName.trim().split(/\s+/);
        if (parts.length < 2) return toTitleCase(fullName.trim());
        const last     = toTitleCase(parts[parts.length - 1]);
        const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
        return style === 'apa' ? `${last}, ${initials}` : `${initials} ${last}`;
    }
    const ieeeName = fullName => formatPersonName(fullName, 'ieee');
    const apaName  = fullName => formatPersonName(fullName, 'apa');

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
       FORM DATA & VALIDASI
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
        if (!raw.author) { toast('Kolom Penulis wajib diisi!', 'error'); return false; }
        if (!raw.title) { toast('Kolom Judul wajib diisi!', 'error'); return false; }
        if (!raw.year) { toast('Kolom Tahun wajib diisi!', 'error'); return false; }
        const y = parseInt(raw.year);
        if (isNaN(y) || y < 1900 || y > 2099) { toast('Tahun tidak valid!', 'error', 4000, 'Masukkan tahun antara 1900–2099.'); return false; }
        if (!raw.source && currentSourceType !== 'website') { toast(`Kolom "${sourceConfig[currentSourceType].label}" wajib diisi!`, 'error'); return false; }
        if (currentSourceType === 'website' && !raw.webUrl) { toast('URL wajib diisi untuk sumber jenis Website!', 'error'); return false; }
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
       GENERATE BUTTONS
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
        sourceBtns.forEach(b => {
            b.classList.remove('active');
            if (b.dataset.type === 'journal') b.classList.add('active');
        });
        currentSourceType = 'journal';
        updateFormFields();
        resultCard.classList.add('hidden');
        btnIEEE.classList.remove('active-format');
        btnAPA.classList.remove('active-format');
    });

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            btnIEEE.click();
        }
    });

    /* ====================================================
       DOI AUTO-FETCH
    ==================================================== */
    btnDoiFetch.addEventListener('click', fetchDOI);
    doiInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchDOI(); });

    function applyWorkToForm(m) {
        const authors  = (m.author || []).map(a => [a.given, a.family].filter(Boolean).join(' ')).join(', ');
        const year     = (m.published || m['published-print'] || m['published-online'] || {})['date-parts']?.[0]?.[0] || '';
        const journal  = (m['container-title'] || [''])[0];
        const typeMap  = { 'journal-article':'journal','book':'book','proceedings-article':'conference','dissertation':'thesis' };
        const detected = typeMap[m.type] || 'journal';

        document.getElementById('input-author').value = authors;
        document.getElementById('input-title').value  = (m.title || [''])[0];
        document.getElementById('input-year').value   = year;
        document.getElementById('input-source').value = journal;

        sourceBtns.forEach(b => { b.classList.remove('active'); if (b.dataset.type === detected) b.classList.add('active'); });
        currentSourceType = detected;
        updateFormFields();

        const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
        setVal('input-volume', m.volume || '');
        setVal('input-issue',  m.issue  || '');
        setVal('input-pages',  m.page   || '');
        setVal('input-url',    m.URL    || '');
    }

    async function fetchDOI() {
        let val = doiInput.value.trim();
        if (!val) {
            toast('Kolom DOI kosong!', 'warning', 3000, 'Tempel kode DOI terlebih dahulu lalu coba lagi.');
            doiInput.focus();
            return;
        }
        val = val.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');

        btnDoiFetch.innerHTML = '<i class=\'bx bx-loader-alt bx-spin\'></i> Memuat...';
        btnDoiFetch.disabled  = true;

        try {
            const controller = new AbortController();
            const timeoutId  = setTimeout(() => controller.abort(), 10000);
            let res;
            try {
                res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(val)}`, { signal: controller.signal });
            } finally {
                clearTimeout(timeoutId);
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const { message: m } = await res.json();

            applyWorkToForm(m);

            btnDoiFetch.innerHTML = '<i class=\'bx bx-check\'></i> Berhasil!';
            toast('Data DOI berhasil dimuat!', 'success', 3000, `${(m.title || [''])[0].slice(0, 60)}...`);
            setTimeout(() => { btnDoiFetch.innerHTML = '<i class=\'bx bx-bolt-circle\'></i> Auto-Fill'; }, 2500);

        } catch (err) {
            if (err.name === 'AbortError') {
                toast('Waktu permintaan habis', 'error', 5000, 'Server DOI tidak merespons dalam 10 detik. Coba lagi.');
            } else {
                toast('Gagal memuat data DOI', 'error', 5000, 'Pastikan DOI valid dan koneksi internet tersedia.');
            }
            btnDoiFetch.innerHTML = '<i class=\'bx bx-bolt-circle\'></i> Auto-Fill';
        }
        btnDoiFetch.disabled = false;
    }

    /* ====================================================
       TITLE / KEYWORD SEARCH (CrossRef)
    ==================================================== */
    let searchAbortController = null;
    let searchDebounceTimer   = null;
    let lastSearchResults     = [];

    function hideSearchResults() {
        searchResultsEl.innerHTML = '';
        searchResultsEl.classList.add('hidden');
    }

    function renderSearchState(state, payload) {
        if (state === 'loading') {
            searchResultsEl.innerHTML = `<div class="search-result-loading"><i class='bx bx-loader-alt bx-spin'></i> Mencari...</div>`;
        } else if (state === 'empty') {
            searchResultsEl.innerHTML = `<div class="search-result-empty">Tidak ada hasil ditemukan. Coba kata kunci lain.</div>`;
        } else if (state === 'error') {
            searchResultsEl.innerHTML = `<div class="search-result-empty">${escapeHtml(payload || 'Gagal memuat hasil pencarian.')}</div>`;
        } else if (state === 'results') {
            lastSearchResults = payload;
            searchResultsEl.innerHTML = payload.map((m, idx) => {
                const title   = (m.title || ['(Tanpa judul)'])[0];
                const authors = (m.author || []).slice(0, 3).map(a => [a.given, a.family].filter(Boolean).join(' ')).join(', ');
                const authorsSuffix = (m.author || []).length > 3 ? ' et al.' : '';
                const year    = (m.published || m['published-print'] || m['published-online'] || {})['date-parts']?.[0]?.[0] || 's.a.';
                const journal = (m['container-title'] || [''])[0];
                const metaParts = [authors ? `${authors}${authorsSuffix}` : null, year, journal].filter(Boolean);
                return `
                    <button type="button" class="search-result-item" role="option" data-idx="${idx}">
                        <div class="search-result-title">${escapeHtml(title)}</div>
                        <div class="search-result-meta">${escapeHtml(metaParts.join(' · '))}</div>
                    </button>`;
            }).join('');
        }
        searchResultsEl.classList.remove('hidden');
    }

    async function searchByTitle(query) {
        if (searchAbortController) searchAbortController.abort();
        searchAbortController = new AbortController();
        const timeoutId = setTimeout(() => searchAbortController.abort(), 10000);

        renderSearchState('loading');

        try {
            const url = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(query)}&rows=6`;
            const res = await fetch(url, { signal: searchAbortController.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data  = await res.json();
            const items = data?.message?.items || [];
            if (!items.length) renderSearchState('empty');
            else renderSearchState('results', items);
        } catch (err) {
            if (err.name === 'AbortError') return; // dibatalkan oleh pencarian berikutnya atau timeout; diamkan
            renderSearchState('error', 'Gagal memuat hasil. Periksa koneksi internet Anda.');
        } finally {
            clearTimeout(timeoutId);
        }
    }

    function runTitleSearch() {
        const query = titleSearchInput.value.trim();
        if (!query) {
            toast('Kolom pencarian kosong!', 'warning', 3000, 'Masukkan judul atau kata kunci terlebih dahulu.');
            titleSearchInput.focus();
            return;
        }
        if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
        searchByTitle(query);
    }

    btnTitleSearch.addEventListener('click', runTitleSearch);

    titleSearchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); runTitleSearch(); }
        if (e.key === 'Escape') hideSearchResults();
    });

    // Live search dengan debounce saat mengetik (min. 4 karakter)
    titleSearchInput.addEventListener('input', () => {
        const query = titleSearchInput.value.trim();
        if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
        if (query.length < 4) { hideSearchResults(); return; }
        searchDebounceTimer = setTimeout(() => searchByTitle(query), 500);
    });

    searchResultsEl.addEventListener('click', e => {
        const btn = e.target.closest('.search-result-item');
        if (!btn) return;
        const item = lastSearchResults[Number(btn.dataset.idx)];
        if (!item) return;
        applyWorkToForm(item);
        hideSearchResults();
        titleSearchInput.value = (item.title || [''])[0];
        toast('Data sitasi berhasil dimuat!', 'success', 3000, `${(item.title || [''])[0].slice(0, 60)}...`);
    });

    document.addEventListener('click', e => {
        if (!searchResultsEl.classList.contains('hidden') &&
            !searchResultsEl.contains(e.target) &&
            e.target !== titleSearchInput && e.target !== btnTitleSearch) {
            hideSearchResults();
        }
    });

    /* ====================================================
       HISTORY MANAGEMENT
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
        const rows = citationHistory.map((item, idx) => {
            const isIEEE   = item.type === 'IEEE';
            const badgeColor = isIEEE ? 'var(--color-info)' : 'var(--color-success)';
            const numLabel = isIEEE && item.ieeeNum
                ? `<span style="color:var(--color-success);font-size:0.9rem;font-weight:700;">[${escapeHtml(item.ieeeNum)}]</span>` : '';
            return `
                <div class="history-item">
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
                            <span class="history-badge" style="color:${badgeColor};border-color:${badgeColor};">${escapeHtml(item.type)}</span>
                            ${numLabel}
                            <span style="font-size:0.7rem;color:var(--text-muted);">${escapeHtml(getSourceTypeLabel(item.sourceType))}</span>
                        </div>
                        <p class="history-text" id="hist-text-${idx}">${escapeHtml(item.text)}</p>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;">
                        <button class="btn icon-btn" onclick="copyHistory(${idx})" title="Salin"><i class='bx bx-copy'></i></button>
                        <button class="btn icon-btn" onclick="deleteHistory(${idx})" title="Hapus" style="color:var(--color-error);border-color:var(--color-error);"><i class='bx bx-trash'></i></button>
                    </div>
                </div>`;
        });
        historyList.innerHTML = rows.join('');
    }

    function getSourceTypeLabel(type) {
        const map = { journal:'📰 Jurnal', book:'📚 Buku', conference:'🎤 Konf.', website:'🌐 Web', thesis:'🎓 Tesis' };
        return map[type] || '📄';
    }

    function updateHistoryCount() {
        historyCount.textContent = citationHistory.length > 0 ? `(${citationHistory.length})` : '';
    }

    window.copyHistory = idx => {
        const text = document.getElementById(`hist-text-${idx}`)?.innerText;
        if (!text) return;
        navigator.clipboard.writeText(text)
            .then(() => toast('Sitasi disalin ke clipboard!', 'success', 2500));
    };

    window.deleteHistory = async idx => {
        const ok = await showConfirm(
            'Hapus sitasi ini?',
            'Sitasi akan dihapus dari riwayat. Tindakan ini tidak dapat dibatalkan.',
            'Hapus'
        );
        if (!ok) return;
        citationHistory.splice(idx, 1);
        localStorage.setItem('citation_history', JSON.stringify(citationHistory));
        renderHistory();
        updateHistoryCount();
        toast('Sitasi dihapus dari riwayat.', 'info', 2500);
    };

    btnClearHistory.addEventListener('click', async () => {
        const ok = await showConfirm(
            'Kosongkan semua riwayat?',
            'Seluruh sitasi yang tersimpan akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
            'Kosongkan'
        );
        if (!ok) return;
        citationHistory = [];
        ieeeCounter     = 0;
        localStorage.removeItem('citation_history');
        localStorage.removeItem('ieee_counter');
        renderHistory();
        updateHistoryCount();
        toast('Semua riwayat berhasil dihapus.', 'info', 3000);
    });

    /* ====================================================
       EXPORT
    ==================================================== */
    function escapeBibtex(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/([{}])/g, '\\$1')
            .replace(/([%&#_$])/g, '\\$1');
    }

    btnExportBibtex.addEventListener('click', () => {
        if (!citationHistory.length) {
            toast('Tidak ada sitasi untuk diekspor!', 'warning', 3000, 'Generate minimal satu sitasi terlebih dahulu.');
            return;
        }
        let bib = '';
        citationHistory.forEach((item, i) => {
            const d    = item.rawData;
            const key  = (d.author || 'unknown').split(/[\s,]/)[0].replace(/[^a-zA-Z]/g, '') + (d.year || '0000');
            const type = { journal:'@article', book:'@book', conference:'@inproceedings', website:'@misc', thesis:'@mastersthesis' }[item.sourceType || 'journal'] || '@misc';
            bib += `${type}{${key}_${i + 1},\n  author = {${escapeBibtex(d.author)}},\n  title  = {${escapeBibtex(d.title)}},\n  year   = {${escapeBibtex(d.year)}},\n`;
            if (item.sourceType === 'book') {
                bib += `  publisher = {${escapeBibtex(d.source)}},\n`;
                if (d.city) bib += `  address = {${escapeBibtex(d.city)}},\n`;
            } else if (item.sourceType === 'conference') {
                bib += `  booktitle = {${escapeBibtex(d.source)}},\n`;
                if (d.confPages) bib += `  pages = {${escapeBibtex(d.confPages)}},\n`;
            } else if (item.sourceType === 'website') {
                bib += `  howpublished = {\\url{${d.webUrl || ''}}},\n`;
            } else if (item.sourceType === 'thesis') {
                bib += `  school = {${escapeBibtex(d.source)}},\n  type = {${escapeBibtex(d.thesisType || 'Skripsi')}},\n`;
            } else {
                bib += `  journal = {${escapeBibtex(d.source)}},\n`;
                if (d.volume) bib += `  volume = {${escapeBibtex(d.volume)}},\n`;
                if (d.issue)  bib += `  number = {${escapeBibtex(d.issue)}},\n`;
                if (d.pages)  bib += `  pages  = {${escapeBibtex(d.pages)}},\n`;
            }
            if (d.url) bib += `  url = {${d.url}},\n`;
            bib += `}\n\n`;
        });
        downloadFile(bib, `references_${Date.now()}.bib`);
        toast('File BibTeX berhasil diunduh!', 'success', 3000, `${citationHistory.length} entri referensi diekspor.`);
    });

    btnExportTxt.addEventListener('click', () => {
        if (!citationHistory.length) {
            toast('Tidak ada sitasi untuk diekspor!', 'warning', 3000, 'Generate minimal satu sitasi terlebih dahulu.');
            return;
        }
        const ieee = [...citationHistory].filter(i => i.type === 'IEEE').sort((a, b) => (a.ieeeNum || 0) - (b.ieeeNum || 0));
        const apa  = citationHistory.filter(i => i.type === 'APA');
        let txt    = '';
        if (ieee.length) { txt += '=== DAFTAR PUSTAKA (IEEE) ===\n\n'; ieee.forEach(i => { txt += i.text + '\n\n'; }); }
        if (apa.length)  { txt += '\n=== DAFTAR PUSTAKA (APA) ===\n\n'; apa.forEach(i => { txt += i.text + '\n\n'; }); }
        downloadFile(txt, `references_${Date.now()}.txt`);
        toast('File TXT berhasil diunduh!', 'success', 3000, `${ieee.length} IEEE + ${apa.length} APA sitasi diekspor.`);
    });

    function downloadFile(content, filename) {
        const a    = document.createElement('a');
        a.href     = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
        a.download = filename;
        a.click();
    }

    /* ====================================================
       DISPLAY & COPY HASIL SITASI
    ==================================================== */
    function displayResult(text, type) {
        outputText.innerText   = text;
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

    /* ====================================================
       INISIALISASI
    ==================================================== */
    renderHistory();
    updateHistoryCount();
    updateFormFields();

});
