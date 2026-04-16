import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deepest: "#0B1426",
          primary: "#142850",
          secondary: "#1E3A6E",
          accent: "#2A5298",
          highlight: "#3D7EE8",
        },
        amber: {
          primary: "#E8B86D",
          glow: "#F5D29A",
          deep: "#C89654",
        },
        text: {
          primary: "#F0EFE8",
          heading: "#FFFFFF",
          muted: "#8B9DC3",
        },
        agent: {
          rwa: "#4A90E2",
          defi: "#50C9B5",
          x402: "#8B6BD9",
        },
      },
      fontFamily: {
        grotesk: ["var(--font-space-grotesk)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "navy-gradient": "linear-gradient(180deg, #0B1426 0%, #142850 50%, #1E3A6E 100%)",
        "card-gradient": "linear-gradient(135deg, #1E3A6E 0%, #142850 100%)",
        "amber-glow": "linear-gradient(135deg, #E8B86D 0%, #F5D29A 100%)",
        "hero-gradient": "linear-gradient(180deg, #0B1426 0%, #142850 100%)",
      },
      boxShadow: {
        "glow-amber": "0 0 20px rgba(232, 184, 109, 0.3), 0 0 40px rgba(232, 184, 109, 0.1)",
        "glow-blue": "0 0 20px rgba(61, 126, 232, 0.3), 0 0 40px rgba(61, 126, 232, 0.1)",
        "card-hover": "0 8px 32px rgba(42, 82, 152, 0.4), 0 0 0 1px rgba(61, 126, 232, 0.3)",
        "card-base": "0 4px 16px rgba(11, 20, 38, 0.6)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glitch": "glitch 4s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glitch: {
          "0%, 90%, 100%": { transform: "translate(0)" },
          "92%": { transform: "translate(-2px, 1px)" },
          "94%": { transform: "translate(2px, -1px)" },
          "96%": { transform: "translate(-1px, 2px)" },
          "98%": { transform: "translate(1px, -1px)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
