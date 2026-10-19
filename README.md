# Ryan King — Clinical AI Research

Personal academic website at [kingrc15.github.io](https://kingrc15.github.io/), built with Jekyll and published by GitHub Pages from `master`.

## Updating the site

- `index.html`: homepage and research overview.
- `_pages/about.md`, `_pages/research.md`, `_pages/cv.md`: biography, research directions, and printable CV.
- `_data/publications.yml`: shared publication records. Set `selected: true` to feature an entry on the homepage. Use the original venue year even when a linked preprint was uploaded later.
- `_layouts/portfolio.html` and `_includes/portfolio-*.html`: shared layout and page sections.
- `assets/css/portfolio.css` and `assets/js/portfolio.js`: responsive styling, mobile navigation, publication filters, and CV printing.
- `_config.yml`: site description and the author profile used by the existing notes archive.

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
