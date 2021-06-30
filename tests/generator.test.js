/**
 * Test File for the generator
 */
let fs = require('fs');
let path = require('path');

jest.mock('fs');
let generator = require('../generator');

fs.readFileSync.mockResolvedValue(require('./buffer-example'))

const sitemapConfig = {
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
};

describe('tests for generator.js', () => {
  beforeAll(async () => {
    // clear any previous calls
    jest.restoreAllMocks();
    await generator(sitemapConfig);
  });

  it('should check if exists', async () => {

    expect(jest.spyOn(fs, "existsSync"))
      .toHaveBeenCalledWith(path.join(__dirname, "../public"));
  });

  it('should have called 1 time', () => {

    expect(jest.spyOn(fs, 'writeFileSync'))
      .toHaveBeenCalledTimes(1);
  });

  it('file write should have been called with ...', () => {

    expect(jest.spyOn(fs, 'writeFileSync')).toHaveBeenCalledWith(
      path.join(__dirname, "../public/sitemap.xml"),
      require('./buffer-example'),
      "utf-8"
    );
  });

  // it('will have lastmod in the values', async () => {

  //   const file = await fs.readFileSync(path.join(__dirname, "../sitemap.xml"))

  //   expect(file.toLocaleString())
  //     .toEqual(expect.stringMatching(/<lastmod>.*<\/lastmod>/g))
  // })
});

describe('generator errors', () => {
  it('will fail if linkResolver is not a function', async () => {
    expect(async () => {
      await generator({})
    }).rejects.toThrow()
  });

  it('will fail if sitemap option callback throws an error', async () => {
    expect(async () => {
      await generator({
        linkResolver: (doc) => `/${doc.uid}`,
        hostname: 'https://example.com',
        documentTypes: ['post', 'page', 'latest_notice'],
        apiEndpoint: process.env.TEST_REPOSITORY,
        optionsMapPerDocumentType: {
          page: (doc) => {
            throw new Error('Hello World')
          }
        }
      })
    })
      .rejects
      .toThrow(/\[Sitemap Generator\]: Failed to generate a sitemap entry for document {.*}/)
  })

  it('will not fail if static path has an error', async () => {
    expect(async () => {
      await generator({
        linkResolver: (doc) => `/${doc.uid}`,
        hostname: 'https://example.com',
        documentTypes: ['post', 'page', 'latest_notice'],
        apiEndpoint: process.env.TEST_REPOSITORY,
        staticPaths: [
          {
            notUrl: 'hello',
            priority: '0.0',
          }
        ]
      })
    })
  })
})

// test('should generate sitemap', async () => {
//   jest.resetModules();

//   let sitemap = await generator(sitemapConfig);

//   expect(sitemap)
//     .toEqual(require('./buffer-example'));

//   expect(fs.existsSync(path.join(__dirname, "../public/sitemap.xml")))
//     .toBeTruthy();
// });
