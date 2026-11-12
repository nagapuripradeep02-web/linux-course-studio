import React from "react";
import { Icon } from "../../kit";
import { NextUp, Recap, TileGrid, TitleObjectives, TryIt } from "../../scenes/Cards";
import { ClipScene, NoteCard } from "../../scenes/Clip";
import { cell, HOLD, SegmentDef } from "../../scenes/Common";
import { at } from "../../timing";
import { c, font } from "../../theme";
import { Combine, Era, GnuParts, Restricted, Timeline } from "./Story";

/**
 * Scene map for Lesson 1.2 "How Linux came into existence".
 * Cards and diagrams for the history (s01-s11), one continuous terminal clip for the demos (s12-s16),
 * then Your turn / Recap / Next. Every time is anchored to a spoken phrase with at(seg, "phrase").
 */

/** One-line mono caption used as a card footer. */
const Footer: React.FC<{ cmd?: string; children: React.ReactNode }> = ({ cmd, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 36, color: c.muted }}>
    {cmd && (
      <span style={{ fontFamily: font.mono, color: c.text, background: "#070B14", border: `1px solid ${c.line}`, borderRadius: 14, padding: "10px 22px" }}>
        <span style={{ color: c.green }}>$ </span>
        {cmd}
      </span>
    )}
    <span>{children}</span>
  </div>
);

/** Small mono block used inside NoteCards. */
const Mono: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <span style={{ fontFamily: font.mono, color: color ?? c.accent }}>{children}</span>
);

