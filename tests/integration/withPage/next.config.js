const withPrismicSitemap = require('../../../index');

module.exports = withPrismicSitemap({
  sitemap: {
    linkResolver: doc => {
      return doc.type == 'post'
        ? `blog/${doc.uid}`
        : `page/${doc.uid}`;
    },

    apiEndpoint: process.env.TEST_REPOSITORY,
    hostname: 'https://example.com',
    documentTypes: ['post', 'page'],
    optionsMapPerDocumentType: {
      post: { changefreq: "weekly", priority: 0.8 },
    },
  }
})

