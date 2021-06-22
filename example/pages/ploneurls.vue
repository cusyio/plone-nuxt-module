<template>
  <div>
    <h1>plone-nuxt-module</h1>
    <h2>getAllPloneURLs</h2>
    <pre>{{ result }}</pre>
  </div>
</template>

<script>
export default {
  async asyncData({ $plone }) {
    return { result: await $plone.getAllPloneURLs() }
  }
}
</script>