export const segments: SegmentDef[] = [
  {
    id: "s01",
    bare: true,
    render: () => (
      <TitleObjectives
        seg="s01"
        headingAt="By the end"
        objectives={[
          {
            at: "describe the path",
            text: "Describe the path from Unix to GNU to Linux",
            chips: [
              { at: "from Unix,", label: "Unix", color: c.accent },
              { at: "to GNU,", label: "GNU", color: c.teal },
              { at: "to Linux,", label: "Linux", color: c.blue },
            ],
          },
          { at: "explain why some", text: "Explain why some people say GNU/Linux" },
        ]}
      />
    ),
  },
  { id: "s02", render: () => <Timeline seg="s02" /> },
  {
    id: "s03",
    render: () => (
      <Era
        seg="s03"
        eyebrow="Step 1"
        year="1969"
        name="Unix"
        color={c.accent}
        sub={{ at: "Bell Labs,", text: "created at Bell Labs" }}
        people={[
          { at: "Ken Thompson", label: "Ken Thompson" },
          { at: "Dennis Ritchie", label: "Dennis Ritchie" },
        ]}
        facts={[
          { at: "rewrote it", text: "Rewritten in the C language, early 1970s" },
          { at: "different kinds", text: "A C program can be rebuilt for other machines" },
          { at: "Universities and", text: "Adopted by universities and companies" },
        ]}
      />
    ),
  },
  {
    id: "s04",
    render: () => (
      <TileGrid
        seg="s04"
        at="a tree of"
        eyebrow="Ideas Unix made popular"
        tiles={[
          { at: "a tree of", icon: Icon.folder, title: "A tree of files", sub: "Directories inside directories" },
          { at: "small tools that", icon: Icon.process, title: "Small tools", sub: "Each one does one job well" },
          { at: "connect those", icon: Icon.plug, title: "Connect them", sub: "The output of one becomes the input of the next" },
        ]}
        footer={{
          at: "The pipe,",
          node: <Footer cmd="ps aux | head -5">the pipe joined two small tools, last lesson</Footer>,
        }}
      />
    ),
  },
  { id: "s05", render: () => <Restricted seg="s05" /> },
  {
    id: "s06",
    render: () => (
      <Era
        seg="s06"
        eyebrow="Step 2"
        year="1983"
        name="The GNU project"
        color={c.teal}
        sub={{ at: "GNU's Not Unix", text: "“GNU's Not Unix”" }}
        people={[{ at: "Richard Stallman", label: "Richard Stallman" }]}
        facts={[
          { at: "completely free", text: "Goal: a completely free operating system" },
          { at: "Free here means", text: "“Free” means freedom, not price" },
        ]}
        chipsTitle="Four freedoms: you can"
        chips={[
          { at: "use it,", label: "use it", color: c.accent },
          { at: "study it,", label: "study it", color: c.blue },
          { at: "change it,", label: "change it", color: c.violet },
          { at: "share it.", label: "share it", color: c.green },
        ]}
      />
    ),
  },
  { id: "s07", render: () => <GnuParts seg="s07" /> },
  {
    id: "s08",
    render: () => (
      <Era
        seg="s08"
        eyebrow="Step 3"
        year="1991"
        name="The Linux kernel"
        color={c.blue}
        sub={{ at: "a new kernel", text: "a new kernel for personal computers" }}
        people={[{ at: "Linus Torvalds", label: "Linus Torvalds" }]}
        facts={[
          { at: "Finnish student", text: "A Finnish student" },
          { at: "hobby project:", text: "Started as a hobby project" },
          { at: "shared the source", text: "Source code shared online" },
          { at: "invited others", text: "Everyone invited to help" },
        ]}
      />
    ),
  },
  {
    id: "s09",
    render: () => (
      <Combine
        seg="s09"
        eyebrow="The key point"
        lead={{ at: "Think of a car", text: "Think of a car: an engine, and everything built around it" }}
        parts={[
          { at: "essential tools", label: "GNU tools", sub: "the essential tools", color: c.teal },
          { at: "built an engine,", label: "Linux kernel", sub: "the engine", color: c.blue },
        ]}
        result={{ at: "Put the two", label: "GNU/Linux", sub: "a complete, free operating system", color: c.accent }}
        emphasis={{ part: 1, at: "belongs only to", note: "the name “Linux” strictly belongs to the kernel" }}
        resultChip={{ at: "In everyday speech,", label: "everyday: just “Linux”", color: c.green }}
      />
    ),
  },
  {
    id: "s10",
    render: () => (
      <Combine
        seg="s10"
        eyebrow="Step 4: distributions"
        parts={[
          { at: "the kernel,", label: "Linux kernel", sub: "the engine", color: c.blue },
          { at: "the GNU tools,", label: "GNU tools", sub: "shell, utilities, compiler", color: c.teal },
          { at: "an installer", label: "Installer", sub: "sets it up on your computer", color: c.violet },
        ]}
        result={{ at: "called distributions.", label: "Distribution", sub: "ready to install and use", color: c.accent }}
        resultChip={{ at: "Ubuntu,", label: "Ubuntu: in our lab", color: c.green }}
      />
    ),
  },
  {
    id: "s11",
    render: () => (
      <TileGrid
        seg="s11"
        at="web servers."
        eyebrow="Step 5: where Linux runs today"
        tiles={[
          { at: "web servers.", icon: Icon.server, title: "Web servers", sub: "most of them run Linux" },
          { at: "supercomputers.", icon: Icon.cpu, title: "Supercomputers", sub: "all 500 of the fastest" },
          { at: "Cloud platforms.", icon: Icon.cloud, title: "Cloud platforms", sub: "the machines behind the cloud" },
          { at: "Android phones.", icon: Icon.phone, title: "Android phones", sub: "built on the Linux kernel" },
          { at: "Routers,", icon: Icon.router, title: "Routers", sub: "the box that connects your home" },
          { at: "cars,", icon: Icon.tv, title: "Cars and TVs", sub: "dashboards and screens" },
        ]}
        footer={{
          at: "Many of these",
          node: <Footer>Many of these use only the kernel, not the GNU tools</Footer>,
        }}
      />
    ),
  },

  // ----------------------------------------------------------------------------------------------------
  // Hands-on: one continuous terminal clip. Terminal grid: row 0 = first prompt line after a `clear`.
  // ----------------------------------------------------------------------------------------------------
  {
    id: "s12",
    render: () => {
      const S = "s12";
      const tType = at(S, "distribution we're") - 0.7;
      const tLook = at(S, "Look at the first");
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "start", lead: -0.4 },
            { at: at(S, "I'll open") - 1.5, event: "open_term", lead: 0, rate: 1.3 },
            { at: tType, event: "type_osr", lead: 0.2 },
            HOLD("clear1", 0.6),
          ]}
          cams={[{ at: tLook - 0.3, rect: [0, 40, 960, 540], dur: 1.1 }]}
          lowerThirds={[{ from: at(S, "print it") + 0.3, to: tLook + 0.2, cmd: "cat /etc/os-release", meaning: "print the contents of a file" }]}
          highlights={[
            { from: at(S, "first line:"), to: at(S, "LTS means"), rect: cell(1, 0, 32), label: "the distribution and its version", side: "right" },
            { from: at(S, "LTS means"), to: at(S, "Further down,"), rect: cell(1, 28, 3), label: "LTS = long-term support", side: "right", color: c.teal },
            { from: at(S, "VERSION adds"), to: at(S, "ID_LIKE says"), rect: cell(4, 21, 18), label: "its code name", side: "right", color: c.violet },
            { from: at(S, "ID_LIKE says"), to: 99, rect: cell(7, 0, 14), label: "built on Debian", side: "right", color: c.blue },
          ]}
        />
      );
    },
  },
  {
    id: "s13",
    cut: true,
    render: () => {
      const S = "s13";
      const tNow = at(S, "Now try");
      const tEnterO = at(S, "And there is") - 0.15;
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "type_unr", lead: 0.3 },
            { at: tNow, event: "type_uno", lead: 0.3 },
            { at: tEnterO, event: "enter_uno", lead: 0.1 }, // command sits typed, Return pressed as the answer is announced
            HOLD("clear2", 0.6),
          ]}
          cams={[{ at: 0, rect: [0, 40, 960, 540], dur: 0.01 }]}
          lowerThirds={[
            { from: at(S, "prints the"), to: at(S, "The word") + 0.4, cmd: "uname -r", meaning: "print just the kernel release" },
            { from: tNow + 0.9, to: tEnterO + 1.2, cmd: "uname -o", meaning: "print the operating system's name" },
          ]}
          highlights={[
            { from: at(S, "kernel release,"), to: at(S, "The word"), rect: cell(1, 0, 32), label: "kernel release", side: "bottom", color: c.teal },
            { from: at(S, "microsoft appears"), to: tNow, rect: cell(1, 9, 9), label: "built by Microsoft for WSL", side: "bottom", dy: 28 },
            { from: at(S, "GNU/Linux.") - 0.1, to: 99, rect: cell(3, 0, 9), label: "the name from lesson 1.1", side: "right", color: c.green },
          ]}
        />
      );
    },
  },
  {
    id: "s14",
    cut: true,
    render: () => {
      const S = "s14";
      const tType = at(S, "with bash") - 0.2;
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "clear2", lead: 0.6 },
            { at: tType, event: "type_bash", lead: 0.3 },
            HOLD("clear3", 0.6),
          ]}
          cams={[{ at: 0, rect: [0, 40, 960, 540], dur: 0.01 }]}
          lowerThirds={[{ from: tType + 2.3, to: at(S, "One honest"), cmd: "bash --version", meaning: "ask the shell which version it is" }]}
          highlights={[
            { from: at(S, "GNU bash,") - 0.1, to: 99, rect: cell(1, 0, 57), label: "GNU bash: the shell from the GNU project", side: "right", color: c.teal },
          ]}
        >
          <NoteCard from={at(S, "One honest")} to={99} x={1010} y={640} w={800} accent={c.accent}>
            <div style={{ fontSize: 24, color: c.muted, fontWeight: 700, letterSpacing: 2 }}>HONEST NOTE</div>
            <div style={{ marginTop: 6, fontSize: 31 }}>
              Ubuntu 26.04 ships some basic tools (<Mono>ls</Mono>, <Mono>cat</Mono>, <Mono>uname</Mono>) as modern rewrites of the GNU originals. The name <Mono color={c.green}>GNU/Linux</Mono> still describes the whole system. <Mono color={c.teal}>bash</Mono> is still the GNU original.
            </div>
          </NoteCard>
        </ClipScene>
      );
    },
  },
  {
    id: "s15",
    cut: true,
    render: () => {
      const S = "s15";
      const tType = at(S, "with ls") - 0.5;
      const tTypical = at(S, "On a typical");
      const tLook = at(S, "But look at");
      const tBecause = at(S, "That's because");
      const tNormal = at(S, "On a normal");
      const Typical = (
        <>
          <div style={{ fontSize: 24, color: c.muted, fontWeight: 700, letterSpacing: 2 }}>EXAMPLE: A TYPICAL INSTALLED UBUNTU (NOT THIS LAB)</div>
          <div style={{ marginTop: 12, fontFamily: font.mono, fontSize: 32, fontVariantLigatures: "none" }}>
            <span style={{ color: c.green }}>$ </span>ls /boot
          </div>
          <div style={{ marginTop: 6, fontFamily: font.mono, fontSize: 32, fontVariantLigatures: "none", lineHeight: 1.45 }}>
            <div style={{ color: c.muted }}>grub&nbsp;&nbsp;initrd.img-…&nbsp;&nbsp;config-…&nbsp;&nbsp;…</div>
            <div>
              <span style={{ color: c.accent }}>vmlinuz-…</span>
              <span style={{ color: c.teal }}>{"   ← the Linux kernel itself"}</span>
            </div>
          </div>
        </>
      );
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "clear3", lead: 0.6 },
            { at: tType, event: "type_boot", lead: 0.3 },
            HOLD("clear4", 0.6),
          ]}
          cams={[{ at: 0, rect: [0, 40, 960, 540], dur: 0.01 }]}
          lowerThirds={[{ from: tType + 1.8, to: tTypical + 2.5, cmd: "ls /boot", meaning: "list the files in the boot directory" }]}
          highlights={[{ from: tLook, to: tBecause, rect: cell(1, 0, 21), label: "nothing listed: the folder is empty", side: "bottom", color: c.accent }]}
        >
          <NoteCard from={tTypical} to={tLook - 0.1} x={760} y={330} w={1090} accent={c.teal}>
            {Typical}
          </NoteCard>
          <NoteCard from={tBecause} to={tNormal - 0.2} x={760} y={330} w={1090} accent={c.accent}>
            <div style={{ fontSize: 24, color: c.muted, fontWeight: 700, letterSpacing: 2 }}>WHY IT IS EMPTY</div>
            <div style={{ marginTop: 8 }}>This lab is a container: a small, isolated environment that shares the kernel of the machine underneath.</div>
          </NoteCard>
          <NoteCard from={tNormal} to={99} x={760} y={330} w={1090} accent={c.teal}>
            {Typical}
          </NoteCard>
        </ClipScene>
      );
    },
  },
  {
    id: "s16",
    cut: true,
    render: () => {
      const S = "s16";
      const tType = at(S, "command man") - 0.3;
      const tName = at(S, "Look at the name");
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "clear4", lead: 0.6 },
            { at: tType, event: "type_man", lead: 0.3 },
          ]}
          // full frame while the page is typed and read (its long DESCRIPTION lines run to the right edge), zoomed to the
          // NAME / SYNOPSIS block while the narration points at it, then back out
          cams={[
            { at: tName - 0.3, rect: [0, 40, 960, 540], dur: 1.0 },
            { at: at(S, "The manual pages") - 0.2, rect: null, dur: 1.0 },
          ]}
          lowerThirds={[{ from: tType + 3.0, to: tName + 0.3, cmd: "man man | head -20", meaning: "show the manual page for man: first 20 lines" }]}
          highlights={[
            { from: at(S, "the name line:"), to: at(S, "The manual pages"), rect: cell(3, 0, 57, 2), label: "NAME: a one-line summary", side: "right", color: c.teal },
          ]}
        />
      );
    },
  },
  {
    id: "s17",
    render: () => (
      <TryIt
        seg="s17"
        listAt="run these"
        cmdW={520}
        commands={[
          { cmd: "cat /etc/os-release", what: "your distribution" },
          { cmd: "uname -r", what: "kernel release" },
          { cmd: "uname -o", what: "GNU/Linux" },
          { cmd: "bash --version", what: "GNU bash" },
          { cmd: "ls /boot", what: "kernel files?" },
          { cmd: "man man | head -20", what: "the manual" },
        ]}
        note={{ at: "If you don't have", text: "No Linux yet? Just watch for now. You'll build your own lab in Lesson 1.5." }}
      />
    ),
  },
  {
    id: "s18",
    render: () => (
      <Recap
        seg="s18"
        points={[
          { at: "Unix, from", title: "Unix, 1969", body: "The design: a tree of files, small tools, the pipe", color: c.accent },
          { at: "The GNU project,", title: "GNU, 1983", body: "The free tools: shell, compiler, utilities", color: c.teal },
          { at: "And Linus Torvalds,", title: "Linux, 1991", body: "The kernel", color: c.blue },
          { at: "Put together,", title: "Together: GNU/Linux", body: "A complete, free operating system", color: c.green },
        ]}
      />
    ),
  },
  { id: "s19", bare: true, render: () => <NextUp seg="s19" /> },
];
