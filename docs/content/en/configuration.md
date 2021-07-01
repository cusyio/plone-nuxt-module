---
title: 'Configuration'
description: 'Easily connect your Nuxt.js application to your Plone site.'
position: 103
category: 'Getting started'
---

You can configure `@cusy/plone-nuxt` with the `plone` property in your `nuxt.config.js` or directly when registering the module in the `buildModules` array by using the array syntax.

<code-group>
  <code-block label="plone key" active>

```javascript[nuxt.config.js]
export default {
  plone: {
    /* configuration */
  }
}
```
  </code-block>
  <code-block label="buildModules array">

```javascript[nuxt.config.js]
export default {
  buildModules: {
    ['@cusy/plone-nuxt', {
      /* configuration */
    }]
  }
}
```
  </code-block>
</code-group>

## Properties

### url

- Type: `String`
- `required`

The endpoint of your Plone API.

```javascript[nuxt.config.js]
plone: {
  // Getting content from the local Plone site named `my-site`
  url: 'http://localhost:8080/my-site'
}
```

### languages

- Type: `Array`
- Default: `[]`

The languages your Nuxt.js site should support.
Note that your Plone site can be configured with more languages.

```javascript[nuxt.config.js]
plone: {
  // Enable english and french
  languages: ['en', 'fr']
}
```

### missingLanguagesAllowed

- Type: `Array`
- Default: `[]`

A list of languages which are allowed to be missing on the Plone site.

```javascript[nuxt.config.js]
plone: {
  // Enable english, french and german
  languages: ['en', 'fr', 'de'],
  // German might not be available right now, but this is ok.
  missingLanguagesAllowed: ['de']
}
```

### missingLanguagesError

- Type: `Boolean`
- Default: `true`

When enabled, the provided crawler will throw an error when one of the configured languages is not available on the Plone site.

This is a safeguard for the case your Nuxt.js site is rebuild, but your Plone site is missing a required language. This will stop your build.

```javascript[nuxt.config.js]
plone: {
  // Enable english, french and german
  languages: ['en', 'fr', 'de'],
  // Don’t throw an error when a language is missing on the Plone site
  missingLanguagesError: false
}
```

### disableGenerator

- Type: `Boolean`
- Default: `false`

This module is providing a crawler feature that will crawl your Plone site and extending Nuxt.js `generate.routes` array (see [Nuxt.js documentation](https://nuxtjs.org/guides/configuration-glossary/configuration-generate#routes)) with routes to those.

Since version 2.13 Nuxt.js is shipped with a [built-in crawler](https://nuxtjs.org/guides/configuration-glossary/configuration-generate#crawler) so this module's crawler feature might not be neccessary. If you're using Nuxt.js >= 2.13 you should be interested in disabling this module's generator with this option.

```javascript[nuxt.config.js]
plone: {
  disableGenerator: true // disable module's crawler
}
```

## Defaults

The default configuration only expects you to provide [your Plone API endpoint](#url).

```javascript[nuxt.config.js]
export default {
  plone: {
    disableGenerator: false,
    languages: [],
    missingLanguagesAllowed: [],
    missingLanguagesError: true
  }
}
```
