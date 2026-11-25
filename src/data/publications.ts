import {
  buildPublicationsFromRecords,
  type Publication,
  type RawPublicationMeta,
} from '../utils/publicationLoader';

const metaModules = import.meta.glob<RawPublicationMeta>(
  '../content/publications/*/meta.json',
  { eager: true, import: 'default' },
);

const bibModules = import.meta.glob<string>(
  '../content/publications/*/*.bib',
  { eager: true, query: '?raw', import: 'default' },
);

const thumbModules = import.meta.glob<string>(
  '../content/publications/*/thumbnail.{png,jpg,jpeg,webp,svg}',
  { eager: true, query: '?url', import: 'default' },
);

export type { Publication };

export const PUBLICATIONS: Publication[] = buildPublicationsFromRecords(
  metaModules,
  bibModules,
  thumbModules,
);
