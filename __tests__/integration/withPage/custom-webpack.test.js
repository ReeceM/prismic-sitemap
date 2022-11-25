const {
  nextBuild
} = require('../next-test-utils');

const appDir = __dirname;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60;

beforeAll(async () => {
  jest.resetModules();
});

describe('Using a custom webpack config', () => {
  it('triggers custom webpack functions', async () => {
    const { stdout, stderr } = await nextBuild(appDir, [], { stdout: true, stderr: true })

    expect(stdout).toContain('Custom Webpack Triggered')

  });
});
