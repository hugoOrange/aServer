$(document).ready(function () {
    var token;
    // 发送登录
    $("#login").on("click", function sendLogin () {
        token = undefined;
        $.ajax({
            url: 'service/login',
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                data: {
                    user: 'admin',
                    password: 'admin'
                }
            }),
            success: function (ret) {
                if (ret.data && ret.data.token) {
                    console.log("登录成功： " + new Date().toISOString());
                    token = ret.data.token;
                } else {
                    console.error("登录失败： " + ret.state.msg);
                }
            },
            error: function (error) {
                console.error("登录失败");
            }
        });
    });
    
    // 测试
    $("#center_rank").on("click", function sendLogin () {
        $.ajax({
            url: 'service/center/rank',
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            headers: {
                token: token
            },
            data: JSON.stringify({
                data: {
                    regionCode: '440000'
                }
            }),
            success: function (ret) {
                console.dir(ret);
            }
        });
    });
    // 测试
    $("#real_time").on("click", function sendLogin () {
        $.ajax({
            url: "service/province/home/center/realTime/stepProgress/status/count",
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            headers: {
                token: token
            },
            data: JSON.stringify({
                data: {
                    "isRegionCode": "true",
                    "regionCode": "440000"
                }
            }),
            success: function (ret) {
                console.dir(ret);
            }
        });
    });
    // 测试
    $("#region_all").on("click", function sendLogin () {
        $.ajax({
            url: "service/province/config/region/all/440000",
            method: 'GET',
            contentType: 'application/json; charset=utf-8',
            headers: {
                token: token
            },
            success: function (ret) {
                console.dir(ret);
            }
        });
    });
})