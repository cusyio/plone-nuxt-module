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
[npm-version-src]: https://img.shields.io/npm/v/plone-nuxt-module/latest.svg
[npm-version-href]: https://npmjs.com/package/plone-nuxt-module

[npm-downloads-src]: https://img.shields.io/npm/dt/plone-nuxt-module.svg
[npm-downloads-href]: https://npmjs.com/package/plone-nuxt-module

[github-actions-ci-src]: https://github.com/it-spirit/plone-nuxt-module/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/it-spirit/plone-nuxt-module/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/it-spirit/plone-nuxt-module.svg
[codecov-href]: https://codecov.io/gh/it-spirit/plone-nuxt-module

[license-src]: https://img.shields.io/npm/l/plone-nuxt-module.svg
[license-href]: https://npmjs.com/package/plone-nuxt-module
