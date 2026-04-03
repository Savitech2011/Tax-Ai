import "dotenv/config";
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

  // Endpoint to confirm the NIM key is configured (does not expose the key itself)
  app.get("/api/nim-key", (req, res) => {
    const configured = !!process.env.NVIDIA_NIM_API_KEY;
    if (!configured) {
      console.error("[/api/nim-key] NVIDIA_NIM_API_KEY is not set in the environment");
      return res.status(503).json({ configured: false, error: "NVIDIA_NIM_API_KEY is not configured on the server" });
    }
    res.json({ configured: true });
  });

  app.post("/api/nim", async (req, res) => {
    const { model, messages } = req.body;
    console.log(`[/api/nim] Endpoint called — model: ${model}, message count: ${Array.isArray(messages) ? messages.length : 'N/A'}`);
    try {
      const apiKey = process.env.NVIDIA_NIM_API_KEY;
      console.log(`[/api/nim] API key status: ${apiKey ? 'defined (length ' + apiKey.length + ')' : 'NOT defined'}`);
      if (!apiKey) {
        console.error("[/api/nim] NVIDIA_NIM_API_KEY is not set in the environment. Ensure it is defined in your .env file or deployment secrets.");
        throw new Error("NVIDIA_NIM_API_KEY is not configured on the server");
      }
      console.log(`[/api/nim] Sending request to NVIDIA NIM API for model: ${model}`);
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

      const contentType = response.headers.get('content-type') ?? '';
      console.log(`[/api/nim] NVIDIA API response — status: ${response.status} ${response.statusText}, content-type: "${contentType}"`);
      console.log(`[/api/nim] NVIDIA API response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

      const rawText = await response.text();
      console.log(`[/api/nim] NVIDIA API raw response body: ${rawText}`);

      if (!response.ok) {
        throw new Error(`NVIDIA NIM API error (${response.status} ${response.statusText}): ${rawText || '(empty response body)'}`);
      }

      if (!contentType.includes('application/json')) {
        console.error(`[/api/nim] Unexpected content-type "${contentType}". Raw response body: ${rawText}`);
        throw new Error(`NVIDIA NIM API returned non-JSON response (content-type: "${contentType}")`);
      }

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

      console.log(`[/api/nim] Sending successful response back to client — choices: ${data?.choices?.length ?? 'N/A'}`);
      res.json(data);
    } catch (error: any) {
      console.error(`[/api/nim] Error: ${error.message}`);
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
