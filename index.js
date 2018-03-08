const got = require('got');
const cheerio = require('cheerio');

class RarBGApi {
    /**
     * @typedef {Object} RarBGConfig
     * @property {string} baseUrl - API base URL
     */

    /**
     * Create a new instance of RarBGApi
     * @param {RarBGConfig} config - API configuration
     */
    constructor({ baseUrl = 'http://rarbg.to' } = {}) {
        /**
         * RarBG base URL
         * @type {string}
         * @readonly
         * @private
         */
        this._baseUrl = baseUrl;
    }

    /**
     * Make a get request and get a cheerio instance back.
     * @param {string} endpoint - The endpoint to make requests to
     * @param {Object} query - The query parameters of the request
     */
    async _get(endpoint, query) {
        const uri = `${this._baseUrl}${endpoint}`;
        const res = await got.get(uri, { query });
        
        return cheerio.load(res.body);
    }

    async getTorrents({
        term,
        categories,
        page = 1
    } = {}) {

    }

    async getMovies() {

    }

    async getMovie() {

    }

    async getShows() {

    }

    async getShow() {

    }
}

module.exports = RarBGApi;