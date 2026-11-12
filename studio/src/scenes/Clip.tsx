import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { clipsJson, LESSON } from "../current";
import { c, easeInOut, easeOut, font, FPS, H, W } from "../theme";

type ClipMeta = { duration: number; events: Record<string, number> };
const clips = clipsJson as unknown as Record<string, ClipMeta>;

export type Rect = [number, number, number, number];

/** Beat: at segment time `at`, show the clip from event `event` (minus `lead`) and play forward. */
export type Beat = { at: number; event: string; lead?: number; rate?: number };
export type Cam = { at: number; rect: Rect | null; dur?: number };
export type Highlight = {
  from: number;
  to: number;
  rect: Rect;
  label?: string;
  side?: "top" | "bottom" | "left" | "right";
  color?: string;
  /** nudge the label down by this many source pixels (e.g. one terminal row = ~26) to clear text under it */
  dy?: number;
};
export type LowerThird = { from: number; to: number; cmd: string; meaning: string };

/** Map segment time -> source time using beats (play forward, then hold until the next beat). */
export function srcTime(clip: string, beats: Beat[], t: number): number {
  const meta = clips[clip];
  if (!meta) throw new Error(`No clip metadata for ${clip}`);
  const ev = (b: Beat) => {
    const e = meta.events[b.event];
    if (e === undefined) throw new Error(`Event ${b.event} missing in ${clip}`);
    return Math.max(0, e - (b.lead ?? 0.25));
  };
  let i = 0;
  while (i + 1 < beats.length && beats[i + 1].at <= t) i++;
  const b = beats[i];
  const start = ev(b);
  const limit = i + 1 < beats.length ? ev(beats[i + 1]) : meta.duration - 1 / FPS;
  const s = start + Math.max(0, t - b.at) * (b.rate ?? 1);
  return Math.min(s, Math.max(start, limit));
}

const camState = (r: Rect | null) => {
  if (!r) return { s: 1, x: 0, y: 0 };
  const [x, y, w, h] = r;
  const s = Math.min(W / w, H / h);
  const cx = x + w / 2;
  const cy = y + h / 2;
  // keep the frame covered: clamp translation so no empty edges show
  let tx = W / 2 - cx * s;
  let ty = H / 2 - cy * s;
  tx = Math.min(0, Math.max(W - W * s, tx));
  ty = Math.min(0, Math.max(H - H * s, ty));
  return { s, x: tx, y: ty };
};

function camAt(cams: Cam[], t: number) {
  let prev = camState(null);
  let cur = prev;
  for (const k of cams) {
    if (t < k.at) break;
    const target = camState(k.rect);
    const p = easeInOut((t - k.at) / (k.dur ?? 1.1));
    cur = {
      s: prev.s + (target.s - prev.s) * p,
      x: prev.x + (target.x - prev.x) * p,
      y: prev.y + (target.y - prev.y) * p,
    };
    prev = p >= 1 ? target : cur;
  }
  return cur;
}

