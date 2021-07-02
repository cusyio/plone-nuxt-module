---
title: The '$plone' Object
position: 104
category: 'Getting started'
---

This module globally injects a `$plone` object so you can access it anywher using `this.$plone`. For plugins, `asyncData`, `nuxtServerInit` and middlewares, you can access it from `context.$plone`.

## Properties

### baseURL

This is the configured Plone Backend URL.

### client

The Plone JS client instance. Use it to perform queries for your custom REST-API services.

```javascript
async getMyEndppoint(options = {}) {
  const searchOptions = {
    key_1: 'option_1_default',
    key_2: 'option_2_default',
    ...options
  }
  try {
    return await this.client.query('@my-endpint', searchOptions)
  } catch {
    return {}
  }
}
```

### \$config

The merged plone config object. It contains all Plone settings.

## Methods

### extractPathAndQuery(url)

Extract the relative path and query options from a given url.

- `url`: The URL for the resource.

  - Type: `String`
  - Required

- Returns: `Object`

### search(path, searchOptions)

Async search for content at a given path with the given search params.

- `path`: The relative path to search within.

  - Type: `String`
  - Default: `''`
  - Example: `/en/blog`

- `searchOptions`: Search options.
  - Type: `Object`
  - default: `{}`
  - Example:
    ```javascript[Example search options]
    {
      sort_on: 'modified',
      sort_order: 'descending'
    }
    ```
- Returns: `Promise`

This method returns a promise with an object with a list of search result items and optional batch information.

```javascript[Example empty result set]
{
  batching: false,
  error: false,
  items: [],
  items_total: 0
}
```

- `batching`: The batching information, if available.

  - Type: `Object`, `Boolean`
  - Example:
    ```javascript[Example batching result]
    {
      '@id': 'http://localhost:8080/Plone/en/blog/@search?sort_on=modified&sort_order=descending',
      first: 'http://localhost:8080/Plone/en/blog/@search?b_start=0&sort_on=modified&sort_order=descending',
      last: 'http://localhost:8080/Plone/en/blog/@search?b_start=75&sort_on=modified&sort_order=descending',
      next: 'http://localhost:8080/Plone/en/blog/@search?b_start=25&sort_on=modified&sort_order=descending'
    }
    ```

- `error`: Did an error happen during the search?

  - Type: `Boolean`

- `_error`: Detailed error information.

  - Type: `Object`

- `items`: The list of search results.

  - Type: `Array`
  - Example:
    ```javascript[Example result items]
    [
      {
        '@id': 'http://localhost:8080/Plone/en/blog/article-1',
        '@type': 'Document',
        description: '',
        modified: '2021-06-11T08:28:00+00:00',
        review_state: 'published',
        title: 'Article 1'
      },
      {
        '@id': 'http://localhost:8080/Plone/en/blog/article-2',
        '@type': 'Document',
        description: '',
        modified: '2021-06-11T08:28:00+00:00',
        review_state: 'published',
        title: 'Article 2'
      }
      // ...
    ]
    ```

- `items_total`: The total number of search results over all batches.
  - Type: `Number`
  - Example: `77`

### get(path, options)

Get a single content item by path.

- `path`: The relative path to get.
  - Type: `String`
  - Required
- `options`: API options
  - Type: `Obejct`
  - Default: `{}`
- Returns: `Promise`

This method returns a `Promise` with the content object.
