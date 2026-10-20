# Ryan King — Clinical AI Research

Personal academic website at [kingrc15.github.io](https://kingrc15.github.io/), built with Jekyll and published by GitHub Pages from `master`.

## Updating the site

- `index.html`: homepage and research overview.
- `_pages/about.md`, `_pages/research.md`, `_pages/cv.md`: biography, research directions, and printable CV.
- `_data/publications.yml`: shared publication records. Set `selected: true` to feature an entry on the homepage. Use the original venue year even when a linked preprint was uploaded later.
- `_layouts/portfolio.html` and `_includes/portfolio-*.html`: shared layout and page sections.
- `_includes/portfolio-structured-data.html`: linked Person, WebSite, WebPage/ProfilePage, and publication metadata derived from the visible public content.
- `assets/css/portfolio.css` and `assets/js/portfolio.js`: responsive styling, mobile navigation, publication filters, and CV printing.
- `_config.yml`: site description and the author profile used by the existing notes archive.
- `seo_title` and `description` in each portfolio page's front matter: distinct search and sharing titles and descriptions, independent of the visible page heading.
- `assets/images/ryan-king-480.webp` and `ryan-king-960.webp`: responsive portrait variants; keep these in sync with the original JPEG used as the fallback and sharing image.

The main pages work without JavaScript; scripting adds navigation controls, publication filtering, and a print button. The CV has a print stylesheet for saving a PDF from a browser.

## Local development

With Ruby and Bundler installed:

```sh
bundle install
bundle exec jekyll serve
```

For a production build:

```sh
JEKYLL_ENV=production bundle exec jekyll build
```

The existing Minimal Mistakes theme continues to render archived notes and posts. Keep `_site/` and Jekyll caches out of source changes. GitHub Pages performs the production Jekyll build on deployment.

## Search and AI discovery

The Jekyll sitemap plugin provides `/sitemap.xml` and `/robots.txt`. Public portfolio pages must remain crawlable and render their content without JavaScript. The internal leaderboard retains its separate noindex layout and sitemap exclusion.

Keep structured metadata consistent with the visible biography and publication list. Publication record links use stable anchors on `/research/`; avoid changing a published paper title unnecessarily. For collective-authorship records, set `collective_authorship: true` so the metadata records Ryan as a contributor without inventing an author list. The reading-notes archive is labeled separately from authored publications.

Search inclusion and AI citations are determined by the search providers. These changes improve how the site represents its content; they do not guarantee rankings, indexing, or citations. No special AI text file is required. Search Console verification and sitemap submission are account-level steps, separate from the site build.

Keep homepage pagination disabled: this site presents a portfolio, not a paginated blog. The legacy `/page2/` URL uses an immediate HTML redirect to `/`, with a matching canonical and sitemap exclusion. GitHub Pages serves this as HTML rather than an HTTP 301 redirect.
