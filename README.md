# VORA — Boutique Fitness

A responsive, multilingual website for VORA, a conceptual premium fitness brand. The project presents a complete digital experience for exploring training spaces, equipment, membership plans, staff, products, and gym locations.

Built with HTML, CSS, and vanilla JavaScript, VORA combines warm neutral tones, editorial typography, and considered motion to reflect the brand's focus on movement, comfort, and personal care.

## Features

- Seven pages covering the homepage, spaces, equipment, brand story, team, products, and contact.
- Portuguese, English, and Spanish translations, with language preferences preserved across navigation.
- Full-screen navigation with a two-column layout and animated opening and closing.
- An automatically rotating hero slideshow with image selection controls.
- Smooth mouse-wheel scrolling and page transitions, with reduced-motion support.
- Three membership tiers, including a highlighted best-value option.
- A dotted Brazil map showing six locations across four cities.
- Staff profiles, an equipment gallery, and a branded product collection.
- A contact page with social channel icons and a copy-to-clipboard email button.
- Responsive layouts for desktop and mobile screens.

## Technology

- **HTML5** — page structure and semantic content.
- **CSS3** — responsive layouts, brand styling, and transitions.
- **Vanilla JavaScript** — content rendering, navigation, localization, and interactions.
- **JSON** — image metadata, membership information, and location data.

No package installation or build process is required.

## Project Structure

```text
.
├── index.html                  # Homepage, memberships, and locations
├── espacos.html                # Training spaces
├── equipamentos.html           # Equipment gallery
├── historia.html               # Brand story
├── equipe.html                 # Team profiles
├── produtos.html               # Product collection
├── contato.html                # Contact page
├── styles.css                  # Shared styles and responsive layouts
├── app.js                      # Content rendering and site interactions
├── scroll.js                   # Smooth scrolling behavior
├── language.js                 # Language selector and localization logic
├── translations.js             # English and Spanish translations
├── content/
│   └── site-content.json        # Membership and location data
├── image-review/
│   └── catalog.json             # Image catalog used by the website
├── pictures/                   # Website image assets
├── vercel.json                 # Static deployment configuration
└── README.md
```

## Local Development

Serve the project through a local HTTP server so the browser can load its JSON content. With Python installed, run the following command from the repository root:

```bash
python -m http.server 4186
```

Open [http://localhost:4186](http://localhost:4186) in your browser.

## Localization

The header language selector supports Portuguese, English, and Spanish. Portuguese is the source language; translated strings are maintained in `translations.js`, and `language.js` applies the selected language to static and dynamically rendered content.

The selected language is stored in the browser and included in internal page links. Names, addresses, and membership prices retain their original values.

## Deployment

The repository is configured for static hosting on Vercel. Import the GitHub repository and use the following settings:

| Setting | Value |
| --- | --- |
| Framework Preset | `Other` |
| Root Directory | `./` |
| Build Command | Leave empty |
| Output Directory | `.` |
| Environment Variables | None required |

Keep `index.html` and `vercel.json` at the repository root. Preserve the asset directories and file names, including `image-review/catalog.json` and `content/site-content.json`, as the site loads these files at runtime.

## Project Scope

VORA is a portfolio concept project. The brand story, staff names, membership offers, and locations are illustrative. Social channels are presented as placeholders, and `contato@vora.example` is a demonstration email address.
