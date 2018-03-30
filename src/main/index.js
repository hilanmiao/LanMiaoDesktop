'use strict'

import {app, BrowserWindow, ipcMain} from 'electron'
// 自动更新相关
import {autoUpdater} from 'electron-updater'

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
        height: 563,
        useContentSize: true,
        width: 1000
    })

    mainWindow.loadURL(winURL)

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
        mainWindow = null
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
let message = {
    error: '检查更新出错',
    checking: '正在检查更新......',
    updateAva: '监测到新版本，正在下载......',
    updateNotAva: '现在使用的就是最新版本，不用下载'
}

const os = require('os') // eslint-disable-line no-unused-vars

// 当更新出现错误时触发
autoUpdater.on('error', (err) => {
    sendUpdateMessage(message.error)
})
// 当开始检查更新的时候触发
autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(message.checking)
})
// 当发现一个可用更新的时候触发，更新下载包会自动开始
autoUpdater.on('update-available', (info) => {
    sendUpdateMessage(message.updateAva)
})
// 当没有可用更新的时候触发
autoUpdater.on('update-not-available', (info) => {
    sendUpdateMessage(message.updateNotAva)
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
        console.log(arguments)
        console.log('开始更新')
        // some code here to handle event
        autoUpdater.quitAndInstall()
    })
    mainWindow.webContents.send('isUpdateNow')
})

ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
})
