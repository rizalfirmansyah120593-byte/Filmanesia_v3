import { useEffect } from 'react';

const SITE_NAME = 'Filmanesia';
const SITE_URL  = 'https://www.filmanesia.com';
const DEFAULT_IMAGE = `${SITE_URL}/preview.png`;

const toAbsoluteUrl = (value, fallback = SITE_URL) => {
  try {
    return new URL(value || fallback, SITE_URL).toString();
  } catch {
    return fallback;
  }
};

function updateMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
  element.setAttribute('data-rh', 'true');
}

function updateCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
  element.setAttribute('data-rh', 'true');
}

/**
 * Reusable SEO component.
 *
 * Props:
 *  title        – page title (appended with " | Filmanesia" unless noSuffix)
 *  description  – meta description (max ~160 chars)
 *  image        – absolute OG image URL
 *  url          – canonical URL (defaults to current href)
 *  type         – OG type: 'website' | 'video.movie' | 'video.episode'
 *  noSuffix     – if true, title is used exactly as given
 *  jsonLd       – raw JSON-LD object to embed as structured data
 */
export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noSuffix = false,
  jsonLd,
  noindex = false,
}) {
  const fullTitle = title
    ? noSuffix ? title : `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Katalog Film dan Serial TV`;

  const metaDescription =
    description ||
    'Jelajahi katalog film dan serial TV Filmanesia. Temukan judul berdasarkan genre, tren, sinopsis, pemeran, dan panduan tontonan.';

  const metaImage  = toAbsoluteUrl(image || DEFAULT_IMAGE, DEFAULT_IMAGE);
  const canonical  = (() => {
    const raw = url || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
    try {
      const parsed = new URL(raw);
      const preferred = new URL(SITE_URL);
      parsed.protocol = preferred.protocol;
      parsed.hostname = preferred.hostname;
      parsed.port = '';
      parsed.hash = '';
      // Keep one canonical host and remove tracking/query parameters.
      parsed.pathname = parsed.pathname || '/';
      parsed.search = '';
      return parsed.toString();
    } catch {
      return SITE_URL;
    }
  })();

  useEffect(() => {
    document.title = fullTitle;
    updateMeta('name', 'description', metaDescription);
    updateMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMeta('property', 'og:site_name', SITE_NAME);
    updateMeta('property', 'og:type', type);
    updateMeta('property', 'og:title', fullTitle);
    updateMeta('property', 'og:description', metaDescription);
    updateMeta('property', 'og:image', metaImage);
    updateMeta('property', 'og:image:alt', fullTitle);
    updateMeta('property', 'og:image:width', '1200');
    updateMeta('property', 'og:image:height', '630');
    updateMeta('property', 'og:url', canonical);
    updateMeta('property', 'og:locale', 'id_ID');
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', fullTitle);
    updateMeta('name', 'twitter:description', metaDescription);
    updateMeta('name', 'twitter:image', metaImage);
    updateMeta('name', 'twitter:image:alt', fullTitle);
    updateCanonical(canonical);

    const schemaId = 'filmanesia-page-jsonld';
    let schema = document.getElementById(schemaId);
    if (jsonLd) {
      if (!schema) {
        schema = document.createElement('script');
        schema.id = schemaId;
        schema.type = 'application/ld+json';
        document.head.appendChild(schema);
      }
      schema.textContent = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
    } else {
      schema?.remove();
    }
  }, [canonical, fullTitle, jsonLd, metaDescription, metaImage, noindex, type]);

  return null;
}
