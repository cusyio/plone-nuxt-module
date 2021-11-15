<template>
  <component :is="wrapper">
    <pre>Hello Default Component via hook</pre>
    <h1>{{ content.title }}</h1>
    <p v-if="content.description">
      {{ content.description }}
    </p>
  </component>
</template>

<script>
export default {
  name: 'PloneLayoutBase',
  props: {
    wrapper: {
      type: String,
      default: 'div'
    },
    content: {
      type: Object,
      required: true
    },
    level: {
      type: [Number, String],
      default: 1
    }
  }
}
</script>

<style></style>
