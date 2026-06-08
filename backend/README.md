# Cloudflare Workers Backend - Football Voting API

Node.js/Hono-based backend for Cloudflare Workers deployment.

## Setup

1. Navigate to this directory:
   ```bash
   cd backend-cloudflare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Cloudflare account and get your credentials

4. Configure KV Namespace:
   ```bash
   wrangler kv:namespace create "VOTES_DB"
   ```

5. Update `wrangler.toml` with your account ID and KV namespace IDs

## Local Development

```bash
npm run dev
```

Backend runs on `http://localhost:8787`

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## API Endpoints

- `GET /api/teams` - List all teams
- `POST /api/vote` - Record a vote
- `GET /api/results` - Get results with percentages
- `GET /api/leaderboard` - Get ranked leaderboard
- `GET /api/stats` - Get statistics
- `GET /health` - Health check

## Environment

The backend uses Cloudflare KV for data storage. No database setup needed!

## Integration

Update `frontend/lib/config.ts` with your Cloudflare Workers URL:

```typescript
export const API_URL = 'https://your-worker.workers.dev';
```
