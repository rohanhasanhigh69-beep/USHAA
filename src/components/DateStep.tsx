import { useMemo, useState } from 'react';
import { CalendarHeart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import StepHeader from './StepHeader';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatIsoDatePretty(iso: string | null): string {
  if (!iso) return '';
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return iso;
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

interface DateStepProps {
  selectedDate: string | null;
  onSelectDate: (isoDate: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function DateStep({
  selectedDate,
  onSelectDate,
  onBack,
  onContinue,
}: DateStepProps) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const initialView = useMemo(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      if (y && m) return { year: y, month: m - 1 };
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  }, [selectedDate, today]);

  const [viewYear, setViewYear] = useState(initialView.year);
  const [viewMonth, setViewMonth] = useState(initialView.month);

  const todayIso = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(
    today.getDate()
  )}`;

  const isCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const handlePrevMonth = () => {
    if (isCurrentMonth) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<{
      day: number | null;
      iso: string | null;
      isPast: boolean;
      isToday: boolean;
    }> = [];

    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, iso: null, isPast: false, isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(viewYear, viewMonth, day);
      const iso = `${viewYear}-${pad2(viewMonth + 1)}-${pad2(day)}`;
      cells.push({
        day,
        iso,
        isPast: cellDate.getTime() < today.getTime(),
        isToday: iso === todayIso,
      });
    }

    return cells;
  }, [viewYear, viewMonth, today, todayIso]);

  return (
    <section
      aria-label="Choose a date"
      className="flex max-h-full w-full items-center justify-center"
    >
      <div className="relative z-10 flex max-h-full w-full max-w-xl flex-col rounded-[1.5rem] border border-rose-200/80 bg-white/90 p-3.5 shadow-[0_24px_60px_-15px_rgba(190,24,93,0.15)] backdrop-blur-md sm:rounded-[2rem] sm:p-6">
        <StepHeader currentStep="date" onBack={onBack} />

        <div className="shrink-0 text-center">
          <h1
            className="font-display text-2xl font-semibold tracking-tight text-[#3d0e1e] sm:text-3xl"
            style={{ textWrap: 'balance' }}
          >
            Yay! It&apos;s a Date! 💕
          </h1>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-[#6b283f] sm:text-sm">
            Pick the perfect day for our little adventure.
          </p>
        </div>

        {/* Monthly Calendar */}
        <div className="mt-2.5 shrink-0 rounded-2xl border border-rose-100 bg-rose-50/45 p-2.5 sm:mt-4 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isCurrentMonth}
              aria-label="Previous month"
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200/80 bg-white text-[#5c1d33] transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:h-9 sm:w-9"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <h2 className="font-display text-base font-semibold text-[#3d0e1e] sm:text-lg">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200/80 bg-white text-[#5c1d33] transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:h-9 sm:w-9"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((dayName) => (
              <div
                key={dayName}
                className="py-1 text-[11px] font-semibold text-[#8c435b] sm:text-xs"
              >
                {dayName}
              </div>
            ))}

            {calendarCells.map((cell, index) => {
              if (!cell.day || !cell.iso) {
                return <div key={`empty-${index}`} className="h-8 sm:h-9" />;
              }

              const isSelected = selectedDate === cell.iso;

              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={cell.isPast}
                  onClick={() => onSelectDate(cell.iso!)}
                  aria-label={formatIsoDatePretty(cell.iso)}
                  aria-pressed={isSelected}
                  className={`relative flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium tabular-nums transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:h-9 sm:rounded-xl sm:text-sm ${
                    isSelected
                      ? 'bg-gradient-to-br from-rose-500 to-rose-600 font-semibold text-white shadow-[0_6px_16px_-4px_rgba(225,29,72,0.5)] scale-[1.03]'
                      : cell.isPast
                      ? 'cursor-not-allowed text-rose-300/75'
                      : cell.isToday
                      ? 'border border-rose-300 bg-white text-rose-700 hover:bg-rose-100/70'
                      : 'bg-white/75 text-[#3d0e1e] hover:bg-rose-100/75'
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Summary */}
        <div className="mt-2.5 shrink-0 rounded-xl border border-rose-200/70 bg-white/95 px-3 py-2 sm:mt-3.5 sm:rounded-2xl sm:px-4 sm:py-2.5">
          {selectedDate ? (
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#3d0e1e] sm:text-sm">
              <CalendarHeart
                className="h-4 w-4 text-rose-600 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">
                Selected:{' '}
                <strong className="font-semibold text-rose-700">
                  {formatIsoDatePretty(selectedDate)}
                </strong>
              </span>
            </div>
          ) : (
            <p className="text-center text-xs text-[#7c354d] sm:text-sm">
              Tap any available date above to continue.
            </p>
          )}
        </div>

        <div className="mt-2.5 flex shrink-0 justify-center sm:mt-4">
          <button
            type="button"
            disabled={!selectedDate}
            onClick={onContinue}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-8px_rgba(225,29,72,0.45)] transition-all duration-150 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:min-h-11 sm:w-auto sm:min-w-[220px] sm:rounded-2xl sm:text-base whitespace-nowrap shrink-0"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
