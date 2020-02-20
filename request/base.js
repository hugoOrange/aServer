const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = '202CB962AC59075B964B07152D234B70';
const { TOKEN_TIMEOUT } = require("../config.json");
const userInfoData = require("./user.json");
const dictionaryData = require("../mock/module/dictionary/base.json");


var _ = require('lodash');
var { RequestTemplate } = require('./template');
var { getToken, isTokenValid, getUserByToken } = require('./token');
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
    app.post('/sundun-edas/oauth/token', function (req, res) {
        var reqData = req.body && req.body.data || {};
        var user = reqData.user,
            pass = reqData.password;
        if (validUser(user, pass)) {
            console.log(`Info User: ${user} login in ${new Date().toISOString()}\
                - timeout: ${TOKEN_TIMEOUT}`);
            res.send(new RequestTemplate({
                access_token: getToken(user, pass, TOKEN_TIMEOUT)
            }));
        } else {
            res.send(new RequestTemplate({}, 5000, '输入的帐号或密码错误'));
        }
    });
    app.get('/sundun-edas/oauth/user/base', function (req, res) {
        var recvToken = req.get('token');
        if (isTokenValid(recvToken)) {
            var userInfo = getUserByToken(recvToken);
            if (!_.isUndefined(userInfo)) {
                res.send(new RequestTemplate(userInfoData));
            } else {
                res.send(new RequestTemplate({}, 5000, '找不到登录用户'));
            }
        } else {
            res.status(401).send(new RequestTemplate({}, 4000, '登录过期'));
        }
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

    app.post('/service/province/config/dic/list', function (req, res) {
        var recvToken = req.get('token');
        var reqData = req.body && req.body || {};
        if (isTokenValid(recvToken)) {
            var reqDic = reqData.data && reqData.data.typeCode || "";
            var res;
            if (dictionaryData[reqDic]) {
                res = new RequestTemplate(dictionaryData[reqDic]);
            } else {
                res = new RequestTemplate([]);
            }
            res.page = {"start":0,"size":10,"currPage":1,"totalPage":1,"total":9,"pageCount":9,"nextPage":-1,"lastPage":1};
            res.send(res);
        } else {
            res.status(401).send(new RequestTemplate({}, 4000, '登录过期'));
        }
    });
    app.post('/service/province/config/dic/type', function (req, res) {
        var recvToken = req.get('token');
        var reqData = req.body && req.body || {};
        if (isTokenValid(recvToken)) {
            var reqDicList = reqData.data && reqData.data.typeList || [];
            var resDicList = {};
            reqDicList.forEach(function (dic) {
                if (dictionaryData[dic]) {
                    resDicList[dic] = dictionaryData[dic];
                } else {
                    resDicList[dic] = [];
                }
            });
            res.send(new RequestTemplate(resDicList));
        } else {
            res.status(401).send(new RequestTemplate({}, 4000, '登录过期'));
        }
    });

    mock.forEach(function (m) {
        app[m.m](m.url, function (req, res) {
            var recvToken = req.get('token');
            var reqData = req.body && req.body || {};
            var responseData = new RequestTemplate({}, 5000, '参数错误');
            if (isTokenValid(recvToken)) {
                if (_.isArray(m.req)) {
                    for (let i = 0; i < m.req.length; i++) {
                        if (diff(reqData, m.req[i])) {
                            responseData = m.res[i];
                            break;
                        }
                    }
                } else {
                    if (diff(reqData, m.req)) {
                        responseData = m.res;
                    }
                }
                res.send(responseData);
            } else {
                res.status(401).send(new RequestTemplate({}, 4000, '登录过期'));
            }
        });
    });
}