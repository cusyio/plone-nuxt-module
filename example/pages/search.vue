<template>
  <div>
    <h1>plone-nuxt-module</h1>
    <h2>search</h2>
    <h3>Query with params</h3>
    <h4>Query</h4>
    <pre>{{ queryParams }}</pre>
    <h4>Results</h4>
    <pre>{{ resultsParams }}</pre>

    <h3>Searching for searchable text</h3>
    <h4>Query</h4>
    <pre>{{ querySearchbleText }}</pre>
    <h4>Results</h4>
    <pre>{{ resultsSearchbleText }}</pre>
  </div>
</template>

<script>
const queryParams = {
  metadata_fields: ['modified', 'created'],
  sort_on: 'modified',
  sort_order: 'descending'
}

const querySearchbleText = {
  SearchableText: 'Welcome'
}

export default {
  async asyncData({ $plone }) {
    return {
      resultsParams: await $plone.search('/', queryParams),
      resultsSearchbleText: await $plone.search('/', querySearchbleText)
    }
  },
  data() {
    return {
      queryParams,
      querySearchbleText
    }
  }
}
</script>
