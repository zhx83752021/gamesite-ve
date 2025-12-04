/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 霓虹色系
        neon: {
          purple: '#B026FF',
          pink: '#FF006E',
          blue: '#00D9FF',
          cyan: '#00FFF5',
          green: '#39FF14',
          yellow: '#FFFC00',
        },
        // 赛博朋克主色调
        cyber: {
          dark: '#0A0E27',
          darkest: '#050816',
          blue: '#1E3A8A',
          purple: '#5B21B6',
          pink: '#DB2777',
        },
        // 主题色（霓虹蓝紫渐变）
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cyber': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-neon': 'linear-gradient(135deg, #B026FF 0%, #00D9FF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0E27 0%, #050816 100%)',
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(176, 38, 255, 0.5)',
        'neon-blue': '0 0 20px rgba(0, 217, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 110, 0.5)',
        'cyber': '0 8px 32px rgba(176, 38, 255, 0.3)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(176, 38, 255, 0.5), 0 0 10px rgba(176, 38, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(176, 38, 255, 0.8), 0 0 30px rgba(176, 38, 255, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
