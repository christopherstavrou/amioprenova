// UI dictionary for shared interface text only
// Page content must live in separate page files, not here

export const ui = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      music: 'Music',
      video: 'Video',
      cakeAndJazz: 'Cake & Jazz',
      shows: 'Shows',
      support: 'Support',
      news: 'News',
      press: 'Press',
      contact: 'Contact',
      links: 'Links',
      toggleTheme: 'Toggle Theme',
      toggleMenu: 'Toggle menu',
      closeMenu: 'Close menu',
      language: 'Language',
    },
    home: {
      playVideo: 'Play',
    },
    shows: {
      eventType: {
        concert: 'Concert',
        jam: 'Jam Session',
        collaboration: 'Collaboration',
        charity: 'Charity Event',
        'album-launch': 'Album Launch',
        workshop: 'Workshop',
        birthday: 'Birthday Show',
      },
      admissionType: {
        free: 'Free entry',
        'free-booking': 'Free · Booking required',
        paid: 'Paid entry',
        donation: 'Pay what you can',
      },
    },
    footer: {
      copyright: 'All rights reserved.',
    },
    a11y: {
      skipToContent: 'Skip to content',
    },
  },
  bg: {
    nav: {
      home: 'Начало',
      about: 'За мен',
      music: 'Музика',
      video: 'Видео',
      cakeAndJazz: 'Кейк и Джаз',
      shows: 'Концерти',
      support: 'Подкрепи',
      news: 'Новини',
      press: 'Преса',
      contact: 'Контакт',
      links: 'Връзки',
      toggleTheme: 'Смяна на тема',
      toggleMenu: 'Меню',
      closeMenu: 'Затвори менюто',
      language: 'Език',
    },
    home: {
      playVideo: 'Пусни',
    },
    shows: {
      eventType: {
        concert: 'Концерт',
        jam: 'Джем сесия',
        collaboration: 'Колаборация',
        charity: 'Благотворителен концерт',
        'album-launch': 'Представяне на албум',
        workshop: 'Майсторски клас',
        birthday: 'Рождено тържество',
      },
      admissionType: {
        free: 'Вход свободен',
        'free-booking': 'Свободен · Изисква резервация',
        paid: 'Платен вход',
        donation: 'Дарение по желание',
      },
    },
    footer: {
      copyright: 'Всички права запазени.',
    },
    a11y: {
      skipToContent: 'Към съдържанието',
    },
  },
} as const;

export type Language = keyof typeof ui;

export const useTranslations = <T extends Language>(lang: T) => ui[lang];
