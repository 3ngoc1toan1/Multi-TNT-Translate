import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import vi from './locales/vi.json';
import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';

const resources = {
  vi: { translation: vi },
  en: { translation: en },
  'zh-CN': { translation: zhCN }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
