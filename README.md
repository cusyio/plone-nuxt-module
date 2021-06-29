# plone-nuxt-module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Nuxt integration for Plone CMS

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `plone-nuxt-module` dependency to your project

```bash
yarn add plone-nuxt-module # or npm install plone-nuxt-module
```

2. Add `plone-nuxt-module` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    'plone-nuxt-module',

    // With options
    ['plone-nuxt-module', { /* module options */ }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Thomas Massmann <thomas.massmann@it-spir.it>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@cusy/plone-nuxt/latest.svg
[npm-version-href]: https://npmjs.com/package/@cusy/plone-nuxt

[npm-downloads-src]: https://img.shields.io/npm/dt/@cusy/plone-nuxt.svg
[npm-downloads-href]: https://npmjs.com/package/@cusy/plone-nuxt

[github-actions-ci-src]: https://github.com/cusyio/plone-nuxt-module/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/cusyio/plone-nuxt-module/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/cusyio/plone-nuxt-module.svg
[codecov-href]: https://codecov.io/gh/cusyio/plone-nuxt-module

[license-src]: https://img.shields.io/npm/l/plone-nuxt-module.svg
[license-href]: https://npmjs.com/package/plone-nuxt-module
