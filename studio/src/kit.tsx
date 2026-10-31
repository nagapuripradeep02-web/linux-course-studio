import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { c, easeOut, font, FPS } from "./theme";

/** Calm dark stage with a soft vignette and a faint technical grid. */
export const Stage: React.FC<{ children?: React.ReactNode; glow?: string }> = ({ children, glow = c.accent }) => (
  <AbsoluteFill style={{ background: c.bg, fontFamily: font.ui, color: c.text }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${c.line}22 1px, transparent 1px), linear-gradient(90deg, ${c.line}22 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 80%)",
      }}
    />
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse 55% 45% at 50% 40%, ${glow}12, transparent 70%)` }}
    />
    {children}
  </AbsoluteFill>
);

/** 0..1 progress of an eased reveal starting at `start` seconds (segment-local). */
export const useReveal = (start: number, dur = 0.6) => {
  const f = useCurrentFrame();
  return easeOut((f / FPS - start) / dur);
};

/** Fade + rise wrapper keyed to a time in seconds. */
export const Reveal: React.FC<{
  at: number;
  dur?: number;
  y?: number;
  x?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, dur = 0.6, y = 18, x = 0, style, children }) => {
  const p = useReveal(at, dur);
  return (
    <div style={{ opacity: p, transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)`, ...style }}>{children}</div>
  );
};

/** Fades everything out over the last `dur` seconds of a sequence of length `total` seconds. */
export const useOutro = (total: number, dur = 0.5) => {
  const f = useCurrentFrame();
  return interpolate(f / FPS, [total - dur, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = c.accent }) => (
  <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color }}>{children}</div>
);

export const Chip: React.FC<{ children: React.ReactNode; color?: string; size?: number; mono?: boolean }> = ({
  children,
  color = c.accent,
  size = 30,
  mono,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.35}px ${size * 0.7}px`,
      borderRadius: size * 0.5,
      background: `${color}1F`,
      border: `2px solid ${color}66`,
      color: c.text,
      fontSize: size,
      fontWeight: 600,
      fontFamily: mono ? font.mono : font.ui,
    }}
  >
    {children}
  </div>
);

// ---------- Line icons (stroke-based, theme coloured) ----------
type IconProps = { size?: number; color?: string; stroke?: number };
const svg = (size: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {children}
  </svg>
);
const S = (color: string, stroke: number) => ({
  stroke: color,
  strokeWidth: stroke,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const Icon = {
  cpu: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="12" y="12" width="24" height="24" rx="3" />
        <rect x="19" y="19" width="10" height="10" rx="1.5" />
        {[17, 24, 31].map((p) => (
          <g key={p}>
            <path d={`M${p} 6v6M${p} 36v6M6 ${p}h6M36 ${p}h6`} />
          </g>
        ))}
      </g>,
    ),
  memory: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="5" y="14" width="38" height="18" rx="2.5" />
        <path d="M11 20v6M17 20v6M23 20v6M29 20v6M35 20v6M9 32v5M15 32v5M21 32v5M27 32v5M33 32v5M39 32v5" />
      </g>,
    ),
  disk: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <ellipse cx="24" cy="13" rx="15" ry="5" />
        <path d="M9 13v22c0 2.8 6.7 5 15 5s15-2.2 15-5V13" />
        <path d="M9 24c0 2.8 6.7 5 15 5s15-2.2 15-5" />
      </g>,
    ),
  network: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="8" y="14" width="32" height="20" rx="2.5" />
        <path d="M14 34v6M20 34v6M28 34v6M34 34v6M16 22h4v6h-4zM28 22h4v6h-4z" />
      </g>,
    ),
  browser: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="5" y="9" width="38" height="30" rx="3" />
        <path d="M5 17h38" />
        <circle cx="10" cy="13" r="0.8" />
        <circle cx="14" cy="13" r="0.8" />
        <circle cx="24" cy="28" r="6" />
        <path d="M18 28h12M24 22c-2 2-2 10 0 12M24 22c2 2 2 10 0 12" />
      </g>,
    ),
  editor: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <path d="M12 5h17l9 9v29H12z" />
        <path d="M29 5v9h9M18 22h14M18 28h14M18 34h9" />
      </g>,
    ),
  terminal: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="5" y="9" width="38" height="30" rx="3" />
        <path d="M12 19l6 5-6 5M22 30h12" />
      </g>,
    ),
  process: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <path d="M8 12h20M8 20h28M8 28h14M8 36h24" />
        <circle cx="38" cy="12" r="3" />
      </g>,
    ),
  folder: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <path d="M5 13a3 3 0 0 1 3-3h10l4 4h18a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" />
        <path d="M5 19h38" />
      </g>,
    ),
  plug: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <path d="M18 5v9M30 5v9M13 14h22v8a11 11 0 0 1-22 0zM24 33v10" />
      </g>,
    ),
  laptop: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="9" y="10" width="30" height="20" rx="2" />
        <path d="M4 36h40l-3-6H7z" />
      </g>,
    ),
  phone: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="14" y="4" width="20" height="40" rx="4" />
        <path d="M21 38h6" />
      </g>,
    ),
  server: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="8" y="6" width="32" height="10" rx="2" />
        <rect x="8" y="19" width="32" height="10" rx="2" />
        <rect x="8" y="32" width="32" height="10" rx="2" />
        <path d="M14 11h2M14 24h2M14 37h2M30 11h4M30 24h4M30 37h4" />
      </g>,
    ),
  cloud: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <path d="M14 36h22a8 8 0 0 0 1-15.9A11 11 0 0 0 15.6 18 9 9 0 0 0 14 36z" />
      </g>,
    ),
  router: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="6" y="26" width="36" height="12" rx="2.5" />
        <path d="M14 26l-4-14M34 26l4-14M13 32h2M19 32h2" />
      </g>,
    ),
  tv: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <rect x="5" y="9" width="38" height="25" rx="2.5" />
        <path d="M17 41h14M24 34v7" />
      </g>,
    ),
  user: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <circle cx="24" cy="16" r="7" />
        <path d="M10 41c1.5-8 7.2-12 14-12s12.5 4 14 12" />
      </g>,
    ),
  pause: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <circle cx="24" cy="24" r="19" />
        <path d="M20 16v16M28 16v16" />
      </g>,
    ),
  check: ({ size = 48, color = c.text, stroke = 2.5 }: IconProps) =>
    svg(
      size,
      <g {...S(color, stroke)}>
        <path d="M10 25l9 9 19-20" />
      </g>,
    ),
};
