const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'admin';
const { TOKEN_TIMEOUT } = require("../config.json");


var _ = require('lodash');
var { RequestTemplate } = require('./template');
var { getToken, isTokenValid } = require('./token');
var mock = require('../mock/index.js')();

function validUser (usr, pass) {
    return usr === ADMIN_USER && pass === ADMIN_PASSWORD;
}
function diff(a, b) {
    var isDiff = true;
    if (_.isArray(a)) {
        for (let i = 0; i < a.length; i++) {
            isDiff = isDiff && diff(a[i], b[i]);
            if (!isDiff) {
                return isDiff;
            }
        }
        return isDiff;
    } else if (_.isObject(a)) {
        for (const key in a) {
            if (a.hasOwnProperty(key)) {
                isDiff = isDiff && diff(a[key], b[key]);
                if (!isDiff) {
                    return isDiff;
                }
            }
        }
        return isDiff;
    } else {
        return a === b;
    }
}

module.exports = function (app) {
    // login
    app.post('/service/login', function (req, res) {
        var reqData = req.body && req.body.data || {};
        var user = reqData.user,
            pass = reqData.password;
        if (validUser(user, pass)) {
            console.log(`Info User: ${user} login in ${new Date().toISOString()}\
                - timeout: ${TOKEN_TIMEOUT}`);
            res.send(new RequestTemplate({
                token: getToken(user, pass, TOKEN_TIMEOUT)
            }));
        } else {
            res.send(new RequestTemplate({}, 5000, '输入的帐号或密码错误'));
        }
    });
    app.post('/service/user/base', function (req, res) {
        
    });

    // Test
    app.post('/service/center/rank', function (req, res) {
        var recvToken = req.get('token');
        if (isTokenValid(recvToken)) {
            res.send(new RequestTemplate({
                data: {
                    centerNum: 10,
                    districtNum: 53
                }
            }));
        } else {
            res.status(401).send(new RequestTemplate({}, 4000, '登录过期'));
        }
    });

    mock.forEach(function (m) {
        app[m.m](m.url, function (req, res) {
            var recvToken = req.get('token');
            var reqData = req.body && req.body || {};
            if (isTokenValid(recvToken)) {
                if (diff(reqData, m.req)) {
                    res.send(m.res);
                } else {
                    res.send(new RequestTemplate({}, 5000, '参数错误'));
                }
            } else {
                res.status(401).send(new RequestTemplate({}, 4000, '登录过期'));
            }
        });
    });
}