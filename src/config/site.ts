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
  bandcampUrl: '', // TODO: Add Bandcamp URL
  spotifyUrl: '', // TODO: Add Spotify URL
  youtubeUrl: '', // TODO: Add YouTube URL

  // Social media
  instagramUrl: '', // TODO: Add Instagram URL
  tiktokUrl: '', // TODO: Add TikTok URL
  facebookUrl: '', // TODO: Add Facebook URL

  // Monetization
  donationUrl: '', // TODO: Add Ko-fi or Buy Me a Coffee URL
  ticketsPlatformUrl: '', // TODO: Add Eventbrite/Tito URL

  // Newsletter
  mailchimpSignupUrl: '', // TODO: Add Mailchimp signup form URL

  // Affiliate links (displayed on Support/Buy page)
  affiliateLinks: [
    {
      label: 'Recommended Gear',
      url: '', // TODO: Add affiliate link
      note: 'Equipment and tools I use',
    },
    {
      label: 'Music Production Software',
      url: '', // TODO: Add affiliate link
      note: 'Software recommendations',
    },
  ],

  // Links page (linktree-style hub)
  linksPageLinks: [
    {
      label: 'Listen on Spotify',
      url: '', // TODO: Add Spotify URL
      category: 'music',
    },
    {
      label: 'Buy on Bandcamp',
      url: '', // TODO: Add Bandcamp URL
      category: 'music',
    },
    {
      label: 'Watch on YouTube',
      url: '', // TODO: Add YouTube URL
      category: 'music',
    },
    {
      label: 'Instagram',
      url: '', // TODO: Add Instagram URL
      category: 'social',
    },
    {
      label: 'TikTok',
      url: '', // TODO: Add TikTok URL
      category: 'social',
    },
    {
      label: 'Facebook',
      url: '', // TODO: Add Facebook URL
      category: 'social',
    },
    {
      label: 'Support Me',
      url: '', // TODO: Add donation URL
      category: 'support',
    },
    {
      label: 'Get Tickets',
      url: '', // TODO: Add tickets URL
      category: 'support',
    },
  ],
} as const;
