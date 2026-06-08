'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { getLeaderboard } from '../../lib/api';
import { Leaderboard } from '../../components/Leaderboard';
import { VoteChart } from '../../components/VoteChart';
import { ShareButton } from '../../components/ShareButton';
import type { TeamData } from '../../lib/api';

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await getLeaderboard();
      setTeams(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = window.setInterval(fetchLeaderboard, 10000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2.5rem] border border-white/10 bg-stadium p-8 shadow-glow backdrop-blur-xl sm:p-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Live analytics</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Leaderboard & match mood</h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                The most voted teams are displayed in real time with tournament-style ranking and percentage analytics.
              </p>
            </div>
            <ShareButton />
          </div>
        </header>

        <section className="grid gap-8 xl:grid-cols-[0.9fr_0.95fr]">
          <div className="glassmorphism rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
            <Leaderboard teams={teams} />
          </div>

          <div className="space-y-6">
            <div className="glassmorphism rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3 text-slate-100">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-accent/10 text-accent">
                  <Trophy className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Insights</p>
                  <h2 className="text-2xl font-semibold text-white">Chart-driven forecast</h2>
                </div>
              </div>
              <p className="text-slate-300">These charts update automatically and highlight the strongest winners in the voting pool.</p>
            </div>

            <VoteChart teams={teams} />
          </div>
        </section>
      </div>
    </div>
  );
}
