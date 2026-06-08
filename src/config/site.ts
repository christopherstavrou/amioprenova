// Central site configuration
// All external URLs and constants should be defined here

export const siteConfig = {
  // Site identity
  siteName: 'amioprenova',
  copyrightName: 'amioprenova',
  baseUrl: 'https://amioprenova.com',
  ogImage: '/og-default.png', // Default OpenGraph image

  // Contact emails
  bookingEmail: 'amioprenova@gmail.com',
  pressEmail: 'amioprenova@gmail.com',

  // Music platforms
  bandcampUrl: 'https://amioprenova.bandcamp.com',
  spotifyUrl: '', // TODO: Add when verified
  appleMusicUrl: '', // TODO: Add when verified
  youtubeUrl: 'https://www.youtube.com/@amioprenova496', // Newer channel
  youtubeUrlOld: 'https://www.youtube.com/@amioprenova1789', // Original channel

  // Social media
  instagramUrl: 'https://www.instagram.com/amioprenovamusic',
  tiktokUrl: 'https://www.tiktok.com/@amioprenovamusic',
  facebookUrl: 'https://www.facebook.com/amioprenovamusic/',

  // Monetization
  donationUrl: '', // TODO: Add when verified
  ticketsPlatformUrl: '', // TODO: Add when verified

  // Newsletter
  mailchimpSignupUrl: '', // TODO: Add when verified

  // Artist identity (used for search-engine structured data / JSON-LD)
  artistName: 'Ami Oprenova',
  artistDescription: 'Jazz vocalist and composer whose musicianship spans from classical violin to the jazz stage.',

  // Press / Media Kit
  genres: ['Jazz', 'Vocal Jazz', 'Contemporary Jazz'], // TODO: Replace with actual genres
  riylTags: ['Ella Fitzgerald', 'Sarah Vaughan', 'Diana Krall'], // TODO: Replace with "Recommended If You Like" artists
  pressAssets: {
    photos: ['/press/press-photo-1.jpg'], // TODO: Add more press photos as needed
    logo: '/press/logo.png',
    techRider: '/press/tech-rider.pdf',
  },

  // Affiliate links (displayed on Support/Buy page)
  affiliateLinks: [
    {
      label: 'Recommended Gear',
      url: '', // TODO: Replace with real affiliate link
      note: 'Equipment and tools I use',
    },
    {
      label: 'Music Production Software',
      url: '', // TODO: Replace with real affiliate link
      note: 'Software recommendations',
    },
  ],
} as const;

/**
 * Feature flags for the Events/Shows section.
 * Set any flag to false to globally hide that field across all show pages.
 */
export const eventFeatures = {
  showEndTime: true,        // "18:30 – 22:00" end time on detail pages
  showHosts: true,          // "with Ami Oprenova Trio" performer line
  showUsersResponded: false, // Facebook attendance count (off by default — often low numbers)
  showCanceledBadge: true,  // Red "Canceled" badge on canceled events
} as const;
