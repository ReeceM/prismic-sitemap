import generator from '../generator'
import emitter from '../emitter'

/**
 * The main Nuxt module for generating the site map
 *
 * @author ReeceM
 * @since 0.2.0
 * @param {*} moduleOptions
 */

export default async function PrismicSitemap(moduleOptions) {
  const options = Object.assign({}, this.options.sitemap, moduleOptions)

  this.nuxt.hook('ready', async nuxt => {
    console.log('Nuxt is ready')
  })

  emitter.init({
    fileName: options.fileName,
    emitter: 'nuxt',
  });

  let sitemapData = await generator(options);

  this.options.build.plugins.push({
    apply(compiler) {
      compiler.plugin('emit', emitter.emit(sitemapData))
    }
  })
}

// REQUIRED if publishing the module as npm package
module.exports.meta = require('../../package.json')
