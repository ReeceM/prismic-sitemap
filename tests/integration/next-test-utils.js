// I am not smart, I learnt from below
// Based on https://github.com/lfades/next-with-apollo/blob/master/integration/next-test-utils.ts

let path = require('path');
let { createServer } = require('http');
let spawn = require('cross-spawn');
let nextServer = require('next');
let fetch = require('node-fetch');

let port;
/**
 * These utils are very similar to the ones used by Next.js in their tests
 */

function promiseCall(obj, method, ...args) {
  return new Promise((resolve, reject) => {
    const newArgs = [
      ...args,
      function(err, res) {
        if (err) return reject(err);
        resolve(res);
      }
    ];

    obj[method](...newArgs);
  });
}

module.exports = { nextServer };

module.exports.startApp = async function startApp(options) {
  const app = nextServer(Object.assign({
    port: 3000,
    hostname: 'localhost',
    customServer: true,
  }, options));

  process.env.NODE_ENV = "production";

  app.prepare();

  const handler = app.getRequestHandler();
  const server = createServer(handler);

  server.__app = app;
  port = server.address().port

  await promiseCall(server, 'listen');

  return server;
}

module.exports.stopApp =  async function stopApp(server) {
  const app = server._app;

  if (app) await app.close();
  await promiseCall(server, 'close');
}

function runNextCommand(
  args = [],
  options,
  actions = () => {}
) {
  const nextDir = path.dirname(require.resolve('next/package'));
  const nextBin = path.join(nextDir, 'dist/bin/next');
  const cwd = nextDir;
  const env = { ...process.env, ...options.env, NODE_ENV: 'production' };

  return new Promise((resolve, reject) => {
    // console.log(`Running command "next ${args.join(' ')}"`);
    const instance = spawn('node', [nextBin, ...args], {
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stderrOutput = '';
    if (options.stderr) {
      instance.stderr.on('data', function(chunk) {
        stderrOutput += chunk;
      });
    }

    let stdoutOutput = '';
    if (options.stdout) {
      instance.stdout.on('data', function (chunk) {
        stdoutOutput += chunk;
      });
    }

    instance.on('close', () => {
      resolve({
        stdout: stdoutOutput,
        stderr: stderrOutput
      });
    });

    instance.on('error', (err) => {
      err.stdout = stdoutOutput;
      err.stderr = stderrOutput;
      reject(err);
    });

    instance.on('exit', () => {
      resolve({
        stdout: stdoutOutput,
        stderr: stderrOutput
      });
    });

    instance.on('spawn', () => actions(instance));
  });
}

module.exports.runNextCommand = runNextCommand

module.exports.nextBuild =  function nextBuild(
  dir,
  args = [],
  opts = {}
) {
  return runNextCommand(['build', dir, ...args], opts);
}

module.exports.nextExport =  function nextExport(
  dir,
  args = [],
  opts = {}
) {
  return runNextCommand(['export', dir, ...args], opts);
}

function fetchViaHTTP(
  appPort = port,
  pathname,
  opts = {}
) {
  const url = `http://localhost:${appPort}${pathname}`;
  return fetch(url, opts);
}

module.exports.fetchViaHTTP = fetchViaHTTP

module.exports.renderViaHTTP =  function renderViaHTTP(appPort, pathname) {
  return fetchViaHTTP(appPort, pathname).then(res => res.text());
}

module.exports.extractNextData =  function extractNextData(html) {
  const R = /<script id=\"__NEXT_DATA__\" type=\"application\/json\">([^<]*)<\/script>/gm;
  const [, json] = R.exec(html);
  const { props } = JSON.parse(json);

  return props;
}
