import React from "react";
import { useCurrentFrame } from "remotion";
import { Icon } from "../../kit";
import { NextUp, Recap, TileGrid, TitleObjectives, TryIt } from "../../scenes/Cards";
import { ClipScene, NoteCard } from "../../scenes/Clip";
import { cell, HOLD, Scrim, SegmentDef } from "../../scenes/Common";
import { at } from "../../timing";
import { c, easeOut, font, FPS } from "../../theme";
import { Devices } from "./Devices";
import { LayersKernel, LayersOS } from "./Layers";

/**
 * Scene map for Lesson 1.1 "What is an operating system?" — the reference lesson.
 * One entry per segment of lessons/1.1/script.json, in order. Every time is anchored to a spoken
 * phrase with at(seg, "phrase") so the whole edit re-syncs when the voice changes.
 */

/** Lesson-specific overlay: "JOB n / 4" badge over the four-jobs footage. */
const JobBadge: React.FC<{ n: number; title: string }> = ({ n, title }) => {
  const t = useCurrentFrame() / FPS;
  const p = easeOut((t - 0.1) / 0.5);
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        bottom: 72,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "rgba(12,17,31,0.94)",
        border: `1px solid ${c.line}`,
        borderRadius: 18,
        padding: "16px 26px",
        boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
        fontFamily: font.ui,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: c.accent }}>JOB {n} / 4</div>
      <div style={{ width: 1, height: 30, background: c.line }} />
      <div style={{ fontSize: 32, fontWeight: 700, color: c.text }}>{title}</div>
    </div>
  );
};

