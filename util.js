/**
 * Wait x amount of time.
 * @param {number} timeout - Amount of time to wait in seconds
 */
function sleep(timeout) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout * 1000);
    });
}

/**
 * Remove all empty attributes of an object.
 * @param {Object} object - The object to clean
 */
function clean(object) {
    Object.keys(object).forEach((key) => (object[key] == null) && delete object[key]);
}

module.exports = {
    sleep,
    clean
};