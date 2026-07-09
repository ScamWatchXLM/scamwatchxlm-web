"use client"

import { useTheme } from "next-themes"

/**
 * Literal (non-CSS-variable) color values mirroring the tokens in
 * globals.css. Recharts renders `fill`/`stroke`/`stopColor` as plain SVG
 * presentation attributes rather than inline `style`, and browsers do not
 * reliably resolve `var(--token)` in that position — so data marks (bars,
 * areas, lines) need literal values here. Decorative chrome (gridlines,
 * axis ticks) renders fine with CSS variables and can keep using them.
 */
export const CHART_PALETTE = {
  light: {
    categorical: [
      "#2a78d6",
      "#1baf7a",
      "#eda100",
      "#008300",
      "#4a3aa7",
      "#e34948",
      "#e87ba4",
      "#eb6834",
    ],
    status: {
      good: "#0ca30c",
      warning: "#fab219",
      serious: "#ec835a",
      critical: "#d03b3b",
    },
    surfaceRing: "#fcfcfb",
  },
  dark: {
    categorical: [
      "#3987e5",
      "#199e70",
      "#c98500",
      "#008300",
      "#9085e9",
      "#e66767",
      "#d55181",
      "#d95926",
    ],
    status: {
      good: "#0ca30c",
      warning: "#fab219",
      serious: "#ec835a",
      critical: "#d03b3b",
    },
    surfaceRing: "#1a1a19",
  },
} as const

export function useChartPalette() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === "light" ? CHART_PALETTE.light : CHART_PALETTE.dark
}
