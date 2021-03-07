/**
 * Test File for the generator
 */
let fs = require('fs');
let path = require('path');

jest.mock('fs');
let generator = require('../src/generator');

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
    await generator(sitemapConfig);
  });

  it('should return a sitemap with valid data', async () => {
    let sitemapData = await generator(sitemapConfig);

    expect(sitemapData)
      .toEqual(require('./buffer-example'))
  })

  // it('should check if exists', async () => {

  //   expect(jest.spyOn(fs, "existsSync"))
  //     .toHaveBeenCalledWith(path.join(__dirname, "../public"));
  // });

  // it('should have called 1 time', () => {

  //   expect(jest.spyOn(fs, 'writeFileSync'))
  //     .toHaveBeenCalledTimes(1);
  // });

  // it('file write should have been called with ...', () => {

  //   expect(jest.spyOn(fs, 'writeFileSync')).toHaveBeenCalledWith(
  //     path.join(__dirname, "../public/sitemap.xml"),
  //     require('./buffer-example'),
  //     "utf-8"
  //   );
  // });
});

describe('generator errors', () => {
  it('will fail if linkResolver is not a function', async () => {
    expect(async () => {
      await generator({})
    }).rejects.toThrow()
  });
})

// test('should generate sitemap', async () => {
//   jest.resetModules();

//   let sitemap = await generator(sitemapConfig);

//   expect(sitemap)
//     .toEqual(require('./buffer-example'));

//   expect(fs.existsSync(path.join(__dirname, "../public/sitemap.xml")))
//     .toBeTruthy();
// });
