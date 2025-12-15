
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        bleu: {
          DEFAULT: "#0579be",
          sombre: "#03476e",
          transparent: "#0579BE80"
        },
        rouge: {
          DEFAULT: "#f44336"
        },
        orange: {
          DEFAULT: "#ff9800"
        },
        blanc: {
          DEFAULT: "#ffffff"
        },
        gris: {
          DEFAULT: "#cccccc",
          sombre: "#888888",
          clair: "#f5f5f5",
          transparent: "#cccccc60",
          desactive: "#6b7280"
        },
        bordure: {
          DEFAULT: "#8080805c"
        }
      },
      fontFamily: {
        liberation: ["Liberation Mono"],
        marianne: ["Marianne-Regular", "sans-serif"],
        "marianne-bold": ["Marianne-Bold", "sans-serif"]
      },
      keyframes: {
        apparition: {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        entreeGauche: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" }
        },
        entreeDroite: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" }
        },
        bounceIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      },
      animation: {
        apparition: "apparition .1s ease",
        "entree-gauche": "entreeGauche 0.2s ease-out 0.1s both",
        "entree-droite": "entreeDroite 0.2s ease-out 0.1s both",
        "bounce-in": "bounceIn 0.3s ease-out forwards"
      },
      transitionProperty: {
        opacity: "opacity"
      }
    }
  },
  plugins: []
};
