# Personal Website - Update Guide

This guide explains how to update the information on the personal website hosted at https://ezzerg.github.io.

## Prerequisites

- Git installed on your machine
- Node.js and npm installed
- A text editor (VS Code, Sublime Text, etc.)
- Basic knowledge of JSON format

## Project Structure

```
ezzerg.github.io/
├── app/                # Next.js app directory
├── components/         # React components
├── public/            # Static assets
│   ├── data/          # JSON data files
│   │   ├── education/ # Education entries
│   │   ├── employment/# Employment history
│   │   └── papers/    # Publications
│   ├── cv/            # CV PDF file
│   ├── employers/     # Company logos
│   ├── institutions/  # University logos
│   └── paper_previews/# Paper preview images
└── README.md          # This file
```

## How to Update Information

### 1. Clone the Repository

```bash
git clone https://github.com/ezzerg/ezzerg.github.io.git
cd ezzerg.github.io
```

### 2. Update Personal Information

Personal information is stored in React components. To update:

#### Header and About Section
- Edit `components/Hero.tsx` for name and title
- Edit `components/AboutMe.tsx` for personal description

### 3. Update Publications

Publications are stored as JSON files in `public/data/papers/`. To add or update a publication:

1. Create a new JSON file (e.g., `paper_9.json`) in `public/data/papers/` with this structure:

```json
{
  "title": "Your Paper Title",
  "year": "2024",
  "venue": "Conference or Journal Name",
  "authors": [
    "First Author",
    "Second Author",
    "Your Name"
  ],
  "abstract": "Full abstract text...",
  "previewImage": "/paper_previews/paper_9.png",
  "url": "https://arxiv.org/abs/YOUR_PAPER_ID",
  "bibtex": "@article{...}",
  "links": {
    "arxiv": "https://arxiv.org/abs/YOUR_PAPER_ID",
    "code": "https://github.com/your-repo" 
  }
}
```

2. Add a preview image to `public/paper_previews/` (optional)

### 4. Update Education

Education entries are stored in `public/data/education/`. To add or update:

1. Create a new JSON file (e.g., `university_name.json`) with this structure:

```json
{
  "institution": "University Name",
  "degree": "Degree Type and Field",
  "years": "2020 - 2024",
  "description": [
    { "text": "Coursework: ", "type": "text", "style": "bold" },
    { "text": "List of relevant courses...", "type": "text" }
  ],
  "logo": "/institutions/university_logo.svg",
  "city": "City Name",
  "country": "Country"
}
```

2. Add institution logos to `public/institutions/` (light and dark versions)

### 5. Update Employment History

Employment entries are stored in `public/data/employment/`. To add or update:

1. Create a new JSON file (e.g., `company_name.json`) with this structure:

```json
{
  "employer": "Company Name",
  "title": "Your Job Title",
  "years": "2020 - Present",
  "description": [
    { "text": "Job description and achievements.", "type": "text" },
    { "type": "linebreak" },
    { "text": "Keywords: ", "type": "text", "style": "bold" },
    { "text": "Technologies, skills, frameworks used...", "type": "text" }
  ],
  "logo": "/employers/company_logo.svg",
  "city": "City",
  "country": "Country"
}
```

2. Add company logos to `public/employers/` (light and dark versions)

### 6. Update CV/Resume

Replace the CV PDF file:
```bash
# Copy your new CV (must be named EZZERG_CV.pdf)
cp /path/to/your/new/cv.pdf public/cv/EZZERG_CV.pdf
```

### 7. Build and Deploy

Since this is a Next.js application, you need to build it before deployment:

```bash
# Install dependencies
npm install

# Build the static site
npm run build

# The built files will be in the 'out' directory
```

### 8. Commit and Push Changes

```bash
# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Update personal information and CV"

# Push to GitHub
git push origin main
```

### 9. Verify Updates

After pushing, GitHub Actions will automatically build and deploy your site. You can monitor the deployment status in the Actions tab of your repository. Visit https://ezzerg.github.io to verify your changes (may take a few minutes).

## Logo Management

When adding logos for employers or institutions:

1. **File Format**: Use SVG format for better scalability
2. **Naming Convention**: 
   - Employers: `company_name_logo_light.svg` and `company_name_logo_dark.svg`
   - Institutions: `university_name_logo_light.svg` and `university_name_logo_dark.svg`
3. **Theme Support**: Always provide both light and dark versions for proper theme switching

## SEO and Metadata Updates

To improve search engine visibility, update the metadata in `app/layout.tsx`:

- Page title
- Meta description
- Open Graph tags
- Twitter card metadata

## Favicon Update

To change the favicon:
1. Create a new favicon.svg file
2. Replace the existing `favicon.svg` in the `public/` directory

## Troubleshooting

- **Changes not appearing**: GitHub Pages can take up to 10 minutes to update. Clear your browser cache if needed.
- **404 Error**: Ensure the repository name matches your GitHub username (username.github.io)
- **Build failures**: Check the Actions tab in your GitHub repository for deployment errors

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [GitHub Actions Status](https://github.com/ezzerg/ezzerg.github.io/actions)

---

*This website was primarily created with assistance from Claude Code (Anthropic's AI assistant)*