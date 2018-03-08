const RarBGApi = require('../');

const rarBGApi = new RarBGApi();

(async () => {
    const $ = await rarBGApi._get('/');
    console.log($.html());
})();