/**
 * 模拟数据的存放路径
 */
const MOCK_PATH = [
    './module/case_center/mock.json'
];



module.exports = function () {
    var bigData = [];
    MOCK_PATH.forEach(function (path) {
        bigData = bigData.concat(require(path));
    });
    return bigData;
}