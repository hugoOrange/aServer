function getUid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + 
        S4() + "-" + S4() + S4() + S4());
}

module.exports = {
    RequestTemplate: function (data = {}, code = 200, msg = '操作成功') {
        this.id = getUid();
        this.sid = getUid();
        this.state = {
            code: code,
            msg: msg
        };
        this.data = data;
    }
}