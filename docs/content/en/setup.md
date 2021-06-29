---
title: 'Setup'
description: ''
position: 102
category: 'Getting started'
---

Check the [Nuxt.js documentation](https://nuxtjs.org/guides/configuration-glossary/configuration-modules) for more information about installing and using modules in Nuxt.js.

## Installation

Add `@cusy/plone-nuxt` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @cusy/plone-nuxt
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @cusy/plone-nuxt
  ```

  </code-block>
</code-group>

Then, add `@cusy/plone-nuxt` to the `modules` section of `nuxt.config.js`:

```js[nuxt.config.js]
{
  modules: [
    '@cusy/plone-nuxt'
  ],
  plone: {
    // Options
    url: 'http://localhost:8080/Plone',
    languages: ['en', 'de', 'es']
  }
}
```
