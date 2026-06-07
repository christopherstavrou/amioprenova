/**
 * Localized display names for the small, bounded set of countries that appear
 * in event data. `country` is stored as an English string (set by the scraper);
 * on the BG site it should render in Bulgarian. Cities are intentionally left
 * as-is — they're high-cardinality, often compound, and many are proper nouns.
 * Unknown countries fall through to the stored value.
 */
const COUNTRY_BG: Record<string, string> = {
  Bulgaria: 'България',
  Italy: 'Италия',
  Romania: 'Румъния',
  'United Kingdom': 'Великобритания',
  UK: 'Великобритания',
};

export function localizeCountry(country: string, lang: 'en' | 'bg'): string {
  if (lang === 'bg') return COUNTRY_BG[country] ?? country;
  return country;
}
