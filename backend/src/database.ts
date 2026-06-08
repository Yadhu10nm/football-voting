export const TEAMS = [
  "Canada",
  "Mexico",
  "United States",
  "Japan",
  "New Zealand",
  "Iran",
  "Argentina",
  "Uzbekistan",
  "Jordan",
  "South Korea",
  "Australia",
  "Brazil",
  "Ecuador",
  "Paraguay",
  "Uruguay",
  "Colombia",
  "Morocco",
  "Tunisia",
  "Egypt",
  "Algeria",
  "Ghana",
  "Cape Verde",
  "Qatar",
  "Saudi Arabia",
  "Senegal",
  "South Africa",
  "Ivory Coast",
  "England",
  "France",
  "Croatia",
  "Portugal",
  "Norway",
  "Germany",
  "Netherlands",
  "Switzerland",
  "Scotland",
  "Spain",
  "Austria",
  "Belgium",
  "Panama",
  "Curaçao",
  "Haiti",
  "Bosnia and Herzegovina",
  "Sweden",
  "Turkey",
  "Czech Republic",
  "DR Congo",
  "Iraq",
];

export interface TeamVote {
  team: string;
  votes: number;
}

export async function getVotesFromKV(env: any): Promise<Record<string, number>> {
  try {
    const data = await env.VOTES_DB.get("votes", "json");
    return data || initializeVotes();
  } catch {
    return initializeVotes();
  }
}

export function initializeVotes(): Record<string, number> {
  const votes: Record<string, number> = {};
  TEAMS.forEach((team) => {
    votes[team] = 0;
  });
  return votes;
}

export async function saveVotesToKV(env: any, votes: Record<string, number>) {
  await env.VOTES_DB.put("votes", JSON.stringify(votes));
}

export async function recordVote(env: any, team: string): Promise<boolean> {
  if (!TEAMS.includes(team)) return false;
  
  const votes = await getVotesFromKV(env);
  votes[team] = (votes[team] || 0) + 1;
  await saveVotesToKV(env, votes);
  return true;
}

export async function getTeams(env: any): Promise<TeamVote[]> {
  const votes = await getVotesFromKV(env);
  return TEAMS.map((team) => ({
    team,
    votes: votes[team] || 0,
  })).sort((a, b) => a.team.localeCompare(b.team));
}

export async function getLeaderboard(env: any): Promise<TeamVote[]> {
  const votes = await getVotesFromKV(env);
  return TEAMS.map((team) => ({
    team,
    votes: votes[team] || 0,
  })).sort((a, b) => b.votes - a.votes);
}

export function getTotalVotes(votes: Record<string, number>): number {
  return Object.values(votes).reduce((sum, v) => sum + v, 0);
}

export async function getResults(env: any) {
  const votes = await getVotesFromKV(env);
  const totalVotes = getTotalVotes(votes);
  const teams = TEAMS.map((team) => {
    const teamVotes = votes[team] || 0;
    return {
      team,
      votes: teamVotes,
      percentage: totalVotes ? parseFloat(((teamVotes / totalVotes) * 100).toFixed(1)) : 0,
    };
  }).sort((a, b) => b.votes - a.votes);

  return { total_votes: totalVotes, teams };
}

export async function getStats(env: any) {
  const votes = await getVotesFromKV(env);
  const totalVotes = getTotalVotes(votes);
  const leaderboard = TEAMS.map((team) => ({
    team,
    votes: votes[team] || 0,
  })).sort((a, b) => b.votes - a.votes);

  const highest = leaderboard[0] || { team: "N/A", votes: 0 };

  const percentages = leaderboard.map((item) => ({
    team: item.team,
    votes: item.votes,
    percentage: totalVotes ? parseFloat(((item.votes / totalVotes) * 100).toFixed(1)) : 0,
  }));

  return {
    total_votes: totalVotes,
    total_teams: TEAMS.length,
    highest_voted_team: highest,
    percentages,
  };
}
