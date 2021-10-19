import Hookable from 'hookable'
import PloneClient from '@cusy/plone-js'
import { getQuery, joinURL, parseURL, withLeadingSlash, withoutTrailingSlash } from 'ufo'
const DOMParser = require('universal-dom-parser')

/**
 * The Plone API client.
 */
class PloneAPI extends Hookable {
  constructor(ctx) {
    super()

    ctx.$config = ctx.$config || {} // fallback for Nuxt < 2.13
    this.$config = ctx.$config.plone || {}

    let url = this.$config.url || '<%= options.url %>'
    if (process.server && ctx.req && url.startsWith('/')) {
      url = joinURL(reqURL(ctx.req), url)
    }
    this.baseURL = withoutTrailingSlash(url)
    this.client = new PloneClient(url, {
      enableCaching: process.server,
      enableRetry: true,
    })
  }

  /**
   * Extract relative path and query options from a given url.
   *
   * @param {string} url The URL for the resource.
   * @returns An object with a clean pathName and a pathQuery.
   */
  extractPathAndQuery(url) {
    // We only want to work with relative URLs
    url = url.replace(this.baseURL, '')

    // Extract the URL information.
    const urlObject = parseURL(url)

    // Get the query params.
    // parseURL returns the query params as string, but we want an object.
    let query = getQuery(url)

    // Return pathName and pathQuery
    return {
      pathName: urlObject.pathname,
      pathQuery: query
    }
  }

  /**
   * Search for content.
   *
   * @param {string} path The relative path to search within.
   * @param {object} searchOptions Search options.
   * @returns An object with a list of search result items and optional batch information.
   */
  async search(path = '', searchOptions = {}) {
    /**
     * We provide a sanitized result for error responses.
     */
    const errorResult = {
      batching: false,
      error: true,
      items: [],
      items_total: 0,
    }

    /**
     * When passing the batching URL, we need to extract the relative path
     * and the query params.
     */
    const { pathName, pathQuery } = this.extractPathAndQuery(path)

    /**
     * We create a new object of search options by combining the extracted
     * options from the url and the provided search options. Duplicate search
     * options overwrite path query options.
     */
    const searchQuery = {
      ...pathQuery,
      ...searchOptions
    }
    let results
    try {
      results = await this.client.search(pathName, searchQuery)
    } catch (e) {
      // This is a local plone plugin error.
      return {
        ...errorResult,
        _error: e
      }
    }
    if (!results) {
      // An empty result was returned.
      return {
        ...errorResult,
        _error: {
          message: 'Result was empty.'
        }
      }
    }
    if (results?.error) {
      // This is an api/connection error.
      return {
        ...errorResult,
        _error: results.error
      }
    }

    // This is the valid response from the Plone REST-API.
    return results
  }

  /**
   * Get a single content item by path.
   *
   * @param {string} path The relative path to get.
   * @param {object} options API options
   * @returns The content
   */
  async get(path, options = {}) {
    const searchOptions = {
      expand: 'breadcrumbs,translations,contentinfo',
      ...options
    }

    return await this.client.query(path, searchOptions)
  }

  /**
   * Get a list of URLs for the sitemap.
   * The result is not batched and might be large!
   *
   * @returns An object with a list of sitemap items.
   */
  async getSitemap() {
    const searchOptions = {}
    let results
    try {
      results = await this.client.fetchItems('/', searchOptions)
    } catch { }
    if (results?.error) {
      return {
        error: true
      }
    }
    return {
      items: results,
    }
  }

  getFormConfig(path) {
    return 'no form config yet'
  }

  /**
   * Get the Plone navigation.
   *
   * @param {string} path The relative path for the navigation root.
   * @param {number} depth How many levels deep should the navigation show?
   * @returns A list of navigation items.
   */
  async getNavigation(path = '', depth = 2) {
    const errorResult = {
      error: true,
      items: [],
    }
    const searchOptions = {
      'expand.navigation.depth': depth
    }
    const url = joinURL(path, '@navigation')
    let results
    try {
      results = await this.client.query(url, searchOptions)
      results = results?.items
    } catch (e) {
      // This is a local plone plugin error.
      return {
        ...errorResult,
        _error: e
      }
    }
    if (!results) {
      // An empty result was returned.
      return {
        ...errorResult,
        _error: {
          message: 'Result was empty.'
        }
      }
    }
    if (results?.error) {
      // This is an api/connection error.
      return {
        ...errorResult,
        _error: results.error
      }
    }

    /**
     * Add a path property with the relative path from the root.
     */
    const itemsWithLocalPath = results.map(result => (
      {
        ...result,
        path: this.getLocalPath(result['@id']),
      }
    ))

    // This is the valid response from the Plone REST-API.
    return {
      error: false,
      items: itemsWithLocalPath
    }
  }

  async getSiteInfo() {
    return await this.client.query('@siteinfo')
  }

  /**
   * Get the local (relative) part from the URL.
   *
   * @param {string} url The full URL
   * @returns The relative path of the URL from the root.
   */
  getLocalPath(url) {
    const path = url.replace(this.baseURL, '') || '/'
    return withLeadingSlash(path);
  }

  /**
   * Get the local URL from the full URL.
   *
   * @param {string} url The full URL
   * @returns The relative URL.
   * @deprecated Use `getLocalPath` instead.
   */
  getLocalURL(url) {
    return this.getLocalPath(url)
  }

  localizeImages(ctx, content) {
    /**
     * We need some content to work with.
     */
    if (!content) {
      return
    }

    /**
     * Stop if `nuxtImage` is disabled or @nuxt/image is not available.
     */
    if (!this.$config.nuxtImage || !ctx.$img) {
      return
    }

    // TODO: Check for all available fields containing images
    // For now we check the text field
    if (content?.text?.data) {
      let contentChanged = false
      const parser = new DOMParser()
      const doc = parser.parseFromString(
        `<!DOCTYPE html><html><body id="body">${content.text.data}</body></html>`,
        'text/html'
      )
      const images = doc.getElementsByTagName('img')
      if (images.length > 0) {
        for (let index = 0; index < images.length; index++) {
          const img = images.item(index)
          let imgSrc = img.src

          // Check if image source is not relative
          // (does not contain '../../')
          if (imgSrc.indexOf('../') !== -1) {
            // Rewrite img src to absolute URL
            imgSrc = absoluteURL(content['@id'], imgSrc)
          }

          // Check again for relativa path segments
          if (imgSrc.indexOf('../') === -1) {
            img.src = ctx.$img(imgSrc)
            if (img.src !== imgSrc) {
              contentChanged = true
            }
          }
        }

        /**
         * Data has changed, so we have to update the content.
         */
        if (contentChanged) {
          const body = doc.getElementById('body')
          content.text.data = body.innerHTML

          return content
        }
      }
    }
  }
}

function absoluteURL(base, relative) {
  const stack = base.split("/")
  const parts = relative.split("/");
  stack.pop(); // remove current file name (or empty string)
  // (omit if "base" is the current folder without trailing slash)
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === ".")
      continue;
    if (parts[i] === "..")
      stack.pop();
    else
      stack.push(parts[i]);
  }
  return stack.join("/");
}

export default async function (ctx, inject) {
  const plone = new PloneAPI(ctx)

  inject('plone', plone)
  ctx.$plone = plone
}
