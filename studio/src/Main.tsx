import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { LESSON } from "./current";
import { segments } from "./currentLesson";
import { BUMPER_SECONDS, chapterOf, lesson, tailOf } from "./meta";
import { Bumper } from "./scenes/Cards";
import { timings } from "./timing";
import { brand, c, easeOut, font, FPS } from "./theme";

const XFADE = 12; // frames of crossfade between scenes

export type Placed = { id: string; from: number; dur: number; audioDur: number; cut: boolean; bare: boolean };

/** Lay segments end to end: each visual = narration + tail; next starts when the previous visual ends. */
export function layout(): { placed: Placed[]; total: number } {
  let t = Math.round(BUMPER_SECONDS * FPS);
  const placed: Placed[] = [];
  for (const s of segments) {
    const audio = timings[s.id]?.duration ?? 3;
    const dur = Math.round((audio + tailOf(s.id)) * FPS);
    placed.push({ id: s.id, from: t, dur, audioDur: Math.round(audio * FPS), cut: !!s.cut, bare: !!s.bare });
    t += dur;
  }
  return { placed, total: t };
}

const FadeIn: React.FC<{ on: boolean; children: React.ReactNode }> = ({ on, children }) => {
  const f = useCurrentFrame();
  const o = on ? interpolate(f, [0, XFADE], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Main: React.FC = () => {
  const { placed } = layout();
  return (
    <AbsoluteFill style={{ background: c.bg }}>
      <Sequence durationInFrames={Math.round(BUMPER_SECONDS * FPS) + XFADE}>
        <Bumper />
      </Sequence>
      {placed.map((p, i) => {
        const def = segments[i];
        const next = placed[i + 1];
        // overlap into the next segment so the next one can fade in over us
        const extra = next && !next.cut ? XFADE : 0;
        return (
          <Sequence key={p.id} from={p.from} durationInFrames={p.dur + extra} name={p.id}>
            <FadeIn on={!p.cut}>{def.render()}</FadeIn>
          </Sequence>
        );
      })}
      {placed.map((p) => (
        <Sequence key={`a-${p.id}`} from={p.from} durationInFrames={p.audioDur + 2} name={`audio ${p.id}`}>
          <Audio src={staticFile(`${LESSON}/audio/${p.id}.wav`)} />
        </Sequence>
      ))}
      <Chrome placed={placed} />
    </AbsoluteFill>
  );
};

/** Lesson chrome: chapter label (top-left) + chapter progress bar (bottom). */
const Chrome: React.FC<{ placed: Placed[] }> = ({ placed }) => {
  const f = useCurrentFrame();
  const cur = [...placed].reverse().find((p) => f >= p.from);
  if (!cur || cur.bare) return null;
  const chapter = chapterOf(cur.id);
  const chapterStart = placed.find((p) => chapterOf(p.id) === chapter)!.from;
  // the chapter label introduces each chapter, then gets out of the way of the footage
  const tagIn = Math.min(easeOut((f - chapterStart - 6) / 14), 1 - easeOut((f - chapterStart - 4.5 * FPS) / 15));

  // chapters in order with their frame spans
  const chapters: { name: string; from: number; to: number }[] = [];
  for (const p of placed) {
    const name = chapterOf(p.id);
    const last = chapters[chapters.length - 1];
    if (last && last.name === name) last.to = p.from + p.dur;
    else chapters.push({ name, from: p.from, to: p.from + p.dur });
  }
  const startF = placed[0].from;
  const endF = placed[placed.length - 1].from + placed[placed.length - 1].dur;
  const span = endF - startF;
  const fadeIn = easeOut((f - placed[1].from) / 20);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: font.ui }}>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 64,
          opacity: tagIn,
          transform: `translateX(${(1 - tagIn) * -16}px)`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(12,17,31,0.88)",
          border: `1px solid ${c.line}`,
          borderRadius: 14,
          padding: "11px 20px",
          fontSize: 23,
          fontWeight: 600,
          color: c.muted,
        }}
      >
        <span style={{ color: c.accent, fontFamily: font.mono, fontWeight: 700 }}>{lesson.number}</span>
        <span style={{ color: c.text }}>{chapter}</span>
      </div>
      <div style={{ position: "absolute", left: 64, right: 64, bottom: 30, display: "flex", gap: 6, opacity: 0.9 * fadeIn }}>
        {chapters.map((ch) => {
          const w = (ch.to - ch.from) / span;
          const fill = Math.min(1, Math.max(0, (f - ch.from) / (ch.to - ch.from)));
          return (
            <div key={ch.name} style={{ flexGrow: w, flexBasis: 0, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.14)", overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", background: c.accent }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 64, bottom: 44, fontSize: 19, color: c.dim, fontWeight: 600, opacity: fadeIn }}>
        {brand.course}
      </div>
    </AbsoluteFill>
  );
};
