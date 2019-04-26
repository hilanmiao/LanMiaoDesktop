// 引用winreg模块
var WinReg = require('winreg')
var startOnBoot = {

    // 设置自动启动
    enableAutoStart: function (name, file, callback) {
        var key = getKey()
        key.set(name, WinReg.REG_SZ, file, callback || noop)
    },

    // 取消自动启动
    disableAutoStart: function (name, callback) {
        var key = getKey()
        key.remove(name, callback || noop)
    },

    // 获取是否自动启动
    getAutoStartValue: function (name, callback) {
        var key = getKey()
        key.get(name, function (error, result) {
            if (result) {
                callback(null, result.value)
            } else {
                callback(error)
            }
        })
    }
}

var RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'

// 获取注册表key
function getKey() {
    return new WinReg({
        // hive: WinReg.HKCU, // CurrentUser,
        hive: WinReg.HKLM, // LocalMachine,
        key: RUN_LOCATION
    })
}

// callback自定义方法，你可以在这里写代码
function noop() {
}

// 导出
module.exports = startOnBoot
