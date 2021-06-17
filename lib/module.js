const { resolve } = require('path')

function install(moduleOptions) {
  const options = {
    ...this.options['plone-nuxt-module'],
    ...moduleOptions
  }

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'plone-nuxt-module.js',
    options
  })
}

module.exports = install
module.exports.meta = require('../package.json')
