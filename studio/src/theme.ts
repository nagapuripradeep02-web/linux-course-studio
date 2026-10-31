import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const brand = {
  course: "Linux Foundations",
  tagline: "From first command to confident admin",
};

export const c = {
  bg: "#0A0F1C",
  bg2: "#0F1628",
  panel: "#141C31",
  panelHi: "#1B2540",
  line: "#26314F",
  text: "#EEF1F7",
  muted: "#8E98B3",
  dim: "#5B6684",
  accent: "#F5A524", // amber: the one warm accent
  accentSoft: "rgba(245,165,36,0.14)",
  teal: "#3DD6C6", // kernel / system
  tealSoft: "rgba(61,214,198,0.14)",
  blue: "#6EA8FE",
  violet: "#A78BFA",
  green: "#5BD48A",
};

export const font = {
  ui: inter.fontFamily,
  mono: mono.fontFamily,
};

// Shared easing used everywhere so motion feels consistent and calm.
export const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
export const easeInOut = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
