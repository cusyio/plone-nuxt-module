const PloneClient = require('@cusy/plone-js')
const logger = require('./logger')

/**
 * Hook into Nuxt’s generate:before to create all routes from Plone.
 * @param {object} options Module configuration options.
 */
function generate(options) {
  this.nuxt.hook('generate:before', () => {
    const client = new PloneClient(options.url)
    const maybeF = this.options.generate.routes || []
    let languages = options?.languages || ['/']
    const missingLanguagesAllowed = options?.missingLanguagesAllowed || []
    const missingLanguagesError = options?.missingLanguagesError
    if (!languages.length) {
      languages = ['/']
    }

    /**
     * Add the dynamic routes from Plone to Nuxt.
     *
     * We don’t catch any errors here to prevent you from building an empty site
     * in case the Plone backend is currently down or unreachable.
     *
     * TODO: Can we add some custom error logging?
     */
    this.options.generate.routes = async () => {
      const ploneRoutes = []
      const userRoutes =
        typeof maybeF === 'function' ? await maybeF(options) : maybeF

      /**
       * Iterate over all configured languages and get the content items.
       * If a language is not available an error will be thrown and the
       * current build process will be stopped.
       */
      for (const langIndex in languages) {
        const lang = languages[langIndex]

        /**
         * We sort the results alphabetically by path.
         */
        const queryOptions = {
          sort_on: 'path',
          sort_order: 'ascending'
        }

        try {
          const urls = await client.fetchItems(lang, queryOptions)
          ploneRoutes.push(...urls)
        } catch (e) {
          if (!missingLanguagesAllowed.includes(lang) && missingLanguagesError) {
            logger.error(e)
            throw new Error(
              'Unable to fetch routes from Plone backend.\n\n' +
              `Content for the language “${lang}” could not be fetched.\n\n` +
              'Please check your Nuxt configuration and if the Plone backend ' +
              `at “${options.url}” is up and running.`
            )
          }
        }
      }

      /**
       * Transform the returned items for Nuxt.
       * y passing the payload the pages can be generated without calling the
       * Plone REST-API again.
       */
      const ploneRoutesNuxt = ploneRoutes.map((item) => {
        return {
          route: item['@id'],
          payload: item
        }
      })

      /**
       * Merge in the custom user routes.
       */
      const generated = [...new Set(ploneRoutesNuxt.concat(userRoutes))].filter(
        (item) => {
          return item
        }
      )

      /**
       * Return the generated routes.
       */
      return generated
    }
  })
}

module.exports = generate
