const RENTCAST_BASE_URL = "https://api.rentcast.io/v1";

function normalize(l: Record<string, any>) {
  return {
    id: String(l.id ?? l.listingId ?? l.propertyId ?? crypto.randomUUID()),
    title: l.formattedAddress ?? l.address ?? "Rental Listing",
    address: l.address ?? l.formattedAddress ?? null,
    city: l.city ?? null,
    state: l.state ?? null,
    zip_code: l.zip ?? l.zipCode ?? l.postalCode ?? null,
    rent: l.price ?? l.rent ?? null,
    bedrooms: l.bedrooms ?? l.beds ?? null,
    bathrooms: l.bathrooms ?? l.baths ?? null,
    description: l.description ?? null,
    images: Array.isArray(l.photos)
      ? l.photos
      : Array.isArray(l.images)
      ? l.images
      : [],
    accepts_evictions: false,
    accepts_poor_credit: false,
    accepts_criminal_background: false,
    flexible_criteria: false,
    is_active: true,
    source: "rentcast",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "GET") {
    return Response.json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const API_KEY = Deno.env.get("RENTCAST_API_KEY");
  if (!API_KEY) {
    return Response.json({ ok: false, error: "Missing RENTCAST_API_KEY" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") ?? "New York";
  const state = searchParams.get("state") ?? "NY";
  const zip = searchParams.get("zip");
  const minRent = searchParams.get("minRent");
  const maxRent = searchParams.get("maxRent");
  const bedrooms = searchParams.get("bedrooms");
  const limit = searchParams.get("limit") ?? "50";
  const offset = searchParams.get("offset") ?? "0";

  const url = new URL(`${RENTCAST_BASE_URL}/listings/rental/long-term`);
  if (zip) {
    url.searchParams.set("zipCode", zip);
  } else {
    url.searchParams.set("city", city);
    url.searchParams.set("state", state);
  }
  if (minRent) url.searchParams.set("minPrice", minRent);
  if (maxRent) url.searchParams.set("maxPrice", maxRent);
  if (bedrooms) url.searchParams.set("bedrooms", bedrooms);
  url.searchParams.set("limit", limit);
  url.searchParams.set("offset", offset);

  try {
    const resp = await fetch(url.toString(), {
      headers: { "X-Api-Key": API_KEY, Accept: "application/json" },
    });

    const data = await resp.json();

    if (!resp.ok) {
      return Response.json({ ok: false, error: data?.message ?? "RentCast error" }, { status: resp.status });
    }

    const raw: any[] = Array.isArray(data) ? data : (data.listings ?? data.results ?? []);
    return Response.json({ ok: true, listings: raw.map(normalize) });
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message ?? "Unknown error" }, { status: 500 });
  }
});