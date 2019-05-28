import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
// 引入remote模块
import { app, remote } from 'electron'
// package.json
import pkg from '../../package.json'

// 根据process.type来分辨在哪种模式使用哪种模块
const APP = process.type === 'renderer' ? remote.app : app

// 获取electron应用的用户目录
const STORE_PATH = APP.getPath('userData')
// console.log(STORE_PATH)
// dev C:\Users\JD\AppData\Roaming\Electron
// prod C:\Users\JD\AppData\Roaming\PocketBook

if (process.type !== 'renderer') {
    // 如果不存在路径
    if (!fs.pathExistsSync(STORE_PATH)) {
        // 就创建
        fs.mkdirpSync(STORE_PATH)
    }
}

// 以同步的方式初始化lowdb读写的json文件名以及存储路径
const adapter = new FileSync(path.join(STORE_PATH, `/${pkg.name}_lowdb.json`))

// lowdb接管该文件
const db = Datastore(adapter)
// 通过._mixin()引入lodash_id唯一id插件
db._.mixin(LodashId)

// 初始化数据
if(!db.has('user').value()) {
    db.set('user',[]).write()
    db.get('user').insert({userId: 'admin', password: '123456'}).write()
}

if(!db.has('category').value()) {
    const tempData = [
        {
            "category": "breakfast",
            "remark": "daily breakfast expenses",
        },
        {
            "category": "dinner",
            "remark": "daily dinner expenses",
        },
        {
            "category": "lunch",
            "remark": "Daily lunch expenses",
        }
    ]
    db.set('category', []).write()
    tempData.forEach(item => {
        db.get('category').insert(item).write()
    })
}

if(!db.has('assets').value()) {
    const tempData = [
        {assetsName: 'me', assetsDetailed: 'My assets', assetsAmountOfMoney: 0},
        {assetsName: 'wife', assetsDetailed: 'My wife\'s assets', assetsAmountOfMoney: 0}
    ]
    db.set('assets', []).write()
    tempData.forEach(item => {
        db.get('assets').insert(item).write()
    })
}

if(!db.has('incomeAndExpenditure').value()) {
    db.set('incomeAndExpenditure', []).write()
}

export default db // 暴露出去