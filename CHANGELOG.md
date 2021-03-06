# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/cusyio/plone-nuxt-module/compare/v1.0.1...v1.1.0) (2021-11-15)


### Features

* :sparkles: add base layout component ([8ee5136](https://github.com/cusyio/plone-nuxt-module/commit/8ee513651f5a5a54d642126c37c3fc172bd3ff9d))
* :sparkles: split plugin in client and server ([13de739](https://github.com/cusyio/plone-nuxt-module/commit/13de739a297602f4c6ac6e404c5866e68f147d18))
* **module:** :truck: rename default plone view names ([6f30c30](https://github.com/cusyio/plone-nuxt-module/commit/6f30c302ed14403dc0b50ef2059f2b854ea2c17d))

### [1.0.1](https://github.com/cusyio/plone-nuxt-module/compare/v1.0.0...v1.0.1) (2021-11-02)


### Bug Fixes

* **module:** :bug: don’t fail if sitemap or generate routes are missing ([ad942f5](https://github.com/cusyio/plone-nuxt-module/commit/ad942f5930319598d644661b40e1c8948a1c6ae0))

## [1.0.0](https://github.com/cusyio/plone-nuxt-module/compare/v1.0.0-dev0.0...v1.0.0) (2021-10-26)

### Features

- **module:** :sparkles: add basic plone layout config ([6de755b](https://github.com/cusyio/plone-nuxt-module/commit/6de755b2db024c4442cdfb20528e5ec5f66fed3a))
- **module:** :sparkles: add option to extend sitemap routes ([2c4c51e](https://github.com/cusyio/plone-nuxt-module/commit/2c4c51ecc95f5cecdc2e1ad66701a20de03f3ce4))
- **module:** :sparkles: allow some languages to fail when generating routes ([5f94e8e](https://github.com/cusyio/plone-nuxt-module/commit/5f94e8e3a4c9e061d0e76f2efa4cbcfcbb7273dc))
- **module:** :sparkles: get all result items for collection like content types ([7f8950d](https://github.com/cusyio/plone-nuxt-module/commit/7f8950d2b3c9836a374c7fd497c246567844de34))
- **module:** :sparkles: load all items from folderish content when generating static pages ([96e05f3](https://github.com/cusyio/plone-nuxt-module/commit/96e05f323e431b4b5d971f166aa5c7fe9213cff3))
- **module:** :sparkles: show info about failed generated routes and their origins ([6786077](https://github.com/cusyio/plone-nuxt-module/commit/67860776eabec97ec9b581f8c208e1a93c480db7))
- :sparkles: add support for nuxt-image ([d5d1117](https://github.com/cusyio/plone-nuxt-module/commit/d5d111780543b10d0b4ec299f5f80261e5b78ebe))
- **plugin:** :goal_net: provide better result for getNavigation including error information ([48fc936](https://github.com/cusyio/plone-nuxt-module/commit/48fc936c6b460b6df83b64c9828917da4352e87a))
- **plugin:** :sparkles: enable retry plugin and caching for server processing ([e430e6a](https://github.com/cusyio/plone-nuxt-module/commit/e430e6af4f57804ca0a572f85037ef3d6695f4b6))
- **plugin:** :sparkles: return items with a path property when fetching navigation ([fe54195](https://github.com/cusyio/plone-nuxt-module/commit/fe5419506aed53d59d4f5e3a7ee4ca49e009ddac))
- **plugin:** implement getLocalURL ([f83e675](https://github.com/cusyio/plone-nuxt-module/commit/f83e675a8e07eb6e0bd9be182bf610cd3be66fa2))
- **plugin:** implement getSiteInfo ([ff83fc9](https://github.com/cusyio/plone-nuxt-module/commit/ff83fc9b850272705ece462d75f3ebd81edd3af7))

### Bug Fixes

- **docs:** :bug: correct image paths ([b509b99](https://github.com/cusyio/plone-nuxt-module/commit/b509b99cbf36006d27df26076249c7c57a78be30))
- **docs:** :bug: use correct published url ([80be902](https://github.com/cusyio/plone-nuxt-module/commit/80be90231b6b7a447c4a845cfee935e6129ac3e1))
- **module:** :bug: default language should be '/' ([1fcbfc0](https://github.com/cusyio/plone-nuxt-module/commit/1fcbfc02d7e14cb8cd0b16f1b2700bd3ac5ea749))
- **plugin:** :bug: don’t supress axios related errors when fetching items ([7ededc6](https://github.com/cusyio/plone-nuxt-module/commit/7ededc681bc58f4d5f4147120e1f90de08601152))
