const {
  nextBuild,
  renderViaHTTP,
  runNextCommand
} = require('../next-test-utils');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60;

describe('Using Sitemap Generator', () => {
  it('loads sitemap.xml', async () => {
    await nextBuild(__dirname);

    await runNextCommand(
      ['start', __dirname],
      { stdout: true, stderr: true },
      async (instance) => {
        const html = await renderViaHTTP(process.env.PORT, '/sitemap.xml');
        expect(html).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
        expect(html).toMatchSnapshot();
        instance.kill()
      }
    );
  });
});
