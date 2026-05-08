/**
 * news-search
 * Client-side script for the dedicated news search pages (/en/news/search, /bg/news/search).
 * Reads ?q= from the URL, fetches the search index, and renders matching posts.
 * Language strings are read from data-* attributes on #search-root to avoid
 * hardcoded strings in the script.
 */

interface SearchEntry {
  type: 'post' | 'event';
  lang: 'en' | 'bg';
  title: string;
  description: string;
  tags: string[];
  url: string;
  date: string;
}

function buildResultCard(entry: SearchEntry): HTMLElement {
  const article = document.createElement('article');
  article.className =
    'bg-surface rounded-md shadow-md hover:shadow-lg transition-shadow duration-fast p-4 space-y-2';

  const titleLink = document.createElement('a');
  titleLink.href = entry.url;
  titleLink.className =
    'font-serif text-lg font-bold leading-snug hover:text-accent-primary transition-colors block';
  titleLink.textContent = entry.title;
  article.appendChild(titleLink);

  const dateEl = document.createElement('p');
  dateEl.className = 'text-text-secondary text-sm';
  dateEl.textContent = entry.date;
  article.appendChild(dateEl);

  if (entry.tags.length > 0) {
    const tagsEl = document.createElement('div');
    tagsEl.className = 'flex gap-1.5 flex-wrap';
    for (const tag of entry.tags) {
      const badge = document.createElement('span');
      badge.className =
        'text-xs bg-surface-elevated border border-border rounded px-2 py-0.5 text-text-secondary';
      badge.textContent = tag;
      tagsEl.appendChild(badge);
    }
    article.appendChild(tagsEl);
  }

  const descEl = document.createElement('p');
  descEl.className = 'text-text-primary text-sm line-clamp-2';
  descEl.textContent = entry.description;
  article.appendChild(descEl);

  return article;
}

export function initNewsSearch(): void {
  const root = document.getElementById('search-root');
  if (!root) return;

  const lang = (root.dataset.lang ?? 'en') as 'en' | 'bg';
  const strings = {
    resultsFor: root.dataset.resultsFor ?? 'results for',
    result: root.dataset.result ?? 'result',
    results: root.dataset.results ?? 'results',
    noResults: root.dataset.noResults ?? 'No results found for',
    noResultsTip: root.dataset.noResultsTip ?? 'Try a different search term.',
    emptyQuery: root.dataset.emptyQuery ?? 'Enter a search term above.',
  };

  const query = new URLSearchParams(window.location.search).get('q')?.trim() ?? '';

  const input = document.getElementById('search-input');
  if (input instanceof HTMLInputElement) input.value = query;

  const statusEl = document.getElementById('search-status');
  const listEl = document.getElementById('search-list');
  if (!(statusEl instanceof HTMLElement) || !(listEl instanceof HTMLElement)) return;

  if (!query) {
    statusEl.textContent = strings.emptyQuery;
    return;
  }

  async function run(status: HTMLElement, list: HTMLElement): Promise<void> {
    let entries: SearchEntry[] = [];
    try {
      const resp = await fetch('/search-index.json');
      if (!resp.ok) return;
      const all: SearchEntry[] = await resp.json();
      entries = all.filter(e => e.type === 'post' && e.lang === lang);
    } catch {
      return;
    }

    const q = query.toLowerCase();
    const results = entries.filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some(tag => tag.toLowerCase().includes(q)),
    );

    if (results.length === 0) {
      const noResEl = document.createElement('p');
      noResEl.className = 'text-text-secondary text-lg mb-2';
      noResEl.textContent = `${strings.noResults} “${query}”.`;
      list.appendChild(noResEl);
      const tipEl = document.createElement('p');
      tipEl.className = 'text-sm text-text-secondary';
      tipEl.textContent = strings.noResultsTip;
      list.appendChild(tipEl);
    } else {
      const countWord = results.length === 1 ? strings.result : strings.results;
      status.textContent = `${results.length} ${countWord} ${strings.resultsFor} “${query}”`;
      const fragment = document.createDocumentFragment();
      for (const entry of results) {
        fragment.appendChild(buildResultCard(entry));
      }
      list.appendChild(fragment);
    }
  }

  run(statusEl, listEl);
}
