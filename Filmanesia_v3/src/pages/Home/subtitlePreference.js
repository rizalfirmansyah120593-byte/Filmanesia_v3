// Browser language is the only reliable country/language signal available
// without sending the visitor's IP to a third party. Indonesia gets Bahasa
// Indonesia; every other locale falls back to English.
export function getPreferredSubtitle() {
  if (typeof navigator === 'undefined') return 'en';
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.some((value) => String(value).toLowerCase().startsWith('id')) ? 'id' : 'en';
}

export function addSubtitlePreference(url, language = getPreferredSubtitle()) {
  const parsed = new URL(url);
  // Providers use different names; unsupported parameters are ignored safely.
  parsed.searchParams.set('lang', language);
  parsed.searchParams.set('language', language);
  parsed.searchParams.set('sub_lang', language);
  parsed.searchParams.set('cc_lang', language);
  parsed.searchParams.set('ds_lang', language);
  return parsed.toString();
}
