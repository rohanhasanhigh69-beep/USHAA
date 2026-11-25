import { ArrowRight, Check, Shuffle, Sparkles } from 'lucide-react';
import { ACTIVITY_OPTIONS, CUSTOMIZATION_BY_ACTIVITY } from '../data/dateOptions';
import { ActivityId } from '../types/datePlan';
import StepHeader from './StepHeader';

interface CustomizeStepProps {
  activityId: ActivityId;
  selectedDetailId: string | null;
  revealedDetailText: string | null;
  onSelectDetail: (detailId: string, revealedText?: string | null) => void;
  onBack: () => void;
  onContinue: () => void;
  onBurst: () => void;
}

export default function CustomizeStep({
  activityId,
  selectedDetailId,
  revealedDetailText,
  onSelectDetail,
  onBack,
  onContinue,
  onBurst,
}: CustomizeStepProps) {
  const activity =
    ACTIVITY_OPTIONS.find((item) => item.id === activityId) ?? ACTIVITY_OPTIONS[0];
  const choices = CUSTOMIZATION_BY_ACTIVITY[activityId] ?? [];
  const selectedChoice = choices.find((c) => c.id === selectedDetailId) ?? null;

  const pickRandomChoice = () => {
    const nonSurprise = choices.filter((c) => !c.isSurprise);
    if (nonSurprise.length === 0) return null;
    const picked = nonSurprise[Math.floor(Math.random() * nonSurprise.length)];
    return picked;
  };

  const handleChoiceClick = (choiceId: string, isSurprise?: boolean) => {
    if (isSurprise) {
      onBurst();
      const picked = pickRandomChoice();
      onSelectDetail(
        choiceId,
        picked ? `${picked.emoji} ${picked.title}` : null
      );
    } else {
      onSelectDetail(choiceId, null);
    }
  };

  return (
    <section
      aria-label={`Customize ${activity.title}`}
      className="flex max-h-full w-full items-center justify-center"
    >
      <div className="relative z-10 flex max-h-full w-full max-w-4xl flex-col rounded-[1.5rem] border border-rose-200/80 bg-white/90 p-3.5 shadow-[0_24px_60px_-15px_rgba(190,24,93,0.15)] backdrop-blur-md sm:rounded-[2rem] sm:p-6">
        <StepHeader currentStep="customize" onBack={onBack} />

        <div className="shrink-0 text-center">
          <p className="text-xs font-medium text-rose-700 sm:text-sm">
            {activity.emoji} {activity.title}
          </p>
          <h1
            className="mt-0.5 font-display text-xl font-semibold tracking-tight text-[#3d0e1e] sm:mt-1 sm:text-3xl"
            style={{ textWrap: 'balance' }}
          >
            {activity.customHeading}
          </h1>
          <p className="mx-auto mt-1 max-w-lg text-xs leading-snug text-[#6b283f] sm:text-sm">
            {activity.customSubheading}
          </p>
        </div>

        <div className="mt-2.5 grid min-h-0 flex-1 grid-cols-2 gap-1.5 overflow-y-auto pr-0.5 sm:mt-4 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-4">
          {choices.map((choice) => {
            const isSelected = selectedDetailId === choice.id;

            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleChoiceClick(choice.id, choice.isSurprise)}
                aria-pressed={isSelected}
                className={`group flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 lg:flex-col lg:items-start lg:rounded-2xl lg:p-3 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/90 shadow-[0_8px_18px_-8px_rgba(225,29,72,0.3)]'
                    : choice.isSurprise
                    ? 'border-rose-200 bg-gradient-to-br from-rose-50/80 to-pink-50/80 hover:border-rose-300'
                    : 'border-rose-100 bg-white/85 hover:border-rose-300 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex shrink-0 items-center justify-between gap-2 lg:w-full">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100/75 text-sm transition-transform duration-150 group-hover:scale-105 lg:h-9 lg:w-9 lg:rounded-xl lg:text-lg"
                    aria-hidden="true"
                  >
                    {choice.emoji}
                  </span>
                  {isSelected && (
                    <span className="hidden h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white lg:flex">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                  )}
                </div>

                <span className="min-w-0 flex-1 text-xs font-semibold leading-tight text-[#3d0e1e] sm:text-sm lg:mt-2 lg:flex-initial">
                  {choice.title}
                </span>

                {isSelected && (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white lg:hidden">
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                )}

                <span className="hidden text-[11px] leading-snug text-[#7c354d] lg:mt-1 lg:line-clamp-2 lg:block">
                  {choice.description}
                </span>
              </button>
            );
          })}
        </div>

        {selectedChoice?.isSurprise && revealedDetailText && (
          <div
            aria-live="polite"
            className="mt-2 flex shrink-0 items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2 sm:mt-3 sm:rounded-2xl sm:px-4 sm:py-2.5"
          >
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Surprise Picked for Usha
              </p>
              <p className="truncate font-display text-sm font-semibold text-[#3d0e1e] sm:text-base">
                {revealedDetailText}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleChoiceClick(selectedChoice.id, true)}
              className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5c1d33] transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:min-h-9 sm:px-3 sm:text-xs whitespace-nowrap shrink-0"
            >
              <Shuffle className="h-3 w-3" aria-hidden="true" />
              Shuffle
            </button>
          </div>
        )}

        <div className="mt-2.5 flex shrink-0 flex-col items-center gap-1.5 sm:mt-4">
          {!selectedDetailId && (
            <p className="text-[11px] font-medium text-[#7c354d] sm:text-xs">
              Choose an option above to continue.
            </p>
          )}
          <button
            type="button"
            disabled={!selectedDetailId}
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
