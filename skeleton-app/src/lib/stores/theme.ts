import { writable, get } from "svelte/store";
import { browser } from "$app/environment";

interface ThemeLabel {
  name: string;
  emoji: string;
}

export const themeLabels: Array<ThemeLabel> = [
  { name: "skeleton", emoji: "💀" },
  { name: "wintry", emoji: "🌨️" },
  { name: "modern", emoji: "🤖" },
  { name: "rocket", emoji: "🚀" },
  { name: "seafoam", emoji: "🧜‍♀️" },
  { name: "vintage", emoji: "📺" },
  { name: "sahara", emoji: "🏜️" },
  { name: "hamlindigo", emoji: "👔" },
  { name: "gold-nouveau", emoji: "💫" },
  { name: "crimson", emoji: "⭕" },
  { name: "custom", emoji: "🎨" },
  { name: "none", emoji: "📝" },
] as const;

export type ThemeName = (typeof themeLabels)[number]["name"];

interface Theme {
  name: ThemeName;
  dark: boolean;
}

const defaultTheme: Theme = { name: themeLabels[0]["name"], dark: false };
const savedTheme =
  typeof localStorage !== "undefined"
    ? JSON.parse(localStorage.getItem("theme") || JSON.stringify(defaultTheme))
    : defaultTheme;

const themeStore = writable<Theme>(savedTheme);

export function getTheme(): Theme {
  return get(themeStore);
}

export function setTheme(theme: Theme): void {
  themeStore.set(theme);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", JSON.stringify(theme));
  }

  applyTheme();
}

export function applyTheme(): void {
  const theme = getTheme();
  if (browser) {
    document.body.setAttribute("data-theme", theme.name);

    const currentMode = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const mode = theme.dark ? "dark" : "light";
    if (currentMode !== mode) {
      document.documentElement.classList.remove(currentMode);
      document.documentElement.classList.add(mode);
    }
  }
}