export const segments: SegmentDef[] = [
  {
    id: "s01",
    bare: true,
    render: () => (
      <TitleObjectives
        seg="s01"
        headingAt="By the end"
        objectives={[
          { at: "explain what", text: "Explain what an operating system does" },
          {
            at: "name three",
            text: "Name three key ideas",
            chips: [
              { at: "the kernel,", label: "Kernel", color: c.teal },
              { at: "the shell,", label: "Shell", color: c.accent },
              { at: "user space.", label: "User space", color: c.blue },
            ],
          },
        ]}
      />
    ),
  },
  {
    id: "s02",
    render: () => {
      const S = "s02";
      const q1 = at(S, "who decides which");
      const q2 = at(S, "Who decides where");
      const q3 = at(S, "And what happens");
      const ans = at(S, "The answer");
      const end = 60;
      return (
        <ClipScene clip="desktop" beats={[{ at: 0, event: "open_files", lead: 1.6, rate: 1.5 }]}>
          <Scrim from={q1 - 0.3} to={end} />
          <NoteCard from={q1} to={ans + 0.2} x={460} y={250} w={1000}>
            Who decides which program gets the processor?
          </NoteCard>
          <NoteCard from={q2} to={ans + 0.2} x={460} y={400} w={1000}>
            Who decides where the files are stored?
          </NoteCard>
          <NoteCard from={q3} to={ans + 0.2} x={460} y={550} w={1000}>
            What happens when you plug in a USB drive?
          </NoteCard>
          <NoteCard from={ans + 0.5} x={560} y={420} w={800} accent={c.teal}>
            <div style={{ fontSize: 26, color: c.muted, fontWeight: 700, letterSpacing: 3 }}>THE ANSWER</div>
            <div style={{ fontSize: 60, fontWeight: 800, marginTop: 6 }}>The Operating System</div>
          </NoteCard>
        </ClipScene>
      );
    },
  },
  { id: "s03", render: () => <LayersOS /> },
  {
    id: "s04",
    render: () => (
      <TileGrid
        seg="s04"
        at="four main jobs."
        eyebrow="Four jobs of an operating system"
        kicker="JOB"
        tiles={[
          { icon: Icon.process, title: "Process management", sub: "Which program runs, when, for how long" },
          { icon: Icon.memory, title: "Memory management", sub: "Each program gets its own protected space" },
          { icon: Icon.folder, title: "File systems", sub: "Turns disk blocks into files and directories" },
          { icon: Icon.plug, title: "Device control", sub: "Talks to hardware through drivers" },
        ]}
      />
    ),
  },
  {
    id: "s05",
    render: () => {
      const S = "s05";
      return (
        <ClipScene
          clip="sysmon"
          beats={[{ at: 0, event: "procs", lead: 1.0 }, HOLD("to_resources", 0.2)]}
          cams={[{ at: 0.2, rect: [160, 110, 1600, 900], dur: 1.2 }]}
          highlights={[
            { from: at(S, "you can see"), to: at(S, "The operating system decides"), rect: [166, 150, 1586, 312], label: "Every line is one running process", side: "bottom" },
            { from: at(S, "decides which") + 0.6, to: 99, rect: [1396, 128, 82, 440], label: "Share of the CPU right now", side: "left" },
          ]}
        >
          <JobBadge n={1} title="Process management" />
        </ClipScene>
      );
    },
  },
  {
    id: "s06",
    cut: true,
    render: () => {
      const S = "s06";
      return (
        <ClipScene
          clip="sysmon"
          beats={[{ at: 0, event: "to_resources", lead: 0.2 }]}
          cams={[{ at: 1.6, rect: [180, 340, 1080, 608], dur: 1.3 }]}
          highlights={[
            { from: at(S, "its own space"), to: at(S, "This graph") + 0.2, rect: [206, 376, 1052, 108], label: "Memory use over the last minute", side: "bottom" },
            { from: at(S, "This graph") + 0.3, to: 99, rect: [272, 506, 196, 64], label: "In use right now", side: "right" },
          ]}
        >
          <JobBadge n={2} title="Memory management" />
        </ClipScene>
      );
    },
  },
  {
    id: "s07",
    render: () => {
      const S = "s07";
      return (
        <ClipScene
          clip="files"
          beats={[
            { at: 0, event: "tour", lead: 1.0 },
            // the scripted double-click lands ~3 s after the marker; /etc shows around "open them"
            { at: at(S, "which Linux calls") - 1.0, event: "open_etc", lead: 0 },
            { at: at(S, "What you're seeing") - 0.5, event: "back", lead: 0.1 },
            HOLD("top", -0.5),
          ]}
          cams={[{ at: 0.3, rect: [160, 66, 1600, 900], dur: 1.2 }]}
          highlights={[
            { from: at(S, "files and folders,"), to: at(S, "which Linux calls") + 1.8, rect: [350, 160, 1360, 210], label: "Directories (folders)", side: "bottom" },
            { from: at(S, "very top") - 0.2, to: 99, rect: [312, 132, 32, 26], label: "/  the root: top of the whole tree", side: "right" },
          ]}
        >
          <NoteCard from={at(S, "This folder,")} to={at(S, "what you're seeing") - 0.2} x={1100} y={760} w={700} accent={c.teal}>
            <span style={{ fontFamily: font.mono, color: c.accent }}>/etc</span> holds the system's settings
          </NoteCard>
          <JobBadge n={3} title="File systems" />
        </ClipScene>
      );
    },
  },
  {
    id: "s08",
    cut: true,
    render: () => {
      const S = "s08";
      const tDev = at(S, "here in the dev directory.");
      return (
        <ClipScene
          clip="files"
          beats={[
            { at: 0, event: "top", lead: -0.5 },
            { at: tDev - 3.4, event: "open_dev", lead: 0 }, // /dev icons are drawn ~3.5 s after the marker
          ]}
          cams={[{ at: 0, rect: [160, 66, 1600, 900], dur: 0.01 }]}
          highlights={[
            { from: tDev + 0.6, to: 99, rect: [1446, 270, 248, 104], label: "Disks", side: "top", color: c.teal },
            { from: tDev + 0.6, to: 99, rect: [358, 370, 362, 104], label: "Disks", side: "bottom", color: c.teal },
            { from: tDev + 1.4, to: 99, rect: [1174, 370, 520, 104], label: "Terminals (tty)", side: "bottom" },
          ]}
        >
          <JobBadge n={4} title="Device control" />
        </ClipScene>
      );
    },
  },
  { id: "s09", render: () => <LayersKernel /> },
  { id: "s10", render: () => <Devices /> },
  {
    id: "s11",
    render: () => {
      const S = "s11";
      const tCmd = at(S, "The command");
      const row1 = (col: number, len: number) => cell(1, col, len);
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "start", lead: -0.4 },
            { at: at(S, "I'll open") - 0.5, event: "open_term", lead: 0 },
            { at: tCmd, event: "type_uname_a", lead: 0.2 },
            HOLD("type_uname_r", 0.6),
          ]}
          cams={[
            { at: at(S, "Let's read it") - 0.3, rect: [0, 40, 760, 428], dur: 1.1 },
            { at: at(S, "Then comes") - 0.3, rect: [180, 40, 960, 540], dur: 1.1 },
            { at: at(S, "And near the end,") - 0.3, rect: [700, 40, 700, 394], dur: 1.1 },
          ]}
          lowerThirds={[{ from: tCmd + 0.6, to: at(S, "Let's read it") + 0.2, cmd: "uname -a", meaning: "print all system information" }]}
          highlights={[
            { from: at(S, "the word Linux."), to: at(S, "Then comes"), rect: row1(0, 5), label: "kernel name", side: "bottom" },
            { from: at(S, "machine's name,"), to: at(S, "Then comes"), rect: row1(6, 9), label: "hostname", side: "bottom", color: c.blue },
            { from: at(S, "kernel release,"), to: at(S, "And near the end,"), rect: row1(16, 32), label: "kernel release", side: "bottom", color: c.teal },
            { from: at(S, "details of how"), to: at(S, "And near the end,"), rect: row1(49, 51), label: "how and when it was built", side: "bottom", color: c.violet },
            { from: at(S, "x86_64"), to: 99, rect: row1(101, 6), label: "CPU type", side: "bottom" },
            { from: at(S, "GNU/Linux.") - 0.1, to: 99, rect: row1(108, 9), label: "Lesson 1.2", side: "top", color: c.green },
          ]}
        />
      );
    },
  },
  {
    id: "s12",
    cut: true,
    render: () => {
      const S = "s12";
      const tType = at(S, "I type");
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "type_uname_r", lead: 0.6 },
            { at: tType, event: "type_uname_r", lead: 0.1 },
            HOLD("type_shell", 0.6),
          ]}
          cams={[
            { at: 0, rect: [0, 40, 960, 540], dur: 1.0 },
            { at: tType + 1.6, rect: [0, 40, 720, 405], dur: 1.0 },
          ]}
          lowerThirds={[{ from: tType + 0.4, to: at(S, "Now, you may") + 0.4, cmd: "uname -r", meaning: "print just the kernel release" }]}
          highlights={[
            { from: tType + 1.6, to: at(S, "Now, you may"), rect: cell(3, 0, 32), label: "kernel release", side: "bottom", color: c.teal },
            { from: at(S, "microsoft"), to: 99, rect: cell(3, 9, 9), label: "built by Microsoft for WSL", side: "bottom" },
          ]}
        >
          <NoteCard from={at(S, "We'll set up")} to={99} x={1180} y={760} w={640} accent={c.teal}>
            <div style={{ fontSize: 24, color: c.muted, fontWeight: 700, letterSpacing: 2 }}>COMING UP</div>
            <div style={{ marginTop: 4 }}>Lesson 1.5: set up WSL on your own PC</div>
          </NoteCard>
        </ClipScene>
      );
    },
  },
  {
    id: "s13",
    cut: true,
    render: () => {
      const S = "s13";
      const tType = at(S, "echo");
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "type_shell", lead: 0.6 },
            { at: tType - 0.2, event: "type_shell", lead: 0.1 },
            HOLD("clear", 0.6),
          ]}
          cams={[{ at: 0, rect: [0, 40, 720, 405], dur: 0.01 }]}
          lowerThirds={[{ from: tType + 0.5, to: at(S, "On most systems,"), cmd: "echo $SHELL", meaning: "show your login shell" }]}
          highlights={[{ from: at(S, "bash."), to: 99, rect: cell(5, 0, 9), label: "login shell: bash", side: "right" }]}
        />
      );
    },
  },
  {
    id: "s14",
    cut: true,
    render: () => {
      const S = "s14";
      const tPs = at(S, "ps aux,") - 1.1;
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "clear", lead: 0.6 },
            { at: tPs, event: "clear", lead: 0 },
            HOLD("type_free", 0.6),
          ]}
          cams={[
            { at: 0, rect: [0, 40, 1920, 1080], dur: 0.8 },
            { at: at(S, "That vertical bar") - 0.3, rect: [0, 40, 1040, 585], dur: 1.1 },
            { at: at(S, "on the far right,") - 0.3, rect: [560, 40, 1340, 754], dur: 1.2 },
          ]}
          lowerThirds={[{ from: tPs + 1.0, to: at(S, "That vertical bar") - 0.1, cmd: "ps aux | head -5", meaning: "list processes, keep the first 5 lines" }]}
          highlights={[
            { from: at(S, "That vertical bar"), to: at(S, "Head keeps") - 0.1, rect: cell(0, 28, 1), label: "| the pipe", side: "bottom", color: c.green },
            { from: at(S, "a header,"), to: at(S, "then four processes."), rect: cell(1, 0, 94), label: "header line", side: "bottom", color: c.blue },
            { from: at(S, "then four processes."), to: at(S, "the user") - 0.1, rect: cell(2, 0, 94, 4), label: "4 processes, one per line", side: "bottom" },
            { from: at(S, "the user"), to: at(S, "its process ID,") - 0.1, rect: cell(1, 0, 4, 5), label: "USER", side: "bottom", color: c.blue },
            { from: at(S, "its process ID,"), to: at(S, "how much CPU") - 0.1, rect: cell(1, 9, 5, 5), label: "PID: process ID", side: "bottom", color: c.teal },
            { from: at(S, "how much CPU"), to: at(S, "on the far right,"), rect: cell(1, 15, 9, 5), label: "%CPU and %MEM", side: "bottom", color: c.violet },
            { from: at(S, "the command that"), to: 99, rect: cell(1, 65, 60, 5), label: "COMMAND that started it", side: "bottom" },
          ]}
        />
      );
    },
  },
  {
    id: "s15",
    cut: true,
    render: () => {
      const S = "s15";
      const tType = at(S, "free") - 0.2;
      return (
        <ClipScene
          clip="terminal"
          beats={[
            { at: 0, event: "type_free", lead: 0.6 },
            { at: tType, event: "type_free", lead: 0.1 },
          ]}
          cams={[
            { at: 0, rect: [560, 40, 1100, 619], dur: 0.01 },
            { at: 0.2, rect: [0, 150, 1060, 596], dur: 1.2 },
          ]}
          lowerThirds={[{ from: tType + 0.5, to: at(S, "Total is"), cmd: "free -h", meaning: "show memory in human-readable units" }]}
          highlights={[
            { from: at(S, "gigabytes"), to: at(S, "Total is"), rect: cell(8, 15, 5), label: "Gi = gibibytes (1024-based GB)", side: "bottom", color: c.blue },
            { from: at(S, "Total is"), to: at(S, "Used is") - 0.1, rect: cell(7, 15, 5, 2), label: "total", side: "bottom", color: c.teal },
            { from: at(S, "Used is"), to: at(S, "And available") - 0.1, rect: cell(7, 27, 5, 2), label: "used", side: "bottom", color: c.violet },
            { from: at(S, "And available"), to: at(S, "Don't worry") - 0.1, rect: cell(7, 71, 9, 2), label: "available for new programs", side: "bottom" },
            { from: at(S, "Don't worry"), to: at(S, "Linux borrows") - 0.1, rect: cell(7, 40, 4, 2), label: "free: completely unused", side: "bottom", color: c.blue },
            { from: at(S, "Linux borrows"), to: at(S, "That's why") - 0.1, rect: cell(7, 58, 10, 2), label: "cache: borrowed, given back on demand", side: "bottom", color: c.teal },
            { from: at(S, "That's why"), to: 99, rect: cell(7, 71, 9, 2), label: "the number to watch", side: "bottom" },
          ]}
        />
      );
    },
  },
  {
    id: "s16",
    render: () => (
      <TryIt
        seg="s16"
        listAt="run these"
        commands={[
          { cmd: "uname -a", what: "system information" },
          { cmd: "uname -r", what: "kernel release" },
          { cmd: "echo $SHELL", what: "your shell" },
          { cmd: "ps aux | head -5", what: "a few processes" },
          { cmd: "free -h", what: "memory usage" },
        ]}
        note={{ at: "If you don't", text: "No Linux yet? Just watch for now. You'll build your own lab in Lesson 1.5." }}
      />
    ),
  },
  {
    id: "s17",
    render: () => (
      <Recap
        seg="s17"
        points={[
          { at: "The operating system", title: "Operating system", body: "Manages the hardware on behalf of your applications", color: c.accent },
          { at: "The kernel", title: "Kernel", body: "The core: full access to hardware, does the four jobs", color: c.teal },
          { at: "The shell", title: "Shell", body: "How you talk to the kernel: you type, it asks", color: c.accent },
          { at: "And user space", title: "User space", body: "Where your programs (and the shell) run", color: c.blue },
        ]}
      />
    ),
  },
  { id: "s18", bare: true, render: () => <NextUp seg="s18" /> },
];
