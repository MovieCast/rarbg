const got = require('got');
const util = require('./util');

class RarBGApi {
    /**
     * @typedef {Object} RarBGConfig
     * @property {string} baseUrl - API base URL
     */

    /**
     * Create a new instance of RarBGApi
     * @param {RarBGConfig} config - API configuration
     */
    constructor({ baseUrl = 'https://torrentapi.org/pubapi_v2.php' } = {}) {
        /**
         * RarBG base URL.
         * @type {string}
         * @readonly
         * @private
         */
        this._baseUrl = baseUrl;

        /**
         * TorrentAPI Token.
         * Don't use this variable directly!
         * Use the {@link _getToken} method instead!
         * @type {string}
         * @private
         */
        this._token = null;
    }

    /**
     * Get current token/refresh current token.
     * @param {boolean} force - Whether to force a refresh
     * @private
     */
    async _getToken(force = false) {
        if(!this._token || refreshToken) {
            const opts = {
                query: {
                    get_token: 'get_token'
                },
                json: true
            }
            
            const res = await got.get(this._baseUrl, opts);

            this._token = res.body.token;
        }

        return this._token;
    }

    /**
     * Make a get request with correct token.
     * @param {string} endpoint - The endpoint to make requests to
     * @param {Object} query - The query parameters of the request
     * @param {boolean} refreshToken - Whether to refresh the token
     * @private
     */
    async _get(query, refreshToken = false) {
        const token = await this._getToken(refreshToken);

        util.clean(query);
        
        const opts = {
            query: {
                ...query,
                token
            },
            json: true
        }

        const res = await got.get(this._baseUrl, opts);

        if(res.body.error_code == 4) {
            // Token expired
            return this._get(query, true);
        }

        if(res.body.error_code == 5) {
            // Too many requests
            await util.sleep(2);
            return this._get(query);
        }

        return res;
    }

    /**
     * Internal function for other getters.
     * Will build query object and do some checks
     * @param {string} mode - The mode (list, search)
     * @param {Object} query - Optional query
     * @private
     */
    async _getAll(mode = 'list', {
        category,
        limit = 25,
        sort = 'last',
        min_seeders,
        min_leechers,
        format = 'json_extended',
        ranked
    } = {}) {

        if(Array.isArray(category)) {
            category = category.join(';');
        }

        if(!~[25, 50, 100].indexOf(limit)) {
            throw new Error(`${limit} is not a valid value for limit.`);
        }

        if(!~['last', 'seeders', 'leechers'].indexOf(sort)) {
            throw new Error(`${sort} is not a valid value for sort`);
        }

        if(!~['json', 'json_extended'].indexOf(format)) {
            throw new Error(`${sort} is not a valid value for format`);
        }

        const result = await this._get({
            mode,
            category,
            limit,
            sort,
            min_seeders,
            min_leechers,
            format,
            ranked
        });

        return result.body.torrent_results;
    }

    /**
     * Get list of torrents from RarBG.
     * @param {Object} query - Optional query
     */
    async getList(query) {
        return this._getAll('list', query);
    }

    /**
     * Search on RarBG by keywords.
     * @param {string} keywords - The keywords to search on
     * @param {Object} query - Optional query
     */
    async search(keywords, query) {
        return this._getAll('search', {
            search_string: keywords,
            ...query
        });
    }
}

module.exports = RarBGApi;