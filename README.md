# WhereDJsPlay Unified Frontend

A React-based news website and admin panel for electronic music news.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment on Netlify

### Environment Variables

Set these environment variables in your Netlify dashboard:

- `VITE_API_URL`: Your API server URL (e.g., `http://localhost:3001`)
- `VITE_APP_NAME`: Application name (default: `WhereDJsPlay`)
- `VITE_APP_VERSION`: Application version (default: `1.0.0`)

### Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

### Troubleshooting

If the build fails:

1. Check that all environment variables are set correctly
2. Ensure the API server is accessible from Netlify
3. Check the build logs for specific error messages

## API Server

The frontend connects to the WhereDJsPlay API server running on AWS EC2:
- **API URL**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`
- **API Base**: `http://localhost:3001/api/v1`

## Features

- **Public News Website**: Browse articles, categories, and search
- **Admin Panel**: Manage articles, categories, users, and settings
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Image Upload**: Upload and manage article images
- **SEO Optimized**: Meta tags and structured data

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Radix UI Components
- Lucide React Icons
