import db from '../datastore'
import _ from 'lodash'

const Table = 'user'

export function login(data) {
    return new Promise((resolve, reject) => {
        try {
            const user = db.read().get(Table).find({userId: data.name, password: data.password}).value()
            resolve(_.cloneDeep(user))
        } catch (err) {
            return reject(err)
        }
    })
}

export function getModelWhere(attrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(Table)
            const list = collection.filter(attrs).value()
            resolve({
                code: 200,
                data: _.cloneDeep(list)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function putModelById(id, attrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(Table)
            const model = collection.updateById(id, attrs).write()
            resolve({
                code: 200,
                data: _.cloneDeep(model)
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}
