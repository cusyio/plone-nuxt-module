import Hookable from 'hookable'
import { joinURL } from 'ufo'
import PloneClient from '@it-spirit/plone-js'

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
    this.client = new PloneClient(url)
  }

  /**
   * Search for content.
   * @param {string} path The relative path to search within.
   * @param {object} searchOptions Search options.
   * @returns A list of search results
   */
  async search(path = '', searchOptions) {
    try {
      return await this.client.search(path, searchOptions)
    } catch {
      return []
    }
  }

  /**
   * Get a single content item by path.
   * @param {string} path The relative path to get.
   * @param {object} options Options
   * @returns The content
   */
  async get(path, options) {
    options = {
      expand: 'breadcrumbs,translations,contentinfo',
      fullobjects: 1
    }

    try {
      return await this.client.query(path, options)
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
