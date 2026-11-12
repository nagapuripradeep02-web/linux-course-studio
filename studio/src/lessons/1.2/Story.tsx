import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Chip, Eyebrow, Icon, Reveal, Stage } from "../../kit";
import { at } from "../../timing";
import { c, easeOut, font, FPS } from "../../theme";

/** Bespoke scenes for Lesson 1.2 "How Linux came into existence" (history + the GNU/Linux idea). */

const ease = (t: number, a: number, d = 0.55) => easeOut((t - a) / d);

// ---------------------------------------------------------------------------------------------------------
// s02: the whole story on one line
// ---------------------------------------------------------------------------------------------------------
type Node = { at: string; year: string; label: string; sub: string; color: string };

const NODES: Node[] = [
  { at: "In 1969,", year: "1969", label: "Unix", sub: "Bell Labs", color: c.accent },
  { at: "In 1983,", year: "1983", label: "GNU", sub: "The free tools", color: c.teal },
  { at: "In 1991,", year: "1991", label: "Linux kernel", sub: "The missing piece", color: c.blue },
  { at: "Through the", year: "1990s", label: "Distributions", sub: "Packaged for everyone", color: c.violet },
  { at: "And today,", year: "Today", label: "Everywhere", sub: "Phones to supercomputers", color: c.green },
];

