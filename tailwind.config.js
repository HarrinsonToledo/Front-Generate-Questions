/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: ({
        theme
      }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray[800]'),
            '--tw-prose-headings': theme('colors.gray[900]'),
            '--tw-prose-lead': theme('colors.gray[700]'),
            '--tw-prose-links': theme('colors.gray[900]'),
            '--tw-prose-bold': theme('colors.gray[900]'),
            '--tw-prose-counters': theme('colors.gray[600]'),
            '--tw-prose-bullets': theme('colors.gray[400]'),
            '--tw-prose-hr': theme('colors.gray[300]'),
            '--tw-prose-quotes': theme('colors.gray[900]'),
            '--tw-prose-quote-borders': theme('colors.gray[300]'),
            '--tw-prose-captions': theme('colors.gray[700]'),
            '--tw-prose-code': theme('colors.gray[900]'),
            '--tw-prose-pre-code': theme('colors.gray[100]'),
            '--tw-prose-pre-bg': theme('colors.gray[900]'),
            '--tw-prose-th-borders': theme('colors.gray[300]'),
            '--tw-prose-td-borders': theme('colors.gray[200]'),
            '.katex-display, .katex': {
              margin: '0',
              padding: '0',
              'font-size': 'inherit',
              'line-height': 'inherit',
              'text-indent': '0'
            },
            '.katex-display': {
              'overflow-x': 'auto',
              'overflow-y': 'hidden',
            }
          }
        }
      })
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
