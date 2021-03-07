const generator = require('./src/generator');
const path = require('path');
const emitter = require('./src/emitter');

module.exports = (nextConfig) => ({
  ...nextConfig,
  webpack(config, options) {

    const {
      isServer,
      config: { sitemap = {} }
    } = options;

    if (isServer) {
      console.log('[Sitemap Generator]: Generating Sitemap');

      if (typeof sitemap.publicPath === 'undefined') {
        sitemap.publicPath = path.join(options.dir, 'public');
      }

      sitemap.emitter = emitter.init({
        fileName: sitemap.fileName,
      })

      let sitemapData = generator(sitemap);

      try {
        sitemap.emitter.emit(sitemapData)(sitemap.publicPath);
      } catch (error) {
        console.error("[Sitemap Generator] Unable to write sitemap to storage. Build will continue")
      }
    }

    if (typeof nextConfig.webpack === 'function') {

      return nextConfig.webpack(config, options)
    }

    return config;
  }
})
