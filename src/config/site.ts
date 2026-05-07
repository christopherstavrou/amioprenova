// Central site configuration
// All external URLs and constants should be defined here

export interface LocalizedString {
  en: string;
  bg: string;
}

export interface LinksPagePlatform {
  label: string;
  icon: string;
  url: string;
}

export interface LinksPageLink {
  label: LocalizedString;
  sublabel?: LocalizedString;
  url: string;
  icon?: string;
  variant?: 'featured' | 'default' | 'subtle';
  external?: boolean;
}

export interface LinksPageSection {
  heading?: LocalizedString;
  links: LinksPageLink[];
}

export interface LinksPageConfig {
  profile: {
    image: string;
    tagline: LocalizedString;
  };
  featuredRelease: {
    active: boolean;
    albumArt: string;
    title: LocalizedString;
    subtitle: LocalizedString;
    youtubeId?: string;
    platforms: LinksPagePlatform[];
    countdownTo?: string;
  };
  sections: LinksPageSection[];
  socialIcons: Array<{
    platform: string;
    url: string;
  }>;
  email: {
    active: boolean;
    endpoint: string;
  };
}

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
  linksPage: {
    profile: {
      image: '/press/press-photo-1.jpg',
      tagline: { en: 'Jazz vocalist', bg: 'Джаз вокалистка' },
    },
    featuredRelease: {
      active: false,
      albumArt: '',
      title: { en: '', bg: '' },
      subtitle: { en: 'Out now', bg: 'Вече е навън' },
      platforms: [],
    },
    sections: [
      {
        heading: { en: 'Music', bg: 'Музика' },
        links: [
          {
            label: { en: 'Listen on Spotify', bg: 'Слушайте в Spotify' },
            url: '', // TODO: Add when verified
            icon: 'spotify',
            variant: 'default',
            external: true,
          },
          {
            label: { en: 'Buy on Bandcamp', bg: 'Купете от Bandcamp' },
            url: 'https://amioprenova.bandcamp.com',
            icon: 'bandcamp',
            variant: 'default',
            external: true,
          },
          {
            label: { en: 'Watch on YouTube', bg: 'Гледайте в YouTube' },
            url: 'https://www.youtube.com/@amioprenova496',
            icon: 'youtube',
            variant: 'default',
            external: true,
          },
        ],
      },
      {
        heading: { en: 'Social', bg: 'Социални мрежи' },
        links: [
          {
            label: { en: 'Instagram', bg: 'Instagram' },
            url: 'https://www.instagram.com/amioprenovamusic',
            icon: 'instagram',
            variant: 'default',
            external: true,
          },
          {
            label: { en: 'TikTok', bg: 'TikTok' },
            url: 'https://www.tiktok.com/@amioprenovamusic',
            icon: 'tiktok',
            variant: 'default',
            external: true,
          },
          {
            label: { en: 'Facebook', bg: 'Facebook' },
            url: 'https://www.facebook.com/amioprenovamusic/',
            icon: 'facebook',
            variant: 'default',
            external: true,
          },
        ],
      },
      {
        heading: { en: 'Support', bg: 'Подкрепа' },
        links: [
          {
            label: { en: 'Support Me', bg: 'Подкрепете ме' },
            url: '', // TODO: Add when verified
            variant: 'default',
            external: true,
          },
          {
            label: { en: 'Get Tickets', bg: 'Купете билети' },
            url: '', // TODO: Add when verified
            variant: 'default',
            external: true,
          },
        ],
      },
    ],
    socialIcons: [
      { platform: 'instagram', url: 'https://www.instagram.com/amioprenovamusic' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@amioprenovamusic' },
      { platform: 'facebook', url: 'https://www.facebook.com/amioprenovamusic/' },
      { platform: 'youtube', url: 'https://www.youtube.com/@amioprenova496' },
      { platform: 'bandcamp', url: 'https://amioprenova.bandcamp.com' },
    ],
    email: {
      active: false,
      endpoint: 'mailto:amioprenova@gmail.com',
    },
  } satisfies LinksPageConfig,
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
