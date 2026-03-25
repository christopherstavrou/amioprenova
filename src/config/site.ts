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
  tiktokUrl: '', // TODO: Add when verified
  facebookUrl: 'https://www.facebook.com/amioprenovamusic/',

  // Monetization
  donationUrl: '', // TODO: Add when verified
  ticketsPlatformUrl: '', // TODO: Add when verified

  // Newsletter
  mailchimpSignupUrl: '', // TODO: Add when verified

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

  // Links page (linktree-style hub)
  linksPageLinks: [
    {
      label: 'Listen on Spotify',
      url: '', // TODO: Add when verified
      category: 'music',
    },
    {
      label: 'Buy on Bandcamp',
      url: 'https://amioprenova.bandcamp.com',
      category: 'music',
    },
    {
      label: 'Watch on YouTube',
      url: 'https://www.youtube.com/@amioprenova496',
      category: 'music',
    },
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/amioprenovamusic',
      category: 'social',
    },
    {
      label: 'TikTok',
      url: '', // TODO: Add when verified
      category: 'social',
    },
    {
      label: 'Facebook',
      url: 'https://www.facebook.com/amioprenovamusic/',
      category: 'social',
    },
    {
      label: 'Support Me',
      url: '', // TODO: Add when verified
      category: 'support',
    },
    {
      label: 'Get Tickets',
      url: '', // TODO: Add when verified
      category: 'support',
    },
  ],
} as const;
