---
title: 'The $plone Object'
position: 104
category: 'Getting started'
---

This module globally injects a `$plone` object so you can access it anywher using `this.$plone`. For plugins, `asyncData`, `nuxtServerInit` and middlewares, you can access it from `context.$plone`.

## Properties

### `baseURL`

This is the configured Plone Backend URL.
It should either point to your Plone root (e.g. http://localhost:8080/Plone) or a subfolder or sub site (if you have [collective.lineage](https://github.com/collective/collective.lineage)) installed (e.g. http://localhost:8080/Plone/campaigns/project-1).

If you have a multi-lingual Plone site, but just want to use one language for your Nuxt project, also link to your Plone root and set the desired langage in the `languages` list.

### `client`

This is the [Plone JS client](https://cusyio.github.io/plone-js-sdk/) instance.
The client handles the requests to your Restful Plone-API.

The Plone module ships with some convenience methods for everyday usage (see [methods](#methods) below).
If you want to have full control over request and response, you can use the client directly.

#### Example: Use the client directly to query a custom endpoint

```js
async getMyEndpoint(customQuery = {}) {
  const query = {
    // Set some default query params
    key_1: 'option_1_default',
    key_2: 'option_2_default',
    // Inject custom query params
    ...customQuery
  }
  try {
    return await this.$plone.client.query('@my-endpint', query)
  } catch {
    return {}
  }
}
```

### `$config`

The merged plone config object. It contains all Plone settings.

## Methods

### `extractPathAndQuery()`

Extract the relative path and query options from a given url.

- **Arguments**:

  - `url` (type: `string`, required): The URL for the resource.

- **Returns**: `object` An object with a clean pathName and a pathQuery.

#### Example: Get the query from a url

```js
const url = 'http://localhost:8080/Plone/@search?sort_on=modified'
const { pathName, pathQuery } = this.extractPathAndQuery(url)
console.log(pathname)
//  http://localhost:8080/Plone/@search
console.log({ pathQuery })
// {
//   pathQuery: {
//     sort_on: 'modified'
//   }
// }
```

### `async search()`

Search for content at a given path with the given query.

- **Arguments**:

  - `path` (type: `string`): The relative path to search within.
  - `searchOptions` (type: `object`): Search options.

- **Returns**: `object` An object with a list of search result items and optional batch information.

#### Example: Search for all content

```js
async asyncData({$plone}) {
  const result = await $plone.search('/');
  return {
    items: result.items
  }
}
```

#### Example: Get the latest 5 news items

```js
async asyncData({$plone}) {
  const query = {
    b_size: 5,
    metadata_fields: ['effective'],
    portal_type: ['News Item'],
    sort_on: 'effective',
    sort_order: 'descending',
  }
  const result = await $plone.search('/', query);
  return {
    items: result.items
  }
}
```

### `async get()`

Get a single content item by path.

- **Arguments**:
  - `path` (type: `string`, required): The relative path to get.
  - `options` (type: `object`): API options.
- **Returns**: `object` The content object.

#### Example: Get a single content item for a page

```js
import { withLeadingSlash } from 'ufo'

export default {
  // ...
  async asyncData({ $plone, error, params, payload }) {
    let contentItem = {}
    if (payload && payload['@id']) {
      // Check if we got payload data.
      contentItem = payload
    } else {
      // Get the path from the params
      const path = withLeadingSlash(params?.pathMatch)
      try {
        contentItem = await $plone.get(path)
        if (contentItem.error) {
          // Axios provided error information.
          error({
            statusCode: contentItem?.error?.response?.status || 500,
            message: contentItem?.error?.response?.statusText || 'Unknown error'
          })
        }
      } catch (err) {
        // Something else happened, so that axios was not handle it
        error({
          statusCode: err?.response?.status || 500,
          message:
            err?.message || err?.response?.statusText || 'Internal Server Error'
        })
      }
    }
    return {
      item: contentItem
    }
  }
  // ...
}
```

### `async getNavigation()`

Get the Plone navigation using the `@navigation` endpoint.

- **Arguments**:
  - `path` (type: `string`, required): The relative path for the navigation root.
  - `depth` (type: `number`): How many levels deep should the navigation show?
- **Returns**: `object` An object with a list of navigation items.

#### Example: Fetch the navigation and store the items in the Vuex store

```js

async fetchNavigation({ commit }, nuxtContext) {
  await nuxtContext.$plone.getNavigation('/').then(result => {
    commit('SET_NAVIGATION', result.items)
  })
}
```

### `async getSiteInfo()`

Get the site information from the Plone site.

This method requires [cusy.restapi.info](https://github.com/cusyio/cusy.restapi.info) to be installed in your Plone site.

### `getLocalPath()`

Get the local (relative) part from the given URL.

- **Arguments**:
  - `url` (type: `string`, required): The full URL.
- **Returns**: `string` The relative path of the URL from the root.

#### Example: Add a path property

```js
const results = $plone.search('/')
const itemsWithLocalPath = results.map((result) => ({
  ...result,
  path: $plone.getLocalPath(result['@id'])
}))
```
