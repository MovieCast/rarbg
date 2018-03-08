const RarBGApi = require('../');

const rarBGApi = new RarBGApi();

(async () => {
    const result = await rarBGApi.getList();
    console.log(result);
})();