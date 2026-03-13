// Central site configuration
// All external URLs and constants should be defined here

export const siteConfig = {
  // Site identity
  siteName: 'amioprenova',
  copyrightName: 'amioprenova',
  baseUrl: 'https://amioprenova.com',
  ogImage: '/og-default.png', // Default OpenGraph image

  // Contact emails
  bookingEmail: '', // TODO: Replace with real booking email
  pressEmail: '', // TODO: Replace with real press email

  // Music platforms
  bandcampUrl: 'https://amioprenova.bandcamp.com', // Verified
  spotifyUrl: '', // TODO: Verify and add real Spotify artist URL
  appleMusicUrl: '', // TODO: Verify and add real Apple Music URL
  youtubeUrl: '', // TODO: Verify and add real YouTube channel URL

  // Social media
  instagramUrl: 'https://www.instagram.com/vocalistami/', // Verified (@vocalistami)
  tiktokUrl: '', // TODO: Verify and add real TikTok URL
  facebookUrl: 'https://www.facebook.com/amioprenovamusic/', // Verified

  // Monetization
  donationUrl: '', // TODO: Verify and add real Ko-fi or Buy Me a Coffee URL
  ticketsPlatformUrl: '', // TODO: Verify and add real Eventbrite/Tito URL

  // Newsletter
  mailchimpSignupUrl: '', // TODO: Replace with real Mailchimp signup form URL

  // Press / Media Kit
  genres: ['Jazz', 'Vocal Jazz', 'Contemporary Jazz'], // TODO: Replace with actual genres
  riylTags: ['Ella Fitzgerald', 'Sarah Vaughan', 'Diana Krall'], // TODO: Replace with "Recommended If You Like" artists
  pressAssets: {
    photos: ['/press/press-photo-1.jpg'], // TODO: Add more press photos as needed
    logo: '/press/logo.png',
    techRider: '/press/tech-rider.pdf',
  },

  // Affiliate links (displayed on Support/Buy page)
  affiliateLinks: [] as Array<{ label: string; url: string; note: string }>, // TODO: Add real affiliate links

  // Links page (linktree-style hub)
  linksPageLinks: [
    {
      label: 'Buy on Bandcamp',
      url: 'https://amioprenova.bandcamp.com', // Verified
      category: 'music',
    },
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/vocalistami/', // Verified (@vocalistami)
      category: 'social',
    },
    {
      label: 'Facebook',
      url: 'https://www.facebook.com/amioprenovamusic/', // Verified
      category: 'social',
    },
    // TODO: Add verified Spotify, YouTube, TikTok URLs when available
  ],
} as const;
