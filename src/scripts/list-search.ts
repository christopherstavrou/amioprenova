/**
 * list-search
 * Shared client-side search for all paginated list pages (shows + news, EN + BG).
 * Fetches /search-index.json, filters by type + lang, and wires up the search
 * input + results dropdown. Replaces per-page inline scripts.
 *
 * Usage (inside an Astro <script> tag):
 *   import { initListSearch } from '../../../scripts/list-search';
 *   initListSearch({ type: 'event', lang: 'en' });
 */

interface SearchEntry {
  type: string;
  lang: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  date: string;
}

export interface ListSearchOptions {
  /** 'event' for shows pages, 'post' for news pages */
  type: 'post' | 'event';
  /** 'en' or 'bg' */
  lang: 'en' | 'bg';
  /** id of the <input type="search"> element (default: 'search-input') */
  inputId?: string;
  /** id of the results dropdown container (default: 'search-results') */
  resultsId?: string;
}

export function initListSearch({
  type,
  lang,
  inputId = 'search-input',
  resultsId = 'search-results',
}: ListSearchOptions): void {
  let searchIndex: SearchEntry[] = [];

  async function loadSearchIndex(): Promise<void> {
    try {
      const response = await fetch('/search-index.json');
      const allEntries: SearchEntry[] = await response.json();
      searchIndex = allEntries.filter(
        entry => entry.type === type && entry.lang === lang,
      );
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to load search index:', error);
    }
  }

  function performSearch(query: string): SearchEntry[] {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return searchIndex
      .filter(entry => {
        const titleMatch = entry.title.toLowerCase().includes(lowerQuery);
        const descMatch = entry.description.toLowerCase().includes(lowerQuery);
        const tagsMatch = entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
        return titleMatch || descMatch || tagsMatch;
      })
      .slice(0, 10);
  }

  function displayResults(results: SearchEntry[], container: HTMLElement): void {
    if (results.length === 0) {
      container.classList.add('hidden');
      return;
    }
    container.innerHTML = '';
    results.forEach(entry => {
      const a = document.createElement('a');
      a.href = entry.url;
      a.className =
        'block p-3 hover:bg-surface-muted border-b border-border last:border-b-0 transition-colors';
      const titleEl = document.createElement('div');
      titleEl.className = 'font-medium text-sm text-text-primary';
      titleEl.textContent = entry.title;
      const dateEl = document.createElement('div');
      dateEl.className = 'text-xs text-text-secondary mt-1';
      dateEl.textContent = entry.date;
      a.appendChild(titleEl);
      a.appendChild(dateEl);
      container.appendChild(a);
    });
    container.classList.remove('hidden');
  }

  function setup(): void {
    const searchInput = document.getElementById(inputId) as HTMLInputElement | null;
    const resultsContainer = document.getElementById(resultsId);
    if (!searchInput || !resultsContainer) return;
    loadSearchIndex();

    searchInput.addEventListener('input', () => {
      displayResults(performSearch(searchInput.value), resultsContainer);
    });
    document.addEventListener('click', (e) => {
      if (
        !searchInput.contains(e.target as Node) &&
        !resultsContainer.contains(e.target as Node)
      ) {
        resultsContainer.classList.add('hidden');
      }
    });
  }

  // Astro defers scripts, so DOM is ready when this runs.
  // Guard against the rare case it fires before DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }
}
