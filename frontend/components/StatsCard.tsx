import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
}

export function StatsCard({ title, value, subtitle, icon: Icon }: StatsCardProps) {
  return (
    <div className="glassmorphism rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl transition hover:-translate-y-1 hover:border-accent/40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm uppercase tracking-[0.12em] text-slate-400">{title}</h3>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-accent/10 text-accent shadow-md shadow-accent/20">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-300">{subtitle}</p>
    </div>
  );
}
