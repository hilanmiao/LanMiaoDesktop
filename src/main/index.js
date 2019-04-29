import {app, BrowserWindow, ipcMain, Menu, shell, Tray, Notification} from 'electron'

// 引入自动启动模块
const startOnBoot = require('./startOnBoot.js')

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

const path = require('path')
const ApplicationName = 'PocketBook'
// 托盘对象
let appTray = null
// 是否可以退出
let trayClose = false
// 系统托盘右键菜单
let trayMenuTemplate
// 系统托盘图标
let iconPath
// 图标的上上下文
let contextMenu
// 图标闪烁定时器
let flashTrayTimer
// 单一实例
const gotTheLock = app.requestSingleInstanceLock()

if (process.platform === 'win32') {
    app.setAppUserModelId(ApplicationName)
}

/**
 * 创建主窗口
 */
function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 1000,
        width: 1600,
        minWidth: 900,
        minHeight: 600,
        useContentSize: true,
        frame: false, // 无边框
        transparent: true, // 透明
        // fullscreen: true, // 全屏
    })

    mainWindow.loadURL(winURL)

    // 为了防止闪烁，让画面准备好了再显示
    // 对于一个复杂的应用，ready-to-show 可能发出的太晚，会让应用感觉缓慢。 在这种情况下，建议立刻显示窗口，并使用接近应用程序背景的 backgroundColor
    // 请注意，即使是使用 ready-to-show 事件的应用程序，仍建议使用设置 backgroundColor 使应用程序感觉更原生。
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    /**
     * 监听
     */

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

    mainWindow.on('maximize', () => {

    })
}

/**
 * 设置系统托盘
 */
function createTray() {
    // 是否可以退出
    trayClose = false
    // 系统托盘右键菜单
    trayMenuTemplate = [
        {
            label: '托盘闪烁',
            click: function () {
                // 判断如果上一个定时器是否执行完
                if (flashTrayTimer) {
                    return
                }

                // 任务栏闪烁
                // if (!mainWindow.isFocused()) {
                //     mainWindow.showInactive();
                //     mainWindow.flashFrame(true);
                // }

                //系统托盘图标闪烁
                appTray.setImage(`${__static}/iconMessage.ico`)
                let count = 0;
                flashTrayTimer = setInterval(function () {
                    count++;
                    if (count % 2 == 0) {
                        appTray.setImage(`${__static}/iconTransparent.ico`)
                    } else {
                        appTray.setImage(`${__static}/iconMessage.ico`)
                    }
                }, 600);
            }
        },
        {
            label: '弹出通知',
            click: function () {
                console.log(Notification.isSupported())
                let notification = new Notification({
                    title: '通知的标题', // 通知的标题, 将在通知窗口的顶部显示
                    body: '通知的正文文本', // 通知的正文文本, 将显示在标题或副标题下面
                    icon: iconPath, // 用于在该通知上显示的图标
                    silent: true, // 在显示通知时是否发出系统提示音
                })

                notification.show()
                notification.on('click' ,()=>{
                    notification.close()
                    console.log('click notification')
                })
            }
        },
        {
            label: '关于项目',
            click: function () {
                // 打开外部链接
                shell.openExternal('https://github.com/hilanmiao/LanMiaoDesktop')
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
    iconPath = `${__static}/icon.ico`
    appTray = new Tray(iconPath)
    // 图标的上上下文
    contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
    // 设置此托盘图标的悬停提示内容
    appTray.setToolTip(ApplicationName)
    // 设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu)
    // 主窗口显示隐藏切换
    appTray.on('click', () => {
        // 清楚图标闪烁定时器
        clearInterval(flashTrayTimer)
        flashTrayTimer = null
        // 还原图标
        appTray.setImage(`${__static}/icon.ico`)
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })
}

/**
 * 开机启动
 */
function ipcStartOnBoot() {
    // 检查是否自动启动
    ipcMain.on('getAutoStartValue', () => {
        startOnBoot.getAutoStartValue(ApplicationName, (error, result) => {
            if (error) {
                mainWindow.webContents.send('getAutoStartValue', false)
            } else {
                mainWindow.webContents.send('getAutoStartValue', true)
            }
        })
    })

    // 设置开机自动启动
    ipcMain.on('enableAutoStart', () => {
        startOnBoot.enableAutoStart(ApplicationName, process.execPath)
    })

    // 取消开机自动启动
    ipcMain.on('disableAutoStart', () => {
        startOnBoot.disableAutoStart(ApplicationName)
    })
}

/**
 * 单一实例
 */
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })

    // 创建 mainWindow, 加载应用的其余部分, etc...
    app.on('ready', () => {
        createWindow()
        createTray()
        ipcStartOnBoot()
    })
}

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

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
