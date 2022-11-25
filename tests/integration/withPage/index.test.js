const {
  nextBuild,
  startApp,
  renderViaHTTP
} = require('../next-test-utils');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 80;

describe('Using Sitemap Generator', () => {
  it('loads sitemap.xml', async () => {
    await nextBuild(__dirname);

    await startApp(__dirname, ['-p', '44343'], { stdout: true, stderr: true })

    const html = await renderViaHTTP(44343, '/sitemap.xml');

    expect(html).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');

    expect(html).toMatchSnapshot();

  });
});
