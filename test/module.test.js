const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')

describe('module info page', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = await setup(loadConfig(__dirname, '../../example')))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('plone-nuxt-module')
    expect(html).toContain('http://localhost:8080/Plone')
  })
})
