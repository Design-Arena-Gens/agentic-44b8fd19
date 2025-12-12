import { LyricsExplorer } from "@/components/lyrics-explorer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-indigo-50 pb-32 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_farthest-side_at_50%_0%,rgba(251,207,232,0.65),transparent)]" />
      <LyricsExplorer />
    </div>
  );
}
