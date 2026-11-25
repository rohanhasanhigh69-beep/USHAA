import test from 'node:test';
import assert from 'node:assert/strict';
import { clampDodgeOffset, computeDodgeOffset, RectBox } from './dodgeButton';

function makeRect(left: number, top: number, width: number, height: number): RectBox {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
}

test('computeDodgeOffset moves button within viewport and away from cursor and protected rects', () => {
  const origin = { left: 740, top: 500 };
  const currentRect = makeRect(740, 500, 140, 48);
  const yesRect = makeRect(560, 500, 160, 48);
  const headingRect = makeRect(420, 260, 600, 100);
  const cursor = { x: 810, y: 524 };

  let seed = 0.1;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const offset = computeDodgeOffset({
    origin,
    currentRect,
    viewport: { width: 1440, height: 900 },
    protectedRects: [yesRect, headingRect],
    cursor,
    random: pseudoRandom,
  });

  const targetLeft = origin.left + offset.x;
  const targetTop = origin.top + offset.y;

  assert.ok(targetLeft >= 16, 'stays inside left padding');
  assert.ok(targetLeft + 160 <= 1440 - 16, 'stays inside right padding');
  assert.ok(targetTop >= 64, 'stays below header');
  assert.ok(targetTop + 48 <= 900 - 20, 'stays above bottom padding');

  const movedDist = Math.hypot(targetLeft - currentRect.left, targetTop - currentRect.top);
  assert.ok(movedDist >= 110, `expected move distance >= 110, got ${movedDist}`);

  const cursorInside =
    cursor.x >= targetLeft &&
    cursor.x <= targetLeft + 160 &&
    cursor.y >= targetTop &&
    cursor.y <= targetTop + 48;
  assert.equal(cursorInside, false, 'target position should not sit under cursor');
});

test('clampDodgeOffset returns null when button is safely inside viewport', () => {
  const result = clampDodgeOffset(
    { left: 100, top: 120, right: 260, bottom: 168 },
    { x: 50, y: -20 },
    { width: 1440, height: 900 }
  );
  assert.equal(result, null);
});

test('clampDodgeOffset pulls button back inside viewport on resize', () => {
  const result = clampDodgeOffset(
    { left: 700, top: 40, right: 860, bottom: 88 },
    { x: 200, y: -100 },
    { width: 800, height: 600 }
  );
  assert.deepEqual(result, { x: 124, y: -76 });
});
