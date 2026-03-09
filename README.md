# Milan for Captain Website

## Run locally (development)

1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev

## Run in production (for Cloudflare Tunnel)

1. Build the production site:
   npm run build
2. Serve the production build on port 3000:
   npm run preview -- --host 0.0.0.0 --port 3000

Your existing Cloudflare Tunnel can then route traffic to port 3000.

## Images

Put these files in `public/images/`:
- `pfp.jpg`
- `image1.jpg`
- `image2.jpg`
- `image3.jpg`
