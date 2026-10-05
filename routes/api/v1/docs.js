// routes/api/v1/docs.js
// GET /api/v1/docs — plain HTML page showing how to call the endpoints.
// No auth required so devs can view it without a key first.

import express from "express";

const router = express.Router();

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Kenya-Ultra API Docs</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; line-height: 1.5; color: #222; }
    h1 { font-size: 1.6rem; }
    h2 { font-size: 1.2rem; margin-top: 2rem; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    code, pre { background: #f4f4f4; border-radius: 4px; }
    code { padding: 2px 6px; }
    pre { padding: 12px; overflow-x: auto; }
    .method { display: inline-block; background: #111; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; }
  </style>
</head>
<body>
  <h1>Kenya-Ultra API — v1</h1>
  <p>Base URL: <code>https://YOUR-CORE-URL.run.app/api/v1</code></p>
  <p>All endpoints require an <code>x-api-key</code> header. Ask for a key if you don't have one yet.</p>

  <h2><span class="method">POST</span>/ytmp3</h2>
  <p>Downloads a YouTube video's audio as mp3.</p>
  <pre>curl -X POST https://YOUR-CORE-URL.run.app/api/v1/ytmp3 \\
  -H "x-api-key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://youtube.com/watch?v=XXXXXXX"}' \\
  --output audio.mp3</pre>
  <p>Response: the mp3 file, streamed directly.</p>

  <h2><span class="method">POST</span>/ytmp4</h2>
  <p>Downloads a YouTube video as mp4.</p>
  <pre>curl -X POST https://YOUR-CORE-URL.run.app/api/v1/ytmp4 \\
  -H "x-api-key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://youtube.com/watch?v=XXXXXXX"}' \\
  --output video.mp4</pre>
  <p>Response: the mp4 file, streamed directly.</p>

  <h2>Errors</h2>
  <pre>{ "status": "error", "message": "..." }</pre>
  <p><code>401</code> missing key · <code>403</code> invalid key · <code>400</code> missing url · <code>500</code> conversion failed</p>

  <h2>Notes</h2>
  <ul>
    <li>Requests time out after ~55s — very long videos may fail. Ask if you need longer clips supported.</li>
    <li>Only YouTube URLs (youtube.com / youtu.be) are accepted.</li>
  </ul>
</body>
</html>`;

router.get("/docs", (req, res) => {
    res.type("html").send(HTML);
});

export default router;
