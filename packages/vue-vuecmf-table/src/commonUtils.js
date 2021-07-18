/**
 * 功能：解析EXCEL文件中日期字段，默认EXCEL中日期字段为变为大于40000的整型数字，需要转换成 形如 YYYY-MM-DD
 * @param {*} dateObj  日期对象
 * @param {*} fmt  格式化字符串：例如 Y/m/d H:i:s
 */
export function dateFormat(dateObj, fmt) {
    let obj = {
        "m+": dateObj.getMonth() + 1, //月份
        "d+": dateObj.getDate() - 1, //日
        "H+": dateObj.getHours(), //小时
        "i+": dateObj.getMinutes(), //分
        s: dateObj.getSeconds() //秒
    };
    if (/(Y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, dateObj.getFullYear() + "");
    for (let k in obj) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, obj[k] < 10 ? "0" + obj[k] : obj[k]);
        }
    }
    return fmt;
}