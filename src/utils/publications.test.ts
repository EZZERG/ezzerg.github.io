import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { TRAJECTORY_ENTRIES } from '../data/portfolioData';
import {
  buildPublicationsFromRecords,
  extractPublicationSlug,
  type RawPublicationMeta,
} from './publicationLoader';
import {
  countByYear,
  filterPublications,
  filterTrajectory,
  getAvailableYears,
  isSelfAuthor,
} from './publications';

function loadPublicationsFromDisk() {
  const baseDir = path.resolve(process.cwd(), 'src/content/publications');
  const metaByPath: Record<string, RawPublicationMeta> = {};
  const bibByPath: Record<string, string> = {};
  const thumbByPath: Record<string, string> = {};

  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folder = path.join(baseDir, entry.name);
    const metaPath = path.join(folder, 'meta.json');
    if (fs.existsSync(metaPath)) {
      metaByPath[metaPath] = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as RawPublicationMeta;
    }
    for (const file of fs.readdirSync(folder)) {
      const fullPath = path.join(folder, file);
      if (file.endsWith('.bib')) {
        bibByPath[fullPath] = fs.readFileSync(fullPath, 'utf8');
      } else if (/^thumbnail\.(png|jpg|jpeg|webp|svg)$/i.test(file)) {
        thumbByPath[fullPath] = fullPath;
      }
    }
  }

  return buildPublicationsFromRecords(metaByPath, bibByPath, thumbByPath);
}

const PUBLICATIONS = loadPublicationsFromDisk();

test('self-contained publication folders all parse with valid metadata, BibTeX, and thumbnail', () => {
  assert.equal(PUBLICATIONS.length, 9);
  for (const pub of PUBLICATIONS) {
    assert.ok(pub.title.length > 5, `${pub.id} has a title`);
    assert.ok(pub.bibtex.includes('@'), `${pub.id} has a BibTeX entry loaded from .bib`);
    assert.ok(pub.previewImage.length > 0, `${pub.id} has a resolved thumbnail`);
    assert.ok(pub.arxivUrl.startsWith('https://'), `${pub.id} has an arXiv URL`);
    assert.ok(pub.url.startsWith('https://'), `${pub.id} has a primary URL`);
  }
});

test('publicationLoader derives sensible defaults for new folders without boilerplate', () => {
  assert.equal(
    extractPublicationSlug('../content/publications/2027-sample-paper/meta.json'),
    '2027-sample-paper',
  );

  const parsed = buildPublicationsFromRecords(
    {
      '../content/publications/2027-sample-paper/meta.json': {
        title: 'Sample Paper',
        year: 2027,
        venue: 'NeurIPS',
        authors: ['Abdelhamid Ezzerg', 'Coauthor One'],
        abstract: 'Test abstract.',
        arxivUrl: 'https://arxiv.org/abs/2701.00001',
        topics: ['Statistical Theory'],
      },
    },
    {
      '../content/publications/2027-sample-paper/citation.bib': '@inproceedings{sample2027, year={2027}}',
    },
    {
      '../content/publications/2027-sample-paper/thumbnail.webp': '/assets/sample.webp',
    },
  );

  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].id, '2027-sample-paper');
  assert.equal(parsed[0].venueShort, 'NeurIPS 2027');
  assert.equal(parsed[0].url, 'https://arxiv.org/abs/2701.00001');
  assert.equal(parsed[0].isFirstAuthor, true);
  assert.equal(parsed[0].previewImage, '/assets/sample.webp');
  assert.equal(parsed[0].bibtex, '@inproceedings{sample2027, year={2027}}');
  assert.deepEqual(parsed[0].topics, ['Statistical Theory']);
});

test('getAvailableYears returns descending unique years', () => {
  assert.deepEqual(getAvailableYears(PUBLICATIONS), [2026, 2023, 2022, 2021]);
});

test('countByYear accurately tallies Abdelhamid Ezzerg publications', () => {
  assert.deepEqual(countByYear(PUBLICATIONS), { 2026: 1, 2023: 2, 2022: 4, 2021: 2 });
});

test('filterPublications filters by year, topic, firstAuthor, and search query', () => {
  const only2026 = filterPublications(PUBLICATIONS, { year: 2026 });
  assert.equal(only2026.length, 1);
  assert.equal(only2026[0].id, '2026-robust-bo-unbounded-corruptions');
  assert.equal(only2026[0].url, 'https://icml.cc/virtual/2026/poster/60490');
  assert.equal(only2026[0].arxivUrl, 'https://arxiv.org/abs/2511.15315');
  assert.equal(only2026[0].isFirstAuthor, true);

  const boPapers = filterPublications(PUBLICATIONS, { topic: 'Bayesian Optimization' });
  assert.equal(boPapers.length, 1);
  assert.equal(boPapers[0].id, '2026-robust-bo-unbounded-corruptions');

  const only2022 = filterPublications(PUBLICATIONS, { year: 2022 });
  assert.equal(only2022.length, 4);
  assert.equal(only2022[0].isFirstAuthor, true);

  const firstAuthor = filterPublications(PUBLICATIONS, { firstAuthorOnly: true });
  assert.equal(firstAuthor.length, 3);
  assert.ok(firstAuthor.every((p) => p.isFirstAuthor));

  const accentSearch = filterPublications(PUBLICATIONS, { query: 'accent conversion' });
  assert.equal(accentSearch.length, 1);
  assert.equal(accentSearch[0].id, '2022-remap-warp-attend-accent-conversion');

  const flowPapers = filterPublications(PUBLICATIONS, { topic: 'Normalizing Flows' });
  assert.equal(flowPapers.length, 6);
});

test('filterTrajectory cleanly separates experience and education entries', () => {
  const all = filterTrajectory(TRAJECTORY_ENTRIES, 'all');
  const exp = filterTrajectory(TRAJECTORY_ENTRIES, 'experience');
  const edu = filterTrajectory(TRAJECTORY_ENTRIES, 'education');
  assert.equal(all.length, exp.length + edu.length);
  assert.equal(exp.length, 4);
  assert.equal(edu.length, 4);
});

test('isSelfAuthor detects Abdelhamid Ezzerg regardless of casing', () => {
  assert.equal(isSelfAuthor('Abdelhamid Ezzerg'), true);
  assert.equal(isSelfAuthor('Thomas Merritt'), false);
});
