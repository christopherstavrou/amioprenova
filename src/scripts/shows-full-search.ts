/**
 * shows-full-search
 * Client-side search + filter logic for the dedicated shows search pages
 * (/en/shows/search, /bg/shows/search).
 *
 * Fetches /search-index.json, filters events by text query + dropdowns,
 * groups results into upcoming / past, and renders result cards via DOM APIs.
 * Labels for runtime-rendered text are read from `data-labels` on the root element.
 *
 * Usage (inside an Astro <script> tag):
 *   import { initShowsSearch } from '../../../scripts/shows-full-search';
 *   initShowsSearch({ lang: 'en' });
 */

interface EventSearchEntry {
  type: 'post' | 'event';
  lang: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  date: string;
  startDate?: string;
  eventType?: string;
  city?: string;
  venue?: string;
  admissionType?: string;
}

interface SearchLabels {
  upcoming: string;
  past: string;
  pastBadge: string;
  resultsFor: string;
  resultsCount: string;
  noResults: string;
  noResultsHint: string;
  noQuery: string;
  clearFilters: string;
  removeFilter: string;
}

interface SearchState {
  q: string;
  type: string;
  city: string;
  admission: string;
}

export interface ShowsSearchOptions {
  lang: 'en' | 'bg';
}

export function initShowsSearch({ lang }: ShowsSearchOptions): void {
  const root = document.getElementById('shows-search-root');
  if (!root) return;

  // Labels for runtime-rendered text are stored in a data attribute as JSON.
  let labels: SearchLabels;
  try {
    labels = JSON.parse(root.dataset.labels ?? '{}') as SearchLabels;
  } catch {
    labels = {} as SearchLabels;
  }

  let allEvents: EventSearchEntry[] = [];

  // --- Element references ---
  const searchForm = document.getElementById('shows-search-form') as HTMLFormElement | null;
  const searchInput = document.getElementById('shows-search-input') as HTMLInputElement | null;
  const typeFilter = document.getElementById('shows-type-filter') as HTMLSelectElement | null;
  const cityFilter = document.getElementById('shows-city-filter') as HTMLSelectElement | null;
  const admissionFilter = document.getElementById('shows-admission-filter') as HTMLSelectElement | null;
  const filterToggle = document.getElementById('shows-filter-toggle') as HTMLButtonElement | null;
  const filterDropdowns = document.getElementById('shows-filter-dropdowns') as HTMLElement | null;
  const chipsContainer = document.getElementById('shows-filter-chips') as HTMLElement | null;
  const resultsContainer = document.getElementById('shows-results-container') as HTMLElement | null;
  const resultsCount = document.getElementById('shows-results-count') as HTMLElement | null;

  // --- Mobile filter toggle ---
  function initMobileToggle(): void {
    if (!filterDropdowns || !filterToggle) return;

    // Hide dropdowns on mobile by default; sm+ breakpoint keeps them visible via
    // the flex class (only the JS-added `hidden` is toggled here).
    if (window.innerWidth < 640) {
      filterDropdowns.classList.add('hidden');
    }

    function handleToggle(): void {
      if (!filterDropdowns || !filterToggle) return;
      const isHidden = filterDropdowns.classList.contains('hidden');
      filterDropdowns.classList.toggle('hidden');
      filterToggle.setAttribute('aria-expanded', String(isHidden));
    }

    function handleResize(): void {
      if (!filterDropdowns || !filterToggle) return;
      if (window.innerWidth >= 640) {
        filterDropdowns.classList.remove('hidden');
        filterToggle.setAttribute('aria-expanded', 'false');
      }
    }

    filterToggle.addEventListener('click', handleToggle);
    window.addEventListener('resize', handleResize);
  }

  // --- URL state ---
  function getStateFromUrl(): SearchState {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') ?? '',
      type: params.get('type') ?? '',
      city: params.get('city') ?? '',
      admission: params.get('admission') ?? '',
    };
  }

  function pushStateToUrl(state: SearchState): void {
    const params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.type) params.set('type', state.type);
    if (state.city) params.set('city', state.city);
    if (state.admission) params.set('admission', state.admission);
    const search = params.toString();
    const newUrl = `${window.location.pathname}${search ? '?' + search : ''}`;
    window.history.pushState({}, '', newUrl);
  }

  function populateFormFromState(state: SearchState): void {
    if (searchInput) searchInput.value = state.q;
    if (typeFilter) typeFilter.value = state.type;
    if (cityFilter) cityFilter.value = state.city;
    if (admissionFilter) admissionFilter.value = state.admission;
  }

  // --- Filter logic ---
  function filterEvents(state: SearchState): EventSearchEntry[] {
    const lowerQ = state.q.toLowerCase();
    return allEvents.filter(entry => {
      if (state.q) {
        const titleMatch = entry.title.toLowerCase().includes(lowerQ);
        const descMatch = entry.description.toLowerCase().includes(lowerQ);
        const tagsMatch = entry.tags.some(tag => tag.toLowerCase().includes(lowerQ));
        const cityMatch = (entry.city ?? '').toLowerCase().includes(lowerQ);
        const venueMatch = (entry.venue ?? '').toLowerCase().includes(lowerQ);
        if (!titleMatch && !descMatch && !tagsMatch && !cityMatch && !venueMatch) return false;
      }
      if (state.type && entry.eventType !== state.type) return false;
      if (state.city && entry.city !== state.city) return false;
      if (state.admission && entry.admissionType !== state.admission) return false;
      return true;
    });
  }

  function isUpcoming(entry: EventSearchEntry): boolean {
    if (!entry.startDate) return false;
    return new Date(entry.startDate) >= new Date();
  }

  // --- Card rendering (DOM only — no innerHTML with user data) ---
  function createCard(entry: EventSearchEntry, isPast: boolean): HTMLElement {
    const article = document.createElement('article');
    article.className = [
      'bg-surface rounded-md shadow-md transition-shadow hover:shadow-lg p-4',
      isPast ? 'opacity-60' : '',
    ].join(' ').trim();

    const header = document.createElement('div');
    header.className = 'flex items-start gap-3 mb-2';

    if (isPast) {
      const badge = document.createElement('span');
      badge.className =
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface-muted text-text-secondary border border-border shrink-0 mt-0.5';
      badge.textContent = labels.pastBadge ?? 'Past';
      header.appendChild(badge);
    }

    const titleLink = document.createElement('a');
    titleLink.href = entry.url;
    titleLink.className =
      'font-serif text-lg font-bold leading-snug hover:text-accent-primary transition-colors text-text-primary';
    titleLink.textContent = entry.title;
    header.appendChild(titleLink);
    article.appendChild(header);

    const meta = document.createElement('p');
    meta.className = 'text-text-secondary text-sm mb-2';
    const location = [entry.venue, entry.city].filter(Boolean).join(' · ');
    meta.textContent = location ? `${entry.date} · ${location}` : entry.date;
    article.appendChild(meta);

    if (entry.description) {
      const desc = document.createElement('p');
      desc.className = 'text-text-primary text-sm line-clamp-2';
      desc.textContent = entry.description;
      article.appendChild(desc);
    }

    return article;
  }

  // --- Count text ---
  function formatCount(count: number, query: string): string {
    if (query) {
      return (labels.resultsFor ?? '{count} results for "{query}"')
        .replace('{count}', String(count))
        .replace('{query}', query);
    }
    return (labels.resultsCount ?? '{count} results').replace('{count}', String(count));
  }

  // --- Chips rendering ---
  function renderChips(state: SearchState): void {
    if (!chipsContainer) return;
    // Clear existing chips using DOM removal, not innerHTML
    while (chipsContainer.firstChild) {
      chipsContainer.removeChild(chipsContainer.firstChild);
    }

    function addChip(chipLabel: string, onDismiss: () => void): void {
      if (!chipsContainer) return;
      const chip = document.createElement('span');
      chip.className =
        'inline-flex items-center gap-1.5 px-3 py-1 bg-surface-muted border border-border rounded-full text-sm text-text-primary';

      const labelEl = document.createElement('span');
      labelEl.textContent = chipLabel;
      chip.appendChild(labelEl);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'text-text-secondary hover:text-text-primary transition-colors ml-0.5';
      btn.setAttribute(
        'aria-label',
        `${labels.removeFilter ?? 'Remove filter'}: ${chipLabel}`,
      );
      btn.textContent = '×';
      btn.addEventListener('click', onDismiss);
      chip.appendChild(btn);

      chipsContainer.appendChild(chip);
    }

    if (state.q) {
      addChip(`"${state.q}"`, () => {
        if (searchInput) searchInput.value = '';
        const newState: SearchState = { ...state, q: '' };
        pushStateToUrl(newState);
        renderResults(newState);
      });
    }

    if (state.type && typeFilter) {
      const chipLabel = typeFilter.options[typeFilter.selectedIndex]?.text ?? state.type;
      addChip(chipLabel, () => {
        if (typeFilter) typeFilter.value = '';
        const newState: SearchState = { ...state, type: '' };
        pushStateToUrl(newState);
        renderResults(newState);
      });
    }

    if (state.city) {
      addChip(state.city, () => {
        if (cityFilter) cityFilter.value = '';
        const newState: SearchState = { ...state, city: '' };
        pushStateToUrl(newState);
        renderResults(newState);
      });
    }

    if (state.admission && admissionFilter) {
      const chipLabel = admissionFilter.options[admissionFilter.selectedIndex]?.text ?? state.admission;
      addChip(chipLabel, () => {
        if (admissionFilter) admissionFilter.value = '';
        const newState: SearchState = { ...state, admission: '' };
        pushStateToUrl(newState);
        renderResults(newState);
      });
    }

    // "Clear all filters" shown when more than one filter is active
    const activeCount = [state.q, state.type, state.city, state.admission].filter(Boolean).length;
    if (activeCount > 1) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className =
        'inline-flex items-center gap-1 px-3 py-1 text-sm text-accent-primary hover:text-accent-primary-hover border border-accent-primary rounded-full transition-colors duration-fast';
      clearBtn.textContent = labels.clearFilters ?? 'Clear filters';
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (typeFilter) typeFilter.value = '';
        if (cityFilter) cityFilter.value = '';
        if (admissionFilter) admissionFilter.value = '';
        const newState: SearchState = { q: '', type: '', city: '', admission: '' };
        pushStateToUrl(newState);
        renderResults(newState);
      });
      chipsContainer.appendChild(clearBtn);
    }
  }

  // --- Section heading helper ---
  function createSectionHeading(text: string): HTMLHeadingElement {
    const h2 = document.createElement('h2');
    h2.className = 'font-serif text-xl font-bold mb-4';
    h2.textContent = text;
    return h2;
  }

  // --- Results rendering ---
  function renderResults(state: SearchState): void {
    if (!resultsContainer) return;

    renderChips(state);

    const hasFilters = state.q || state.type || state.city || state.admission;
    if (!hasFilters) {
      if (resultsCount) resultsCount.textContent = '';
      // Clear container using DOM removal, not innerHTML
      while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
      }
      const p = document.createElement('p');
      p.className = 'text-text-secondary text-lg';
      p.textContent = labels.noQuery ?? 'Enter a search term to find shows across all dates.';
      resultsContainer.appendChild(p);
      return;
    }

    const results = filterEvents(state);
    const upcoming = results
      .filter(e => isUpcoming(e))
      .sort((a, b) => new Date(a.startDate ?? '').getTime() - new Date(b.startDate ?? '').getTime());
    const past = results
      .filter(e => !isUpcoming(e))
      .sort((a, b) => new Date(b.startDate ?? '').getTime() - new Date(a.startDate ?? '').getTime());

    if (resultsCount) {
      resultsCount.textContent = results.length > 0 ? formatCount(results.length, state.q) : '';
    }

    // Clear container
    while (resultsContainer.firstChild) {
      resultsContainer.removeChild(resultsContainer.firstChild);
    }

    if (results.length === 0) {
      const wrapper = document.createElement('div');

      const p = document.createElement('p');
      p.className = 'text-text-primary font-medium mb-1';
      p.textContent = (labels.noResults ?? 'No results for "{query}"').replace(
        '{query}',
        state.q || state.type || state.city || state.admission,
      );
      wrapper.appendChild(p);

      const hint = document.createElement('p');
      hint.className = 'text-text-secondary text-sm';
      hint.textContent =
        labels.noResultsHint ?? 'Try a different search term or clear the filters.';
      wrapper.appendChild(hint);

      resultsContainer.appendChild(wrapper);
      return;
    }

    if (upcoming.length > 0) {
      const section = document.createElement('section');
      section.setAttribute('aria-label', labels.upcoming ?? 'Upcoming');
      section.appendChild(createSectionHeading(labels.upcoming ?? 'Upcoming'));
      const list = document.createElement('div');
      list.className = 'space-y-3 mb-10';
      upcoming.forEach(entry => list.appendChild(createCard(entry, false)));
      section.appendChild(list);
      resultsContainer.appendChild(section);
    }

    if (past.length > 0) {
      const section = document.createElement('section');
      section.setAttribute('aria-label', labels.past ?? 'Past');
      section.appendChild(createSectionHeading(labels.past ?? 'Past'));
      const list = document.createElement('div');
      list.className = 'space-y-3';
      past.forEach(entry => list.appendChild(createCard(entry, true)));
      section.appendChild(list);
      resultsContainer.appendChild(section);
    }
  }

  // --- Event handlers ---
  function handleFormSubmit(e: Event): void {
    e.preventDefault();
    const state: SearchState = {
      q: searchInput?.value.trim() ?? '',
      type: typeFilter?.value ?? '',
      city: cityFilter?.value ?? '',
      admission: admissionFilter?.value ?? '',
    };
    pushStateToUrl(state);
    renderResults(state);
  }

  function handleFilterChange(): void {
    const state: SearchState = {
      q: searchInput?.value.trim() ?? '',
      type: typeFilter?.value ?? '',
      city: cityFilter?.value ?? '',
      admission: admissionFilter?.value ?? '',
    };
    pushStateToUrl(state);
    renderResults(state);
  }

  // --- Load index ---
  async function loadSearchIndex(): Promise<void> {
    try {
      const response = await fetch('/search-index.json');
      if (!response.ok) {
        if (import.meta.env.DEV) console.error('Search index fetch failed:', response.status);
        return;
      }
      // Cast is safe: we control this endpoint (search-index.json.ts)
      const allEntries: EventSearchEntry[] = await response.json() as EventSearchEntry[];
      allEvents = allEntries.filter(entry => entry.type === 'event' && entry.lang === lang);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to load search index:', error);
    }
  }

  // --- Setup ---
  async function setup(): Promise<void> {
    await loadSearchIndex();

    initMobileToggle();

    searchForm?.addEventListener('submit', handleFormSubmit);
    typeFilter?.addEventListener('change', handleFilterChange);
    cityFilter?.addEventListener('change', handleFilterChange);
    admissionFilter?.addEventListener('change', handleFilterChange);

    // Browser back/forward: re-render from updated URL
    window.addEventListener('popstate', () => {
      const state = getStateFromUrl();
      populateFormFromState(state);
      renderResults(state);
    });

    const initialState = getStateFromUrl();
    populateFormFromState(initialState);
    renderResults(initialState);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => void setup(), { once: true });
  } else {
    void setup();
  }
}
