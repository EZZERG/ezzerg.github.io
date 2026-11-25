# Adding a New Publication

Each publication lives in its own self-contained folder inside `src/content/publications/<slug>/`. No TypeScript or React code needs to be edited—every folder is automatically discovered, parsed, sorted, and rendered on the site.

## Folder structure

```text
src/content/publications/2027-my-new-paper/
├── meta.json        # Required: title, year, venue, authors, abstract, links, topics
├── citation.bib     # Optional: raw BibTeX (paste directly from arXiv / Scholar)
└── thumbnail.png    # Optional: figure/diagram (.png, .jpg, .jpeg, .webp, or .svg)
```

## Example `meta.json`

```json
{
  "title": "My Paper Title",
  "year": 2027,
  "venue": "Conference on Neural Information Processing Systems (NeurIPS)",
  "venueShort": "NeurIPS 2027",
  "authors": ["Abdelhamid Ezzerg", "Coauthor Name"],
  "abstract": "Short abstract text...",
  "url": "https://venue-link-if-different-from-arxiv",
  "arxivUrl": "https://arxiv.org/abs/2701.00000",
  "topics": ["Bayesian Inference", "Gaussian Processes"]
}
```

### Automatic defaults
- **`isFirstAuthor`** is inferred automatically from whether the first author contains `"Ezzerg"` (override with `"isFirstAuthor": true/false` if needed).
- **`url`** defaults to `arxivUrl` when omitted (only include `url` when there is a separate conference/journal link).
- **`venueShort`** defaults to `"<venue> <year>"` when omitted.
- **`topics`** are open-ended strings—any new topic automatically appears in the topic filter dropdown.
