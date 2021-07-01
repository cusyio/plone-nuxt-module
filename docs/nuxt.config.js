import theme from '@nuxt/content-theme-docs'

export default theme({
  docs: {
    primaryColor: '#0095D3'
  },
  loading: { color: '#0095D3' },
  pwa: {
    manifest: {
      name: 'Plone Nuxt'
    }
  },
  router: {
    base: '/plone-nuxt-module/'
  },
  target: 'static'
})
