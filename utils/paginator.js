const Prismic = require("prismic-javascript");

const paginator = {
  pageSize: 20,
  api: null,
  results: [],
  /**
   *
   * @param {Prismic} api prismic client
   * @param {Object} options {pageSize}
   */
  init(api, options = {}) {
    this.api = api;
    this.pageSize = options.hasOwnProperty('pageSize') ? options.pageSize : 20;

    return this;
  },

  /**
   * This paginates automatically over the document list from Prismic
   * @todo Add Lang support for scoping to a selection of languages.
   *
   * @param {String} type The Document type
   * @param {Number} next The Next Page type
   * @returns Promise
   */
  async paginate(type, next = null) {
    const { results, total_pages, page } = await this.api.query(
      Prismic.Predicates.at("document.type", type),
      {
        lang: "*",
        pageSize: this.pageSize,
        page: next
      }
    );

    if (results.length <= 0) {
      return Promise.resolve();
    }
    
    this.results.push(...results);

    if (total_pages !== page) {
      return this.paginate(type, page + 1)
    }

    return Promise.resolve();
  }
}

module.exports = paginator;
