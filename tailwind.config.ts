import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Material-style surface system ── */
        surface: {
          DEFAULT: "#f7f9ff",
          dim: "#d7dadf",
          bright: "#f7f9ff",
          variant: "#e0e3e8",
          tint: "#79526f",
          container: {
            lowest: "#ffffff",
            low: "#f1f4f9",
            DEFAULT: "#ebeef3",
            high: "#e5e8ee",
            highest: "#e0e3e8",
          },
        },
        "on-surface": {
          DEFAULT: "#181c20",
          variant: "#4e444a",
        },
        "inverse-surface": "#2d3135",
        "inverse-on-surface": "#eef1f6",

        /* ── Primary (Plum) ── */
        primary: {
          DEFAULT: "#57344f",
          container: "#F5ECF2",
          fixed: {
            DEFAULT: "#ffd7f1",
            dim: "#e9b8d9",
          },
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#f0bfe0",
          fixed: {
            DEFAULT: "#2f1029",
            variant: "#5f3b56",
          },
        },
        "inverse-primary": "#e9b8d9",
        "plum-hover": "#5B3A52",
        "plum-subtle": "#EADCE6",

        /* ── Secondary (Teal) ── */
        secondary: {
          DEFAULT: "#00696e",
          container: "#92eff5",
          fixed: {
            DEFAULT: "#95f1f8",
            dim: "#78d5db",
          },
        },
        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#006e73",
          fixed: {
            DEFAULT: "#002022",
            variant: "#004f53",
          },
        },

        /* ── Tertiary (Marker Yellow) ── */
        tertiary: {
          DEFAULT: "#573b00",
          container: "#755000",
          fixed: {
            DEFAULT: "#ffdeac",
            dim: "#febb3c",
          },
        },
        "on-tertiary": {
          DEFAULT: "#ffffff",
          container: "#ffc35a",
          fixed: {
            DEFAULT: "#281900",
            variant: "#5f4100",
          },
        },

        /* ── Error ── */
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-error": {
          DEFAULT: "#ffffff",
          container: "#93000a",
        },

        /* ── Utility & Semantic ── */
        background: "#f7f9ff",
        "on-background": "#181c20",
        outline: {
          DEFAULT: "#80747a",
          variant: "#d1c3ca",
        },
        "section-bg": "#F4F5F6",
        "canvas-white": "#FFFFFF",
        "text-muted": "#555E68",
        "on-surface-muted": "#555E68",
        "border-subtle": "#DEE2E6",

        /* ── Status Badge Tokens ── */
        badge: {
          draft: {
            bg: "#E9ECEF",
            text: "#495057",
          },
          quotation: {
            bg: "#CFE2FF",
            text: "#084298",
          },
          confirmed: {
            bg: "#EADCE6",
            text: "#714B67",
          },
          active: {
            bg: "#D1E7DD",
            text: "#0F5132",
          },
          closed: {
            bg: "#E2E3E5",
            text: "#41464B",
          },
          outstanding: {
            bg: "#FFF3CD",
            text: "#664D03",
          },
          overdue: {
            bg: "#F8D7DA",
            text: "#842029",
          },
          paid: {
            bg: "#D1E7DD",
            text: "#0F5132",
          },
        },
      },

      /* ── Border Radius ── */
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },

      /* ── Spacing tokens ── */
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        gutter: "1.5rem",
        "gutter-sm": "1rem",
        margin: "2rem",
        "margin-mobile": "1rem",
      },

      /* ── Font Family ── */
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
      },

      /* ── Font Size with line-height + weight ── */
      fontSize: {
        "body-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-md": [
          "24px",
          { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.015em",
            fontWeight: "600",
          },
        ],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-xl": [
          "40px",
          {
            lineHeight: "48px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "headline-xl-mobile": [
          "30px",
          {
            lineHeight: "38px",
            letterSpacing: "-0.01em",
            fontWeight: "700",
          },
        ],
        "caption-script": ["20px", { lineHeight: "24px", fontWeight: "600" }],
      },

      /* ── Shadows (Elevation Levels) ── */
      boxShadow: {
        "level-0": "none",
        "level-1":
          "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)",
        "level-2":
          "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        "level-3":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
      },

      /* ── Keyframes ── */
      keyframes: {
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-in",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-out-left": "slide-out-left 0.3s ease-in",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-in",
        "slide-up": "slide-up 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
