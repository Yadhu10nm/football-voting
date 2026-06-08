import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

export type TeamData = {
  team: string;
  votes: number;
  percentage?: number;
};

export async function getTeams(): Promise<TeamData[]> {
  const response = await api.get('/api/teams');
  return response.data;
}

export async function voteForTeam(team: string): Promise<{ success: boolean; team: string }> {
  const response = await api.post('/api/vote', { team });
  return response.data;
}

export async function getResults(): Promise<{ total_votes: number; teams: TeamData[] }> {
  const response = await api.get('/api/results');
  return response.data;
}

export async function getLeaderboard(): Promise<TeamData[]> {
  const response = await api.get('/api/leaderboard');
  return response.data;
}

export async function getStats() {
  const response = await api.get('/api/stats');
  return response.data;
}
