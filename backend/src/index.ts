import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  getTeams,
  recordVote,
  getLeaderboard,
  getResults,
  getStats,
  getVotesFromKV,
  initializeVotes,
  saveVotesToKV,
} from "./database";

const app = new Hono();

// Enable CORS
app.use("*", cors());

// Initialize votes on first run
app.get("/api/init", async (c) => {
  const env = c.env as any;
  const votes = initializeVotes();
  await saveVotesToKV(env, votes);
  return c.json({ success: true, message: "Database initialized" });
});

// GET /api/teams - List all teams with vote counts
app.get("/api/teams", async (c) => {
  const env = c.env as any;
  const teams = await getTeams(env);
  return c.json(teams);
});

// POST /api/vote - Record a vote for a team
app.post("/api/vote", async (c) => {
  const env = c.env as any;
  const body = await c.req.json() as { team?: string };
  const { team } = body;

  if (!team) {
    return c.json({ error: "Team name is required" }, 400);
  }

  const success = await recordVote(env, team);
  if (!success) {
    return c.json({ error: "Team not found" }, 404);
  }

  return c.json({ success: true, team });
});

// GET /api/results - Get results with percentages
app.get("/api/results", async (c) => {
  const env = c.env as any;
  const results = await getResults(env);
  return c.json(results);
});

// GET /api/leaderboard - Get ranked leaderboard
app.get("/api/leaderboard", async (c) => {
  const env = c.env as any;
  const leaderboard = await getLeaderboard(env);
  const votes = await getVotesFromKV(env);
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  return c.json(
    leaderboard.map((item) => ({
      team: item.team,
      votes: item.votes,
      percentage: totalVotes ? parseFloat(((item.votes / totalVotes) * 100).toFixed(1)) : 0,
    }))
  );
});

// GET /api/stats - Get statistics
app.get("/api/stats", async (c) => {
  const env = c.env as any;
  const stats = await getStats(env);
  return c.json(stats);
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
