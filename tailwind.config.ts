import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        px: '1px',
        0: '0',
        0.5: '4px',
        1: '8px',
        1.5: '12px',
        2: '16px',
        2.5: '20px',
        3: '24px',
        3.5: '28px',
        4: '32px',
        5: '40px',
        6: '48px',
        7: '56px',
        8: '64px',
        9: '72px',
        10: '80px',
        11: '88px',
        12: '96px',
        14: '112px',
        16: '128px',
        20: '160px',
        24: '192px',
        28: '224px',
        32: '256px',
        36: '288px',
        40: '320px',
        44: '352px',
        48: '384px',
        52: '416px',
        56: '448px',
        60: '480px',
        64: '512px',
        72: '576px',
        80: '640px',
        96: '768px',
      },
      fontSize: {
        'xs': '0.5rem',
        'sm': '0.707rem',
        'base': '1rem',
        'xl': '1.414rem',
        '2xl': '1.999rem',
        '3xl': '2.827rem',
        '4xl': '3.998rem',
        '5xl': '5.653rem',
        '6xl': '7.993rem',
      },
      opacity: {
        '85': '0.85',
      },
      fontFamily: {
        sans: ['var(--font-greatVibes)']
      },
      colors: {
        'primary': '#A01D35',
        'primary-dark': '#711D2C',
        'secondary': '#B81885',
        'black-10': '#E9E9E9'
      }
    },
  },
  plugins: [],
}
export default config
