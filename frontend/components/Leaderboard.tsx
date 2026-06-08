import { TeamData } from '../lib/api';

interface LeaderboardProps {
  teams: TeamData[];
}

export function Leaderboard({ teams }: LeaderboardProps) {
  const medallions = ['🥇', '🥈', '🥉'];

  return (
    <div className="glassmorphism overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Live leaderboard</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Team ranking</h2>
        </div>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
          Updated every 10s
        </span>
      </div>

      <div className="space-y-4">
        {teams.map((team, index) => (
          <div key={team.team} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-accent/30 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-accent/10 text-2xl text-accent">
                {medallions[index] ?? index + 1}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{team.team}</p>
                <h3 className="text-xl font-semibold text-white">{team.votes.toLocaleString()} votes</h3>
              </div>
            </div>
            <p className="text-right text-sm font-medium text-slate-300 md:text-base">{team.percentage?.toFixed(1)}% share</p>
          </div>
        ))}
      </div>
    </div>
  );
}
