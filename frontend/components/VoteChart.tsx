import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PolarAngleAxis, RadialBarChart, RadialBar } from 'recharts';
import { TeamData } from '../lib/api';

interface VoteChartProps {
  teams: TeamData[];
}

const palette = ['#ffc107', '#198754', '#0f5132', '#0dcaf0', '#6610f2', '#fd7e14', '#6f42c1', '#20c997', '#0d6efd', '#212529'];

export function VoteChart({ teams }: VoteChartProps) {
  const top10 = teams.slice(0, 10);
  const pieData = top10.map((team) => ({ name: team.team, value: team.votes }));

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="glassmorphism rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white">Vote distribution</h3>
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={2}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()} votes`, 'Votes']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glassmorphism rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white">Top 10 teams</h3>
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top10} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="team" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()} votes`, 'Votes']} />
              <Bar dataKey="votes" radius={[12, 12, 0, 0]} fill="#ffc107" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glassmorphism rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white">Vote share map</h3>
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="10%" outerRadius="80%" data={pieData} startAngle={180} endAngle={-180}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={20} fill="#198754" background />
              <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ color: '#e2e8f0' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
