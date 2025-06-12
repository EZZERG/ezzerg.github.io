export interface TextContent {
  text: string
  style?: 'bold'
  type?: 'text' | 'linebreak'
  link?: string
}

export interface Education {
  institution: string
  degree: string
  years: string
  description: TextContent[]
  logo: string
  city: string
  country: string
}

export interface Employment {
  employer: string
  title: string
  years: string
  description: TextContent[]
  logo: string
  city: string
  country: string
}

export interface Paper {
  title: string
  year: string
  venue: string
  authors: string[]
  abstract: string
  previewImage: string
  url: string
  pdfUrl?: string
  bibtex: string
  links: {
    arxiv: string | null
    code: string | null
  }
}