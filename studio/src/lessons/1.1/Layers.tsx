import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Icon, Stage } from "../../kit";
import { at } from "../../timing";
import { c, easeInOut, easeOut, font, FPS } from "../../theme";

const X0 = 300;
const BW = 1200;
const BAND_H = 160;
const Y = { you: 64, apps: 200, os: 460, hw: 720 };

const ease = (t: number, a: number, d = 0.6) => easeOut((t - a) / d);

const Band: React.FC<{
  y: number;
  h?: number;
  x?: number;
  w?: number;
  label: string;
  color: string;
  p: number;
  glow?: number;
  labelW?: number;
  children?: React.ReactNode;
}> = ({ y, h = BAND_H, x = X0, w = BW, label, color, p, glow = 0, labelW = 380, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 24,
      background: `linear-gradient(180deg, ${color}26, ${color}12)`,
      border: `2px solid ${color}${glow > 0 ? "" : "88"}`,
      boxShadow: glow > 0 ? `0 0 ${40 * glow}px ${color}66` : "none",
      opacity: p,
      transform: `translateY(${(1 - p) * 26}px)`,
      display: "flex",
      alignItems: "center",
      padding: "0 40px",
      gap: 26,
      boxSizing: "border-box",
    }}
  >
    <div style={{ fontSize: 40, fontWeight: 700, color: c.text, width: labelW, flexShrink: 0, whiteSpace: "nowrap" }}>{label}</div>
    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>{children}</div>
  </div>
);

const Pill: React.FC<{ p: number; icon?: React.ReactNode; children: React.ReactNode; color?: string }> = ({
  p,
  icon,
  children,
  color = c.text,
}) => (
  <div
    style={{
      opacity: p,
      transform: `scale(${0.9 + 0.1 * p})`,
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "rgba(10,15,28,0.55)",
      border: `1px solid ${c.line}`,
      borderRadius: 14,
      padding: "10px 18px",
      fontSize: 26,
      fontWeight: 600,
      whiteSpace: "nowrap",
      color,
    }}
  >
    {icon}
    {children}
  </div>
);

