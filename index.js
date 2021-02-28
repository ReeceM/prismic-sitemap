const generator = require('./generator');

module.exports = (nextConfig) => ({
  ...nextConfig,
  webpack(config, options) {

    const {
      isServer,
      config: { sitemap = {} }
    } = options;


    if (isServer) {
      console.log('[Sitemap Generator]: Generating Sitemap');

      generator(sitemap);

      return config;
    }

    if (typeof nextConfig.webpack === 'function') {

      return nextConfig.webpack(config, options)
    }

    return config;
  }
})
