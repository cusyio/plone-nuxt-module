const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  generate: {
    dir: resolve(__dirname, 'dist')
  },
  target: 'static',
  modules: [{ handler: require('../src/module') }],
  buildModules: ['../src/module.js'],
  plone: {
    url: 'http://localhost:8080/Plone'
  }
}
