import { timingsJson } from "./current";
import { FPS } from "./theme";

export type Word = { w: string; start: number; end: number };
export type SegTiming = { duration: number; source: string; words: Word[] };

export const timings = timingsJson as unknown as Record<string, SegTiming>;

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9$\-./]/g, "")
    .replace(/\.+$/, "");

/**
 * Seconds (within the segment's narration) where `phrase` is spoken.
 * Matches consecutive display words; `nth` picks a later occurrence.
 */
export function at(seg: string, phrase: string, opts: { nth?: number; edge?: "start" | "end" } = {}): number {
  const t = timings[seg];
  if (!t) throw new Error(`No timings for ${seg}`);
  const target = phrase.split(/\s+/).map(norm);
  let seen = 0;
  for (let i = 0; i + target.length <= t.words.length; i++) {
    let ok = true;
    for (let k = 0; k < target.length; k++) {
      if (norm(t.words[i + k].w) !== target[k]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      seen++;
      if (seen === (opts.nth ?? 1)) {
        return opts.edge === "end" ? t.words[i + target.length - 1].end : t.words[i].start;
      }
    }
  }
  throw new Error(`Phrase "${phrase}" not found in ${seg}`);
}

export const sec = (s: number) => Math.round(s * FPS);
