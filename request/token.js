var moment = require('moment');
var tokenCache = {};
const { TOKEN_RULE } = require("../config.json");
function Token () {
    return moment(new Date()).format(TOKEN_RULE);
}

module.exports = {

    getToken: function (user, pass, timeout) {
        var t = Token();
        tokenCache[t] = {
            user: user,
            password: pass,
            timeout: timeout,
            createTime: new Date()
        };
        return t;
    },

    isTokenValid: function (token) {
        if (tokenCache[token]) {
            var expireTime = moment(tokenCache[token].createTime)
                .add(tokenCache[token].timeout, 'seconds')
                .format(TOKEN_RULE);
            var nowTime = moment(new Date()).format(TOKEN_RULE);
            return expireTime > nowTime;
        }
        return false;
    }
};