'use client';

import { useMemo, useState } from 'react';
import { Lyric, lyricsCatalog } from '@/data/lyrics';

type FilterState = {
  mood: string | null;
  era: string | null;
  language: string | null;
  length: string | null;
};

const initialFilters: FilterState = {
  mood: null,
  era: null,
  language: null,
  length: null,
};

const allMoods = Array.from(
  new Set(lyricsCatalog.flatMap((lyric) => lyric.mood)),
);
const allEras = Array.from(new Set(lyricsCatalog.map((lyric) => lyric.era)));
const allLanguages = Array.from(
  new Set(lyricsCatalog.map((lyric) => lyric.language)),
);
const allLengths = Array.from(new Set(lyricsCatalog.map((lyric) => lyric.length)));

const trendingLyrics: Lyric[] = [...lyricsCatalog]
  .sort((a, b) => {
    const moodScore = (value: Lyric) =>
      value.mood.includes('Passionate') ? 2 : value.mood.includes('Dreamy') ? 1 : 0;
    return b.year + moodScore(b) - (a.year + moodScore(a));
  })
  .slice(0, 3);

export function LyricsExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedLyric, setSelectedLyric] = useState<Lyric | null>(trendingLyrics[0]);

  const filteredLyrics = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return lyricsCatalog.filter((lyric) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        lyric.title.toLowerCase().includes(normalizedSearch) ||
        lyric.artist.toLowerCase().includes(normalizedSearch) ||
        lyric.excerpt.toLowerCase().includes(normalizedSearch) ||
        lyric.lyrics.some((line) =>
          line.toLowerCase().includes(normalizedSearch),
        );

      if (!matchesSearch) {
        return false;
      }

      const matchesMood =
        !filters.mood || lyric.mood.includes(filters.mood as Lyric['mood'][number]);
      const matchesEra = !filters.era || lyric.era === filters.era;
      const matchesLanguage = !filters.language || lyric.language === filters.language;
      const matchesLength = !filters.length || lyric.length === filters.length;

      return matchesMood && matchesEra && matchesLanguage && matchesLength;
    });
  }, [searchTerm, filters]);

  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters((previous) => ({
      ...previous,
      [key]: previous[key] === value ? null : value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-16 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl sm:h-[620px] sm:w-[620px]" />
        <div className="absolute left-10 top-48 h-48 w-48 rounded-full bg-indigo-200/40 blur-2xl" />
        <div className="absolute -right-20 top-24 h-56 w-56 rounded-full bg-fuchsia-200/40 blur-3xl" />
      </div>

      <section className="rounded-3xl bg-white/70 p-10 shadow-xl shadow-rose-100 ring-1 ring-white/40 backdrop-blur">
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-rose-950 sm:text-5xl">
              Love Lyrics Atlas
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-rose-900/70">
              Drift through a handpicked anthology of romantic lyrics in five
              languages. Sift by mood, era, and cadence, or follow the curated signals
              from our stargazing editors to discover the perfect confession.
            </p>

            <div className="mt-8 space-y-6">
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search for lyrics, artists, emotions, or words..."
                  className="w-full rounded-xl border border-pink-200/70 bg-white/80 px-5 py-4 text-base text-rose-900 shadow-inner shadow-rose-100/70 outline-none transition focus:border-rose-400 focus:ring focus:ring-rose-200/60"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-rose-400 sm:block">
                  Search
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-rose-800/70">
                <span className="font-semibold text-rose-900">Filters:</span>
                <FilterGroup
                  label="Mood"
                  options={allMoods}
                  active={filters.mood}
                  onSelect={(option) => toggleFilter('mood', option)}
                />
                <FilterGroup
                  label="Era"
                  options={allEras}
                  active={filters.era}
                  onSelect={(option) => toggleFilter('era', option)}
                />
                <FilterGroup
                  label="Language"
                  options={allLanguages}
                  active={filters.language}
                  onSelect={(option) => toggleFilter('language', option)}
                />
                <FilterGroup
                  label="Length"
                  options={allLengths}
                  active={filters.length}
                  onSelect={(option) => toggleFilter('length', option)}
                />
                <button
                  onClick={clearFilters}
                  type="button"
                  className="rounded-full border border-transparent bg-rose-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-600 shadow-sm transition hover:bg-rose-200/80"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {filteredLyrics.length === 0 ? (
                <p className="col-span-full rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 p-10 text-center text-rose-900/60">
                  No lyrics match that constellation. Try softening your filters or
                  searching another phrase.
                </p>
              ) : (
                filteredLyrics.map((lyric) => (
                  <LyricCard
                    key={lyric.id}
                    lyric={lyric}
                    isActive={selectedLyric?.id === lyric.id}
                    onSelect={() => setSelectedLyric(lyric)}
                  />
                ))
              )}
            </div>
          </div>

          <aside className="space-y-6 rounded-2xl border border-rose-100/80 bg-white/80 p-6 shadow-lg shadow-rose-100/60">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
                Spotlight
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-rose-900">Curated Echo</h2>
              <p className="mt-3 text-sm leading-relaxed text-rose-900/70">
                Dive deep into a highlighted lyric while you explore. Switch selections
                to reveal full verses, context, and cadence cues.
              </p>
            </header>

            {selectedLyric ? (
              <div>
                <div
                  className="rounded-2xl p-6 shadow-inner"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${selectedLyric.gradient[0]}, ${selectedLyric.gradient[1]})`,
                  }}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.35em] text-rose-700/60">
                    {selectedLyric.language} • {selectedLyric.era}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-rose-950">
                    {selectedLyric.title}
                  </h3>
                  <p className="text-sm font-medium uppercase tracking-widest text-rose-800/70">
                    {selectedLyric.artist} · {selectedLyric.year}
                  </p>
                </div>

                <article className="mt-5 space-y-4 rounded-xl border border-rose-100 bg-rose-50/60 p-5 text-sm leading-relaxed text-rose-900/80">
                  {selectedLyric.lyrics.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </article>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-500">
                  {selectedLyric.mood.map((mood) => (
                    <span
                      key={mood}
                      className="rounded-full bg-rose-100/80 px-3 py-1 text-rose-600"
                    >
                      {mood}
                    </span>
                  ))}
                  <span className="rounded-full bg-rose-100/80 px-3 py-1 text-rose-600">
                    {selectedLyric.length}
                  </span>
                </div>

                {selectedLyric.spotifyUrl ? (
                  <a
                    href={selectedLyric.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-rose-500/90 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                  >
                    Listen on Spotify
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-rose-200 bg-rose-50/50 p-6 text-sm text-rose-900/70">
                Select a lyric to unfold its verses and hidden whispers.
              </p>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-400">
                Trending
              </p>
              <ul className="mt-3 space-y-3">
                {trendingLyrics.map((lyric) => (
                  <li
                    key={lyric.id}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-rose-50/80 px-4 py-3 text-sm text-rose-900/80 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-100"
                    onClick={() => {
                      setSelectedLyric(lyric);
                      setFilters(initialFilters);
                      setSearchTerm('');
                    }}
                  >
                    <div>
                      <p className="font-semibold text-rose-900">{lyric.title}</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-rose-400">
                        {lyric.artist}
                      </p>
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-rose-500">
                      {lyric.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

type LyricCardProps = {
  lyric: Lyric;
  isActive: boolean;
  onSelect: () => void;
};

function LyricCard({ lyric, isActive, onSelect }: LyricCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'group flex h-full flex-col items-start rounded-2xl border px-6 py-5 text-left transition-all duration-150',
        isActive
          ? 'border-rose-400 bg-white shadow-lg shadow-rose-100'
          : 'border-rose-100 bg-white/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/80',
      ].join(' ')}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">
        {lyric.language} • {lyric.era}
      </span>
      <h3 className="mt-3 text-xl font-semibold text-rose-900 group-hover:text-rose-600">
        {lyric.title}
      </h3>
      <p className="text-xs uppercase tracking-[0.35em] text-rose-400">
        {lyric.artist} · {lyric.year}
      </p>
      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-rose-900/70">
        {lyric.excerpt}
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-widest text-rose-500">
        {lyric.mood.map((mood) => (
          <span
            key={mood}
            className="rounded-full bg-rose-50 px-3 py-1 text-rose-500 group-hover:bg-rose-100"
          >
            {mood}
          </span>
        ))}
        <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-500 group-hover:bg-rose-100">
          {lyric.length}
        </span>
      </div>
    </button>
  );
}

type FilterGroupProps = {
  label: string;
  options: string[];
  active: string | null;
  onSelect: (option: string) => void;
};

function FilterGroup({ label, options, active, onSelect }: FilterGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-rose-400 sm:block">
        {label}
      </span>
      {options.map((option) => {
        const isActive = active === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={[
              'rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition',
              isActive
                ? 'border-rose-400 bg-rose-500 text-white shadow'
                : 'border-rose-100 bg-white/70 text-rose-500 hover:border-rose-300 hover:bg-rose-50',
            ].join(' ')}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
