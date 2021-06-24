const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: {
          fontSize: theme('fontSize.4xl'),
          fontWeight: '700',
          marginBottom: theme('margin.4')
        },
        h2: {
          fontSize: theme('fontSize.2xl'),
          paddingTop: theme('padding.2'),
          paddingBottom: theme('padding.2'),
          borderBottomWidth: '1px',
          borderBottomColor: theme('colors.gray.200'),
          marginTop: theme('margin.4'),
          marginBottom: theme('margin.4')
        },
        h3: { fontSize: theme('fontSize.xl') },
        p: {
          marginBottom: theme('margin.2')
        },
        ol: {
          marginBottom: theme('margin.2')
        },
        ul: {
          marginBottom: theme('margin.2')
        }
      })
    })
  ]
}
