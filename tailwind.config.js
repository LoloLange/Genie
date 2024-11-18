/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
				onest: ["Onest", "sans-serif"],
			},
			colors: {
				'black-bg': '#18181B',
				'gray': '#222226',
				'purple': '#5645EE',
				'white-answer': "#DDDDDD",
				'gray-selected': "#36353F",
				'light-mode': '#e0e0e0',
				'light-mode-selected': '#D1D1DC',
			}
		},
	},
	plugins: [typography],
}
