import { PROFILE, RESEARCH_INTERESTS, TRAJECTORY_ENTRIES } from '../data/portfolioData';
import type { Publication } from './publicationLoader';

export const SITE_URL = 'https://ezzerg.github.io/';
export const SITE_TITLE = 'Abdelhamid Ezzerg — Statistics & Machine Learning';
export const SITE_DESCRIPTION =
  'Academic homepage of Abdelhamid Ezzerg, PhD student in Statistics and Machine Learning at University College London (UCL) and former Amazon Applied Scientist.';

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

export function buildStructuredData(publications: Publication[]): Record<string, unknown> {
  const personId = `${SITE_URL}#person`;
  const websiteId = `${SITE_URL}#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE_URL,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
        author: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: PROFILE.name,
        url: SITE_URL,
        image: `${SITE_URL}profile_photo/Profile_photo.jpeg`,
        jobTitle: PROFILE.role,
        description: PROFILE.tagline,
        email: `mailto:${PROFILE.email}`,
        homeLocation: {
          '@type': 'Place',
          name: PROFILE.location,
        },
        affiliation: {
          '@type': 'CollegeOrUniversity',
          name: 'University College London',
          department: 'Department of Statistical Science',
        },
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'ENS Paris-Saclay' },
          { '@type': 'CollegeOrUniversity', name: 'École Centrale Paris (CentraleSupélec)' },
          { '@type': 'CollegeOrUniversity', name: 'University of Cambridge' },
        ],
        knowsAbout: [
          ...RESEARCH_INTERESTS.current.map((item) => item.title),
          ...RESEARCH_INTERESTS.previous.map((item) => item.title),
          'Generalized Bayesian Inference',
          'Bayesian Optimization',
          'Normalizing Flows',
          'Text-to-Speech',
        ],
        sameAs: PROFILE.socials
          .map((item) => item.href)
          .filter((href) => href.startsWith('https://')),
      },
      ...publications.map((pub) => ({
        '@type': 'ScholarlyArticle',
        headline: pub.title,
        name: pub.title,
        datePublished: String(pub.year),
        url: pub.url || pub.arxivUrl,
        sameAs: pub.arxivUrl,
        isPartOf: {
          '@type': 'PublicationEvent',
          name: pub.venue,
        },
        author: pub.authors.map((name) => ({
          '@type': 'Person',
          name: name.trim(),
        })),
        abstract: pub.abstract,
        keywords: pub.topics.join(', '),
      })),
    ],
  };
}

/**
 * Generates semantic, progressive-enhancement HTML embedded inside #root at build time.
 * Crawlers (Googlebot, Bingbot, social scrapers) read the full academic bio, background,
 * and publications directly from index.html without waiting for client-side JavaScript.
 * React replaces #root cleanly on client mount via createRoot().
 */
export function buildStaticSeoHtml(publications: Publication[]): string {
  const interestsList = [
    ...RESEARCH_INTERESTS.current.map(
      (item) => `<li><strong>${escapeHtml(item.title)}</strong>: ${escapeHtml(item.detail)}</li>`,
    ),
    ...RESEARCH_INTERESTS.previous.map(
      (item) => `<li><strong>${escapeHtml(item.title)}</strong>: ${escapeHtml(item.detail)}</li>`,
    ),
  ].join('');

  const backgroundItems = TRAJECTORY_ENTRIES.map(
    (entry) =>
      `<li><strong>${escapeHtml(entry.role)}</strong> — ${escapeHtml(entry.organization)} (${escapeHtml(entry.years)}, ${escapeHtml(entry.city)}): ${escapeHtml(entry.summary)}</li>`,
  ).join('');

  const publicationItems = publications
    .map(
      (pub) =>
        `<article><h3><a href="${escapeHtml(pub.url || pub.arxivUrl)}" style="color:#93c5fd">${escapeHtml(pub.title)}</a></h3><p>${escapeHtml(pub.authors.join(', '))} · ${escapeHtml(pub.venueShort)}</p><p>${escapeHtml(pub.abstract)}</p></article>`,
    )
    .join('');

  const socialItems = PROFILE.socials
    .map(
      (item) =>
        `<li><a href="${escapeHtml(item.href)}" style="color:#93c5fd">${escapeHtml(item.label)}: ${escapeHtml(item.value)}</a></li>`,
    )
    .join('');

  return [
    '<div data-prerendered="true" style="min-height:100vh;background:#090b10;color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;padding:48px 24px;max-width:960px;margin:0 auto;line-height:1.6">',
    `<header><p>University College London · Department of Statistical Science · ${escapeHtml(PROFILE.location)}</p><h1>${escapeHtml(PROFILE.name)}</h1><p>${escapeHtml(PROFILE.tagline)}</p><p><a href="${escapeHtml(PROFILE.cvUrl)}" style="color:#93c5fd">Curriculum Vitae (PDF)</a></p></header>`,
    `<main><section id="about"><h2>About</h2><p>I am a PhD student in Statistical Science at UCL, working on generalized Bayesian methods for modern statistical and machine learning problems under Prof. Jeremias Knoblauch and Prof. Ilija Bogunovic. Previously, I spent six years as an Applied Scientist at Amazon Alexa Text-to-Speech and Data Scientist at Fimatix.</p><ul>${interestsList}</ul></section>`,
    `<section id="background"><h2>Background</h2><ul>${backgroundItems}</ul></section>`,
    `<section id="publications"><h2>Selected Publications</h2>${publicationItems}</section></main>`,
    `<footer id="contact"><h2>Contact</h2><ul>${socialItems}</ul></footer>`,
    '</div>',
  ].join('');
}

export function buildSitemapXml(lastModIsoDate: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${escapeHtml(lastModIsoDate)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}
