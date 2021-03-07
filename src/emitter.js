const path = require("path");
const fs = require("fs");

let emitter = {
  data: Buffer.from('<error>Empty Sitemap</error>', 'utf-8'),
  fileName: 'sitemap.xml',

  init({
    fileName, emitter = 'file',
  }) {
    this.fileName = fileName;
    this.emitter = emitter;
    return this;
  },

  fileWriter(publicPath) {
    let basePath = resolvePublicPath(publicPath);

    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }

    return fs.writeFileSync(
      path.join(basePath, this.fileName),
      this.data,
      "utf-8"
    );
  },

  webpackEmitter(compilation, cb) {
    // This will generate `.nuxt/dist/filename.ext' with contents of source variable.

    compilation.assets[this.fileName] = {
      source: () => this.data,
      size: () => this.data.length
    }

    cb()
  },

  emit(data) {
    this.data = data;

    switch (this.emitter) {
      case 'file':
        return this.fileWriter.bind(this)
      case 'nuxt':
        return this.webpackEmitter.bind(this)

      default:
        console.error(`Emitter [${this.emitter}] is not supported`)
        return null;
    }
  }
}

function resolvePublicPath(dir) {
  if (dir === 'public') {
    dir = path.join(__dirname, dir);
  }

  return dir;
}

module.exports = emitter;
