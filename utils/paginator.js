const Prismic = require("prismic-javascript");

const paginator = {
  pageSize: 20,
  api: null,
  results: [],
  /**
   *
   * @param {Prismic} api prismic client
   * @param {Object} options {pageSize, auto}
   */
  init(api, options = {}) {
    this.api = api;
    this.pageSize = options.hasOwnProperty('pageSize') ? options.pageSize : 20;

    return this;
  },

  async paginate(type, next = null) {
    const { results, total_pages, page } = await this.api.query(
      Prismic.Predicates.at("document.type", type),
        {
          lang: "*",
          pageSize: this.pageSize,
          page: next
        }
    );

    results.push(...results);

    if (total_pages > this.nextPage) {
      return this.paginate(type, page + 1)
    }

    return Promise.resolve(this.results);
  }
}

module.exports = paginator;
