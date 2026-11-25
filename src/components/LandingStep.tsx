import { MouseEvent, useEffect, useRef, useState } from 'react';
import { clampDodgeOffset, computeDodgeOffset } from '../utils/dodgeButton';
import { SmallPinkRoseIcon } from './PinkRoseBackdrop';

const NO_MESSAGES = [
  'No 🙈',
  'Are you sure? 🙈',
  'Really sure? 🥺',
  'Nice try! 💕',
  'Still no? 🌸',
  'Think again! 💗',
  'Just click Yes! ✨',
];

interface LandingStepProps {
  onYesClick: () => void;
  onBurst: () => void;
}

export default function LandingStep({ onYesClick, onBurst }: LandingStepProps) {
  const [noCount, setNoCount] = useState(0);
  const [noOffset, setNoOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const cardRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const yesBtnRef = useRef<HTMLButtonElement | null>(null);
  const noAnchorRef = useRef<HTMLDivElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastMoveAtRef = useRef<number>(0);

  useEffect(() => {
    if (noCount === 0) return;

    const handleResize = () => {
      const noEl = noBtnRef.current;
      if (!noEl) return;
      const rect = noEl.getBoundingClientRect();
      setNoOffset((prev) => {
        const clamped = clampDodgeOffset(rect, prev, {
          width: window.innerWidth,
          height: window.innerHeight,
        });
        return clamped ?? prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [noCount]);

  const moveNoButton = (cursor?: { x: number; y: number } | null) => {
    const now = performance.now();
    lastMoveAtRef.current = now;

    const noEl = noBtnRef.current;
    if (!noEl) {
      setNoCount((c) => c + 1);
      return;
    }

    const noRect = noEl.getBoundingClientRect();
    const anchorRect = noAnchorRef.current?.getBoundingClientRect();
    const origin = anchorRect
      ? { left: anchorRect.left, top: anchorRect.top }
      : { left: noRect.left - noOffset.x, top: noRect.top - noOffset.y };

    const protectedRects = [
      yesBtnRef.current?.getBoundingClientRect(),
      headingRef.current?.getBoundingClientRect(),
    ].filter((r): r is DOMRect => Boolean(r));

    const nextOffset = computeDodgeOffset({
      origin,
      currentRect: noRect,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      protectedRects,
      cursor,
    });

    setNoOffset(nextOffset);
    setNoCount((c) => c + 1);
  };

  const handleNoMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    if (performance.now() - lastMoveAtRef.current < 250) return;
    moveNoButton({ x: e.clientX, y: e.clientY });
  };

  const handleNoMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (performance.now() - lastMoveAtRef.current < 250) return;
    moveNoButton({ x: e.clientX, y: e.clientY });
  };

  const handleNoClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail !== 0 && performance.now() - lastMoveAtRef.current < 250) {
      return;
    }
    const cursor =
      e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : null;
    moveNoButton(cursor);
  };

  const handleYes = () => {
    onBurst();
    onYesClick();
  };

  const noLabel = NO_MESSAGES[Math.min(noCount, NO_MESSAGES.length - 1)];
  const yesScale = Math.min(1 + noCount * 0.05, 1.2);

  return (
    <section
      aria-label="Date invitation for Usha"
      className="flex max-h-full w-full items-center justify-center"
    >
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-xl rounded-[1.75rem] border border-rose-200/80 bg-white/88 px-6 py-8 text-center shadow-[0_24px_60px_-15px_rgba(190,24,93,0.16)] backdrop-blur-md sm:rounded-[2rem] sm:px-10 sm:py-12"
      >
        <div className="mb-2 flex justify-center">
          <SmallPinkRoseIcon className="h-9 w-9 sm:h-11 sm:w-11" />
        </div>

        <p className="text-xs font-medium text-rose-700 sm:text-sm">
          For Usha <span aria-hidden="true">·</span> A Special Invitation
        </p>

        <h1
          ref={headingRef}
          className="mt-4 font-display text-3xl font-semibold leading-[1.15] tracking-tight text-[#3d0e1e] sm:mt-5 sm:text-5xl"
          style={{ textWrap: 'balance' }}
        >
          USHA, Will You Go on a Date With Me? 💗
        </h1>

        <p className="mx-auto mt-3.5 max-w-md text-sm leading-relaxed text-[#6b283f] sm:mt-4 sm:text-base">
          I put together a little pink adventure just for you. Say yes and let&apos;s plan our favorite day together.
        </p>

        <div className="mt-6 flex min-h-14 flex-wrap items-center justify-center gap-4 sm:mt-8">
          <button
            ref={yesBtnRef}
            type="button"
            onClick={handleYes}
            style={{ transform: `scale(${yesScale})` }}
            className="inline-flex min-h-12 min-w-[144px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-3 text-base font-semibold text-white shadow-[0_12px_28px_-6px_rgba(225,29,72,0.48)] transition-[transform,filter] duration-200 ease-out hover:brightness-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap shrink-0"
          >
            Yes! 💖
          </button>

          <div ref={noAnchorRef} className="inline-flex shrink-0">
            <button
              ref={noBtnRef}
              type="button"
              onMouseEnter={handleNoMouseEnter}
              onMouseMove={handleNoMouseMove}
              onClick={handleNoClick}
              style={{
                transform: `translate3d(${noOffset.x}px, ${noOffset.y}px, 0)`,
              }}
              className={`inline-flex min-h-12 min-w-[128px] items-center justify-center rounded-2xl border border-rose-200 bg-white/95 px-7 py-3 text-base font-semibold text-[#5c1d33] shadow-sm transition-[transform,background-color,border-color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 will-change-transform whitespace-nowrap shrink-0 ${
                noCount > 0 ? 'relative z-40' : 'relative z-10'
              }`}
            >
              {noLabel}
            </button>
          </div>
        </div>

        <p
          aria-live="polite"
          className="mt-5 min-h-5 text-xs font-medium text-[#7c354d] sm:mt-6 sm:text-sm"
        >
          {noCount === 0
            ? 'Move or tap around the background to scatter floating rose particles.'
            : noCount === 1
            ? 'Oops, that button seems shy — try the pink Yes button!'
            : `Dodged ${noCount} times! Looks like fate is voting Yes.`}
        </p>
      </div>
    </section>
  );
}
