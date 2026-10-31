import { scriptJson } from "./current";

type Chip = { label: string; color: "accent" | "teal" | "blue" | "violet" | "green" };
export type Script = {
  lesson: {
    bumperSeconds: number;
    module: number;
    moduleTitle: string;
    number: string;
    title: string;
    next: { number: string; title: string };
    thumbnail?: { chips?: Chip[]; prompt?: string; output?: string };
  };
  segments: { id: string; chapter: string; text: string; tail: number }[];
};
export const scriptData = scriptJson as unknown as Script;
export const lesson = scriptData.lesson;
export const BUMPER_SECONDS = lesson.bumperSeconds;
export const chapterOf = (id: string): string => scriptData.segments.find((s) => s.id === id)?.chapter ?? "";
export const tailOf = (id: string): number => scriptData.segments.find((s) => s.id === id)?.tail ?? 0.6;