/** Animated vertical arrow drawn between two y positions at x. */
const Arrow: React.FC<{ x: number; y1: number; y2: number; p: number; color: string; dashed?: boolean; label?: string; labelSide?: "l" | "r" }> = ({
  x,
  y1,
  y2,
  p,
  color,
  dashed,
  label,
  labelSide = "r",
}) => {
  const len = Math.abs(y2 - y1);
  const dir = y2 > y1 ? 1 : -1;
  const yEnd = y1 + dir * len * p;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        <line
          x1={x}
          y1={y1}
          x2={x}
          y2={yEnd}
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={dashed ? "4 16" : undefined}
          opacity={p > 0 ? 1 : 0}
        />
        {p > 0.97 && !dashed && (
          <path
            d={`M${x - 16} ${y2 - dir * 20} L${x} ${y2} L${x + 16} ${y2 - dir * 20}`}
            stroke={color}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            top: (y1 + y2) / 2 - 22,
            left: labelSide === "r" ? x + 22 : undefined,
            right: labelSide === "l" ? 1920 - x + 22 : undefined,
            fontSize: 27,
            fontWeight: 600,
            color,
            opacity: easeOut((p - 0.5) * 2),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

/** s03: OS as the manager between applications and hardware. */
export const LayersOS: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const S = "s03";
  const tYou = at(S, "between you");
  const tHw = at(S, "At the bottom");
  const tApps = at(S, "At the top");
  const tOS = at(S, "in between sits");
  const tNever = at(S, "Applications never");
  const tAsk = at(S, "They ask");
  const tWork = at(S, "does the work,");
  const tBack = at(S, "hands back");
  const tKeep = at(S, "Keep that picture");

  const blocked = ease(t, tNever, 0.9);
  const blockedFade = 1 - ease(t, tAsk - 0.1, 0.5);
  const xMark = ease(t, at(S, "directly.") - 0.1, 0.35);
  const settle = ease(t, tKeep, 1.0);
  const ax = X0 + 560; // request path x
  return (
    <Stage glow={c.teal}>
      <AbsoluteFill>
        {/* You */}
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y.you,
            width: BW,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            fontSize: 34,
            fontWeight: 600,
            color: c.muted,
            opacity: ease(t, tYou - 0.3),
          }}
        >
          {Icon.user({ size: 52, color: c.accent })}
          You
        </div>
        <Band y={Y.apps} label="Applications" color={c.blue} p={ease(t, tApps - 0.2)}>
          <Pill p={ease(t, at(S, "web browser") - 0.1)} icon={Icon.browser({ size: 34, color: c.blue })}>
            Browser
          </Pill>
          <Pill p={ease(t, at(S, "text editor.") - 0.1)} icon={Icon.editor({ size: 34, color: c.blue })}>
            Text editor
          </Pill>
        </Band>
        <Band
          y={Y.os}
          label="Operating system"
          color={c.accent}
          p={ease(t, tOS - 0.2)}
          glow={ease(t, tWork, 0.4) * (1 - ease(t, tBack + 0.6, 0.6)) + settle * 0.5}
        >
          <Pill p={ease(t, tOS + 0.4)} color={c.muted}>
            the manager
          </Pill>
        </Band>
        <Band y={Y.hw} label="Hardware" color={c.teal} p={ease(t, tHw - 0.2)}>
          <Pill p={ease(t, at(S, "the processor,") - 0.1)} icon={Icon.cpu({ size: 34, color: c.teal })}>
            CPU
          </Pill>
          <Pill p={ease(t, at(S, "memory,") - 0.1)} icon={Icon.memory({ size: 34, color: c.teal })}>
            Memory
          </Pill>
          <Pill p={ease(t, at(S, "disks,") - 0.1)} icon={Icon.disk({ size: 34, color: c.teal })}>
            Disks
          </Pill>
          <Pill p={ease(t, at(S, "network cards.") - 0.1)} icon={Icon.network({ size: 34, color: c.teal })}>
            Network
          </Pill>
        </Band>

        {/* Blocked direct path: app -> hardware, outside the stack */}
        <div style={{ opacity: blockedFade }}>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <path
              d={`M${X0 + BW + 10} ${Y.apps + 80} C ${X0 + BW + 170} ${Y.apps + 120}, ${X0 + BW + 170} ${Y.hw + 40}, ${X0 + BW + 10} ${Y.hw + 80}`}
              stroke="#FF6B6B"
              strokeWidth={6}
              fill="none"
              strokeDasharray="6 16"
              strokeLinecap="round"
              pathLength={1}
              style={{ strokeDashoffset: 0 }}
              opacity={blocked}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: X0 + BW + 92,
              top: (Y.apps + Y.hw) / 2 + 40,
              width: 84,
              height: 84,
              borderRadius: 42,
              background: "#FF6B6B",
              color: "#1A0B0B",
              fontSize: 56,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${xMark})`,
            }}
          >
            ✕
          </div>
          <div
            style={{
              position: "absolute",
              left: X0 + BW + 30,
              top: (Y.apps + Y.hw) / 2 + 140,
              width: 260,
              fontSize: 26,
              fontWeight: 600,
              color: "#FF8A8A",
              textAlign: "center",
              opacity: xMark,
            }}
          >
            Never directly
          </div>
        </div>

        {/* Request / response flow through the OS */}
        <Arrow x={ax} y1={Y.apps + BAND_H + 8} y2={Y.os - 8} p={ease(t, tAsk, 0.6)} color={c.accent} label="asks" />
        <Arrow x={ax} y1={Y.os + BAND_H + 8} y2={Y.hw - 8} p={ease(t, tWork - 0.1, 0.6)} color={c.accent} label="does the work" />
        <Arrow x={ax - 90} y1={Y.hw - 8} y2={Y.os + BAND_H + 8} p={ease(t, tBack, 0.5)} color={c.teal} />
        <Arrow
          x={ax - 90}
          y1={Y.os - 8}
          y2={Y.apps + BAND_H + 8}
          p={ease(t, tBack + 0.35, 0.5)}
          color={c.teal}
          label="result"
          labelSide="l"
        />
      </AbsoluteFill>
    </Stage>
  );
};

/**
 * s09: same picture, refined. The OS band becomes the kernel; the shell appears BESIDE the apps
 * (it is just another user-space program), and every user-space program asks the kernel directly.
 */
export const LayersKernel: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const S = "s09";
  const tKernel = at(S, "The kernel is");
  const tFull = at(S, "full access");
  const tShell = at(S, "The shell is");
  const tReads = at(S, "It reads");
  const tElse = at(S, "Everything else,");
  const tUser = at(S, "user space.");
  const tKSpace = at(S, "kernel space.");

  const split = easeInOut((t - (tKernel - 0.4)) / 0.9);
  const shellIn = ease(t, tShell - 0.2, 0.7);
  const intro = ease(t, 0.0, 0.5);
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);
  const hwLink = ease(t, tFull, 0.6);
  const shellArrow = ease(t, tReads, 0.8);
  const appArrows = ease(t, tElse, 0.8);
  // apps band shrinks to make room for the shell box in the same (user-space) row
  const APPS_W = 770;
  const GAP = 30;
  const appsW = BW - (BW - APPS_W) * shellIn;
  const shellX = X0 + APPS_W + GAP;
  const shellW = BW - APPS_W - GAP;
  const rowBottom = Y.apps + BAND_H;
  return (
    <Stage glow={c.teal}>
      <AbsoluteFill style={{ opacity: intro }}>
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y.you - 6,
            width: BW,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            fontSize: 34,
            fontWeight: 600,
            color: c.muted,
          }}
        >
          {Icon.user({ size: 52, color: c.accent })}
          You
        </div>
        <Band y={Y.apps} w={appsW} labelW={270} label="Applications" color={c.blue} p={1}>
          <Pill p={1} icon={Icon.browser({ size: 30, color: c.blue })}>
            Browser
          </Pill>
          <Pill p={1} icon={Icon.editor({ size: 30, color: c.blue })}>
            Text editor
          </Pill>
        </Band>
        <div
          style={{
            position: "absolute",
            left: shellX,
            top: Y.apps,
            width: shellW,
            height: BAND_H,
            borderRadius: 24,
            background: `linear-gradient(180deg, ${c.accent}26, ${c.accent}12)`,
            border: `2px solid ${c.accent}`,
            boxShadow: shellArrow > 0 ? `0 0 ${30 * shellArrow * (1 - ease(t, tElse, 0.5))}px ${c.accent}66` : "none",
            opacity: shellIn,
            transform: `translateX(${(1 - shellIn) * 40}px)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 34px",
            boxSizing: "border-box",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 700 }}>Shell</div>
          <div style={{ fontFamily: font.mono, fontSize: 26, color: c.text }}>
            <span style={{ color: c.green }}>$</span> you type commands
          </div>
        </div>
        <Band
          y={Y.os}
          label={split > 0.5 ? "Kernel" : "Operating system"}
          color={split > 0.5 ? c.teal : c.accent}
          p={1}
          glow={ease(t, tKernel, 0.4) * (1 - ease(t, tShell - 0.3, 0.5))}
        >
          <Pill p={ease(t, tKernel + 0.3)} color={c.text}>
            core of the OS
          </Pill>
          <Pill p={ease(t, at(S, "four jobs.") - 0.2)} color={c.muted}>
            does the four jobs
          </Pill>
        </Band>
        <Band y={Y.hw} label="Hardware" color={c.teal} p={1} glow={hwLink * (1 - ease(t, tShell - 0.3, 0.5)) * pulse}>
          <Pill p={1} icon={Icon.cpu({ size: 30, color: c.teal })}>
            CPU
          </Pill>
          <Pill p={1} icon={Icon.memory({ size: 30, color: c.teal })}>
            Memory
          </Pill>
          <Pill p={1} icon={Icon.disk({ size: 30, color: c.teal })}>
            Disks
          </Pill>
          <Pill p={1} icon={Icon.network({ size: 30, color: c.teal })}>
            Network
          </Pill>
        </Band>
        <div
          style={{
            position: "absolute",
            left: X0 + 40,
            top: Y.os + BAND_H,
            width: BW - 80,
            height: Y.hw - Y.os - BAND_H,
            opacity: hwLink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            color: c.teal,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <div style={{ flex: 1, height: 4, background: `${c.teal}88`, borderRadius: 2 }} />
          full access to hardware
          <div style={{ flex: 1, height: 4, background: `${c.teal}88`, borderRadius: 2 }} />
        </div>
        {/* every user-space program asks the kernel directly */}
        <Arrow x={shellX + shellW / 2} y1={rowBottom + 8} y2={Y.os - 8} p={shellArrow} color={c.accent} label="asks the kernel" />
        <Arrow x={X0 + 200} y1={rowBottom + 8} y2={Y.os - 8} p={appArrows} color={c.blue} label="asks the kernel" />
        <Arrow x={X0 + 480} y1={rowBottom + 8} y2={Y.os - 8} p={ease(t, tElse + 0.25, 0.8)} color={c.blue} />

        <Bracket top={Y.apps} bottom={rowBottom} label="User space" sub="apps, tools, the shell" color={c.blue} p={ease(t, tUser - 0.4, 0.8)} glow={ease(t, tUser - 0.2, 0.5)} />
        <Bracket top={Y.os} bottom={Y.os + BAND_H} label="Kernel space" sub="protected, full control" color={c.teal} p={ease(t, tKSpace - 0.4, 0.8)} />
      </AbsoluteFill>
    </Stage>
  );
};

const Bracket: React.FC<{ top: number; bottom: number; label: string; sub: string; color: string; p: number; glow?: number }> = ({
  top,
  bottom,
  label,
  sub,
  color,
  p,
  glow = 0,
}) => {
  const x = X0 + BW + 40;
  return (
    <div style={{ position: "absolute", left: x, top, height: bottom - top, opacity: p, display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: 22,
          height: "100%",
          border: `4px solid ${color}`,
          borderLeft: "none",
          borderRadius: "0 14px 14px 0",
          boxShadow: glow ? `0 0 ${24 * glow}px ${color}` : "none",
        }}
      />
      <div style={{ marginLeft: 22, transform: `translateX(${(1 - p) * -14}px)` }}>
        <div style={{ fontSize: 36, fontWeight: 800, color }}>{label}</div>
        <div style={{ fontSize: 24, color: c.muted, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
};
