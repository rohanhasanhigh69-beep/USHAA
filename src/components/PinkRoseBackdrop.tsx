interface RoseClusterProps {
  className?: string;
  flip?: boolean;
}

function RoseBloom({
  cx,
  cy,
  scale = 1,
  rotation = 0,
  variant = 'blush',
}: {
  cx: number;
  cy: number;
  scale?: number;
  rotation?: number;
  variant?: 'blush' | 'deep';
}) {
  const outer = variant === 'deep' ? '#fb7185' : '#fda4af';
  const mid = variant === 'deep' ? '#f43f5e' : '#fb7185';
  const inner = variant === 'deep' ? '#e11d48' : '#f43f5e';
  const core = variant === 'deep' ? '#be123c' : '#e11d48';

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotation}) scale(${scale})`}>
      {/* Soft outer petals */}
      <ellipse cx="0" cy="-18" rx="16" ry="13" fill={outer} opacity="0.82" />
      <ellipse cx="17" cy="-6" rx="15" ry="12" transform="rotate(68 17 -6)" fill={outer} opacity="0.82" />
      <ellipse cx="11" cy="15" rx="15" ry="12" transform="rotate(140 11 15)" fill={outer} opacity="0.82" />
      <ellipse cx="-11" cy="15" rx="15" ry="12" transform="rotate(-140 -11 15)" fill={outer} opacity="0.82" />
      <ellipse cx="-17" cy="-6" rx="15" ry="12" transform="rotate(-68 -17 -6)" fill={outer} opacity="0.82" />

      {/* Mid petals */}
      <ellipse cx="0" cy="-11" rx="12" ry="10" fill={mid} opacity="0.88" />
      <ellipse cx="11" cy="-2" rx="11" ry="9" transform="rotate(62 11 -2)" fill={mid} opacity="0.88" />
      <ellipse cx="7" cy="10" rx="11" ry="9" transform="rotate(138 7 10)" fill={mid} opacity="0.88" />
      <ellipse cx="-7" cy="10" rx="11" ry="9" transform="rotate(-138 -7 10)" fill={mid} opacity="0.88" />
      <ellipse cx="-11" cy="-2" rx="11" ry="9" transform="rotate(-62 -11 -2)" fill={mid} opacity="0.88" />

      {/* Inner rose cup */}
      <circle cx="0" cy="0" r="10.5" fill={inner} opacity="0.92" />
      <path
        d="M -6 -2 C -6 -7, 6 -7, 6 -1 C 6 5, -4 6, -4 0 C -4 -3, 2 -4, 2 0"
        fill="none"
        stroke="#ffe4e6"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="0" cy="0" r="3.2" fill={core} opacity="0.9" />
    </g>
  );
}

function RoseBud({
  cx,
  cy,
  scale = 1,
  rotation = 0,
}: {
  cx: number;
  cy: number;
  scale?: number;
  rotation?: number;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotation}) scale(${scale})`}>
      <path
        d="M -7 4 C -10 -7, -3 -16, 0 -17 C 3 -16, 10 -7, 7 4 Z"
        fill="#fda4af"
        opacity="0.88"
      />
      <path
        d="M -5 4 C -6 -5, -1 -12, 0 -13 C 2 -12, 6 -5, 5 4 Z"
        fill="#f43f5e"
        opacity="0.85"
      />
      <path
        d="M -7 3 Q 0 9 7 3 Q 0 12 -7 3 Z"
        fill="#84a98c"
        opacity="0.78"
      />
    </g>
  );
}

