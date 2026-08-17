// Language codes mapping
export const LANGUAGE_CODES = {
  vi: 'vi',
  en: 'en',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  id: 'id',
  th: 'th',
  fil: 'fil',
  ja: 'ja',
  ko: 'ko',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  it: 'it',
  pt: 'pt'
};

// Full language names
export const LANGUAGE_NAMES = {
  vi: 'Tiếng Việt',
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  id: 'Bahasa Indonesia',
  th: 'ไทย',
  fil: 'Filipino',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  it: 'Italiano',
  pt: 'Português'
};

// Language flags
export const LANGUAGE_FLAGS = {
  vi: '🇻🇳',
  en: '🇬🇧',
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  id: '🇮🇩',
  th: '🇹🇭',
  fil: '🇵🇭',
  ja: '🇯🇵',
  ko: '🇰🇷',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  ru: '🇷🇺',
  it: '🇮🇹',
  pt: '🇵🇹'
};

// Get all available languages
export const getAvailableLanguages = () => {
  return Object.keys(LANGUAGE_CODES).map((code) => ({
    code,
    name: LANGUAGE_NAMES[code],
    flag: LANGUAGE_FLAGS[code]
  }));
};
