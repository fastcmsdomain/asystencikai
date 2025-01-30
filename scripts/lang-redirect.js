const LANG_COOKIE = 'preferred_lang';
const SUPPORTED_LANGS = ['en', 'es', 'fr'];
const DEFAULT_LANG = 'en';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return undefined;
}

function getBrowserLang() {
  return (navigator.language || navigator.userLanguage).substring(0, 2);
}

function shouldRedirect() {
  // Don't redirect if already on a language path
  if (SUPPORTED_LANGS.some(lang => window.location.pathname.startsWith(`/${lang}/`))) {
    return false;
  }
  
  // Check for existing cookie
  const storedLang = getCookie(LANG_COOKIE);
  if (storedLang && SUPPORTED_LANGS.includes(storedLang)) {
    return storedLang;
  }
  
  // Detect browser language
  const browserLang = getBrowserLang();
  if (SUPPORTED_LANGS.includes(browserLang)) {
    return browserLang;
  }
  
  return DEFAULT_LANG;
}

const redirectLang = shouldRedirect();
if (redirectLang) {
  window.location.href = `/${redirectLang}${window.location.pathname}`;
}