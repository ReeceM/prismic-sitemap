/**
 * Test File for the generator
 */
let fs = require('fs');
let path = require('path');

jest.mock('fs');
let generator = require('../src/generator');
let emitter = require('../src/emitter');

let _emitter = emitter.init({
  fileName: 'sitemap.xml',
})
let sitemapData = null;

const sitemapConfig = {
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
};

describe('tests for generator.js', () => {
  beforeAll(async () => {
    // clear any previous calls
    jest.restoreAllMocks();
    sitemapData = await generator(sitemapConfig);
    _emitter.emit(sitemapData)(path.join(__dirname, "public"));
  });

  it('should check if exists', async () => {

    expect(jest.spyOn(fs, "existsSync"))
      .toHaveBeenCalledWith(path.join(__dirname, "public"));
  });

  it('should have called 1 time', () => {

    expect(jest.spyOn(fs, 'writeFileSync'))
      .toHaveBeenCalledTimes(1);
  });

  it('file write should have been called with ...', () => {

    expect(jest.spyOn(fs, 'writeFileSync')).toHaveBeenCalledWith(
      path.join(__dirname, "public/sitemap.xml"),
      require('./buffer-example'),
      "utf-8"
    );
  });
});
