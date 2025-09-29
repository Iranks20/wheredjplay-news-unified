import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script would typically fetch data from your API
// For now, we'll create a basic sitemap structure

const baseUrl = 'https://wheredjsplay.com';
const currentDate = new Date().toISOString();

const staticPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/category/artist-news', priority: '0.9', changefreq: 'daily' },
  { url: '/category/event-reports', priority: '0.9', changefreq: 'daily' },
  { url: '/category/gear-tech', priority: '0.8', changefreq: 'weekly' },
  { url: '/category/trending-tracks', priority: '0.9', changefreq: 'daily' },
  { url: '/category/industry-news', priority: '0.8', changefreq: 'weekly' },
];

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Note: In a real implementation, you would fetch articles from your API
  // and add them to the sitemap like this:
  /*
  articles.forEach(article => {
    sitemap += `
  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${article.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });
  */

  sitemap += `
</urlset>`;

  // Write to public directory
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

// Run the generator
generateSitemap();
