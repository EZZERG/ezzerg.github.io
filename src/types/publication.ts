export interface Publication {
  title: string;
  year: string;
  venue: string;
  authors: string[];
  abstract: string;
  previewImage: string;
  url?: string;
  bibtex?: string;  // Changed from BibTexEntry to string
  links: {
    arxiv?: string;
    code?: string;
  };
}
