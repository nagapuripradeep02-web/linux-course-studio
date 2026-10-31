import React from "react";
import { AbsoluteFill } from "remotion";
import { Chip, Eyebrow, Stage } from "./kit";
import { lesson } from "./meta";
import { brand, c, font } from "./theme";

/**
 * Course-page thumbnail: lesson title, keyword chips and a real terminal line.
 * Content comes from script.json -> lesson.thumbnail { chips: [{label, color}], prompt, output }.
 */
export const Thumbnail: React.FC = () => {
  const th = lesson.thumbnail ?? {};
  return (
  <Stage>
    <AbsoluteFill style={{ padding: "110px 130px", justifyContent: "space-between" }}>
      <div>
        <Eyebrow>
          {brand.course} · Module {lesson.module} · Lesson {lesson.number}
        </Eyebrow>
        <div style={{ fontSize: 138, fontWeight: 800, letterSpacing: -4, lineHeight: 1.02, marginTop: 30, maxWidth: 1300 }}>
          {lesson.title}
        </div>
        {th.chips && th.chips.length > 0 && (
          <div style={{ display: "flex", gap: 18, marginTop: 44 }}>
            {th.chips.map((ch) => (
              <Chip key={ch.label} color={c[ch.color]} size={36}>
                {ch.label}
              </Chip>
            ))}
          </div>
        )}
      </div>
      {th.prompt && (
      <div
        style={{
          alignSelf: "flex-start",
          background: "#070B14",
          border: `1px solid ${c.line}`,
          borderRadius: 20,
          padding: "26px 36px",
          fontFamily: font.mono,
          fontSize: 38,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <span style={{ color: c.green }}>student@linux-lab</span>
        <span style={{ color: c.muted }}>:~$ </span>
        <span>{th.prompt}</span>
        <div style={{ color: c.text, marginTop: 8 }}>{th.output}</div>
      </div>
      )}
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        right: 120,
        top: 130,
        width: 300,
        height: 300,
        borderRadius: 70,
        background: `linear-gradient(145deg, ${c.panelHi}, ${c.panel})`,
        border: `3px solid ${c.accent}55`,
        boxShadow: `0 30px 90px ${c.accent}2A`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: font.mono,
        fontWeight: 700,
        fontSize: 140,
        color: c.accent,
      }}
    >
      {">_"}
    </div>
  </Stage>
  );
};
