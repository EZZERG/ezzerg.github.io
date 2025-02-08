export interface Paper {
  title: string;
  year: string;
  authors: string[];
  venue: string;
  abstract: string;
  links: {
    arxiv: string | null;
    code: string | null;
    pdf: string | null;
  };
  previewImage: string;
}
