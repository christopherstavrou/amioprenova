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
    },
    footer: {
      copyright: 'All rights reserved.',
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
    },
    footer: {
      copyright: 'Всички права запазени.',
    },
  },
} as const;

export type Language = keyof typeof ui;
