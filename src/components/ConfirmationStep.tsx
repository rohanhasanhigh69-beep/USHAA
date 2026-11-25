import { useState } from 'react';
import {
  Calendar,
  Check,
  Copy,
  Edit3,
  RotateCcw,
  Sparkles,
  Heart,
} from 'lucide-react';
import {
  ACTIVITY_OPTIONS,
  CUSTOMIZATION_BY_ACTIVITY,
  OUTFIT_OPTIONS,
} from '../data/dateOptions';
import { DatePlanState, FlowStep } from '../types/datePlan';
import { formatIsoDatePretty } from './DateStep';
import StepHeader from './StepHeader';

interface ConfirmationStepProps {
  plan: DatePlanState;
  onConfirm: () => void;
  onEditStep: (step: FlowStep) => void;
  onBack: () => void;
  onRestart: () => void;
  onBurst: () => void;
}

export default function ConfirmationStep({
  plan,
  onConfirm,
  onEditStep,
  onBack,
  onRestart,
  onBurst,
}: ConfirmationStepProps) {
  const [copied, setCopied] = useState(false);


  const activity = ACTIVITY_OPTIONS.find((a) => a.id === plan.selectedActivityId);
  const detailChoices = plan.selectedActivityId
    ? CUSTOMIZATION_BY_ACTIVITY[plan.selectedActivityId] ?? []
    : [];
  const detailChoice = detailChoices.find((d) => d.id === plan.selectedDetailId);
  const outfit =
    !plan.outfitSkipped && plan.selectedOutfitId
      ? OUTFIT_OPTIONS.find((o) => o.id === plan.selectedOutfitId)
      : null;

  const formattedDate = formatIsoDatePretty(plan.selectedDate);
  const detailDisplay = detailChoice
    ? plan.revealedDetailText
      ? `${detailChoice.emoji} ${detailChoice.title} (${plan.revealedDetailText})`
      : `${detailChoice.emoji} ${detailChoice.title}`
    : 'A sweet surprise';

  const handleConfirmClick = () => {
    onConfirm();
    onBurst();
  };

  const handleCopySummary = async () => {
    const lines = [
      'Our Date Plan for USHA',
      `Date: ${formattedDate || 'To be decided'}`,
      `Activity: ${activity ? `${activity.emoji} ${activity.title}` : 'Date'}`,
      `Preference: ${detailDisplay}`,
      outfit ? `Outfit: ${outfit.emoji} ${outfit.title}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      aria-label="Date confirmation summary"
      className="flex max-h-full w-full items-center justify-center"
    >
      <div className="relative z-10 flex max-h-full w-full max-w-2xl flex-col rounded-[1.5rem] border border-rose-200/80 bg-white/92 p-3.5 shadow-[0_24px_60px_-15px_rgba(190,24,93,0.18)] backdrop-blur-md sm:rounded-[2rem] sm:p-6">
        <StepHeader currentStep="confirmation" onBack={onBack} />

        {/* Video & Headline */}
        <div className="flex shrink-0 flex-col items-center gap-2 text-center">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-rose-200 bg-rose-50 shadow-lg">
            <video
              src="/assets/usha_official.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h1
              className="font-display text-xl font-semibold tracking-tight text-[#3d0e1e] sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              It&apos;s Official, USHA! 💖
            </h1>
            <p className="mt-0.5 text-xs leading-snug text-[#6b283f] sm:mx-auto sm:mt-1 sm:max-w-md sm:text-sm">
              Something special is waiting for us. Let&apos;s make this day unforgettable. 🌷
            </p>
          </div>
        </div>

        {/* Compact 2x2 Summary Card */}
        <div className="mt-2.5 min-h-0 shrink overflow-y-auto rounded-2xl border border-rose-200/80 bg-gradient-to-b from-rose-50/55 to-white p-2.5 sm:mt-4 sm:p-3.5">
          <div className="mb-2 flex items-center justify-between border-b border-rose-100 pb-1.5 text-xs">
            <span className="font-semibold text-[#3d0e1e]">
              Guest of Honor: <span className="font-display">USHA 💗</span>
            </span>
            <span className="font-medium text-rose-700">VIP Invite</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-rose-100/80 bg-white/80 p-2">
              <div className="flex items-center justify-between gap-1">
                <p className="text-[11px] font-medium text-[#8c435b]">Date</p>
                <button
                  type="button"
                  onClick={() => onEditStep('date')}
                  aria-label="Edit date"
                  className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100/70"
                >
                  <Edit3 className="h-3 w-3" aria-hidden="true" />
                  Edit
                </button>
              </div>
              <p className="mt-0.5 truncate text-xs font-semibold text-[#3d0e1e] sm:text-sm">
                {formattedDate || 'Not selected'}
              </p>
            </div>

            <div className="rounded-xl border border-rose-100/80 bg-white/80 p-2">
              <div className="flex items-center justify-between gap-1">
                <p className="text-[11px] font-medium text-[#8c435b]">Adventure</p>
                <button
                  type="button"
                  onClick={() => onEditStep('activity')}
                  aria-label="Edit activity"
                  className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100/70"
                >
                  <Edit3 className="h-3 w-3" aria-hidden="true" />
                  Edit
                </button>
              </div>
              <p className="mt-0.5 truncate text-xs font-semibold text-[#3d0e1e] sm:text-sm">
                {activity ? `${activity.emoji} ${activity.title}` : 'Not selected'}
              </p>
            </div>

            <div className="rounded-xl border border-rose-100/80 bg-white/80 p-2">
              <div className="flex items-center justify-between gap-1">
                <p className="truncate text-[11px] font-medium text-[#8c435b]">
                  {activity?.id === 'dinner' ? 'Food Mood' : 'Preference'}
                </p>
                <button
                  type="button"
                  onClick={() => onEditStep('customize')}
                  aria-label="Edit preference"
                  className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100/70"
                >
                  <Edit3 className="h-3 w-3" aria-hidden="true" />
                  Edit
                </button>
              </div>
              <p className="mt-0.5 truncate text-xs font-semibold text-[#3d0e1e] sm:text-sm">
                {detailDisplay}
              </p>
            </div>

            <div className="rounded-xl border border-rose-100/80 bg-white/80 p-2">
              <div className="flex items-center justify-between gap-1">
                <p className="text-[11px] font-medium text-[#8c435b]">Outfit Vibe</p>
                <button
                  type="button"
                  onClick={() => onEditStep('outfit')}
                  aria-label="Edit outfit"
                  className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100/70"
                >
                  <Edit3 className="h-3 w-3" aria-hidden="true" />
                  Edit
                </button>
              </div>
              <p className="mt-0.5 truncate text-xs font-semibold text-[#3d0e1e] sm:text-sm">
                {outfit ? `${outfit.emoji} ${outfit.title}` : 'Lovely surprise ✨'}
              </p>
            </div>
          </div>
        </div>

        {/* Confirmed Celebration Banner */}
        {plan.confirmed && (
          <div
            role="status"
            aria-live="polite"
            className="mt-2.5 shrink-0 rounded-xl border border-rose-300 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 p-2.5 text-center sm:mt-3.5 sm:rounded-2xl sm:p-3.5"
          >
            <p className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-[#3d0e1e] sm:text-lg">
              <Sparkles className="h-4 w-4 text-rose-600 shrink-0" aria-hidden="true" />
              Counting down the days until I see you, Usha!
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-1 text-[11px] font-semibold text-[#5c1d33] transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:min-h-9 sm:text-xs whitespace-nowrap shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-rose-600" aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" aria-hidden="true" />
                    Copy Plan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onBurst}
                className="inline-flex min-h-8 items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:min-h-9 sm:text-xs whitespace-nowrap shrink-0"
              >
                <Heart className="h-3 w-3 fill-current" aria-hidden="true" />
                More Hearts
              </button>
            </div>
          </div>
        )}

        {/* Primary & Secondary Footer Actions */}
        <div className="mt-2.5 flex shrink-0 flex-col items-center gap-1.5 sm:mt-4 sm:gap-2">
          {!plan.confirmed && (
            <button
              type="button"
              onClick={handleConfirmClick}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-6px_rgba(225,29,72,0.48)] transition-all duration-150 hover:brightness-105 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:min-h-11 sm:w-auto sm:min-w-[240px] sm:rounded-2xl sm:text-base whitespace-nowrap shrink-0"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Confirm Our Date 💕
            </button>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onEditStep('date')}
              className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[#6b283f] transition-colors hover:bg-rose-50 hover:text-[#3d0e1e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:text-sm whitespace-nowrap shrink-0"
            >
              <Edit3 className="h-3 w-3" aria-hidden="true" />
              Edit Selections
            </button>

            <button
              type="button"
              onClick={onRestart}
              className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[#6b283f] transition-colors hover:bg-rose-50 hover:text-[#3d0e1e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:text-sm whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
