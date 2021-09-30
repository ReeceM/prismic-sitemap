const path = require("path");
const fs = require("fs");
const Prismic = require("prismic-javascript");
const { SitemapStream, streamToPromise } = require('sitemap');
const paginatorUtil = require('./utils/paginator')

/**
 * Generates a sitemap
 *
 * @param {Object} sitemap The Sitemap Object
 * @param {Function} sitemap.linkResolver
 * @param {String} sitemap.apiEndpoint
 * @param {String} sitemap.accessToken
 * @param {String} sitemap.hostname
 * @param {Array} sitemap.optionsMapPerDocumentType
 * @param {Array} sitemap.documentTypes
 * @param {Object} sitemap.sitemapConfig
 * @param {Object} sitemap.defaultEntryOption
 * @param {Object[]} sitemap.staticPaths
 */
const generator = async (sitemap) => {

  const {
    linkResolver = null /* doc => { return something } */,
    apiEndpoint = '',
    accessToken = null,
    hostname = '',
    optionsMapPerDocumentType = {},
    documentTypes = ['*'],
    pagination = {
      pageSize: 20,
    },
    fileName = 'sitemap.xml',
    publicPath = 'public',
    sitemapConfig = {
      lastmodDateOnly: true,
    },
    defaultEntryOption = { changefreq: "monthly", priority: 1, },
    staticPaths = [],
    /** optional things */
    // onBeforeWrite = docs => docs,
    // onBeforeStore = stream => stream,
  } = sitemap;

  if (typeof linkResolver !== 'function') {
    throw new Error(
      '[Sitemap Generator]: The linkResolver function is undefined, this is needed to build sitemap links'
    );
  }

  if (accessToken !== null && accessToken.length <= 1) {
    throw new Error(
      '[Sitemap Generator]: The API Access token appears incorrect, please double check as it is short.'
    );
  }

  if (documentTypes === null || documentTypes.length <= 0) {
    throw new Error(
      '[Sitemap Generator]: The documentTypes option needs a value of 1 or greater in the array'
    );
  }

  /** @todo Add extended options to the Prismic API function, or to pass one from user level */
  const api = await Prismic.getApi(apiEndpoint, { 'accessToken': accessToken, });
  const paginator = paginatorUtil.init(api, pagination);

  let documents = [];
  let types = Array.isArray(documentTypes) ? documentTypes : Array.of(documentTypes)

  await Promise.all(types.flatMap(type => paginator.paginate(type)))

  documents = paginator.results;

  const sitemapStream = new SitemapStream({ hostname: hostname, ...sitemapConfig });

  documents
    .sort((a, b) => a.type < b.type ? -1 : 1) // sort by type
    .forEach(doc => {

      const options = optionsMapPerDocumentType.hasOwnProperty(doc.type)
        ? resolveDocumentOption(optionsMapPerDocumentType[doc.type], doc)
        : defaultEntryOption;

      sitemapStream.write(
        Object.assign({ ...options }, { url: linkResolver(doc) })
      );
    })

  /* Handle adding a list of static paths to the sitemap, must be an object */
  try {
    staticPaths.length >= 1
      ? staticPaths.forEach(path => storeIfValid(path, sitemapStream))
      : null;
  } catch (error) {
    console.error('[Sitemap Generator]: Unable to save staticPaths to sitemap')
  }

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

/**
 * Resolves if the option is a callback and handles it
 * or continues with the object entry.
 * @param {Object|Function} option
 * @param {Object} document
 * @returns Object
 */
function resolveDocumentOption(option, document) {
  try {
    return typeof option === 'function'
      ? option(document)
      : option;

  } catch (error) {
    // console.error('[Sitemap Generator]: Failed to handle callback for a document', error);

    throw new Error(
      `[Sitemap Generator]: Failed to generate a sitemap entry for document {${document.type}}, ${error.message}`
    );
  }
}

/**
 * Adds the static path to the index
 *
 * @todo Make use of a async callback or handle the object depending on what happens
 * @param {Object} option the static path to add
 * @param {SitemapStream} stream
 * @returns void
 */
function storeIfValid(option, stream) {

  if (typeof option === 'function') {
    option = option()
  }

  if (option.url === undefined) {
    return;
  }

  option.lastmod = option.lastmod ? option.lastmod : (new Date).toISOString()

  stream.write(option);
}

module.exports = generator;