function RoseLeaf({
  cx,
  cy,
  rotation = 0,
  scale = 1,
}: {
  cx: number;
  cy: number;
  rotation?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotation}) scale(${scale})`}>
      <path
        d="M 0 -22 C 11 -12, 11 8, 0 20 C -11 8, -11 -12, 0 -22 Z"
        fill="#95b89c"
        opacity="0.62"
      />
      <path
        d="M 0 -18 L 0 17"
        stroke="#74987c"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </g>
  );
}

function CornerRoseCluster({ className = '', flip = false }: RoseClusterProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      className={className}
      style={flip ? { transform: 'scale(-1, -1)' } : undefined}
    >
      {/* Delicate stems */}
      <path
        d="M 28 190 Q 64 118 118 82"
        stroke="#84a98c"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.48"
      />
      <path
        d="M 48 164 Q 108 150 162 126"
        stroke="#84a98c"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Leaves */}
      <RoseLeaf cx={60} cy={132} rotation={-48} scale={0.95} />
      <RoseLeaf cx={112} cy={154} rotation={64} scale={0.9} />
      <RoseLeaf cx={142} cy={104} rotation={24} scale={0.85} />
      <RoseLeaf cx={82} cy={66} rotation={-18} scale={0.82} />
      <RoseLeaf cx={42} cy={168} rotation={-76} scale={0.78} />

      {/* Blooms & buds */}
      <RoseBloom cx={82} cy={96} scale={1.18} rotation={-12} variant="blush" />
      <RoseBloom cx={136} cy={138} scale={0.9} rotation={22} variant="deep" />
      <RoseBloom cx={54} cy={148} scale={0.82} rotation={-28} variant="deep" />
      <RoseBud cx={158} cy={84} scale={0.92} rotation={38} />
      <RoseBud cx={104} cy={46} scale={0.82} rotation={12} />
      <RoseBud cx={182} cy={132} scale={0.76} rotation={72} />
    </svg>
  );
}

export function SmallPinkRoseIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <RoseLeaf cx={14} cy={30} rotation={-48} scale={0.45} />
      <RoseLeaf cx={34} cy={30} rotation={48} scale={0.45} />
      <RoseBloom cx={24} cy={22} scale={0.56} variant="deep" />
    </svg>
  );
}

export default function PinkRoseBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Top-left botanical pink rose cluster */}
      <div className="animate-gentle-float absolute top-9 -left-7 w-28 opacity-45 sm:-top-5 sm:-left-5 sm:w-56 sm:opacity-75 lg:w-72 lg:opacity-80">
        <CornerRoseCluster className="h-auto w-full" />
      </div>

      {/* Bottom-right botanical pink rose cluster */}
      <div
        className="animate-gentle-float absolute -right-7 bottom-9 w-28 opacity-45 sm:-right-5 sm:-bottom-5 sm:w-56 sm:opacity-75 lg:w-72 lg:opacity-80"
        style={{ animationDelay: '-2.2s' }}
      >
        <CornerRoseCluster className="h-auto w-full" flip />
      </div>

      {/* Subtle single rosebud accents in opposite outer margins on larger screens */}
      <svg
        viewBox="0 0 96 96"
        fill="none"
        className="animate-heart-bob absolute top-20 right-8 hidden h-20 w-20 opacity-60 md:block lg:right-14 lg:h-24 lg:w-24"
      >
        <RoseLeaf cx={38} cy={56} rotation={-36} scale={0.62} />
        <RoseLeaf cx={60} cy={54} rotation={42} scale={0.58} />
        <RoseBloom cx={48} cy={44} scale={0.72} rotation={15} variant="blush" />
        <RoseBud cx={68} cy={30} scale={0.65} rotation={35} />
      </svg>

      <svg
        viewBox="0 0 96 96"
        fill="none"
        className="animate-heart-bob absolute bottom-16 left-8 hidden h-20 w-20 opacity-60 md:block lg:left-14 lg:h-24 lg:w-24"
        style={{ animationDelay: '-1.5s' }}
      >
        <RoseLeaf cx={36} cy={56} rotation={-40} scale={0.6} />
        <RoseLeaf cx={58} cy={56} rotation={38} scale={0.6} />
        <RoseBloom cx={48} cy={46} scale={0.7} rotation={-18} variant="deep" />
        <RoseBud cx={28} cy={32} scale={0.62} rotation={-32} />
      </svg>
    </div>
  );
}
