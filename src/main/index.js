'use strict'

import {app, BrowserWindow, ipcMain, Menu, Tray, shell} from 'electron'
// 自动更新相关
import {autoUpdater} from 'electron-updater'

// 自动启动相关
const startOnBoot = require('./startOnBoot.js')
// 应用程序名称 （cmd命令"msconfig-启动项"查看）
const exeName = 'LanMiao'
// // 设置自动启动
// startOnBoot.getAutoStartValue(exeName, (error, result) => {
//     if (result) {
//         startOnBoot.enableAutoStart(exeName, process.execPath)
//     }
// })

// 托盘对象
let appTray = null
// 是否可以退出
let trayClose = false
const path = require('path')

// 指定 flash 路径，假定它与 main.js 放在同一目录中。
// let pluginName
// switch (process.platform) {
//     case 'win32':
//         pluginName = '/static/pepflashplayer64_29_0_0_113.dll'
//         break
//     case 'darwin':
//         pluginName = 'PepperFlashPlayer.plugin'
//         break
//     case 'linux':
//         pluginName = 'libpepflashplayer.so'
//         break
// }
// app.commandLine.appendSwitch('ppapi-flash-path', pluginName)
app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'))

// 可选：指定 flash 的版本，例如 v17.0.0.169
app.commandLine.appendSwitch('ppapi-flash-version', '29.0.0.113')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 768,
        useContentSize: true,
        width: 1366,
        webPreferences: {
            webSecurity: false,
            plugins: true
        }
    })

    mainWindow.loadURL(winURL)

    // if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
    // }
    mainWindow.on('close', (event) => {
        if (!trayClose) {
            // 最小化
            mainWindow.hide()
            event.preventDefault()
        }
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // 为了防止闪烁，让画面准备好了再显示
    // 对于一个复杂的应用，ready-to-show 可能发出的太晚，会让应用感觉缓慢。 在这种情况下，建议立刻显示窗口，并使用接近应用程序背景的 backgroundColor
    // 请注意，即使是使用 ready-to-show 事件的应用程序，仍建议使用设置 backgroundColor 使应用程序感觉更原生。
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    // 系统托盘右键菜单
    const trayMenuTemplate = [
        {
            label: '关于我们',
            click: function () {
                // 打开外部链接
                shell.openExternal('http://www.baidu.com')
            }
        },
        {
            label: '退出',
            click: function () {
                // 退出
                trayClose = true
                app.quit()
            }
        }
    ]
    // 系统托盘图标
    const iconPath = path.join(__dirname, '/static/icon2.ico')
    appTray = new Tray(iconPath)
    // 图标的上上下文
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
    // 设置此托盘图标的悬停提示内容
    appTray.setToolTip('天天好心情')
    // 设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu)
    // 主窗口显示隐藏切换
    appTray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    mainWindow.webContents.send('message', text)
}

// 监测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
let message = { // eslint-disable-line no-unused-vars
    error: '检查更新出错',
    checking: '正在检查更新......',
    updateAva: '监测到新版本，正在下载......',
    updateNotAva: '现在使用的就是最新版本，不用下载'
}

const os = require('os') // eslint-disable-line no-unused-vars

// 当更新出现错误时触发
autoUpdater.on('error', (err) => {
    sendUpdateMessage('error')
})
// 当开始检查更新的时候触发
autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage('checking')
})
// 当发现一个可用更新的时候触发，更新下载包会自动开始
autoUpdater.autoDownload = false
autoUpdater.on('update-available', (info) => {
    sendUpdateMessage('updateAva')
})
// 当没有可用更新的时候触发
autoUpdater.on('update-not-available', (info) => {
    sendUpdateMessage('updateNotAva')
})
// 更新下载进度事件
autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('downloadProgress', progressObj)
})
/**
 * event Event
 * releaseNotes String - 新版本更新公告
 * releaseName String - 新的版本号
 * releaseDate Date - 新版本发布的日期
 * updateUrl String - 更新地址
 */
autoUpdater.on('update-downloaded', (info) => {
    ipcMain.on('isUpdateNow', (e, arg) => {
        // some code here to handle event
        autoUpdater.quitAndInstall()
    })
    mainWindow.webContents.send('isUpdateNow')
})

ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
})

ipcMain.on('downloadUpdate', () => {
    // 下载
    autoUpdater.downloadUpdate()
})

// 检查是否自动启动
ipcMain.on('getAutoStartValue', () => {
    startOnBoot.getAutoStartValue(exeName, (error, result) => {
        if (error) {
            mainWindow.webContents.send('getAutoStartValue', false)
        } else {
            mainWindow.webContents.send('getAutoStartValue', true)
        }
    })
})

// 设置开机自动启动
ipcMain.on('enableAutoStart', () => {
    startOnBoot.enableAutoStart(exeName, process.execPath)
})

// 取消开机自动启动
ipcMain.on('disableAutoStart', () => {
    startOnBoot.disableAutoStart(exeName)
})
