<template>
  <div>
    <h1>plone-nuxt-module</h1>
    <h2>getContent</h2>
    <pre>{{ content }}</pre>
  </div>
</template>

<script>
export default {
  async asyncData({ $plone }) {
    return { content: await $plone.get('/') }
  }
}
</script>
