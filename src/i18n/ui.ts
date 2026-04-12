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
      language: 'Language',
    },
    home: {
      playVideo: 'Play',
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
      language: 'Език',
    },
    home: {
      playVideo: 'Пусни',
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
