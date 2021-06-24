import Hookable from 'hookable'
import PloneClient from '@it-spirit/plone-js'
import { getQuery, joinURL, parseURL } from 'ufo'

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
    this.baseURL = url
    this.client = new PloneClient(url)
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
  async search(path = '', searchOptions) {
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
   * @param {object} options Options
   * @returns The content
   */
  async get(path, options) {
    const searchOptions = {
      expand: 'breadcrumbs,translations,contentinfo',
      ...options
    }

    try {
      return await this.client.query(path, searchOptions)
    } catch {
      return {}
    }
  }

  /**
   * Get a list of URLs for the sitemap.
   * @returns
   */
  getSitemap() {
    return 'no sitemap yet'
  }

  getFormConfig(path) {
    return 'no form config yet'
  }

  getNavigation(path = '', depth = 2) {
    return 'no navigation yet'
  }

  getSiteInfo() {
    return 'no siteinfo yet'
  }
}

export default async function (ctx, inject) {
  const plone = new PloneAPI(ctx)

  inject('plone', plone)
  ctx.$plone = plone
}
