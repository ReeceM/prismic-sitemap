'use strict'

const generator = require('./generator');
const path = require('path');

let isRunning = false;

module.exports =
  (sitemap = {}) =>
    (nextConfig = {}) =>
      Object.assign({}, nextConfig, {
        webpack(config, options) {
          const { isServer, buildId, webpack } = options;

          if (typeof nextConfig.webpack === 'function' && isRunning == false) {
            config = nextConfig.webpack(config, options)
          }

          if (isServer && isRunning == false) {
            isRunning = true;

            console.log('[Sitemap Generator]: Generating Sitemap');

            if (typeof sitemap.publicPath === 'undefined') {
              sitemap.publicPath = path.join(options.dir, 'public');
            }

            generator(sitemap);
          }


          return config;
        }
      })
