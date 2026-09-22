# Citation Generator

![HTML5](https://img.shields.io/badge/HTML5-Static_App-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-Enabled-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

A client-side web application for creating and managing academic references in **IEEE** and **APA** styles. It supports manual entry, DOI metadata lookup, keyword search, PDF DOI detection, local citation history, and several import/export formats.

## 🌐 Live Demo

**[Open the application]([https://generator-sitasi.vercel.app/])**

## ✨ Key Features

### Reference Input

- **Manual input** for five source types: journal articles, books, conference papers, websites, and theses.
- **DOI auto-fill** using the Crossref API.
- **Keyword search** using Crossref for journal/article searches and Google Books for book searches.
- **PDF DOI detection** by checking PDF metadata and scanning up to the first three pages for a DOI.
- **Dynamic forms** that change according to the selected source type.
- **Organization author mode** for institutional authors whose names should not be reformatted.

### Citation Generation

- Generates **IEEE** citations with automatic numbering.
- Generates **APA** citations.
- Formats personal author names into IEEE or APA-style name order.
- Supports multiple authors entered as comma-separated names.
- Applies the application's sentence-case formatting to generated titles.
- Supports `Ctrl + Enter` or `Cmd + Enter` as a shortcut for IEEE generation.

### History and Data Management

- Stores citation history and the selected theme in browser `localStorage`.
- Automatically renumbers stored IEEE citations after history changes.
- Allows individual citation deletion or clearing the full history.
- Exports citations to **BibTeX** and **TXT** files.
- Imports BibTeX files using the application's built-in parser.
- Exports the application history as a JSON project bundle and imports bundles by merging them with the existing history.

### Interface and PWA

- Light and dark themes with persisted preferences.
- Custom toast notifications and confirmation dialog.
- Responsive academic-workspace-inspired interface.
- Web app manifest and service worker for installable PWA behavior and caching of the application shell. Core metadata lookup and search features require an internet connection.
- SEO-related files including `robots.txt`, `sitemap.xml`, and social metadata in `index.html`.

## 🧠 How It Works

1. Choose a source type or use one of the automatic input methods.
2. Enter the reference data manually, search by keyword, provide a DOI, or upload a PDF for DOI detection.
3. DOI metadata is requested directly from Crossref. Keyword searches use Crossref or Google Books depending on the selected source type.
4. The application formats the data using its built-in IEEE or APA citation builders.
5. Generated citations are displayed and saved in browser `localStorage`.
6. The stored history can be copied, edited through deletion, or exported as BibTeX, TXT, or a JSON bundle.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure and semantic forms |
| CSS3 | Responsive styling, themes, and UI components |
| Vanilla JavaScript | Application logic, citation formatting, API requests, file handling, and browser storage |
| Crossref REST API | DOI lookup and keyword search for scholarly works |
| Google Books API | Keyword search for books |
| pdf.js | Lazy-loaded PDF parsing for DOI detection |
| Google Fonts | Inter and Lora typefaces |
| Boxicons | Interface icons |
| Web App Manifest | Installable web app metadata |
| Service Worker | Application-shell caching |

## 📁 Project Structure

```text
generate-sitation/
├── .gitignore
├── LICENSE             # MIT License
├── README.md
├── app.js              # Citation generation, APIs, history, import/export, theme logic
├── index.html          # Application markup and metadata
├── manifest.json       # PWA metadata and icons
├── icon-192.svg        # PWA icon
├── icon-512.svg        # PWA icon
├── preview.png         # Preview image included in the repository
├── robots.txt          # Search crawler rules
├── sitemap.xml         # Sitemap
├── style.css           # Application styles and themes
└── sw.js               # Service worker and cache configuration
```

## 🚀 Running Locally

This project has no package manager or build step. Clone the repository and serve it as a static website.

```bash
git clone https://github.com/IchigoSky21/generate-sitation.git
cd generate-sitation
```

You can then open the project with a local static server, such as the Live Server extension in VS Code.

> Some browser features, including service workers, are intended to run in a proper HTTP(S) context rather than directly from a `file://` URL.

## 🌐 External Services

The application calls public third-party services directly from the browser:

- **Crossref** — DOI metadata lookup and scholarly keyword search.
- **Google Books** — book keyword search.
- **pdf.js CDN** — loaded on demand when PDF DOI detection is used.

These features require network access. The service worker caches the application shell, but it does not make external API lookups available offline.

## 📄 Supported Source Types

| Source Type | Supported by Generator |
|---|---|
| Journal Article | IEEE and APA |
| Book | IEEE and APA |
| Conference Paper | IEEE and APA |
| Website | IEEE and APA |
| Thesis / Dissertation | IEEE and APA |

The application provides citation templates based on its built-in formatting logic. Users should review generated references when strict publication-specific style compliance is required.

## 📦 Import and Export

| Format | Direction | Purpose |
|---|---|---|
| BibTeX (`.bib`) | Import / Export | Exchange citation data with BibTeX-compatible workflows |
| TXT (`.txt`) | Export | Export generated citation history as text |
| JSON (`.json`) | Import / Export | Save or merge the application's citation history as a project bundle |

## 📱 PWA and Offline Behavior

The repository includes a web app manifest and a service worker. The service worker caches the main application files, fonts, and icon stylesheet defined in its cache list.

This provides cached access to the application shell after installation/use, subject to browser and cache availability. However, **DOI lookup, keyword search, and first-time PDF library loading still depend on network access** because they use external services or CDN resources.

## 🔒 Data and Privacy Notes

Citation history and theme preferences are stored locally in the browser through `localStorage`. The application does not include a repository-side database or user account system.

Reference metadata entered into automatic lookup features may be sent to the relevant third-party service, such as Crossref or Google Books, as part of the request needed to perform that lookup.

## 📌 Current Limitations

- The application is a client-side citation generator, not a complete reference manager.
- Generated citations are based on the formatting rules implemented in `app.js`; they should not be treated as a guarantee of complete compliance with every edition, publication, or institutional variation of IEEE or APA rules.
- Automatic metadata quality depends on data returned by Crossref and Google Books.
- PDF DOI detection works on accessible PDF metadata or text content and may not find a DOI in scanned/image-only documents.
- Automatic online features require internet access.
- The current interface text and metadata are primarily in Indonesian, even though this README is in English.

## 🤝 Contributing

Contributions are welcome. You can fork the repository, create a branch, make your changes, and open a pull request.

For bugs or feature requests, please use the repository's issue tracker.

## 📄 License

This project is licensed under the **MIT License**. See the included `LICENSE` file for details.
