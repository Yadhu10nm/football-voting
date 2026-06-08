import { Search, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
}

export function SearchBar({ searchTerm, onSearch, sortOption, onSortChange }: SearchBarProps) {
  return (
    <div className="glassmorphism rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glow backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 shadow-inner md:max-w-xl">
          <Search className="h-4 w-4 text-accent" />
          <input
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search a national team"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
          />
        </label>

        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Sort by</span>
          <div className="relative">
            <select
              value={sortOption}
              onChange={(event) => onSortChange(event.target.value)}
              className="appearance-none rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-3 pr-10 text-sm text-slate-100 outline-none transition hover:border-accent"
            >
              <option value="most">Most Votes</option>
              <option value="least">Least Votes</option>
              <option value="alpha">Alphabetical</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
