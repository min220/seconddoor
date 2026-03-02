import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.RENTCAST_API_KEY;
const BASE_URL = "https://api.rentcast.io/v1";

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/rentals", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "Missing RENTCAST_API_KEY" });
    }

    const { city = "New York", state = "NY" } = req.query;

    const url = `${BASE_URL}/listings/rental/long-term?city=${city}&state=${state}`;

    const response = await fetch(url, {
      headers: {
        "X-Api-Key": API_KEY,
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8787, () => {
  console.log("Backend running on http://localhost:8787");
});