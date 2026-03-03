import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
const result = dotenv.config({ path: envPath });

console.log("CWD:", process.cwd());
console.log("ENV PATH:", envPath);
console.log("dotenv error:", result.error ? result.error.message : "none");
console.log("KEY at boot:", Boolean(process.env.RENTCAST_API_KEY));

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

app.get("/server/rentals", async (req, res) => {
  try {
    const API_KEY = process.env.RENTCAST_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: "Missing RENTCAST_API_KEY" });

    const { city = "New York", state = "NY" } = req.query;

    const url =
      `https://api.rentcast.io/v1/listings/rental/long-term?city=${encodeURIComponent(city)}` +
      `&state=${encodeURIComponent(state)}`;

    const response = await fetch(url, {
      headers: { "X-Api-Key": API_KEY, Accept: "application/json" },
    });

    const raw = await response.json();
    if (!response.ok) return res.status(response.status).json(raw);

    const listings = Array.isArray(raw) ? raw : raw?.listings ?? [];

    const mapType = (t, bedrooms) => {
      const x = String(t || "").toLowerCase();
      if (bedrooms === 0) return "studio";
      if (x.includes("condo")) return "condo";
      if (x.includes("town")) return "townhouse";
      if (x.includes("duplex")) return "duplex";
      if (x.includes("house")) return "house";
      return "apartment";
    };

    const normalized = listings.map((l) => {
      const bedrooms = typeof l.bedrooms === "number" ? l.bedrooms : 0;

      return {
        id: l.id,

        title: `${bedrooms === 0 ? "Studio" : `${bedrooms} BR`} in ${l.city}`,
        description: l.formattedAddress || "Rental listing",

        address:
          l.formattedAddress ||
          `${l.addressLine1 || ""}${l.addressLine2 ? ", " + l.addressLine2 : ""}`.trim(),

        city: l.city,
        state: l.state,
        zip_code: l.zipCode || "",

        bedrooms,
        bathrooms: typeof l.bathrooms === "number" ? l.bathrooms : 1,
        square_feet: typeof l.squareFootage === "number" ? l.squareFootage : null,

        rent: typeof l.price === "number" ? l.price : null,
        security_deposit: null,

        // required by your schema
        broker_id: "external",

        property_type: mapType(l.propertyType, bedrooms),

        amenities: [],
        images: [],

        accepts_evictions: false,
        accepts_poor_credit: false,
        accepts_criminal_background: false,
        flexible_criteria: false,

        minimum_income_multiplier: 3.0,

        available_date: l.listedDate ? String(l.listedDate).slice(0, 10) : null,

        is_active: l.status === "Active",
      };
    });

    return res.json({ results: normalized });
  } catch (err) {
    console.error("Rental route error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

app.listen(8787, "0.0.0.0", () => {
  console.log("Backend running on http://0.0.0.0:8787");
});