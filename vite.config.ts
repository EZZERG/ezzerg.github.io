import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {
  buildPublicationsFromRecords,
  type RawPublicationMeta,
} from './src/utils/publicationLoader';
import {
  buildSitemapXml,
  buildStaticSeoHtml,
  buildStructuredData,
  serializeJsonLd,
} from './src/utils/seoPrerender';

function loadPublicationsFromDisk(rootDir: string) {
  const pubRoot = path.resolve(rootDir, 'src/content/publications');
  if (!fs.existsSync(pubRoot)) {
    return [];
  }
  const slugs = fs
    .readdirSync(pubRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const metaRecords: Record<string, RawPublicationMeta> = {};
  const bibRecords: Record<string, string> = {};
  const thumbRecords: Record<string, string> = {};

  for (const slug of slugs) {
    const dir = path.join(pubRoot, slug);
    const metaPath = path.join(dir, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    metaRecords[`../content/publications/${slug}/meta.json`] = JSON.parse(
      fs.readFileSync(metaPath, 'utf8'),
    ) as RawPublicationMeta;

    const files = fs.readdirSync(dir);
    const bibFile = files.find((file) => file.endsWith('.bib'));
    if (bibFile) {
      bibRecords[`../content/publications/${slug}/${bibFile}`] = fs.readFileSync(
        path.join(dir, bibFile),
        'utf8',
      );
    }
    const thumbFile = files.find((file) => /^thumbnail\.(png|jpe?g|webp|svg)$/i.test(file));
    if (thumbFile) {
      thumbRecords[`../content/publications/${slug}/${thumbFile}`] = '';
    }
  }

  return buildPublicationsFromRecords(metaRecords, bibRecords, thumbRecords);
}

function seoPrerenderPlugin(): Plugin {
  return {
    name: 'seo-prerender-and-jsonld',
    transformIndexHtml(html, ctx) {
      const publications = loadPublicationsFromDisk(__dirname);
      const jsonLdScript = `<script type="application/ld+json">${serializeJsonLd(
        buildStructuredData(publications),
      )}</script>`;

      let out = html.replace('<!-- SEO_JSON_LD -->', jsonLdScript);
      if (ctx.bundle) {
        out = out.replace('<!-- SEO_PRERENDER -->', buildStaticSeoHtml(publications));
      } else {
        out = out.replace('<!-- SEO_PRERENDER -->', '');
      }
      return out;
    },
    closeBundle(error?: Error): void {
      if (error) return;
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;
      const today = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), buildSitemapXml(today), 'utf8');
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      seoPrerenderPlugin(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'motion/react', 'lucide-react'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
