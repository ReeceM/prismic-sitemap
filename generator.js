const path = require("path");
const fs = require("fs");
const Prismic = require("prismic-javascript");
const { SitemapStream, streamToPromise } = require('sitemap');

/**
 * Generates a sitemap
 * @param {Object} sitemap The Sitemap Object
 * @param {Function} sitemap.linkResolver
 * @param {String} sitemap.apiEndpoint
 * @param {String} sitemap.hostname
 * @param {Array} sitemap.optionsMapPerDocumentType
 * @param {Array} sitemap.documentTypes
 * @param {Object} sitemap.sitemapConfig
 */
const generator = async (sitemap) => {

  const {
    linkResolver = null /* doc => { return something } */,
    apiEndpoint = '',
    hostname = '',
    optionsMapPerDocumentType = {},
    documentTypes = [],
    fileName = 'sitemap.xml',
    publicPath = 'public',
    sitemapConfig
  } = sitemap;

  if (typeof linkResolver !== 'function') {
    throw new Error('A linkResolver function is undefined, this is needed to build sitemap links');
  }

  const api = await Prismic.getApi(apiEndpoint);

  const { results: docs } = await api.query(
    Prismic.Predicates.any('document.type', documentTypes),
    {
      lang: "*"
    });

  const sitemapStream = new SitemapStream({ hostname: hostname, ...sitemapConfig });

  docs
    .sort((a, b) => a.type < b.type ? -1 : 1) // sort by type
    .forEach(doc => {

      const options = optionsMapPerDocumentType.hasOwnProperty(doc.type)
        ? optionsMapPerDocumentType[doc.type]
        : { changefreq: "monthly", priority: 1 };

      sitemapStream.write({
        url: linkResolver(doc),
        ...options
      });
    })

  sitemapStream.end();

  const sitemapData = await streamToPromise(sitemapStream);

  let basePath = resolvePublicPath(publicPath)

  if (!fs.existsSync(path.join(basePath))) {
    fs.mkdirSync(path.join(basePath), { recursive: true });
  }

  fs.writeFileSync(path.join(basePath, fileName), sitemapData, "utf-8");

  return sitemapData;
}

function resolvePublicPath(dir) {
  if (dir === 'public') {
    dir = path.join(__dirname, dir);
  }

  return dir;
}

module.exports = generator;
