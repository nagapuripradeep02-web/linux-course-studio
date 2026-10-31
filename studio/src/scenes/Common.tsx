import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage } from "../kit";
import { c, easeOut, font, FPS } from "../theme";
import type { Beat, Rect } from "./Clip";

/** One entry of a lesson's scene map (studio/src/lessons/<id>/index.tsx). */
export type SegmentDef = {
  id: string;
  /** cut (no crossfade) into this segment, e.g. continuous footage from the previous one */
  cut?: boolean;
  /** hide the chapter label / progress bar chrome (title and closing cards) */
  bare?: boolean;
  render: () => React.ReactNode;
};

/**
 * Terminator beat: the footage stops at this event (minus lead) and holds there, so a segment can never
 * run into the next segment's action while the narration is still catching up. Use as the LAST beat
 * of every ClipScene whose clip continues into another segment.
 */
export const HOLD = (event: string, lead: number): Beat => ({ at: 1e6, event, lead });

// ---------- terminal grid, calibrated from the lab's maximised xfce4-terminal (JetBrains Mono 14) ----------
export const TERM = { TX: 22, TY: 64, CW: 11, LH: 26 }; // left padding, top of row 0, cell width, line height
/** Rect for `len` characters starting at column `col` on terminal row `row` (rows start at 0 = the prompt line). */
export const cell = (row: number, col: number, len: number, rows = 1): Rect => [
  TERM.TX + col * TERM.CW,
  TERM.TY + row * TERM.LH,
  len * TERM.CW,
  rows * TERM.LH,
];

/** Dims footage behind on-footage questions or notes. Times are segment-local seconds. */
export const Scrim: React.FC<{ from: number; to: number; amount?: number }> = ({ from, to, amount = 0.55 }) => {
  const t = useCurrentFrame() / FPS;
  const p = Math.min(easeOut((t - from) / 0.5), 1 - easeOut((t - (to - 0.4)) / 0.4));
  return <AbsoluteFill style={{ background: `rgba(6,9,18,${amount * Math.max(0, p)})` }} />;
};

/** Placeholder a new lesson starts with: shows the segment's narration until a real scene replaces it. */
export const StubScene: React.FC<{ id: string; chapter: string; text: string }> = ({ id, chapter, text }) => (
  <Stage>
    <AbsoluteFill style={{ padding: "150px 160px", fontFamily: font.ui, color: c.text }}>
      <div style={{ fontSize: 28, color: c.accent, fontFamily: font.mono, fontWeight: 700 }}>
        {id} · {chapter}
      </div>
      <div style={{ fontSize: 40, lineHeight: 1.4, marginTop: 30, color: c.muted }}>{text}</div>
      <div style={{ position: "absolute", left: 160, bottom: 90, fontSize: 24, color: c.dim }}>
        placeholder scene — replace it in studio/src/lessons/&lt;lesson&gt;/index.tsx
      </div>
    </AbsoluteFill>
  </Stage>
);