export const Timeline: React.FC<{ seg: string }> = ({ seg }) => {
  const t = useCurrentFrame() / FPS;
  const times = NODES.map((n) => at(seg, n.at) - 0.2);
  const X0 = 250;
  const X1 = 1670;
  const Y = 520;
  const step = (X1 - X0) / (NODES.length - 1);
  return (
    <Stage>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 160, top: 150 }}>
          <Reveal at={0.1}>
            <Eyebrow>The whole story in five steps</Eyebrow>
          </Reveal>
        </div>
        {/* the line, drawn segment by segment */}
        {NODES.slice(1).map((n, i) => {
          const p = ease(t, times[i + 1] - 0.45, 0.6);
          return (
            <div
              key={n.year}
              style={{
                position: "absolute",
                left: X0 + i * step,
                top: Y - 3,
                width: step * p,
                height: 6,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${NODES[i].color}, ${n.color})`,
              }}
            />
          );
        })}
        {NODES.map((n, i) => {
          const p = ease(t, times[i]);
          const x = X0 + i * step;
          return (
            <React.Fragment key={n.year}>
              <div
                style={{
                  position: "absolute",
                  left: x - 150,
                  width: 300,
                  top: Y - 190,
                  textAlign: "center",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 18}px)`,
                  fontSize: n.year.length > 4 ? 66 : 84,
                  fontWeight: 800,
                  letterSpacing: -2,
                  color: n.color,
                  lineHeight: "110px",
                }}
              >
                {n.year}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: x - 24,
                  top: Y - 24,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  background: c.bg,
                  border: `6px solid ${n.color}`,
                  boxShadow: `0 0 ${34 * p}px ${n.color}88`,
                  transform: `scale(${p})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x - 160,
                  width: 320,
                  top: Y + 62,
                  textAlign: "center",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 18}px)`,
                }}
              >
                <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.1 }}>{n.label}</div>
                <div style={{ fontSize: 29, color: c.muted, marginTop: 10 }}>{n.sub}</div>
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------
// s03 / s06 / s08: one "era" card: big year, name, people (names only), facts
// ---------------------------------------------------------------------------------------------------------
export const Era: React.FC<{
  seg: string;
  eyebrow: string;
  year: string;
  name: string;
  color: string;
  sub?: { at: string; text: string };
  people: { at: string; label: string }[];
  facts: { at: string; text: string }[];
  chips?: { at: string; label: string; color: string }[];
  chipsTitle?: string;
}> = ({ seg, eyebrow, year, name, color, sub, people, facts, chips, chipsTitle }) => (
  <Stage glow={color}>
    <AbsoluteFill style={{ padding: "0 160px", flexDirection: "row", alignItems: "center", gap: 100 }}>
      <div style={{ width: 640, flexShrink: 0 }}>
        <Reveal at={0.1}>
          <Eyebrow color={color}>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal at={0.3}>
          <div style={{ fontSize: 250, fontWeight: 800, letterSpacing: -8, lineHeight: 1, color, marginTop: 10 }}>{year}</div>
        </Reveal>
        <Reveal at={0.55}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2, marginTop: 10 }}>{name}</div>
        </Reveal>
        {sub && (
          <Reveal at={at(seg, sub.at) - 0.2}>
            <div style={{ fontSize: 38, color: c.muted, marginTop: 14 }}>{sub.text}</div>
          </Reveal>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {people.map((p) => (
            <Reveal key={p.label} at={at(seg, p.at) - 0.2} y={12}>
              <Chip color={color} size={38}>
                {p.label}
              </Chip>
            </Reveal>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 40 }}>
          {facts.map((f) => (
            <Reveal key={f.text} at={at(seg, f.at) - 0.2} x={-20} y={0}>
              <div
                style={{
                  display: "flex",
                  gap: 26,
                  alignItems: "center",
                  background: c.panel,
                  border: `1px solid ${c.line}`,
                  borderLeft: `8px solid ${color}`,
                  borderRadius: 20,
                  padding: "26px 36px",
                  fontSize: 40,
                  fontWeight: 600,
                  lineHeight: 1.25,
                }}
              >
                {f.text}
              </div>
            </Reveal>
          ))}
        </div>
        {chips && (
          <div style={{ marginTop: 34 }}>
            {chipsTitle && (
              <Reveal at={at(seg, chips[0].at) - 0.6}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3, color: c.muted, textTransform: "uppercase", marginBottom: 18 }}>
                  {chipsTitle}
                </div>
              </Reveal>
            )}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {chips.map((ch) => (
                <Reveal key={ch.label} at={at(seg, ch.at) - 0.15} y={12}>
                  <Chip color={ch.color} size={36}>
                    {ch.label}
                  </Chip>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  </Stage>
);

// ---------------------------------------------------------------------------------------------------------
// s05: restricted source code
// ---------------------------------------------------------------------------------------------------------
const RED = "#FF6B6B";

export const Restricted: React.FC<{ seg: string }> = ({ seg }) => {
  const t = useCurrentFrame() / FPS;
  const items = [
    { at: "study how", text: "Study how it works" },
    { at: "can't fix", text: "Fix it" },
    { at: "can't share", text: "Share it" },
  ];
  const tSrc = at(seg, "source code was") - 0.2;
  const tDef = at(seg, "Source code is") - 0.2;
  return (
    <Stage glow={RED}>
      <AbsoluteFill style={{ padding: "150px 160px" }}>
        <Reveal at={0.1}>
          <Eyebrow>The problem</Eyebrow>
        </Reveal>
        <div style={{ display: "flex", gap: 70, marginTop: 56, alignItems: "stretch" }}>
          <div style={{ width: 760, flexShrink: 0 }}>
            <Reveal at={at(seg, "Unix became") - 0.2}>
              <div
                style={{
                  background: c.panel,
                  border: `1px solid ${c.line}`,
                  borderRadius: 26,
                  padding: "44px 48px",
                }}
              >
                <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2 }}>Unix</div>
                <div style={{ fontSize: 38, color: c.muted, marginTop: 8 }}>commercial and expensive</div>
                <div
                  style={{
                    marginTop: 34,
                    opacity: ease(t, tSrc),
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 26px",
                    borderRadius: 16,
                    background: `${RED}1F`,
                    border: `2px solid ${RED}88`,
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#FFB0B0",
                  }}
                >
                  source code: restricted
                </div>
              </div>
            </Reveal>
            <Reveal at={tDef}>
              <div style={{ fontSize: 40, color: c.muted, marginTop: 30, lineHeight: 1.35 }}>
                <span style={{ color: c.text, fontWeight: 700 }}>Source code</span> = the readable instructions of a program
              </div>
            </Reveal>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26, justifyContent: "center" }}>
            {items.map((it) => {
              const p = ease(t, at(seg, it.at) - 0.2);
              return (
                <div
                  key={it.text}
                  style={{
                    opacity: p,
                    transform: `translateX(${(1 - p) * 24}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 28,
                    background: c.panel,
                    border: `1px solid ${c.line}`,
                    borderRadius: 22,
                    padding: "26px 38px",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      background: RED,
                      color: "#1A0B0B",
                      fontSize: 40,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </div>
                  <div style={{ fontSize: 46, fontWeight: 600 }}>{it.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------
// s07: what GNU had built, and the one missing piece
// ---------------------------------------------------------------------------------------------------------
export const GnuParts: React.FC<{ seg: string }> = ({ seg }) => {
  const t = useCurrentFrame() / FPS;
  const parts = [
    { at: "A compiler,", icon: Icon.process, title: "Compiler", sub: "turns code into programs" },
    { at: "The bash shell,", icon: Icon.terminal, title: "bash shell", sub: "where you type commands" },
    { at: "Core utilities,", icon: Icon.folder, title: "Core utilities", sub: <>commands like <span style={{ fontFamily: font.mono, color: c.text }}>ls</span> and <span style={{ fontFamily: font.mono, color: c.text }}>cp</span></> },
    { at: "And editors.", icon: Icon.editor, title: "Editors", sub: "to write text and code" },
  ];
  const tMissing = at(seg, "still missing") - 0.3;
  const pm = ease(t, tMissing, 0.7);
  return (
    <Stage glow={c.teal}>
      <AbsoluteFill style={{ padding: "150px 160px" }}>
        <Reveal at={0.1}>
          <Eyebrow color={c.teal}>What GNU had built by the early 1990s</Eyebrow>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 56 }}>
          {parts.map((p) => (
            <Reveal key={p.title} at={at(seg, p.at) - 0.2} y={22}>
              <div
                style={{
                  background: c.panel,
                  border: `1px solid ${c.line}`,
                  borderRadius: 24,
                  padding: "30px 40px",
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  height: 150,
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 22,
                    background: `${c.teal}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {p.icon({ size: 56, color: c.teal })}
                </div>
                <div>
                  <div style={{ fontSize: 44, fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: 29, color: c.muted, marginTop: 4 }}>{p.sub}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div
          style={{
            marginTop: 30,
            opacity: pm,
            transform: `translateY(${(1 - pm) * 20}px)`,
            display: "flex",
            alignItems: "center",
            gap: 34,
            borderRadius: 24,
            border: `3px dashed ${c.accent}`,
            background: `${c.accent}12`,
            padding: "30px 44px",
            boxShadow: `0 0 ${40 * pm}px ${c.accent}33`,
          }}
        >
          {Icon.cpu({ size: 76, color: c.accent })}
          <div style={{ fontSize: 56, fontWeight: 800 }}>A working kernel</div>
          <div style={{ fontSize: 36, color: c.accent, fontWeight: 700, marginLeft: "auto" }}>still missing</div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------
// s09 / s10: parts + parts = something complete
// ---------------------------------------------------------------------------------------------------------
type Part = { at: string; label: string; sub?: string; color: string };

export const Combine: React.FC<{
  seg: string;
  eyebrow: string;
  parts: Part[];
  result: { at: string; label: string; sub: string; color: string };
  /** glow one part and add a note under it (e.g. "the name Linux belongs only to the kernel") */
  emphasis?: { part: number; at: string; note: string };
  resultChip?: { at: string; label: string; color: string };
  /** one line of plain text under the eyebrow, revealed on its phrase (an analogy, a framing question) */
  lead?: { at: string; text: string };
}> = ({ seg, eyebrow, parts, result, emphasis, resultChip, lead }) => {
  const t = useCurrentFrame() / FPS;
  const tRes = at(seg, result.at) - 0.3;
  const tEmph = emphasis ? at(seg, emphasis.at) - 0.3 : 1e9;
  const pRes = ease(t, tRes, 0.7);
  // sized so the whole "a + b = c" row fits inside the 1720 px content width (it used to overflow the margins)
  const partW = parts.length > 2 ? 340 : 440;
  const Op: React.FC<{ ch: string; p: number }> = ({ ch, p }) => (
    <div style={{ width: 90, textAlign: "center", fontSize: 90, fontWeight: 300, color: c.muted, opacity: p }}>{ch}</div>
  );
  return (
    <Stage glow={result.color}>
      <AbsoluteFill style={{ padding: "150px 100px" }}>
        <div style={{ paddingLeft: 60 }}>
          <Reveal at={0.1}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
        </div>
        {lead && (
          <div style={{ position: "absolute", left: 160, right: 160, top: 230 }}>
            <Reveal at={at(seg, lead.at) - 0.2}>
              <div style={{ fontSize: 50, fontWeight: 600, color: c.text }}>{lead.text}</div>
            </Reveal>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: lead ? 180 : 130 }}>
          {parts.map((p, i) => {
            const pp = ease(t, at(seg, p.at) - 0.25);
            const em = emphasis && emphasis.part === i ? ease(t, tEmph, 0.5) : 0;
            return (
              <React.Fragment key={p.label}>
                {i > 0 && <Op ch="+" p={pp} />}
                <div style={{ width: partW, position: "relative" }}>
                  <div
                    style={{
                      opacity: pp,
                      transform: `translateY(${(1 - pp) * 24}px)`,
                      background: c.panel,
                      border: `3px solid ${em > 0 ? p.color : `${p.color}88`}`,
                      boxShadow: em > 0 ? `0 0 ${50 * em}px ${p.color}66` : "none",
                      borderRadius: 26,
                      padding: "44px 24px",
                      textAlign: "center",
                      minHeight: 260,
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{ fontSize: parts.length > 2 ? 44 : 62, fontWeight: 800, color: p.color }}>{p.label}</div>
                    {p.sub && <div style={{ fontSize: 31, color: c.muted, marginTop: 14, lineHeight: 1.3 }}>{p.sub}</div>}
                  </div>
                  {emphasis && emphasis.part === i && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 290,
                        textAlign: "center",
                        fontSize: 31,
                        fontWeight: 700,
                        color: p.color,
                        opacity: em,
                        transform: `translateY(${(1 - em) * 10}px)`,
                      }}
                    >
                      {emphasis.note}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
          <Op ch="=" p={pRes} />
          <div style={{ width: partW + 60, position: "relative" }}>
            <div
              style={{
                opacity: pRes,
                transform: `scale(${0.94 + 0.06 * pRes})`,
                background: `linear-gradient(160deg, ${result.color}2B, ${c.panel})`,
                border: `3px solid ${result.color}`,
                boxShadow: `0 0 ${60 * pRes}px ${result.color}55`,
                borderRadius: 26,
                padding: "44px 34px",
                textAlign: "center",
                minHeight: 260,
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: parts.length > 2 ? 56 : 66, fontWeight: 800 }}>{result.label}</div>
              <div style={{ fontSize: 31, color: c.muted, marginTop: 14, lineHeight: 1.3 }}>{result.sub}</div>
            </div>
            {resultChip && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center" }}>
                <Reveal at={at(seg, resultChip.at) - 0.2} y={12}>
                  <Chip color={resultChip.color} size={32}>
                    {resultChip.label}
                  </Chip>
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

