const { resolve } = require('path')
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
    document_view: 'PloneDocumentView',
    EasyFormView: 'PloneEasyFormView',
    event_view: 'PloneEventView',
    file_view: 'PloneFileView',
    image_view: 'PloneImageView',
    image_view_fullscreen: 'PloneImageViewFullscreen',
    'language-switcher': 'PloneLanguageSwitcher',
    link_redirect_view: 'PloneLinkRedirectView',
    newsitem_view: 'PloneNewsItemView',
    // Collection layouts
    album_view: 'PloneAlbumView',
    event_listing: 'PloneEventListingView',
    full_view: 'PloneFullView',
    listing_view: 'PloneListingView',
    summary_view: 'PloneSummaryView',
    tabular_view: 'PloneTabularView'
  },
  layoutAliases: {
    atct_album_view: 'album_view',
    folder_album_view: 'album_view',
    folder_listing: 'listing_view',
    folder_full_view: 'full_view',
    folder_summary_view: 'summary_view',
    folder_tabular_view: 'tabular_view'
  },
  layoutFallback: 'PloneBaseView',
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

  /**
   * Update the public runtime config.
   */
  nuxt.options.publicRuntimeConfig = nuxt.options.publicRuntimeConfig || {}
  nuxt.options.publicRuntimeConfig.plone = nuxt.options.publicRuntimeConfig.plone || {}
  nuxt.options.publicRuntimeConfig.plone.url = options.url
  nuxt.options.publicRuntimeConfig.plone.languages = options.languages
  nuxt.options.publicRuntimeConfig.plone.nuxtImage = options.nuxtImage
  nuxt.options.publicRuntimeConfig.plone.updateSitemap = options.updateSitemap

  /**
   * Add the plone core plugin.
   *
   * It will be responsible for the communication with the Plone backend.
   */
  this.addPlugin({
    src: resolve(__dirname, '../templates/plugins/plone.js'),
    fileName: 'plone/plugins/plone.js',
    options
  })

  if (options.url && !options.disableGenerator) {
    generate.call(this, options)
  }
}

module.exports.meta = require('../package.json')
