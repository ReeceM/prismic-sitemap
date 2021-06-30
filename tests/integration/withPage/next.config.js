const withPrismicSitemap = require('../../../index');

module.exports = withPrismicSitemap({
  sitemap: {
    linkResolver: doc => {
      switch (doc.type) {
        case 'post':
          return `blog/${doc.uid}`
        case 'latest_notice':
          return `notice/${doc.uid}`
        default:
          return `page/${doc.uid}`
      }
    },

    apiEndpoint: process.env.TEST_REPOSITORY,
    hostname: 'https://example.com',
    documentTypes: ['post', 'page', 'latest_notice'],
    staticPaths: [
      {
        url: 'hello-to-me',
        lastmod: '2021-06-29'
      },
      function () {
        return {
          url: 'sup',
          lastmod: '2000-02-02'
        }
      }
    ],
    optionsMapPerDocumentType: {
      post: { changefreq: "weekly", priority: 0.8 },
      latest_notice: (doc) => {
        return {
          lastmod: doc.last_publication_date ? doc.last_publication_date : (new Date()).toJSON(),
          changefreq: "weekly",
          priority: 0.8
        }
      }
    },
  }
})

