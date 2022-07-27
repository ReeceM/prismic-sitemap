const generator = require('./generator');
const path = require('path');

let isRunning = false;

module.exports = (nextConfig) => ({
  ...nextConfig,
  webpack(config, options) {

    const {
      isServer,
      config: { sitemap = {} }
    } = options;


    if (isServer && isRunning == false) {
      console.log('[Sitemap Generator]: Generating Sitemap');

      isRunning = true;

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
