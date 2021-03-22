const {
  nextServer,
  nextBuild,
  startApp,
  renderViaHTTP
} = require('../next-test-utils');

const appDir = __dirname;
let appPort;
let server;
let app;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 30;

beforeAll(async () => {
  jest.resetModules();
  await nextBuild(appDir);

  server = await startApp({
    dir: appDir,
    dev: false,
    quiet: true
  });

  appPort = server.address().port;
});

afterAll(() => server ? server.close() : null);

describe('Using Sitemap Generator', () => {
  describe('visiting page', () => {
    it('loads sitemap.xml', async () => {
      const html = await renderViaHTTP(appPort, '/sitemap.xml');
      expect(html).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(html).toMatchSnapshot();
    });
  });
});
