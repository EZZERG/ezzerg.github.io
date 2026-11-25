import type { Publication, TrajectoryEntry } from '../data/portfolioData';

export type YearFilter = 'all' | number;
export type TopicFilter = 'all' | Publication['topics'][number];
export type TrajectoryFilter = 'all' | 'experience' | 'education';

export function getAvailableYears(publications: Publication[]): number[] {
  const unique = Array.from(new Set(publications.map((p) => p.year)));
  return unique.sort((a, b) => b - a);
}

export function getAvailableTopics(publications: Publication[]): Array<Publication['topics'][number]> {
  const set = new Set<Publication['topics'][number]>();
  for (const pub of publications) {
    for (const topic of pub.topics) {
      set.add(topic);
    }
  }
  return Array.from(set);
}

export function filterPublications(
  publications: Publication[],
  options: {
    year?: YearFilter;
    topic?: TopicFilter;
    firstAuthorOnly?: boolean;
    query?: string;
  },
): Publication[] {
  const { year = 'all', topic = 'all', firstAuthorOnly = false, query = '' } = options;
  const normalizedQuery = query.trim().toLowerCase();

  return publications
    .filter((pub) => {
      if (year !== 'all' && pub.year !== year) return false;
      if (topic !== 'all' && !pub.topics.includes(topic)) return false;
      if (firstAuthorOnly && !pub.isFirstAuthor) return false;
      if (normalizedQuery.length > 0) {
        const haystack = [pub.title, pub.venue, pub.venueShort, pub.abstract, ...pub.authors, ...pub.topics]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      if (a.isFirstAuthor !== b.isFirstAuthor) return a.isFirstAuthor ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
}

export function filterTrajectory(entries: TrajectoryEntry[], kind: TrajectoryFilter): TrajectoryEntry[] {
  if (kind === 'all') return entries;
  return entries.filter((entry) => entry.kind === kind);
}

export function isSelfAuthor(authorName: string): boolean {
  return authorName.toLowerCase().includes('ezzerg');
}

export function countByYear(publications: Publication[]): Record<number, number> {
  const counts: Record<number, number> = {};
  for (const pub of publications) {
    counts[pub.year] = (counts[pub.year] ?? 0) + 1;
  }
  return counts;
}
