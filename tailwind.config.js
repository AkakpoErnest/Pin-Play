/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        krw: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        gaming: {
          50: '#0a0015',
          100: '#1a0033',
          200: '#2d0066',
          300: '#4a0099',
          400: '#6600cc',
          500: '#8800ff',
          600: '#9933ff',
          700: '#aa66ff',
          800: '#bb99ff',
          900: '#ccccff',
        },
        dark: {
          50: '#000000',
          100: '#0d0d0d',
          200: '#1a1a1a',
          300: '#262626',
          400: '#333333',
          500: '#404040',
          600: '#4d4d4d',
          700: '#5a5a5a',
          800: '#666666',
          900: '#737373',
        },
        neon: {
          blue: '#00ffff',
          purple: '#dd00ff',
          pink: '#ff0080',
          green: '#00ff80',
          yellow: '#ffff00',
          orange: '#ff8000',
          red: '#ff0040',
        },
        cyber: {
          50: '#f0f8ff',
          100: '#e0f1ff',
          200: '#c0e3ff',
          300: '#80ccff',
          400: '#40aaff',
          500: '#0088ff',
          600: '#0066cc',
          700: '#004499',
          800: '#002266',
          900: '#001133',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'neon-pulse': 'neonPulse 2s infinite',
        'gradient-x': 'gradientX 3s ease infinite',
        'matrix': 'matrix 4s linear infinite',
        'cyber-glitch': 'cyberGlitch 0.3s ease-in-out infinite',
        'level-up': 'levelUp 1s ease-out',
        'power-up': 'powerUp 0.6s ease-out',
        'hover-lift': 'hoverLift 0.3s ease-out',
        'game-bounce': 'gameBounce 1.2s ease-in-out infinite',
        'neon-border': 'neonBorder 2s ease-in-out infinite',
        'pixel-shift': 'pixelShift 2s ease-in-out infinite',
        'energy-pulse': 'energyPulse 1.5s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(168, 85, 247, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        neonPulse: {
          '0%, 100%': { textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '50%': { textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        cyberGlitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        levelUp: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        powerUp: {
          '0%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0px) scale(1)' },
          '100%': { transform: 'translateY(-8px) scale(1.05)' },
        },
        gameBounce: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '25%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(-5px)' },
          '75%': { transform: 'translateY(-15px)' },
        },
        neonBorder: {
          '0%, 100%': { borderColor: '#00ffff', boxShadow: '0 0 10px #00ffff' },
          '25%': { borderColor: '#dd00ff', boxShadow: '0 0 15px #dd00ff' },
          '50%': { borderColor: '#00ff80', boxShadow: '0 0 20px #00ff80' },
          '75%': { borderColor: '#ffff00', boxShadow: '0 0 15px #ffff00' },
        },
        pixelShift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(1px, -1px)' },
          '50%': { transform: 'translate(-1px, 1px)' },
          '75%': { transform: 'translate(1px, 1px)' },
        },
        energyPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(0, 255, 255, 0.5), inset 0 0 5px rgba(0, 255, 255, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.8), inset 0 0 20px rgba(0, 255, 255, 0.4)' 
          },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
