/**
 * 模拟数据的存放路径
 */
const MOCK_PATH = [
    './module/common/region.json',
    './module/case_center/mock.json',

    // 在下面这里添加模拟数据的文件路径
];



module.exports = function () {
    var bigData = [];
    MOCK_PATH.forEach(function (path) {
        bigData = bigData.concat(require(path));
    });
    return bigData;
}