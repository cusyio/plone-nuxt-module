import theme from '@nuxt/content-theme-docs'

export default theme({
  docs: {
    primaryColor: '#0095D3'
  },
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  },
  loading: { color: '#0095D3' },
  pwa: {
    manifest: {
      name: 'Nuxt Plone'
    }
  }
})
