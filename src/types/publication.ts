export interface BibTexEntry {
  type: string;
  key: string;
  fields: Record<string, string>;
}

export interface Publication {
  title: string;
  year: string;
  venue: string;
  authors: string[];
  abstract: string;
  previewImage: string;
  url: string | null;
  bibtex: string;
  links: {
    arxiv: string | null;
    code: string | null;
  };
}
