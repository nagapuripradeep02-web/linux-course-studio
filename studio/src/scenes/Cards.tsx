import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Chip, Eyebrow, Icon, Reveal, Stage, useReveal } from "../kit";
import { at } from "../timing";
import { brand, c, easeInOut, easeOut, font, FPS } from "../theme";
import { lesson } from "../meta";

/** 4-second brand bumper: prompt glyph, course name types in. No narration. */
export const Bumper: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const mark = easeOut((t - 0.2) / 0.7);
  const name = brand.course;
  const typed = Math.max(0, Math.min(name.length, Math.floor((t - 0.9) * 26)));
  const cursorOn = Math.floor(t * 2.2) % 2 === 0;
  const tag = easeOut((t - 2.0) / 0.6);
  const out = interpolate(t, [3.4, 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 34,
              background: `linear-gradient(145deg, ${c.panelHi}, ${c.panel})`,
              border: `2px solid ${c.accent}55`,
              boxShadow: `0 20px 60px ${c.accent}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: font.mono,
              fontWeight: 700,
              fontSize: 72,
              color: c.accent,
              transform: `scale(${0.85 + 0.15 * mark})`,
              opacity: mark,
            }}
          >
            {">_"}
          </div>
          <div>
            <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2, minHeight: 112 }}>
              {name.slice(0, typed)}
              <span style={{ color: c.accent, opacity: typed < name.length || cursorOn ? 1 : 0 }}>▍</span>
            </div>
            <div style={{ fontSize: 34, color: c.muted, opacity: tag, transform: `translateY(${(1 - tag) * 10}px)` }}>
              {brand.tagline}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

export type ObjectiveDef = {
  /** narration phrase (inside `seg`) where this objective appears */
  at: string;
  text: string;
  /** optional keyword chips under the objective, each revealed on its own phrase */
  chips?: { at: string; label: string; color: string }[];
};

/** Opening card: lesson title, then the learning objectives keyed to the narration. */
export const TitleObjectives: React.FC<{
  seg: string;
  /** phrase where the title shrinks away and the objective list begins, e.g. "By the end" */
  headingAt: string;
  heading?: string;
  objectives: ObjectiveDef[];
}> = ({ seg, headingAt, heading = "By the end of this lesson you can", objectives }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const tObj = at(seg, headingAt) - 0.2;
  const move = easeInOut((t - tObj) / 0.9);
  return (
    <Stage>
      <AbsoluteFill style={{ padding: "0 160px", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${-250 * move}px) scale(${1 - 0.3 * move})`, transformOrigin: "left center" }}>
          <Reveal at={0.2}>
            <Eyebrow>
              Module {lesson.module} · Lesson {lesson.number}
            </Eyebrow>
          </Reveal>
          <Reveal at={0.45}>
            <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, marginTop: 22 }}>
              {lesson.title}
            </div>
          </Reveal>
          <Reveal at={0.8}>
            <div style={{ fontSize: 38, color: c.muted, marginTop: 26 }}>{lesson.moduleTitle}</div>
          </Reveal>
        </div>
        <div style={{ position: "absolute", left: 160, right: 160, top: 520 }}>
          <Reveal at={tObj + 0.5}>
            <div style={{ fontSize: 30, fontWeight: 700, color: c.muted, letterSpacing: 3, textTransform: "uppercase" }}>
              {heading}
            </div>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 30 }}>
            {objectives.map((o, i) => (
              <Objective key={o.text} n={i + 1} at={at(seg, o.at)} text={o.text}>
                {o.chips && (
                  <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
                    {o.chips.map((ch) => (
                      <Reveal key={ch.label} at={at(seg, ch.at)} y={10}>
                        <Chip color={ch.color}>{ch.label}</Chip>
                      </Reveal>
                    ))}
                  </div>
                )}
              </Objective>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

const Objective: React.FC<{ n: number; at: number; text: string; children?: React.ReactNode }> = ({
  n,
  at: t0,
  text,
  children,
}) => (
  <Reveal at={t0 - 0.15} x={-24} y={0}>
    <div
      style={{
        display: "flex",
        gap: 30,
        alignItems: "flex-start",
        background: c.panel,
        border: `1px solid ${c.line}`,
        borderRadius: 22,
        padding: "30px 38px",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: c.accentSoft,
          color: c.accent,
          fontWeight: 800,
          fontSize: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div>
        <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.25, paddingTop: 4 }}>{text}</div>
        {children}
      </div>
    </div>
  </Reveal>
);

export type Tile = { icon: (p: { size?: number; color?: string }) => React.ReactNode; title: string; sub: string };

/** Two-column grid of 2–6 tiles, revealed one after another from the phrase `at` (icons: Icon in ../kit). */
export const TileGrid: React.FC<{ seg: string; at: string; eyebrow: string; kicker?: string; tiles: Tile[] }> = ({
  seg,
  at: phrase,
  eyebrow,
  kicker,
  tiles,
}) => {
  const t0 = at(seg, phrase) - 0.4;
  const tileH = tiles.length > 4 ? 230 : 300;
  return (
    <Stage>
      <AbsoluteFill style={{ padding: "150px 160px" }}>
        <Reveal at={0.1}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 34,
            marginTop: 60,
          }}
        >
          {tiles.map((j, i) => (
            <Reveal key={j.title} at={t0 + i * 0.28} y={24}>
              <div
                style={{
                  background: c.panel,
                  border: `1px solid ${c.line}`,
                  borderRadius: 26,
                  padding: "44px 48px",
                  display: "flex",
                  gap: 36,
                  alignItems: "center",
                  height: tileH,
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: 28,
                    background: c.accentSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {j.icon({ size: 76, color: c.accent })}
                </div>
                <div>
                  {kicker && (
                    <div style={{ fontSize: 26, color: c.muted, fontWeight: 700, letterSpacing: 2 }}>
                      {kicker} {i + 1}
                    </div>
                  )}
                  <div style={{ fontSize: 50, fontWeight: 700, marginTop: 6 }}>{j.title}</div>
                  <div style={{ fontSize: 31, color: c.muted, marginTop: 12, lineHeight: 1.35 }}>{j.sub}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** "Pause and try it" card listing the demo commands. */
export const TryIt: React.FC<{
  seg: string;
  /** phrase where the command list starts to appear, e.g. "run these" */
  listAt: string;
  commands: { cmd: string; what: string }[];
  /** optional side note (e.g. for learners who have no Linux yet), revealed on its phrase */
  note?: { at: string; text: string };
}> = ({ seg, listAt, commands, note }) => {
  const tList = at(seg, listAt) - 0.3;
  return (
    <Stage>
      <AbsoluteFill style={{ padding: "100px 160px", flexDirection: "row", gap: 90, alignItems: "center" }}>
        <div style={{ width: 560, flexShrink: 0 }}>
          <Reveal at={0.1}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {Icon.pause({ size: 74, color: c.accent })}
              <Eyebrow>Your turn</Eyebrow>
            </div>
          </Reveal>
          <Reveal at={0.35}>
            <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 30, letterSpacing: -2 }}>
              Pause the video and try it
            </div>
          </Reveal>
          {note && (
            <Reveal at={at(seg, note.at) - 0.2}>
              <div style={{ fontSize: 33, color: c.muted, marginTop: 34, lineHeight: 1.45 }}>{note.text}</div>
            </Reveal>
          )}
        </div>
        <div
          style={{
            flex: 1,
            background: "#070B14",
            border: `1px solid ${c.line}`,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ height: 54, background: c.panel, display: "flex", alignItems: "center", gap: 12, padding: "0 24px" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => (
              <div key={col} style={{ width: 16, height: 16, borderRadius: 8, background: col, opacity: 0.85 }} />
            ))}
            <div style={{ marginLeft: 16, color: c.muted, fontSize: 22, fontFamily: font.mono }}>practice</div>
          </div>
          <div style={{ padding: "34px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
            {commands.map((cm, i) => (
              <Reveal key={cm.cmd} at={tList + i * 0.35} x={-16} y={0}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
                  <span style={{ fontFamily: font.mono, color: c.green, fontSize: 38 }}>$</span>
                  <span style={{ fontFamily: font.mono, fontSize: 42, fontWeight: 500, width: 420 }}>{cm.cmd}</span>
                  <span style={{ fontSize: 29, color: c.muted }}>{cm.what}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** Recap card: three takeaways keyed to narration. */
export const Recap: React.FC<{ seg: string; points: { at: string; title: string; body: string; color: string }[] }> = ({
  seg,
  points,
}) => (
  <Stage>
    <AbsoluteFill style={{ padding: "150px 160px" }}>
      <Reveal at={0.1}>
        <Eyebrow>Recap</Eyebrow>
      </Reveal>
      <Reveal at={0.3}>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 18, letterSpacing: -2 }}>What you learned</div>
      </Reveal>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 44 }}>
        {points.map((p) => (
          <Reveal key={p.title} at={at(seg, p.at) - 0.2} x={-20} y={0}>
            <div
              style={{
                display: "flex",
                gap: 34,
                alignItems: "center",
                background: c.panel,
                border: `1px solid ${c.line}`,
                borderLeft: `8px solid ${p.color}`,
                borderRadius: 20,
                padding: "30px 40px",
              }}
            >
              {Icon.check({ size: 54, color: p.color, stroke: 3.5 })}
              <div>
                <div style={{ fontSize: 46, fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontSize: 32, color: c.muted, marginTop: 6 }}>{p.body}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </AbsoluteFill>
  </Stage>
);

/** Closing card: next lesson (from script.json lesson.next) + course mark, revealed on the phrase `at`. */
export const NextUp: React.FC<{ seg: string; at?: string }> = ({ seg, at: phrase = "In the next lesson" }) => {
  const f = useCurrentFrame();
  const t0 = at(seg, phrase) - 0.3;
  const p = easeOut((f / FPS - t0) / 0.8);
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)`, textAlign: "center" }}>
          <Eyebrow color={c.muted}>Up next</Eyebrow>
          <div style={{ fontSize: 44, color: c.accent, fontWeight: 700, marginTop: 34 }}>Lesson {lesson.next.number}</div>
          <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: -3, marginTop: 10 }}>{lesson.next.title}</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
        <Reveal at={t0 + 0.8}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: c.muted, fontSize: 28 }}>
            <span style={{ fontFamily: font.mono, color: c.accent, fontWeight: 700 }}>{">_"}</span>
            {brand.course} · Module {lesson.module}
          </div>
        </Reveal>
      </AbsoluteFill>
    </Stage>
  );
};

export const useSceneT = () => useCurrentFrame() / FPS;
export { useReveal };
