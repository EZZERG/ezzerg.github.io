export interface SupervisorLink {
  name: string;
  url: string;
}

export interface ResearchInterest {
  title: string;
  detail: string;
}

export type CityKey = 'London' | 'Cambridge' | 'Paris';

export interface CityCoord {
  name: CityKey;
  country: string;
  latLabel: string;
  lonLabel: string;
  /** Normalized position [0..1] on the minimalist Western Europe coordinate projection */
  mapX: number;
  mapY: number;
}

export interface ChapterTheme {
  /** Base RGB background color for full-viewport atmospheric cross-dissolve */
  bgRgb: [number, number, number];
  /** Primary typographic & cartographic accent hex */
  accent: string;
  /** Whether this chapter uses dark-mode light ink or flips to sunlit light paper */
  isDark: boolean;
  /** Short geographic chapter subtitle */
  placeTag: string;
}

export interface TrajectoryEntry {
  id: string;
  kind: 'education' | 'experience';
  role: string;
  organization: string;
  monogram: string;
  years: string;
  displayYear: number;
  startYear: number;
  city: CityKey;
  country: string;
  summary: string;
  highlights: string[];
  supervisors?: SupervisorLink[];
  logo: {
    src: string;
    width: number;
    height: number;
  };
  theme: ChapterTheme;
}

export type { Publication } from '../utils/publicationLoader';

export const CITIES: Record<CityKey, CityCoord> = {
  Cambridge: {
    name: 'Cambridge',
    country: 'United Kingdom',
    latLabel: '52.20°N',
    lonLabel: '0.12°E',
    mapX: 0.42,
    mapY: 0.23,
  },
  London: {
    name: 'London',
    country: 'United Kingdom',
    latLabel: '51.52°N',
    lonLabel: '0.13°W',
    mapX: 0.39,
    mapY: 0.36,
  },
  Paris: {
    name: 'Paris',
    country: 'France',
    latLabel: '48.86°N',
    lonLabel: '2.35°E',
    mapX: 0.67,
    mapY: 0.76,
  },
};

export const PROFILE = {
  name: 'Abdelhamid Ezzerg',
  role: 'PhD Student in Statistics & Machine Learning',
  formerRole: 'Former Applied Scientist at Amazon',
  tagline:
    'Researching generalized Bayesian inference at University College London. Six years prior building generative speech models and language systems in industry.',
  location: 'London, United Kingdom',
  email: 'ezzergabdelhamid@gmail.com',
  cvUrl: '/cv/EZZERG_CV.pdf',
  profilePhoto: '/src/assets/images/profile_photo.jpeg',
  supervisors: [
    { name: 'Prof. Jeremias Knoblauch', url: 'https://jeremiasknoblauch.github.io/' },
    { name: 'Prof. Ilija Bogunovic', url: 'https://www.ilijabogunovic.com/' },
  ],
  socials: [
    { label: 'Email', href: 'mailto:ezzergabdelhamid@gmail.com', value: 'ezzergabdelhamid@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/EZZERG', value: 'github.com/EZZERG' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/abdelhamid-ezzerg-274437a6/',
      value: 'linkedin.com/in/abdelhamid-ezzerg',
    },
    {
      label: 'Google Scholar',
      href: 'https://scholar.google.com/citations?user=Sltvi4AAAAAJ&hl=en',
      value: 'Scholar Profile',
    },
  ],
} as const;

export const RESEARCH_INTERESTS: {
  current: ResearchInterest[];
  previous: ResearchInterest[];
} = {
  current: [
    {
      title: 'Statistics',
      detail: 'Generalizations of classical Bayesian inference for modern statistical learning.',
    },
    {
      title: 'Machine Learning',
      detail: 'Probabilistic modeling and robust Bayesian optimization.',
    },
  ],
  previous: [
    {
      title: 'Machine Learning',
      detail: 'Generative modeling.',
    },
    {
      title: 'Speech Synthesis',
      detail: 'Expressive neural Text-to-Speech and voice conversion.',
    },
    {
      title: 'Software Engineering',
      detail: 'ML pipelines and NLP extraction systems.',
    },
  ],
};

