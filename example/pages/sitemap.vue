<template>
  <div>
    <h1>plone-nuxt-module</h1>
    <h2>getSitemap</h2>
    <pre>{{ sitemap }}</pre>
  </div>
</template>

<script>
export default {
  async asyncData({ $plone }) {
    return { sitemap: await $plone.getSitemap() }
  }
}
</script>
