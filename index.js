const generator = require('./generator');
const path = require('path');

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

      generator(sitemap);
    }

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config;
  }
})
