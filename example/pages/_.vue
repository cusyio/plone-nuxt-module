<template>
  <div>
    <h1>{{ item.title }}</h1>
    <h2>{{ item.lastmod }}</h2>
  </div>
</template>

<script>
export default {
  asyncData({ params, error, payload }) {
    if (payload) {
      return { item: payload }
    } else {
      return { item: { title: 'Unknown', lastmod: 'now' } }
    }
  }
}
</script>

<style></style>
