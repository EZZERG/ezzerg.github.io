import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  buildPublicationsFromRecords,
  type RawPublicationMeta,
} from './publicationLoader';
import {
  SITE_URL,
  buildSitemapXml,
  buildStaticSeoHtml,
  buildStructuredData,
  serializeJsonLd,
} from './seoPrerender';

function loadDiskPublications() {
  const pubRoot = path.resolve(process.cwd(), 'src/content/publications');
  const slugs = fs
    .readdirSync(pubRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const metaRecords: Record<string, RawPublicationMeta> = {};
  const bibRecords: Record<string, string> = {};
  const thumbRecords: Record<string, string> = {};

  for (const slug of slugs) {
    const dir = path.join(pubRoot, slug);
    metaRecords[`../content/publications/${slug}/meta.json`] = JSON.parse(
      fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'),
    ) as RawPublicationMeta;
    const bibFile = fs.readdirSync(dir).find((f) => f.endsWith('.bib')) ?? 'citation.bib';
    bibRecords[`../content/publications/${slug}/${bibFile}`] = fs.readFileSync(
      path.join(dir, bibFile),
      'utf8',
    );
    const thumbFile =
      fs.readdirSync(dir).find((f) => /^thumbnail\.(png|jpe?g|webp|svg)$/i.test(f)) ??
      'thumbnail.png';
    thumbRecords[`../content/publications/${slug}/${thumbFile}`] = `/mock/${slug}/${thumbFile}`;
  }

  return buildPublicationsFromRecords(metaRecords, bibRecords, thumbRecords);
}

test('buildStructuredData generates valid Person, WebSite, and ScholarlyArticle graph', () => {
  const publications = loadDiskPublications();
  const ld = buildStructuredData(publications);
  const graph = ld['@graph'] as Array<Record<string, unknown>>;

  assert.equal(ld['@context'], 'https://schema.org');
  assert.ok(graph.some((node) => node['@type'] === 'WebSite' && node.url === SITE_URL));
  assert.ok(
    graph.some((node) => node['@type'] === 'Person' && node.name === 'Abdelhamid Ezzerg'),
  );

  const articles = graph.filter((node) => node['@type'] === 'ScholarlyArticle');
  assert.equal(articles.length, publications.length);

  const serialized = serializeJsonLd(ld);
  assert.doesNotMatch(serialized, /<\/script/i);
  assert.deepEqual(JSON.parse(serialized)['@context'], 'https://schema.org');
});

test('buildStaticSeoHtml embeds name, UCL affiliation, background, and all publication titles', () => {
  const publications = loadDiskPublications();
  const html = buildStaticSeoHtml(publications);

  assert.match(html, /<h1>Abdelhamid Ezzerg<\/h1>/);
  assert.match(html, /University College London/);
  assert.match(html, /\/cv\/EZZERG_CV\.pdf/);
  for (const pub of publications) {
    assert.ok(html.includes(pub.title), `Expected pre-rendered HTML to include "${pub.title}"`);
  }
});

test('buildSitemapXml emits valid XML with canonical root URL', () => {
  const xml = buildSitemapXml('2026-11-25');
  assert.match(xml, /<loc>https:\/\/ezzerg\.github\.io\/<\/loc>/);
  assert.match(xml, /<lastmod>2026-11-25<\/lastmod>/);
});
