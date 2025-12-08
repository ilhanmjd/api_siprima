PERBAIKI ANALYZE (hasil terbaru):

- StrictMode dev double-run: `src/index.jsx`.
- Banyak `api_call` di `src/api.js` (endpoint dasar) dan pemanggilnya; pertimbangkan pagination/cache bila perlu.
- Duplicate fetch: literal `/api/assets`, `/api/dinas`, dan getAssets dipanggil di 4 file → sebaiknya cache di context/React Query.