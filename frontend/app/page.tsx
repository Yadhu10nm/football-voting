'use client';

import { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowRight, Trophy, Globe2, Sparkles } from 'lucide-react';
import { getLeaderboard, getResults, getTeams, voteForTeam } from '../lib/api';
import { TeamCard } from '../components/TeamCard';
import { SearchBar } from '../components/SearchBar';
import { StatsCard } from '../components/StatsCard';
import { ShareButton } from '../components/ShareButton';
import type { TeamData } from '../lib/api';

const statsIcons = {
  votes: Trophy,
  teams: Globe2,
  leader: Sparkles,
};

const defaultStats = {
  total_votes: 0,
  teams: [] as TeamData[],
  total_teams: 0,
  highest_voted_team: { team: 'N/A', votes: 0 },
};

export default function HomePage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [results, setResults] = useState<{ total_votes: number; teams: TeamData[] }>(defaultStats as any);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('most');
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setVoted(localStorage.getItem('voted') === 'true');
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apiTeams, apiResults] = await Promise.all([getTeams(), getResults()]);
      setTeams(apiTeams);
      setResults(apiResults);
    } catch (error) {
      toast.error('Unable to load predictions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = window.setInterval(fetchData, 10000);
    return () => window.clearInterval(interval);
  }, []);

  const filteredTeams = useMemo(() => {
    const normalized = searchTerm.toLowerCase();
    const filtered = teams.filter((team) => team.team.toLowerCase().includes(normalized));

    if (sortOption === 'least') {
      return filtered.slice().sort((a, b) => a.votes - b.votes);
    }

    if (sortOption === 'alpha') {
      return filtered.slice().sort((a, b) => a.team.localeCompare(b.team));
    }

    return filtered.slice().sort((a, b) => b.votes - a.votes);
  }, [searchTerm, sortOption, teams]);

  const handleVote = async (team: string) => {
    if (voted) {
      toast('You already voted from this browser.', { icon: '⚠️' });
      return;
    }

    try {
      await voteForTeam(team);
      localStorage.setItem('voted', 'true');
      setVoted(true);
      toast.success(`Vote received for ${team}!`);
      fetchData();
    } catch (error) {
      toast.error('Could not submit vote.');
    }
  };

  const top3 = results.teams.slice(0, 3);

  return (
    <div className="min-h-screen px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <Toaster position="top-right" toastOptions={{ style: { background: '#0d2f1e', color: '#f8fafc' } }} />

      <header className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-stadium p-8 shadow-glow backdrop-blur-xl sm:p-12">
        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.9fr] xl:items-center">
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-accent shadow-inner">
              FIFA World Cup 2026
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Prediction Center
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Vote for the national team you believe will win FIFA World Cup 2026. Explore live analytics, leaderboards, and team momentum designed for football fans.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl bg-slate-950/70 p-5 text-white shadow-lg shadow-black/10">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Total votes</p>
                <p className="mt-3 text-4xl font-semibold text-accent animated-count">{results.total_votes.toLocaleString()}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-5 text-white shadow-lg shadow-black/10">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Teams participating</p>
                <p className="mt-3 text-4xl font-semibold text-white">{teams.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-5 text-white shadow-lg shadow-black/10">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Current leader</p>
                <p className="mt-3 text-4xl font-semibold text-white">{top3[0]?.team ?? 'TBD'}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <ShareButton />
              <a href="/leaderboard" className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-accent/30 hover:bg-white/10">
                Explore leaderboard <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-800/30 to-slate-950/40 p-8 shadow-2xl shadow-black/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_36%)]" />
            <div className="relative grid gap-4">
              <div className="rounded-3xl bg-slate-950/60 p-5 text-white shadow-inner shadow-black/20">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Top 3 predictions</p>
                <div className="mt-6 space-y-4">
                  {top3.map((team, index) => (
                    <div key={team.team} className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                      <span className="font-semibold">{index + 1}. {team.team}</span>
                      <span className="text-accent">{team.percentage?.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-5 text-white shadow-inner shadow-black/30">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Stadium outlook</p>
                <div className="mt-6 flex items-center justify-between gap-4 rounded-3xl bg-black/20 p-5">
                  <div>
                    <p className="text-2xl font-semibold text-white">⚽</p>
                    <p className="mt-2 text-sm text-slate-300">Designed for football fans with modern analytics and premium stadium visuals.</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/10 text-3xl text-accent">🏆</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-7xl space-y-10">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Team voting</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Choose the winner</h2>
            </div>
            <p className="max-w-2xl text-sm text-slate-300 md:text-base">
              Use the search filter and sort tools to discover your favorite nation and submit your prediction. Voting is locked per browser.
            </p>
          </div>

          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} sortOption={sortOption} onSortChange={setSortOption} />

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <StatsCard title="Total votes" value={results.total_votes.toLocaleString()} subtitle="All prediction votes collected from fans." icon={Trophy} />
            <StatsCard title="Teams" value={teams.length} subtitle="National teams ready to compete in the prediction pool." icon={Globe2} />
            <StatsCard title="Leading team" value={top3[0]?.team ?? 'TBD'} subtitle="The current frontrunner in the prediction race." icon={Sparkles} />
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="animate-pulse rounded-3xl bg-slate-950/60 p-6" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTeams.map((team) => (
                <TeamCard key={team.team} team={team} onVote={handleVote} disabled={voted} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
