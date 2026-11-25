import { ArrowRight, Check } from 'lucide-react';
import { OUTFIT_OPTIONS } from '../data/dateOptions';
import { OutfitId } from '../types/datePlan';
import StepHeader from './StepHeader';

interface OutfitStepProps {
  selectedOutfitId: OutfitId | null;
  onSelectOutfit: (id: OutfitId) => void;
  onSkip: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function OutfitStep({
  selectedOutfitId,
  onSelectOutfit,
  onSkip,
  onBack,
  onContinue,
}: OutfitStepProps) {
  return (
    <section
      aria-label="Choose an outfit"
      className="flex max-h-full w-full items-center justify-center"
    >
      <div className="relative z-10 flex max-h-full w-full max-w-4xl flex-col rounded-[1.5rem] border border-rose-200/80 bg-white/90 p-3.5 shadow-[0_24px_60px_-15px_rgba(190,24,93,0.15)] backdrop-blur-md sm:rounded-[2rem] sm:p-6">
        <StepHeader currentStep="outfit" onBack={onBack} />

        <div className="shrink-0 text-center">
          <h1
            className="font-display text-xl font-semibold tracking-tight text-[#3d0e1e] sm:text-3xl"
            style={{ textWrap: 'balance' }}
          >
            Now, What Are You Going to Wear? 🎀
          </h1>
          <p className="mx-auto mt-1 max-w-md text-xs leading-snug text-[#6b283f] sm:text-sm">
            Pick the outfit vibe for our special day.
          </p>
        </div>

        <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto pr-0.5 sm:mt-5 sm:grid-cols-4 sm:gap-2.5">
          {OUTFIT_OPTIONS.map((outfit) => {
            const isSelected = selectedOutfitId === outfit.id;

            return (
              <button
                key={outfit.id}
                type="button"
                onClick={() => onSelectOutfit(outfit.id)}
                aria-pressed={isSelected}
                className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:flex-col sm:items-start sm:rounded-2xl sm:p-3.5 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/90 shadow-[0_8px_18px_-8px_rgba(225,29,72,0.3)]'
                    : 'border-rose-100 bg-white/85 hover:border-rose-300 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex shrink-0 items-center justify-between gap-2 sm:w-full">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100/75 text-base transition-transform duration-150 group-hover:scale-105 sm:h-9 sm:w-9 sm:rounded-xl sm:text-lg"
                    aria-hidden="true"
                  >
                    {outfit.emoji}
                  </span>
                  {isSelected && (
                    <span className="hidden h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white sm:flex">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                  )}
                </div>

                <span className="min-w-0 flex-1 text-xs font-semibold leading-tight text-[#3d0e1e] sm:mt-2 sm:flex-initial sm:text-sm">
                  {outfit.title}
                </span>

                {isSelected && (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white sm:hidden">
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                )}

                <span className="hidden text-[11px] leading-snug text-[#7c354d] sm:mt-1 sm:line-clamp-2 sm:block">
                  {outfit.description}
                </span>
                <span className="hidden text-[11px] font-medium text-rose-700 sm:mt-2 sm:block">
                  {outfit.vibeNote}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex shrink-0 items-center justify-center gap-2.5 sm:mt-5">
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#5c1d33] transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:min-h-11 sm:flex-initial sm:rounded-2xl sm:px-6 sm:text-sm whitespace-nowrap shrink-0"
          >
            Skip This Step
          </button>

          <button
            type="button"
            disabled={!selectedOutfitId}
            onClick={onContinue}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-8px_rgba(225,29,72,0.45)] transition-all duration-150 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:min-h-11 sm:flex-initial sm:min-w-[200px] sm:rounded-2xl sm:px-8 sm:text-base whitespace-nowrap shrink-0"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
