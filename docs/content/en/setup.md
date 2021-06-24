---
title: Setup
description: ''
position: 2
category: Guide
---

Check the [Nuxt.js documentation](https://nuxtjs.org/guides/configuration-glossary/configuration-modules) for more information about installing and using modules in Nuxt.js.

## Installation

Add `@it-spirit/plone-nuxt` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @it-spirit/plone-nuxt
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @it-spirit/plone-nuxt
  ```

  </code-block>
</code-group>

Then, add `@it-spirit/plone-nuxt` to the `modules` section of `nuxt.config.js`:

```js[nuxt.config.js]
{
  modules: [
    '@it-spirit/plone-nuxt'
  ],
  plone: {
    // Options
    url: 'http://localhost:8080/Plone',
    languages: ['en', 'de', 'es']
  }
}
```
