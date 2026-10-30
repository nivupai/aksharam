/** Decorative, theme-aware vector motifs. They contain no text or external assets. */
export function Pookalam({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="var(--gold-muted)"
        strokeWidth="1"
      />
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse
          key={`outer-${i}`}
          cx="50"
          cy="24"
          rx="6.5"
          ry="16"
          transform={`rotate(${i * 22.5} 50 50)`}
          fill={i % 2 ? "var(--gold-soft)" : "var(--gold-light)"}
          stroke="var(--gold)"
          strokeWidth=".75"
        />
      ))}
      <circle
        cx="50"
        cy="50"
        r="23"
        fill="var(--paper)"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={`inner-${i}`}
          cx="50"
          cy="38"
          rx="5"
          ry="10"
          transform={`rotate(${i * 45} 50 50)`}
          fill="var(--burgundy)"
          stroke="var(--gold)"
          strokeWidth=".6"
        />
      ))}
      <circle cx="50" cy="50" r="8" fill="var(--gold)" />
      <circle cx="50" cy="50" r="3" fill="var(--paper)" />
    </svg>
  );
}

function Palm({
  x,
  y,
  scale = 1,
  lean = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  lean?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale * lean} ${scale})`}
      fill="none"
      stroke="var(--landscape-ink)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 79 Q-2 39 12 4 M5 79 Q2 41 12 4" strokeWidth="2.4" />
      <path
        d="M12 4 Q-5 -12 -34 1 Q-7 -4 12 4 M12 4 Q-16 -3 -36 24 Q-11 8 12 4 M12 4 Q-5 10 -9 39 Q1 16 12 4 M12 4 Q17 -16 39 -20 Q23 -7 12 4 M12 4 Q40 -13 62 5 Q37 -1 12 4 M12 4 Q42 0 55 30 Q31 12 12 4 M12 4 Q27 16 26 43 Q20 22 12 4"
        strokeWidth="1.7"
      />
      <path
        d="M-27 7 l7 3 m-4 4 l7 2 m-22 -13 l7 2 m57 -15 l1 6 m9 -3 l-1 6 m9 -2 l-1 6 M38 12 l-3 5 m9 2 l-3 5 M6 29 l4 1 M2 44 l4 1 M0 58 l5 1"
        strokeWidth="1"
      />
      <circle cx="10" cy="8" r="3" fill="var(--landscape-ink)" stroke="none" />
    </g>
  );
}

export function Backwaters({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 560 170"
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 118 Q75 98 141 111 T268 111 T410 113 T560 104 V170 H0Z"
        fill="var(--water)"
      />
      <path
        d="M0 115 Q75 98 141 111 T268 111 T410 113 T560 104"
        fill="none"
        stroke="var(--gold-muted)"
        strokeWidth="1"
      />
      <g opacity=".55">
        <Palm x={70} y={34} scale={0.84} />
        <Palm x={125} y={59} scale={0.57} lean={-1} />
        <Palm x={475} y={20} scale={1.07} lean={-1} />
        <Palm x={510} y={51} scale={0.75} />
      </g>
      <g
        fill="none"
        stroke="var(--landscape-ink)"
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        <path d="M2 117 q35 -8 66 -2 m28 2 q36 -8 62 -2 m260 -4 q33 -4 62 1 m24 -1 56 -6" />
        <path
          d="M207 106 Q220 66 273 66 Q329 66 346 106 Z"
          fill="var(--roof)"
          stroke="var(--gold)"
          strokeWidth="1.3"
        />
        <path
          d="M217 105 Q229 73 273 73 Q315 73 334 105 M231 104 Q240 78 273 78 Q304 78 319 104"
          stroke="var(--gold-muted)"
        />
        <path
          d="M243 72 238 105 M259 68 256 105 M275 67 V105 M291 69 294 105 M307 74 313 105 M321 82 329 105"
          stroke="var(--gold-muted)"
        />
        <path
          d="M180 104 Q202 119 233 120 H333 Q362 119 381 98 Q371 129 333 133 H229 Q196 129 180 104Z"
          fill="var(--burgundy)"
          stroke="var(--gold)"
          strokeWidth="1.4"
        />
        <path d="M195 114 Q276 128 363 114" stroke="var(--gold-light)" />
        <path d="M351 96 V111 M355 90 362 88" stroke="var(--landscape-ink)" />
      </g>
      <g
        fill="none"
        stroke="var(--gold-muted)"
        strokeLinecap="round"
        strokeWidth="1"
      >
        <path d="M35 137 H124 M153 147 H246 M273 144 H393 M423 135 H526 M62 154 H172 M350 159 H469 M8 165 H57" />
        <path d="M168 138 q97 10 211 0 M222 151 q51 5 93 0" />
      </g>
      <g
        fill="none"
        stroke="var(--landscape-ink)"
        strokeWidth="1.1"
        opacity=".65"
      >
        <path d="M225 39 q7 -7 14 0 q7 -7 14 0 M360 48 q5 -5 10 0 q5 -5 10 0" />
      </g>
    </svg>
  );
}
