const PloneClient = require('@cusy/plone-js')
const logger = require('./logger')

/**
 * Hook into Nuxt’s generate:before to create all routes from Plone.
 * @param {object} moduleOptions Module configuration options.
 */
function generate(moduleOptions) {
  this.nuxt.hook('generate:before', () => {
    logger.info(`Getting all content from your Plone backend at ${moduleOptions.url}`)

    /*
     * Initialize a new Plone JS client with the provided Plone backend URL.
     */
    const ploneClient = new PloneClient(moduleOptions.url, {
      enableCaching: true,
      enableRetry: true
    })

    /**
     * There might be custom routes defined in nuxt.config.js.
     *
     * Those routes can either be an Array or a function.
     * We save the defined routes, if any, and merge them later with our Plone
     * routes.
     *
     * Note that the custom routes will overwrite any Plone routes, if they have the
     * same path. The Plone routes will provide a payload with the actual data for a
     * particular route. So when a custom route overwrites a Plone route, the payload
     * data is gone unless the custom route provides one.
     */
    const nuxtCustomRoutesConfig = this.options.generate.routes || []

    /**
     * There also might be custom sitemap routes defined in nuxt.config.js.
     *
     * Those routes can either be an Array or a function.
     * We save the defined routes, if any, and merge them later with our Plone
     * routes if `updateSitemap` is set to `true`.
     */
    const nuxtCustomSitemapRoutesConfig = this.options.sitemap.routes || []

    /**
     * A list of languages which are allowed to be missing on the Plone site.
     */
    const missingLanguagesAllowed = moduleOptions?.missingLanguagesAllowed || []

    /**
     * Throw an error when a configured language is not available?
     */
    const missingLanguagesError = moduleOptions?.missingLanguagesError

    /**
     * Should we update the sitemap with our custom Plone routes?
     */
    const updateSitemap = moduleOptions?.updateSitemap

    /**
     * The languages your Nuxt.js site should support.
     */
    let languages = moduleOptions?.languages || ['/']

    /**
     * If there is no language available, use the root folder.
     */
    if (!languages.length) {
      languages = ['/']
    }

    /**
     * Add the dynamic routes from Plone to Nuxt.
     *
     * We don’t catch any errors here to prevent you from building an empty site
     * in case the Plone backend is currently down or unreachable.
     *
     * This will overwrite any possible custom routes definition from `nuxt.config.js`.
     * But we have a copy of the data in `nuxtCustomRoutesConfig` and will merge
     * this in at the end.
     */
    this.options.generate.routes = async () => {
      /**
       * The list of collected routes from the Plone backend.
       */
      const ploneRoutes = []

      /**
       * A list of custom routes defined in the nuxt configuration.
       *
       * If it is a function, call it. Otherwise use the assigned value.
       */
      const nuxtCustomRoutes = typeof nuxtCustomRoutesConfig === 'function'
        ? await nuxtCustomRoutesConfig(moduleOptions)
        : nuxtCustomRoutesConfig

      /**
       * A list of custom sitemap routes defined in the nuxt configuration.
       *
       * If it is a function, call it. Otherwise use the assigned value.
       */
      const nuxtCustomSitemapRoutes = typeof nuxtCustomSitemapRoutesConfig === 'function'
        ? await nuxtCustomSitemapRoutesConfig(moduleOptions)
        : nuxtCustomSitemapRoutesConfig

      /**
       * Iterate over all configured languages and get the content items.
       * If a language is not available an error will be thrown and the
       * current build process will be stopped.
       */
      for (const lang of languages) {
        logger.info(`Processing language '${lang}'`)

        /**
         * We sort the results alphabetically by path.
         *
         * We also request information for breadcrumbs, any translations and the
         * extended content information. This way we have all the data in one
         * single API request.
         *
         * Requesting full objects will make the initial API request slower, but
         * saves us a lot of API requests when generating the pages later, as we
         * can provide the full object as payload.
         */
        const queryOptions = {
          sort_on: 'path',
          sort_order: 'ascending',
          expand: 'breadcrumbs,translations,contentinfo',
          fullobjects: '1'
        }

        /**
         * First, get all the URLs including the payload for the given language.
         *
         * If an error occures and the language is not allowed to fail, we log it
         * to the console and raise the error. This prevents building an empty frontend
         * when the backend might be unreachable or is mis-configured.
         */
        try {
          ploneRoutes.push(...await ploneClient.fetchItems(lang, queryOptions, {}))
        } catch (e) {
          if (!missingLanguagesAllowed.includes(lang) && missingLanguagesError) {
            logger.error(e)
            throw new Error(
              'Unable to fetch routes from Plone backend.\n\n' +
              `Content for the language “${lang}” could not be fetched.\n\n` +
              'Please check your Nuxt configuration and if the Plone backend ' +
              `at “${moduleOptions.url}” is up and running.`
            )
          }
        }
      }

      /**
       * Transform the returned items for Nuxt.
       *
       * By passing the payload the pages can be generated without calling the
       * Plone REST-API again.
       *
       * We also filter any empty items.
       */
      const ploneRoutesNuxt = await Promise.all(ploneRoutes.map(async (item) => {
        let changefreq
        let payload = item

        /**
         * Items with a query param are possible collections with dynamic items.
         *
         * Those items are not available unless the `include_items` option is activated
         * in the search, which is not due to performance implications.
         *
         * So we query the content item and use the result as the payload which then
         * includes the information for the query result items.
         *
         * Since the items can change more frequently, we change the sitemap change
         * frequency for those items to `daily`.
         */
        if (item.query) {
          payload = await ploneClient.fetchCollection(
            item['@id'],
            {
              metadata_fields: ['_all']
            }
          )
          changefreq = 'daily'
        }

        /**
         * Same applies to default pages which contain a query param.
         */
        if (item?.default_page && item.default_page.query) {
          const defaultPage = await ploneClient.fetchCollection(
            item.default_page['@id'],
            {
              metadata_fields: ['_all']
            }
          )
          changefreq = 'daily'
          payload.default_page = defaultPage
        }

        return {
          route: item['@id'],
          payload,
          sitemap: {
            lastmod: item.modified,
            ...(changefreq && { changefreq })
          }
        }
      }))
      ploneRoutesNuxt.filter(item => item)

      /**
       * Merge in the custom routes and remove possible duplicates.
       *
       * We also filter any empty items.
       */
      if (nuxtCustomRoutes.length) {
        logger.info(
          `Add ${nuxtCustomRoutes.length} custom routes from your generate.routes config.`
        )
      }
      const generated = [...new Set(ploneRoutesNuxt.concat(nuxtCustomRoutes))].filter(
        item => item
      )

      if (updateSitemap) {
        const sitemapRoutes = generated.map((item) => {
          return {
            url: item.route,
            ...item?.sitemap || {}
          }
        })
        this.options.sitemap.routes = [...sitemapRoutes, ...nuxtCustomSitemapRoutes]
      }

      logger.info(`Collected ${generated.length} routes from your Plone backend`)
      logger.info('Plone routes done. Back to you, Nuxt!')

      /**
     * Return the generated routes.
     */
      return generated
    }
  })
}

module.exports = generate
