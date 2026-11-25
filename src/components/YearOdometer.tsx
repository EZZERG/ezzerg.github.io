import { getOdometerDigits } from '../utils/trajectoryMotion';

interface YearOdometerProps {
  year: number;
  accentColor: string;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Precision mechanical vertical-drum year odometer.
 * Each of the four numerals spins smoothly in its own masked vertical aperture
 * as the visitor scrolls through the Trajectory chapters.
 */
export function YearOdometer({ year, accentColor, className = '' }: YearOdometerProps) {
  const digits = getOdometerDigits(year);

  return (
    <div
      data-testid="trajectory-active-year"
      aria-label={String(year)}
      className={`inline-flex items-baseline font-display font-semibold tracking-tighter tabular-nums leading-none select-none ${className}`}
      style={{ color: accentColor }}
    >
      <span className="sr-only">{year}</span>
      {digits.map((digit, slotIdx) => (
        <span
          key={slotIdx}
          aria-hidden="true"
          className="relative inline-block overflow-hidden h-[1.02em] w-[0.64em] align-top"
        >
          <span
            className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateY(-${digit * 10}%)` }}
          >
            {DIGITS.map((d) => (
              <span
                key={d}
                className="h-[1.02em] flex items-center justify-center leading-none"
              >
                {d}
              </span>
            ))}
          </span>
        </span>
      ))}
    </div>
  );
}
