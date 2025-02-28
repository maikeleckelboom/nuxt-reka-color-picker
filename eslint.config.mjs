import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
  // ...Custom flat configs append after nuxt configs
  .prepend({})
// ...you can chain more operations as needed
