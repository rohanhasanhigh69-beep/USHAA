export interface RectBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface DodgePositionInput {
  origin: { left: number; top: number };
  currentRect: RectBox;
  viewport: { width: number; height: number };
  protectedRects: RectBox[];
  cursor?: { x: number; y: number } | null;
  random?: () => number;
}

export interface DodgeOffset {
  x: number;
  y: number;
}

export function computeDodgeOffset({
  origin,
  currentRect,
  viewport,
  protectedRects,
  cursor = null,
  random = Math.random,
}: DodgePositionInput): DodgeOffset {
  const estWidth = Math.max(currentRect.width, 160);
  const estHeight = Math.max(currentRect.height, 48);

  const minLeft = 16;
  const maxLeft = Math.max(minLeft, viewport.width - estWidth - 16);
  const minTop = 64;
  const maxTop = Math.max(minTop, viewport.height - estHeight - 20);

  const hitsProtected = (left: number, top: number) => {
    const buffer = 14;
    const right = left + estWidth;
    const bottom = top + estHeight;
    return protectedRects.some(
      (r) =>
        !(
          right < r.left - buffer ||
          left > r.right + buffer ||
          bottom < r.top - buffer ||
          top > r.bottom + buffer
        )
    );
  };

  const hitsCursor = (left: number, top: number) => {
    if (!cursor) return false;
    const pad = 36;
    return (
      cursor.x >= left - pad &&
      cursor.x <= left + estWidth + pad &&
      cursor.y >= top - pad &&
      cursor.y <= top + estHeight + pad
    );
  };

  let chosenLeft = minLeft;
  let chosenTop = minTop;
  let bestScore = -1;

  for (let i = 0; i < 64; i++) {
    const candLeft = minLeft + random() * Math.max(1, maxLeft - minLeft);
    const candTop = minTop + random() * Math.max(1, maxTop - minTop);

    if (hitsProtected(candLeft, candTop)) continue;

    const distFromBtn = Math.hypot(
      candLeft - currentRect.left,
      candTop - currentRect.top
    );
    const avoidsCursor = !hitsCursor(candLeft, candTop);
    const score = distFromBtn + (avoidsCursor ? 1000 : 0);

    if (avoidsCursor && distFromBtn >= 110) {
      chosenLeft = candLeft;
      chosenTop = candTop;
      bestScore = score;
      break;
    }

    if (score > bestScore) {
      bestScore = score;
      chosenLeft = candLeft;
      chosenTop = candTop;
    }
  }

  if (bestScore < 0) {
    const firstProtected = protectedRects[0];
    chosenLeft = minLeft + random() * Math.max(1, maxLeft - minLeft);
    chosenTop =
      firstProtected && firstProtected.top > viewport.height * 0.5
        ? minTop
        : maxTop;
  }

  return {
    x: Math.round(chosenLeft - origin.left),
    y: Math.round(chosenTop - origin.top),
  };
}

export function clampDodgeOffset(
  rect: Pick<RectBox, 'left' | 'top' | 'right' | 'bottom'>,
  currentOffset: DodgeOffset,
  viewport: { width: number; height: number }
): DodgeOffset | null {
  const pad = 16;
  let dx = 0;
  let dy = 0;

  if (rect.left < pad) dx = pad - rect.left;
  if (rect.right > viewport.width - pad) {
    dx = viewport.width - pad - rect.right;
  }
  if (rect.top < 64) dy = 64 - rect.top;
  if (rect.bottom > viewport.height - pad) {
    dy = viewport.height - pad - rect.bottom;
  }

  if (dx === 0 && dy === 0) return null;

  return {
    x: Math.round(currentOffset.x + dx),
    y: Math.round(currentOffset.y + dy),
  };
}
