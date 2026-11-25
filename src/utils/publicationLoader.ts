export interface Publication {
  id: string;
  title: string;
  year: number;
  venue: string;
  venueShort: string;
  authors: string[];
  abstract: string;
  previewImage: string;
  url: string;
  arxivUrl: string;
  bibtex: string;
  topics: string[];
  isFirstAuthor: boolean;
  featured?: boolean;
}

export interface RawPublicationMeta {
  id?: string;
  title: string;
  year: number;
  venue: string;
  venueShort?: string;
  authors: string[];
  abstract: string;
  previewImage?: string;
  url?: string;
  arxivUrl: string;
  bibtex?: string;
  topics: string[];
  isFirstAuthor?: boolean;
  featured?: boolean;
}

/**
 * Extracts the self-contained publication folder slug from a Vite glob or filesystem path.
 * Example: "../content/publications/2026-robust-bo/meta.json" -> "2026-robust-bo"
 */
export function extractPublicationSlug(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const segments = normalized.split('/').filter(Boolean);
  if (segments.length < 2) {
    throw new Error(`Invalid publication asset path: "${filePath}"`);
  }
  return segments[segments.length - 2];
}

function inferFirstAuthor(authors: string[]): boolean {
  const first = authors[0];
  return typeof first === 'string' && first.toLowerCase().includes('ezzerg');
}

/**
 * Pure parser that combines self-contained publication folders (meta.json, optional .bib,
 * and optional thumbnail image) into a validated, chronologically sorted Publication list.
 */
export function buildPublicationsFromRecords(
  metaByPath: Record<string, RawPublicationMeta>,
  bibByPath: Record<string, string>,
  thumbByPath: Record<string, string>,
): Publication[] {
  const bibBySlug = new Map<string, string>();
  for (const [filePath, rawBib] of Object.entries(bibByPath)) {
    const slug = extractPublicationSlug(filePath);
    bibBySlug.set(slug, rawBib.trim());
  }

  const thumbBySlug = new Map<string, string>();
  for (const [filePath, thumbUrl] of Object.entries(thumbByPath)) {
    const slug = extractPublicationSlug(filePath);
    if (!thumbBySlug.has(slug)) {
      thumbBySlug.set(slug, thumbUrl);
    }
  }

  const publications: Publication[] = [];

  for (const [filePath, meta] of Object.entries(metaByPath)) {
    const slug = extractPublicationSlug(filePath);
    if (!meta || typeof meta.title !== 'string' || typeof meta.year !== 'number') {
      throw new Error(`Invalid publication metadata in "${filePath}"`);
    }

    const authors = Array.isArray(meta.authors) ? meta.authors : [];
    const arxivUrl = meta.arxivUrl ?? '';
    const url = meta.url ?? arxivUrl;
    const venueShort = meta.venueShort ?? `${meta.venue} ${meta.year}`;
    const bibtex = (bibBySlug.get(slug) ?? meta.bibtex ?? '').trim();
    const previewImage = thumbBySlug.get(slug) ?? meta.previewImage ?? '';
    const isFirstAuthor =
      typeof meta.isFirstAuthor === 'boolean' ? meta.isFirstAuthor : inferFirstAuthor(authors);

    publications.push({
      id: meta.id ?? slug,
      title: meta.title,
      year: meta.year,
      venue: meta.venue,
      venueShort,
      authors,
      abstract: meta.abstract,
      previewImage,
      url,
      arxivUrl,
      bibtex,
      topics: Array.isArray(meta.topics) ? meta.topics : [],
      isFirstAuthor,
      featured: meta.featured,
    });
  }

  return publications.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (a.isFirstAuthor !== b.isFirstAuthor) return a.isFirstAuthor ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}