export const TRAJECTORY_ENTRIES: TrajectoryEntry[] = [
  {
    id: 'ucl-phd',
    kind: 'education',
    role: 'PhD in Statistics & Machine Learning',
    organization: 'University College London (UCL)',
    monogram: 'UCL',
    years: '2024 – Present',
    displayYear: 2024,
    startYear: 2024,
    city: 'London',
    country: 'United Kingdom',
    summary:
      'Researching modern Bayesian methods under Prof. Jeremias Knoblauch and Prof. Ilija Bogunovic—exploring generalizations of classical Bayesian inference suited to modern statistical and machine learning problems.',
    highlights: ['Bayesian Methods', 'Statistical Machine Learning', 'Uncertainty Quantification'],
    supervisors: [
      { name: 'Prof. Jeremias Knoblauch', url: 'https://jeremiasknoblauch.github.io/' },
      { name: 'Prof. Ilija Bogunovic', url: 'https://www.ilijabogunovic.com/' },
    ],
    logo: { src: '/src/assets/logos/ucl.svg', width: 248, height: 78 },
    theme: {
      bgRgb: [8, 13, 26],
      accent: '#3B82F6',
      isDark: true,
      placeTag: 'Bloomsbury · London',
    },
  },
  {
    id: 'fimatix',
    kind: 'experience',
    role: 'Data Scientist',
    organization: 'Fimatix',
    monogram: 'FMX',
    years: '2024',
    displayYear: 2024,
    startYear: 2024,
    city: 'London',
    country: 'United Kingdom',
    summary:
      'Used NLP methods to extract structured information from complex unstructured enterprise data.',
    highlights: ['Deep Neural Networks', 'Natural Language Processing', 'Question Answering'],
    logo: { src: '/src/assets/logos/fimatix.svg', width: 280, height: 62 },
    theme: {
      bgRgb: [18, 19, 23],
      accent: '#F59E0B',
      isDark: true,
      placeTag: 'City of London · UK',
    },
  },
  {
    id: 'amazon',
    kind: 'experience',
    role: 'Applied Scientist — Alexa Text-to-Speech',
    organization: 'Amazon',
    monogram: 'AMZ',
    years: '2018 – 2023',
    displayYear: 2018,
    startYear: 2018,
    city: 'Cambridge',
    country: 'United Kingdom',
    summary:
      'Built deep generative models behind Amazon Alexa Text-to-Speech across five years, publishing eight peer-reviewed papers on normalizing flows, expressive speech synthesis, accent conversion, and diffusion prosody.',
    highlights: [
      'Speech Synthesis',
      'Normalizing Flows',
      'Sequence-to-Sequence',
      'VAEs & GANs',
    ],
    logo: { src: '/src/assets/logos/amazon.svg', width: 245, height: 74 },
    theme: {
      bgRgb: [6, 24, 29],
      accent: '#2DD4BF',
      isDark: true,
      placeTag: 'Cambridge Science Corridor · UK',
    },
  },
  {
    id: 'axa',
    kind: 'experience',
    role: 'Intern Data Scientist',
    organization: 'AXA Data Innovation Lab (DIL)',
    monogram: 'AXA',
    years: '2017',
    displayYear: 2017,
    startYear: 2017,
    city: 'Paris',
    country: 'France',
    summary:
      'Implemented a graph-based model leveraging PageRank to detect coordinated insurance policy fraud networks.',
    highlights: ['Graph-Based Models', 'PageRank', 'Fraud Detection', 'NetworkX', 'Neo4j'],
    logo: { src: '/src/assets/logos/axa.svg', width: 112, height: 112 },
    theme: {
      bgRgb: [25, 14, 22],
      accent: '#FB7185',
      isDark: true,
      placeTag: 'Paris · Île-de-France',
    },
  },
  {
    id: 'ens-mva',
    kind: 'education',
    role: 'Research M.Sc. in Applied Mathematics & Machine Learning (MVA)',
    organization: 'ENS Paris-Saclay',
    monogram: 'MVA',
    years: '2016 – 2017',
    displayYear: 2016,
    startYear: 2016,
    city: 'Paris',
    country: 'France',
    summary:
      'Intensive mathematical machine learning research degree spanning deep learning, sparsity, compressed sensing, statistical learning, and reinforcement learning.',
    highlights: ['Deep Learning', 'Compressed Sensing', 'Statistical Learning', 'Reinforcement Learning'],
    logo: { src: '/src/assets/logos/ens-paris-saclay.png', width: 315, height: 72 },
    theme: {
      bgRgb: [244, 239, 230],
      accent: '#C2410C',
      isDark: false,
      placeTag: 'Cachan / Saclay · Paris',
    },
  },
  {
    id: 'ibm',
    kind: 'experience',
    role: 'Part-Time Data Scientist',
    organization: 'IBM',
    monogram: 'IBM',
    years: '2016 – 2017',
    displayYear: 2016,
    startYear: 2016,
    city: 'Paris',
    country: 'France',
    summary:
      'Worked in a two-student team to construct a credit-card fraud detection model that significantly outperformed the existing rule-based baseline.',
    highlights: ['Anomaly Detection', 'Credit Card Fraud', 'Random Forest', 'Gradient Boosting', 'XGBoost'],
    logo: { src: '/src/assets/logos/ibm.svg', width: 204, height: 76 },
    theme: {
      bgRgb: [9, 21, 43],
      accent: '#38BDF8',
      isDark: true,
      placeTag: 'Bois-Colombes · Paris',
    },
  },
  {
    id: 'cambridge',
    kind: 'education',
    role: 'Erasmus Exchange — Department of Engineering',
    organization: 'University of Cambridge',
    monogram: 'CAM',
    years: '2015 – 2016',
    displayYear: 2015,
    startYear: 2015,
    city: 'Cambridge',
    country: 'United Kingdom',
    summary:
      'Exchange year in the Department of Engineering covering software engineering, computer systems, signals & systems, and thermodynamics.',
    highlights: ['Software Engineering', 'Computer & Network Systems', 'Signals & Systems', 'Thermodynamics'],
    logo: { src: '/src/assets/logos/cambridge.svg', width: 310, height: 65 },
    theme: {
      bgRgb: [9, 26, 20],
      accent: '#EAB308',
      isDark: true,
      placeTag: 'Trumpington St · Cambridge',
    },
  },
  {
    id: 'centrale',
    kind: 'education',
    role: 'M.Sc. in Applied Mathematics',
    organization: 'École Centrale Paris (CentraleSupélec)',
    monogram: 'ECP',
    years: '2014 – 2017',
    displayYear: 2014,
    startYear: 2014,
    city: 'Paris',
    country: 'France',
    summary:
      'Rigorous applied mathematics engineering curriculum spanning probability, statistics, numerical methods, PDEs, functional analysis, and programming.',
    highlights: ['Probability & Statistics', 'Numerical Methods', 'PDEs', 'Functional Analysis'],
    logo: { src: '/src/assets/logos/centrale.svg', width: 205, height: 106 },
    theme: {
      bgRgb: [237, 233, 224],
      accent: '#1D4ED8',
      isDark: false,
      placeTag: 'Châtenay-Malabry · Paris',
    },
  },
];
