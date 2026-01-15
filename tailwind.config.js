export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#E11D48', // Rose 600
                    hover: '#BE123C', // Rose 700
                    light: '#FFF1F2', // Rose 50
                    dark: '#9F1239', // Rose 800
                },
                secondary: {
                    DEFAULT: '#0F172A', // Slate 900
                    hover: '#1E293B', // Slate 800
                    light: '#475569', // Slate 600
                },
                accent: {
                    DEFAULT: '#3B82F6', // Blue 500
                    hover: '#2563EB', // Blue 600
                    light: '#DBEAFE', // Blue 50
                },
                neutral: {
                    DEFAULT: '#F8FAFC', // Slate 50
                    dark: '#020617', // Slate 950
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
                'strong': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
