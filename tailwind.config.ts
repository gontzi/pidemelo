import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		// Mapas de clases compartidos (p. ej. colores de estado en idea-status.ts)
		"./src/lib/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-body)'],
				heading: ['var(--font-heading)'],
				jakarta: ['var(--font-heading)'],
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				// Identidad y acentos Community-first
				brand: {
					DEFAULT: 'hsl(var(--brand))',
					soft: 'hsl(var(--brand-soft))'
				},
				navy: 'hsl(var(--foreground))',
				coral: 'hsl(var(--accent-coral))',
				green: 'hsl(var(--accent-green))',
				blue: 'hsl(var(--accent-blue))',
				violet: 'hsl(var(--accent-violet))',
				yellow: 'hsl(var(--accent-yellow))',
				mint: 'hsl(135 35% 94%)',
				// Nombres heredados que siguen en uso
				sage: 'hsl(var(--accent-green))',
				skyblue: 'hsl(var(--accent-blue))',
				cream: 'hsl(var(--background))',
				butter: 'hsl(var(--muted))',
				'accent-coral': 'hsl(var(--accent-coral))',
				'accent-green': 'hsl(var(--accent-green))',
				'accent-blue': 'hsl(var(--accent-blue))',
				// Estados semánticos (con variante suave de fondo)
				success: {
					DEFAULT: 'hsl(var(--success))',
					soft: 'hsl(var(--success-soft))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					soft: 'hsl(var(--warning-soft))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					soft: 'hsl(var(--info-soft))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 0.125rem)',
				sm: 'calc(var(--radius) - 0.25rem)',
				xl: 'calc(var(--radius) + 0.125rem)',
				'2xl': 'calc(var(--radius) + 0.25rem)',
			},
			boxShadow: {
				soft: '0 1px 2px 0 hsl(229 25% 20% / 0.04)',
				card: '0 1px 2px hsl(229 25% 20% / 0.04), 0 6px 18px -10px hsl(229 25% 20% / 0.12)',
				brand: '0 6px 18px -6px hsl(var(--brand) / 0.4)',
				pop: '0 12px 32px -12px hsl(229 25% 20% / 0.22)',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				pop: {
					'0%': { transform: 'scale(0.97)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
			},
			animation: {
				float: 'float 6s ease-in-out infinite',
				pop: 'pop 0.2s ease-out',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
