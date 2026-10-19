(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    };
    menuButton.hidden = false;
    document.documentElement.classList.add('nav-ready');
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.header-inner')) closeMenu();
    });
  }
  const filters = [...document.querySelectorAll('[data-publication-filter]')];
  const papers = [...document.querySelectorAll('[data-topics]')];
  const count = document.querySelector('[data-publication-count]');
  if (filters.length && papers.length) {
    const filterBar = document.querySelector('.publication-filters');
    if (filterBar) filterBar.hidden = false;
    filters.forEach(button => {
      button.addEventListener('click', () => {
        const topic = button.dataset.publicationFilter;
        filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
        let visible = 0;
        papers.forEach(paper => {
          const matches = topic === 'all' || paper.dataset.topics.split(' ').includes(topic);
          paper.hidden = !matches;
          if (matches) visible += 1;
        });
        if (count) count.textContent = `${visible} ${visible === 1 ? 'publication' : 'publications'}`;
      });
    });
  }
  const printButton = document.querySelector('[data-print-cv]');
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', () => window.print());
  }
})();
