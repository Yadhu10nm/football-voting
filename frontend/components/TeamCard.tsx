import { Trophy } from 'lucide-react';
import { TeamData } from '../lib/api';

interface TeamCardProps {
  team: TeamData;
  onVote: (team: string) => void;
  disabled: boolean;
}

const flagEmojiMap: Record<string, string> = {
  Argentina: '🇦🇷',
  Brazil: '🇧🇷',
  France: '🇫🇷',
  England: '🏴',
  Spain: '🇪🇸',
  Germany: '🇩🇪',
  Portugal: '🇵🇹',
  Netherlands: '🇳🇱',
  Belgium: '🇧🇪',
  Croatia: '🇭🇷',
  Italy: '🇮🇹',
  Uruguay: '🇺🇾',
  Morocco: '🇲🇦',
  Japan: '🇯🇵',
  'South Korea': '🇰🇷',
  USA: '🇺🇸',
  Mexico: '🇲🇽',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
  Senegal: '🇸🇳',
  Switzerland: '🇨🇭',
  Denmark: '🇩🇰',
  Poland: '🇵🇱',
  Serbia: '🇷🇸',
  Turkey: '🇹🇷',
  Colombia: '🇨🇴',
  Chile: '🇨🇱',
  Nigeria: '🇳🇬',
  Egypt: '🇪🇬',
  Algeria: '🇩🇿',
  Norway: '🇳🇴',
  Sweden: '🇸🇪',
};

export function TeamCard({ team, onVote, disabled }: TeamCardProps) {
  const percentage = team.percentage ?? 0;
  const fillWidth = Math.max(6, Math.min(100, percentage));

  return (
    <div className="group glassmorphism overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 shadow-glow transition duration-300 hover:-translate-y-1 hover:border-accent/30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl shadow-lg shadow-slate-950/20">
            {flagEmojiMap[team.team] ?? '🏟️'}
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Team</p>
            <h3 className="text-xl font-semibold text-white">{team.team}</h3>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/75 px-4 py-2 text-sm font-semibold text-white/90 shadow-inner">
          <Trophy className="h-4 w-4 text-accent" />
          {team.votes} votes
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Prediction strength</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-accent via-yellow-400 to-emerald-500 transition-all duration-500" style={{ width: `${fillWidth}%` }} />
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote(team.team)}
        className="mt-7 inline-flex w-full items-center justify-center rounded-3xl bg-accent px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {disabled ? 'Vote locked' : 'Vote for this team'}
      </button>
    </div>
  );
}
