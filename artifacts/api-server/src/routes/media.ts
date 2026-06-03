import { Router } from "express";

const router = Router();

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

async function tmdb(path: string, params: Record<string, string | number | undefined> = {}): Promise<any> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", API_KEY!);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`TMDB error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

router.get("/media/:mediaType/:mediaId", async (req, res) => {
  const { mediaType, mediaId } = req.params;
  if (mediaType !== "movie" && mediaType !== "tv") {
    res.status(400).json({ error: "mediaType must be movie or tv" });
    return;
  }
  const id = Number(mediaId);
  if (isNaN(id)) {
    res.status(400).json({ error: "mediaId must be a number" });
    return;
  }

  try {
    const data = await tmdb(`/${mediaType}/${id}`);
    res.json({ ...data, media_type: mediaType });
  } catch (err) {
    req.log.error({ err }, "TMDB media details error");
    res.status(500).json({ error: "Failed to fetch media details" });
  }
});

router.get("/media/:mediaType/:mediaId/similar", async (req, res) => {
  const { mediaType, mediaId } = req.params;
  if (mediaType !== "movie" && mediaType !== "tv") {
    res.status(400).json({ error: "mediaType must be movie or tv" });
    return;
  }
  const id = Number(mediaId);
  if (isNaN(id)) {
    res.status(400).json({ error: "mediaId must be a number" });
    return;
  }

  try {
    const data = await tmdb(`/${mediaType}/${id}/similar`);
    data.results = data.results.map((r: Record<string, unknown>) => ({ ...r, media_type: mediaType }));
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TMDB similar error");
    res.status(500).json({ error: "Failed to fetch similar" });
  }
});

router.get("/media/:mediaType/:mediaId/credits", async (req, res) => {
  const { mediaType, mediaId } = req.params;
  if (mediaType !== "movie" && mediaType !== "tv") {
    res.status(400).json({ error: "mediaType must be movie or tv" });
    return;
  }
  const id = Number(mediaId);
  if (isNaN(id)) {
    res.status(400).json({ error: "mediaId must be a number" });
    return;
  }

  try {
    const data = await tmdb(`/${mediaType}/${id}/credits`);
    res.json({ cast: data.cast || [], crew: data.crew || [] });
  } catch (err) {
    req.log.error({ err }, "TMDB credits error");
    res.status(500).json({ error: "Failed to fetch credits" });
  }
});

router.get("/media/:mediaType/:mediaId/videos", async (req, res) => {
  const { mediaType, mediaId } = req.params;
  if (mediaType !== "movie" && mediaType !== "tv") {
    res.status(400).json({ error: "mediaType must be movie or tv" });
    return;
  }
  const id = Number(mediaId);
  if (isNaN(id)) {
    res.status(400).json({ error: "mediaId must be a number" });
    return;
  }

  try {
    const data = await tmdb(`/${mediaType}/${id}/videos`);
    const filtered = (data.results || []).filter(
      (v: { site: string; type: string }) => v.site === "YouTube"
    );
    res.json({ results: filtered });
  } catch (err) {
    req.log.error({ err }, "TMDB videos error");
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

router.get("/media/tv/:mediaId/seasons/:seasonNumber", async (req, res) => {
  const { mediaId, seasonNumber } = req.params;
  const id = Number(mediaId);
  const season = Number(seasonNumber);
  if (isNaN(id) || isNaN(season)) {
    res.status(400).json({ error: "mediaId and seasonNumber must be numbers" });
    return;
  }

  try {
    const data = await tmdb(`/tv/${id}/season/${season}`);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TMDB season error");
    res.status(500).json({ error: "Failed to fetch season details" });
  }
});

export default router;
