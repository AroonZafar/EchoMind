import dotenv from "dotenv";
import http from "node:http";

dotenv.config();

const PORT = 3001;

const ALLOWED_ORIGINS = new Set([
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

const server = http.createServer(async (req, res) => {
  // Allow browser requests from either localhost or 127.0.0.1 during local development
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/api/voice-token") {
    try {
      const apiKey = process.env.ASSEMBLYAI_API_KEY;

      if (!apiKey) {
        throw new Error("ASSEMBLYAI_API_KEY is missing from .env");
      }

      const response = await fetch(
        "https://agents.assemblyai.com/v1/token?expires_in_seconds=600",
        {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `AssemblyAI token request failed: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify(data));
      return;
    } catch (error) {
      console.error("Token error:", error.message);

      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          error: "Could not create AssemblyAI token",
          message: error.message,
        })
      );

      return;
    }
  }

  res.writeHead(404, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Voice token server running at http://localhost:${PORT}`);
});