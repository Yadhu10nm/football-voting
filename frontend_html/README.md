# frontend_1

A simple static HTML/CSS/JS frontend for the existing Football Voting backend.

## Usage

1. Start the backend at `http://127.0.0.1:8000`.
2. Serve `frontend_1` with a local static server, then open `index.html` in your browser. Loading the page directly with `file://` may prevent `.env` from being read.
3. The backend URL is loaded from `frontend_1/.env` using `API_BASE=http://127.0.0.1:8000`.
4. If you need to override the backend URL in the browser, use:
   - `index.html?api=http://127.0.0.1:8000`
   - `index.html?api=http://localhost:8000`

## API requirements

This frontend uses the same backend endpoints as the original app:

- `GET /api/teams`
- `POST /api/vote`
- `GET /api/results`
- `GET /api/leaderboard`
- `GET /api/stats`

## Notes

- No backend logic is changed.
- For local file usage, the frontend defaults to `http://localhost:8787` as the API host.
- If you serve this folder with a static server, it will use the current origin by default.
