// Central site configuration
// All external URLs and constants should be defined here

export const siteConfig = {
  // Site identity
  siteName: 'amioprenova',
  copyrightName: 'amioprenova',

  // Contact emails
  bookingEmail: 'booking@example.com', // TODO: Replace with real email
  pressEmail: 'press@example.com', // TODO: Replace with real email

  // Music platforms
  bandcampUrl: 'https://amioprenova.bandcamp.com', // TODO: Replace with real Bandcamp URL
  spotifyUrl: 'https://open.spotify.com/artist/example', // TODO: Replace with real Spotify URL
  youtubeUrl: 'https://youtube.com/@amioprenova', // TODO: Replace with real YouTube URL

  // Social media
  instagramUrl: 'https://instagram.com/amioprenova', // TODO: Replace with real Instagram URL
  tiktokUrl: 'https://tiktok.com/@amioprenova', // TODO: Replace with real TikTok URL
  facebookUrl: 'https://facebook.com/amioprenova', // TODO: Replace with real Facebook URL

  // Monetization
  donationUrl: 'https://ko-fi.com/amioprenova', // TODO: Replace with real Ko-fi or Buy Me a Coffee URL
  ticketsPlatformUrl: 'https://eventbrite.com/o/amioprenova', // TODO: Replace with real Eventbrite/Tito URL

  // Newsletter
  mailchimpSignupUrl: 'https://mailchimp.com/signup', // TODO: Replace with real Mailchimp signup form URL

  // Affiliate links (displayed on Support/Buy page)
  affiliateLinks: [
    {
      label: 'Recommended Gear',
      url: 'https://example.com/gear', // TODO: Replace with real affiliate link
      note: 'Equipment and tools I use',
    },
    {
      label: 'Music Production Software',
      url: 'https://example.com/software', // TODO: Replace with real affiliate link
      note: 'Software recommendations',
    },
  ],

  // Links page (linktree-style hub)
  linksPageLinks: [
    {
      label: 'Listen on Spotify',
      url: 'https://open.spotify.com/artist/example', // TODO: Replace with real Spotify URL
      category: 'music',
    },
    {
      label: 'Buy on Bandcamp',
      url: 'https://amioprenova.bandcamp.com', // TODO: Replace with real Bandcamp URL
      category: 'music',
    },
    {
      label: 'Watch on YouTube',
      url: 'https://youtube.com/@amioprenova', // TODO: Replace with real YouTube URL
      category: 'music',
    },
    {
      label: 'Instagram',
      url: 'https://instagram.com/amioprenova', // TODO: Replace with real Instagram URL
      category: 'social',
    },
    {
      label: 'TikTok',
      url: 'https://tiktok.com/@amioprenova', // TODO: Replace with real TikTok URL
      category: 'social',
    },
    {
      label: 'Facebook',
      url: 'https://facebook.com/amioprenova', // TODO: Replace with real Facebook URL
      category: 'social',
    },
    {
      label: 'Support Me',
      url: 'https://ko-fi.com/amioprenova', // TODO: Replace with real donation URL
      category: 'support',
    },
    {
      label: 'Get Tickets',
      url: 'https://eventbrite.com/o/amioprenova', // TODO: Replace with real tickets URL
      category: 'support',
    },
  ],
} as const;