export const ClipScene: React.FC<{
  clip: string;
  beats: Beat[];
  cams?: Cam[];
  highlights?: Highlight[];
  lowerThirds?: LowerThird[];
  children?: React.ReactNode;
}> = ({ clip, beats, cams = [], highlights = [], lowerThirds = [], children }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const st = srcTime(clip, beats, t);
  const cam = camAt(cams, t);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`,
        }}
      >
        <Freeze frame={Math.round(st * FPS)}>
          <OffthreadVideo src={staticFile(`${LESSON}/clips/${clip}.mp4`)} muted style={{ width: W, height: H }} />
        </Freeze>
        {highlights.map((h, i) => (
          <HighlightBox key={i} h={h} t={t} scale={cam.s} />
        ))}
      </AbsoluteFill>
      {lowerThirds.map((l, i) => (
        <CommandLowerThird key={i} l={l} t={t} />
      ))}
      {children}
    </AbsoluteFill>
  );
};

const HighlightBox: React.FC<{ h: Highlight; t: number; scale: number }> = ({ h, t, scale }) => {
  const pin = easeOut((t - h.from) / 0.35);
  const pout = 1 - easeOut((t - (h.to - 0.3)) / 0.3);
  const p = Math.min(pin, pout);
  if (p <= 0) return null;
  const [x, y, w, hh] = h.rect;
  const col = h.color ?? c.accent;
  const pad = 6 / scale;
  const side = h.side ?? "bottom";
  const labelStyle: React.CSSProperties = {
    position: "absolute",
    whiteSpace: "nowrap",
    fontFamily: font.ui,
    fontWeight: 700,
    fontSize: 26 / scale,
    padding: `${8 / scale}px ${16 / scale}px`,
    borderRadius: 10 / scale,
    background: col,
    color: "#111",
    boxShadow: `0 ${6 / scale}px ${20 / scale}px rgba(0,0,0,0.4)`,
  };
  const gap = 12 / scale;
  if (side === "bottom") Object.assign(labelStyle, { top: hh + pad * 2 + gap, left: 0 });
  if (side === "top") Object.assign(labelStyle, { bottom: hh + pad * 2 + gap, left: 0 });
  if (side === "right") Object.assign(labelStyle, { left: w + pad * 2 + gap, top: 0 });
  if (side === "left") Object.assign(labelStyle, { right: w + pad * 2 + gap, top: 0 });
  if (h.dy) labelStyle.marginTop = h.dy;
  return (
    <div
      style={{
        position: "absolute",
        left: x - pad,
        top: y - pad,
        width: w + pad * 2,
        height: hh + pad * 2,
        opacity: p,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `${3.5 / scale}px solid ${col}`,
          borderRadius: 8 / scale,
          background: `${col}1A`,
          boxShadow: `0 0 ${18 / scale}px ${col}55`,
          transform: `scale(${1.04 - 0.04 * pin})`,
        }}
      />
      {h.label && <div style={labelStyle}>{h.label}</div>}
    </div>
  );
};

/** Bottom-left card: the command and what it means in plain English. */
const CommandLowerThird: React.FC<{ l: LowerThird; t: number }> = ({ l, t }) => {
  const pin = easeOut((t - l.from) / 0.45);
  const pout = 1 - easeOut((t - (l.to - 0.35)) / 0.35);
  const p = Math.min(pin, pout);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        bottom: 84,
        opacity: p,
        transform: `translateX(${(1 - pin) * -30}px)`,
        display: "flex",
        alignItems: "stretch",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        border: `1px solid ${c.line}`,
      }}
    >
      <div style={{ width: 10, background: c.accent }} />
      <div style={{ background: "rgba(12,17,31,0.94)", padding: "20px 34px 22px 28px" }}>
        <div style={{ fontFamily: font.mono, fontSize: 40, fontWeight: 700, color: c.text }}>
          <span style={{ color: c.green }}>$ </span>
          {l.cmd}
        </div>
        <div style={{ fontFamily: font.ui, fontSize: 27, color: c.muted, marginTop: 6 }}>{l.meaning}</div>
      </div>
    </div>
  );
};

/** Glass card used for on-footage questions and notes. */
export const NoteCard: React.FC<{
  from: number;
  to?: number;
  x: number;
  y: number;
  w?: number;
  children: React.ReactNode;
  accent?: string;
}> = ({ from, to = 1e9, x, y, w = 620, children, accent = c.accent }) => {
  const t = useCurrentFrame() / FPS;
  const pin = easeOut((t - from) / 0.5);
  const pout = 1 - easeOut((t - (to - 0.4)) / 0.4);
  const p = Math.min(pin, pout);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity: p,
        transform: `translateY(${(1 - pin) * 16}px)`,
        background: "rgba(12,17,31,0.92)",
        border: `1px solid ${c.line}`,
        borderLeft: `8px solid ${accent}`,
        borderRadius: 18,
        padding: "24px 30px",
        fontFamily: font.ui,
        color: c.text,
        fontSize: 34,
        fontWeight: 600,
        lineHeight: 1.3,
        boxShadow: "0 18px 50px rgba(0,0,0,0.5)",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};
