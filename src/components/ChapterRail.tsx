import { CHAPTERS, type ChapterId } from '../utils/scrollChoreography';

interface ChapterRailProps {
  activeChapter: ChapterId;
  isDarkSurface: boolean;
  progress: number;
}

export function ChapterRail({ activeChapter, isDarkSurface, progress }: ChapterRailProps) {
  const hiddenForTheater = activeChapter === 'trajectory';
  return (
    <aside
      aria-label="Page chapters"
      aria-hidden={hiddenForTheater}
      className={`hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3 transition-opacity duration-300 ${
        hiddenForTheater ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-end gap-3 pr-4">
        {/* Continuous vertical progress spine */}
        <div
          aria-hidden="true"
          className={`absolute right-0 top-1 bottom-1 w-px ${
            isDarkSurface ? 'bg-white/15' : 'bg-slate-900/15'
          }`}
        >
          <div
            className="w-full h-full bg-blue-500 origin-top transition-transform duration-100"
            style={{ transform: `scaleY(${Math.max(0.06, progress)})` }}
          />
        </div>

        {CHAPTERS.map((chapter) => {
          const isActive = activeChapter === chapter.id;
          return (
            <a
              key={chapter.id}
              href={`#${chapter.anchor}`}
              aria-current={isActive ? 'location' : undefined}
              className={`group flex items-center gap-2 text-xs transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? isDarkSurface
                    ? 'text-white font-semibold'
                    : 'text-slate-950 font-semibold'
                  : isDarkSurface
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <span
                className={`transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {chapter.label}
              </span>
              <span className="font-mono tabular-nums text-[11px]">{chapter.index}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
