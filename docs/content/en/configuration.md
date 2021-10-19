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

The endpoint of your Plone API which will be used as a base for all queries.
This can either be the root of your Plone site or a subfolder.

```javascript[nuxt.config.js]
plone: {
  // Getting content from the local Plone site named `my-site`
  url: 'http://localhost:8080/my-site'
}
```

### languages

- Type: `Array`
- Default: `[]`

Language configuration when using the [plone.app.multilingual](https://github.com/plone/plone.app.multilingual) add-on in Plone.

If your Plone site is configured with multiple languages using the `plone.app.multilingual` add-on, add all the languages your Nuxt project should support.
Note that your Plone site can be configured with more languages than you use in your Nuxt project.

If you don’t use multiple languages in your Plone site, leave this list empty.

<alert type="warning">

Languages are only supported if the base `url` points to the root of your Plone site, not a subfolder!
This is a limitation in Plone itself, as for every language in a multilingual site, you get a language root folder in the root of your Plone site, e.g.:

- http://localhost:8080/Plone/en for English and
- http://localhost:8080/Plone/de for German

</alert>

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

This has no effect if `missingLanguagesError` is set to false.

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

When enabled, the provided generator will throw an error when one of the configured languages is not available on the Plone site.

This is a safeguard for the case your Nuxt.js site is rebuild, but your Plone site is missing a required language. This will stop your build.

```javascript[nuxt.config.js]
plone: {
  // Enable english, french and german
  languages: ['en', 'fr', 'de'],
  // Don’t throw an error when a language is missing on the Plone site
  missingLanguagesError: false
}
```

### updateSitemap

- Type: `Boolean`
- Default: `false`

If you are using the [sitemap module for Nuxt](https://sitemap.nuxtjs.org/), you can enable `updateSitemap` to enhance the information of the individual Plone routes.

By default the sitemap module will take the (dynamic) routes defined in the `generate` property along with the static routes provided by the Nuxt crawler.
The dynamic routes will only contain the url, not the payload the Plone generator provides.
So there is no information available about e.g. the last modification date of an item.

When enabling `updateSitemap`, the Plone generator will add additional information to the dynamic Plone routes:

- `lastmod` with the item’s last modification date
- set `changefreq` to `daily` for collection like content

```javascript[nuxt.config.js]
plone: {
  // Enable sitemap update
  updateSitemap: true
},
sitemap: {
  // No sitemap build caching.
  cacheTime: -1,

  // Set defaults for all sitemap entries.
  // The Plone module will adjust those for dynamic items.
  defaults: {
    changefreq: 'weekly',
    // Use the current date for static content items
    lastmod: new Date(),
  },
},
```

### disableGenerator

- Type: `Boolean`
- Default: `false`

This module is providing a crawler feature (generator) that will crawl your Plone site and extend the Nuxt.js `generate.routes` array (see [Nuxt.js documentation about the routes property](https://nuxtjs.org/guides/configuration-glossary/configuration-generate#routes)) with routes to those.

Since version 2.13 Nuxt.js is shipped with a [built-in crawler](https://nuxtjs.org/guides/configuration-glossary/configuration-generate#crawler), so this module's generator feature might not be neccessary.
If you have Plone content which is hidden from navigation and only linked from within other Plone content, the Nuxt crawler might not be able to find those.
If you are in doubt, keep the Plone generator enabled.

<alert type="info">

The Plone generator fetches all content from the Plone site with full object information. This might be a bit slower to generate, but we provide the object information as a payload to the routes, so no additional API requests are neccessary.
Check out the [Nuxt documentation on how payloads can speed up dynamic route generation](https://nuxtjs.org/docs/configuration-glossary/configuration-generate#speeding-up-dynamic-route-generation-with-payload).

</alert>

```javascript[nuxt.config.js]
plone: {
  // disable module's genrator
  disableGenerator: true
}
```

### nuxtImage (beta)

- Type: `Boolean`
- Default: `false`

<alert type="warning">

This feature is currently in development and not yet ready for production use.

</alert>

With the [nuxt image module](https://image.nuxtjs.org/) we get a plug-and-play image optimization solution for nuxt projects.
If the module is installed and `nuxtImage` enabled in the Plone module settings, images within `RichText` fields will be processed and delivered from within nuxt instead of the Plone site.
This is especially usefull when the site is generated with the `static` target, as then no additional requests have to be made to the Plone backend.

## Defaults

The default configuration only expects you to provide [your Plone API endpoint](#url).

```javascript[nuxt.config.js]
export default {
  plone: {
    disableGenerator: false,
    languages: [],
    missingLanguagesAllowed: [],
    missingLanguagesError: true,
    nuxtImage: false,
    updateSitemap: false
  }
}
```
