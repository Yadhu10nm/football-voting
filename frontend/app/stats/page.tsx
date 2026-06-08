'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getStats } from '../../lib/api';
import { StatsCard } from '../../components/StatsCard';
import { ShareButton } from '../../components/ShareButton';
import { Trophy, Globe2, Activity } from 'lucide-react';

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const response = await getStats();
      setStats(response);
    }
    load();
  }, []);

  const chartData = stats?.percentages?.slice(0, 8) ?? [];

  return (
    <div className="min-h-screen px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2.5rem] border border-white/10 bg-stadium p-8 shadow-glow backdrop-blur-xl sm:p-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Statistics hub</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Team analytics & voting stats</h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Deep insights into vote percentages, highest predictions, and live team momentum from the World Cup fan community.
              </p>
            </div>
            <ShareButton />
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-3">
          <StatsCard title="Total votes" value={stats?.total_votes?.toLocaleString() ?? '0'} subtitle="All entries captured in the SQLite voting system." icon={Trophy} />
          <StatsCard title="Teams" value={stats?.total_teams ?? 0} subtitle="National teams included in the prediction pool." icon={Globe2} />
          <StatsCard title="Top team" value={stats?.highest_voted_team?.team ?? 'TBD'} subtitle={`Leading with ${stats?.highest_voted_team?.votes ?? 0} votes`} icon={Activity} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
          <div className="glassmorphism rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Top voting share</h2>
            <p className="mt-2 text-sm text-slate-300">Explore the teams with the biggest vote percentages in the current rankings.</p>
            <div className="mt-6 h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="team" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} />
                  <Bar dataKey="percentage" fill="#ffc107" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glassmorphism rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white">Quick facts</h2>
              <ul className="mt-5 space-y-4 text-slate-300">
                <li className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">Highest voted team: <span className="font-semibold text-white">{stats?.highest_voted_team?.team ?? 'TBD'}</span></li>
                <li className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">Total teams: <span className="font-semibold text-white">{stats?.total_teams ?? 0}</span></li>
                <li className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">Live vote refresh every 10s</li>
              </ul>
            </div>
            <div className="glassmorphism rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white">Data source</h2>
              <p className="mt-4 text-slate-300">All vote data is stored locally in a lightweight SQLite database managed by the FastAPI backend.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
