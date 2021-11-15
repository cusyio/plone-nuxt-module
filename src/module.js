import pkg from '../package.json'
const { join, resolve } = require('path')
const defu = require('defu')
const generate = require('./generator')
const logger = require('./logger')

/**
 * Default module options.
 */
const defaults = {
  disableGenerator: false,
  languages: process.env.PLONE_LANGUAGES
    ? process.env.PLONE_LANGUAGES.split(',')
    : ['/'],
  layouts: {
    // Content layouts
    document_view: 'PloneLayoutDocument',
    EasyFormView: 'PloneLayoutEasyForm',
    event_view: 'PloneLayoutEvent',
    file_view: 'PloneLayoutFile',
    image_view: 'PloneLayoutImage',
    image_view_fullscreen: 'PloneLayoutImageFullscreen',
    'language-switcher': 'PloneLayoutLanguageSwitcher',
    link_redirect_view: 'PloneLayoutLinkRedirect',
    newsitem_view: 'PloneLayoutNewsItem',
    // Collection layouts
    album_view: 'PloneLayoutCollectionAlbum',
    event_listing: 'PloneLayoutCollectionEvents',
    full_view: 'PloneLayoutCollectionFull',
    listing_view: 'PloneLayoutCollectionListing',
    summary_view: 'PloneLayoutCollectionSummary',
    tabular_view: 'PloneLayoutCollectionTabular'
  },
  layoutAliases: {
    atct_album_view: 'album_view',
    folder_album_view: 'album_view',
    folder_listing: 'listing_view',
    folder_full_view: 'full_view',
    folder_summary_view: 'summary_view',
    folder_tabular_view: 'tabular_view'
  },
  layoutFallback: 'PloneLayoutBase',
  missingLanguagesAllowed: process.env.PLONE_MISSING_LANGUAGES_ALLOWED
    ? process.env.PLONE_MISSING_LANGUAGES_ALLOWED.split(',')
    : [],
  missingLanguagesError: true,
  nuxtImage: false,
  updateSitemap: false,
  url: process.env?.PLONE_URL
}

/**
 * Prepare the Plone module.
 * @param {object} moduleOptions Module configuration.
 */
module.exports = function (moduleOptions) {
  const { nuxt } = this

  /**
   * Read plone property defined in nuxt.config.js and merge with defaults.
   */
  const options = defu(moduleOptions, nuxt.options.plone, defaults)

  /**
   * We need the Plone backend URL. Without the url, the module is useless.
   */
  if (!options.url) {
    logger.warn('Options `url` is required, disabling module...')
    return
  }

  options.pkg_name = pkg.name
  options.pkg_version = pkg.version

  /**
   * Update the public runtime config.
   */
  nuxt.options.publicRuntimeConfig = nuxt.options.publicRuntimeConfig || {}
  nuxt.options.publicRuntimeConfig.plone = nuxt.options.publicRuntimeConfig.plone || {}
  nuxt.options.publicRuntimeConfig.plone.url = options.url
  nuxt.options.publicRuntimeConfig.plone.languages = options.languages
  nuxt.options.publicRuntimeConfig.plone.nuxtImage = options.nuxtImage
  nuxt.options.publicRuntimeConfig.plone.updateSitemap = options.updateSitemap

  // Transpile and alias runtime
  const runtimeDir = resolve(__dirname, '../templates')
  nuxt.options.alias['~plone'] = runtimeDir

  /**
   * Add the plone core plugin.
   *
   * It will be responsible for the communication with the Plone backend.
   */
  this.addPlugin({
    src: resolve(runtimeDir, 'plugins/plone.js'),
    fileName: 'plone/plone.client.js',
    mode: 'client',
    options: {
      ...options,
      enableCaching: false,
      isServer: false
    }
  })

  this.addPlugin({
    src: resolve(runtimeDir, 'plugins/plone.js'),
    fileName: 'plone/plone.server.js',
    mode: 'server',
    options: {
      ...options,
      enableCaching: !nuxt.options.dev,
      isServer: true
    }
  })

  if (options.url && !options.disableGenerator) {
    generate.call(this, options)
  }

  // Add default components if components option is enabled.
  if (nuxt.options.components) {
    this.nuxt.hook('components:dirs', (dirs) => {
      // Add ./components dir to the list of available components.
      // With a level of 2 this has the lowest priority (0 is default with highest priority).
      // Components like @cusy/plone-components-vue define a level of 1.
      // This way local project components will always be able to overwrite module
      // components (unless specified with a custom level).
      dirs.push({
        path: join(__dirname, 'components'),
        level: 2
      })
    })
  }
}

module.exports.meta = require('../package.json')
