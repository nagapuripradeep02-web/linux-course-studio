import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Eyebrow, Icon, Reveal, Stage } from "../../kit";
import { at } from "../../timing";
import { c, easeOut, FPS } from "../../theme";

const S = "s10";
const ease = (t: number, a: number, d = 0.5) => easeOut((t - a) / d);

type OSName = { name: string; linux?: boolean; at: string; note?: string };

/** s10: where operating systems live, with Linux highlighted across categories. */
export const Devices: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const tAndroid = at(S, "In fact,");
  const tServers = at(S, "And most");
  const tValue = at(S, "That's exactly");
  const linuxGlow = ease(t, tAndroid - 0.2, 0.6);

  const cols: { icon: (p: { size?: number; color?: string }) => React.ReactNode; title: string; at: string; items: OSName[]; key: string }[] = [
    {
      key: "laptop",
      icon: Icon.laptop,
      title: "Laptops & desktops",
      at: "Windows and",
      items: [
        { name: "Windows", at: "Windows and" },
        { name: "macOS", at: "macOS on" },
        { name: "Linux", linux: true, at: "And Linux" },
      ],
    },
    {
      key: "phone",
      icon: Icon.phone,
      title: "Phones",
      at: "Android and",
      items: [
        { name: "Android", at: "Android and", note: "built on the Linux kernel", linux: true },
        { name: "iOS", at: "iOS on" },
      ],
    },
    {
      key: "server",
      icon: Icon.server,
      title: "Servers & cloud",
      at: "runs on servers,",
      items: [{ name: "Linux", linux: true, at: "runs on servers," }],
    },
    {
      key: "router",
      icon: Icon.tv,
      title: "Routers & smart TVs",
      at: "routers,",
      items: [{ name: "Linux", linux: true, at: "routers," }],
    },
  ];

  return (
    <Stage>
      <AbsoluteFill style={{ padding: "150px 120px" }}>
        <Reveal at={0.1}>
          <Eyebrow>Operating systems are everywhere</Eyebrow>
        </Reveal>
        <div style={{ display: "flex", gap: 30, marginTop: 64 }}>
          {cols.map((col) => {
            const p = ease(t, at(S, col.at) - 0.25, 0.6);
            const serverHi = col.key === "server" ? ease(t, tServers, 0.5) : 0;
            return (
              <div
                key={col.key}
                style={{
                  flex: 1,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px)`,
                  background: c.panel,
                  border: `2px solid ${serverHi > 0 ? c.teal : c.line}`,
                  boxShadow: serverHi > 0 ? `0 0 ${50 * serverHi}px ${c.teal}55` : "none",
                  borderRadius: 26,
                  padding: "40px 34px",
                  minHeight: 520,
                  boxSizing: "border-box",
                }}
              >
                {col.icon({ size: 96, color: c.text })}
                <div style={{ fontSize: 38, fontWeight: 700, marginTop: 26, lineHeight: 1.15 }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 34 }}>
                  {col.items.map((it) => {
                    const ip = ease(t, at(S, it.at) - 0.1, 0.4);
                    const glow = it.linux ? linuxGlow : 0;
                    const noteP = it.note ? ease(t, tAndroid + 0.3, 0.6) : 0;
                    return (
                      <div key={it.name + col.key} style={{ opacity: ip }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "12px 22px",
                            borderRadius: 14,
                            fontSize: 32,
                            fontWeight: 600,
                            background: glow > 0 ? `rgba(61,214,198,${0.08 + 0.12 * glow})` : c.bg2,
                            border: `2px solid ${glow > 0 ? `rgba(61,214,198,${0.3 + 0.5 * glow})` : c.line}`,
                          }}
                        >
                          {it.name}
                        </div>
                        {it.note && (
                          <div
                            style={{
                              marginTop: 10,
                              fontSize: 25,
                              color: c.teal,
                              fontWeight: 600,
                              opacity: noteP,
                              transform: `translateX(${(1 - noteP) * -10}px)`,
                            }}
                          >
                            ↳ {it.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 50,
            fontSize: 40,
            fontWeight: 700,
            textAlign: "center",
            opacity: ease(t, tValue - 0.1, 0.6),
          }}
        >
          Linux runs the servers behind most of the web. <span style={{ color: c.accent }}>That's why Linux skills matter.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
