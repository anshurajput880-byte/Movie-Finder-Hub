import { Router } from "express";
import { SearchMoviesQueryParams, GetTrendingQueryParams, GetPopularQueryParams, GetPopularTvQueryParams, GetTopRatedQueryParams, GetNowPlayingQueryParams } from "@workspace/api-zod";

const router = Router();

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

async function tmdb(path: string, params: Record<string, string | number | undefined> = {}) {
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

router.get("/movies/search", async (req, res) => {
  const parsed = SearchMoviesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { query, page = 1, mediaType = "all" } = parsed.data;

  try {
    if (mediaType === "movie") {
      const data = await tmdb("/search/movie", { query, page });
      data.results = data.results.map((r: Record<string, unknown>) => ({ ...r, media_type: "movie" }));
      res.json(data);
    } else if (mediaType === "tv") {
      const data = await tmdb("/search/tv", { query, page });
      data.results = data.results.map((r: Record<string, unknown>) => ({ ...r, media_type: "tv" }));
      res.json(data);
    } else {
      const data = await tmdb("/search/multi", { query, page });
      data.results = data.results.filter((r: { media_type?: string }) =>
        r.media_type === "movie" || r.media_type === "tv"
      );
      res.json(data);
    }
  } catch (err) {
    req.log.error({ err }, "TMDB search error");
    res.status(500).json({ error: "Failed to search" });
  }
});

router.get("/movies/trending", async (req, res) => {
  const parsed = GetTrendingQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { mediaType = "all", timeWindow = "week" } = parsed.data;

  try {
    const tmdbType = mediaType === "all" ? "all" : mediaType;
    const data = await tmdb(`/trending/${tmdbType}/${timeWindow}`);
    if (mediaType === "all") {
      data.results = data.results.filter((r: { media_type?: string }) =>
        r.media_type === "movie" || r.media_type === "tv"
      );
    } else {
      data.results = data.results.map((r: Record<string, unknown>) => ({ ...r, media_type: mediaType }));
    }
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TMDB trending error");
    res.status(500).json({ error: "Failed to fetch trending" });
  }
});

router.get("/movies/popular", async (req, res) => {
  const parsed = GetPopularQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { page = 1 } = parsed.data;

  try {
    const data = await tmdb("/movie/popular", { page });
    data.results = data.results.map((r: Record<string, unknown>) => ({ ...r, media_type: "movie" }));
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TMDB popular movies error");
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
});

router.get("/movies/popular-tv", async (req, res) => {
  const parsed = GetPopularTvQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { page = 1 } = parsed.data;

  try {
    const data = await tmdb("/tv/popular", { page });
    data.results = data.results.map((r: Record<string, unknown>) => ({ ...r, media_type: "tv" }));
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TMDB popular TV error");
    res.status(500).json({ error: "Failed to fetch popular TV" });
  }
});

router.get("/movies/top-rated", async (req, res) => {
  const parsed = GetTopRatedQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { page = 1 } = parsed.data;

  try {
    const data = await tmdb("/movie/top_rated", { page });
    data.results = data.results.map((r: Record<string, unknown>) => ({ ...r, media_type: "movie" }));
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TMDB top rated error");
    res.status(500).json({ error: "Failed to fetch top rated" });
  }
});

router.get("/movies/now-playing", async (req, res) => {
  const parsed = GetNowPlayingQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { page = 1 } = parsed.data;

  try {
    const data = await tmdb("/movie/now_playing", { page });
    data.results = data.results.map((r: Record<string, unknown>) => ({ ...r, media_type: "movie" }));
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "TMDB now playing error");
    res.status(500).json({ error: "Failed to fetch now playing" });
  }
});

router.get("/movies/genres", async (_req, res) => {
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      tmdb("/genre/movie/list"),
      tmdb("/genre/tv/list"),
    ]);
    res.json({
      movie_genres: movieGenres.genres,
      tv_genres: tvGenres.genres,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

export default router;
