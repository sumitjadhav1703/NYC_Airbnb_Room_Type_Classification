module.exports = {
  // script.js emits Tailwind classes from template literals
  // (Build Line cards, recap grid) — it must stay in `content` or they get purged.
  content: ['./index.html', './script.js'],
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
                "on-secondary-container": "#9abcd9",
                "on-background": "#e5e2e1",
                "primary-fixed-dim": "#c6c6c7",
                "on-primary-fixed": "#1a1c1c",
                "background": "transparent",
                "surface-variant": "#353434",
                "on-primary": "#2f3131",
                "inverse-surface": "#e5e2e1",
                "primary-container": "#e2e2e2",
                "secondary-container": "#2a4c65",
                "on-tertiary-fixed": "#1a1c1c",
                "surface": "rgba(20, 19, 19, 0.5)",
                "on-tertiary-fixed-variant": "#454747",
                "on-surface-variant": "#c4c7c8",
                "on-error": "#690005",
                "outline-variant": "#444748",
                "on-secondary-fixed-variant": "#274a62",
                "outline": "#8e9192",
                "tertiary": "#ffffff",
                "secondary": "#a8cbe8",
                "surface-container-highest": "#353434",
                "inverse-on-surface": "#313030",
                "surface-tint": "#c6c6c7",
                "error": "#ffb4ab",
                "surface-container-low": "#1c1b1b",
                "surface-container-high": "#2a2a2a",
                "surface-container": "rgba(32, 31, 31, 0.4)",
                "tertiary-fixed": "#e2e2e2",
                "surface-container-lowest": "#0e0e0e",
                "secondary-fixed-dim": "#a8cbe8",
                "on-primary-container": "#636565",
                "error-container": "#93000a",
                "primary-fixed": "#e2e2e2",
                "on-secondary": "#0c334b",
                "on-secondary-fixed": "#001e2f",
                "secondary-fixed": "#cae6ff",
                "on-tertiary-container": "#636565",
                "surface-bright": "#3a3939",
                "on-surface": "#ffffff",
                "tertiary-container": "#e2e2e2",
                "surface-dim": "#141313",
                "on-primary-fixed-variant": "#454747",
                "on-tertiary": "#2f3131",
                "inverse-primary": "#5d5f5f",
                "primary": "#ffffff",
                "on-error-container": "#ffdad6",
                "tertiary-fixed-dim": "#c6c6c7"
        },
        "borderRadius": {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
        },
        "spacing": {
                "margin-desktop": "64px",
                "unit": "4px",
                "margin-mobile": "20px",
                "container-max": "1200px",
                "gutter": "24px"
        },
        "fontFamily": {
                "body-md": [
                        "Inter"
                ],
                "body-lg": [
                        "Inter"
                ],
                "display-lg-mobile": [
                        "Instrument Serif"
                ],
                "label-caps": [
                        "Inter"
                ],
                "headline-md": [
                        "Instrument Serif"
                ],
                "display-lg": [
                        "Instrument Serif"
                ],
                "headline-sm": [
                        "Instrument Serif"
                ]
        },
        "fontSize": {
                "body-md": [
                        "16px",
                        {
                                "lineHeight": "1.6",
                                "fontWeight": "400"
                        }
                ],
                "body-lg": [
                        "18px",
                        {
                                "lineHeight": "1.6",
                                "letterSpacing": "0.01em",
                                "fontWeight": "400"
                        }
                ],
                "display-lg-mobile": [
                        "48px",
                        {
                                "lineHeight": "1.1",
                                "letterSpacing": "-0.01em",
                                "fontWeight": "400"
                        }
                ],
                "label-caps": [
                        "12px",
                        {
                                "lineHeight": "1.2",
                                "letterSpacing": "0.1em",
                                "fontWeight": "600"
                        }
                ],
                "headline-md": [
                        "40px",
                        {
                                "lineHeight": "1.2",
                                "fontWeight": "400"
                        }
                ],
                "display-lg": [
                        "72px",
                        {
                                "lineHeight": "1.1",
                                "letterSpacing": "-0.02em",
                                "fontWeight": "400"
                        }
                ],
                "headline-sm": [
                        "32px",
                        {
                                "lineHeight": "1.2",
                                "fontWeight": "400"
                        }
                ]
        }
},
    },
  plugins: [require('@tailwindcss/forms')],
}
