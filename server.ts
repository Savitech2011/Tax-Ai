import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  });

  app.post("/api/nim", async (req, res) => {
    const { model, messages } = req.body;
    try {
      const apiKey = process.env.NVIDIA_NIM_API_KEY;
      if (!apiKey) throw new Error("NVIDIA_NIM_API_KEY is not defined");
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: false,
          max_tokens: 16000,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`NVIDIA NIM API error (${response.status} ${response.statusText}): ${errorText || '(empty response body)'}`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        const rawText = await response.text();
        console.error(`[/api/nim] Unexpected content-type "${contentType}". Raw response body: ${rawText}`);
        throw new Error(`NVIDIA NIM API returned non-JSON response (content-type: "${contentType}")`);
      }

      const rawText = await response.text();
      if (!rawText || rawText.trim() === '') {
        console.error('[/api/nim] NVIDIA NIM API returned an empty response body');
        throw new Error('NVIDIA NIM API returned an empty response body');
      }

      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch (parseError: any) {
        console.error(`[/api/nim] Failed to parse JSON response. Raw body: ${rawText}`);
        throw new Error(`Failed to parse NVIDIA NIM API response as JSON: ${parseError.message}`);
      }

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
