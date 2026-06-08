# FIFA World Cup 2026 Prediction Voting Website

This project includes a **Next.js frontend** and backend options for a World Cup 2026 prediction voting experience.

## Structure

- `frontend/` — Next.js App Router website with Tailwind CSS, Recharts, and Axios.
- `backend/` — FastAPI server (Python) with SQLite database.
- `backend-cloudflare/` — Hono/Node.js backend for Cloudflare Workers deployment.

---

## 🚀 DEPLOYMENT OPTION 1: Full Cloudflare (Recommended)

### Backend (Cloudflare Workers)

1. Navigate to `backend-cloudflare/`
2. Install dependencies: `npm install`
3. Install Wrangler: `npm install -g wrangler`
4. Create KV namespace: `wrangler kv:namespace create "VOTES_DB"`
5. Update `wrangler.toml` with your Cloudflare Account ID
6. Deploy: `npm run deploy`

### Frontend (Cloudflare Pages)

1. Navigate to `frontend/`
2. Set environment: `NEXT_PUBLIC_API_URL=https://your-worker.workers.dev`
3. Build: `npm run build`
4. Deploy to Cloudflare Pages

---

## 🔧 DEPLOYMENT OPTION 2: Hybrid (Cloudflare Pages + Railway/Render)

### Backend (Railway/Render)

1. Navigate to `backend/`
2. Create virtual environment: `python -m venv .venv`
3. Activate: `.\.venv\Scripts\Activate`
4. Install: `pip install -r requirements.txt`
5. Initialize: `python init_db.py`
6. Deploy to Railway or Render

### Frontend (Cloudflare Pages)

1. Set `NEXT_PUBLIC_API_URL` to your Railway/Render URL
2. Deploy to Cloudflare Pages

---

## 💻 Local Development

### Backend (Python)

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
python init_db.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Backend (Cloudflare/Node.js)

```bash
cd backend-cloudflare
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📝 Notes

- Team list is shared across both backends (see `backend/database.py` and `backend-cloudflare/src/database.ts`)
- Vote protection uses browser `localStorage`
- Charts refresh every 10 seconds
- Cloudflare deployment uses KV for data storage (no external database needed)
