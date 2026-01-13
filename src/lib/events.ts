import eventsData from '../data/events.json';

export interface Event {
  id: string;
  title: string;
  startDate: string;
  venue: string;
  city: string;
  country: string;
  ticketUrl: string;
  mapUrl: string;
}

// Load all events
export function getAllEvents(): Event[] {
  return eventsData as Event[];
}

// Filter to upcoming events (future dates only)
export function getUpcomingEvents(): Event[] {
  const now = new Date();
  return getAllEvents()
    .filter(event => new Date(event.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

// Get next N upcoming events
export function getNextEvents(count: number): Event[] {
  return getUpcomingEvents().slice(0, count);
}

// Format date for display
export function formatEventDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString(locale, options);
}
