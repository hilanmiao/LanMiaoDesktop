import db from '../datastore'

const TableName = 'incomeAndExpenditure'

export function getModelById(id) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            const model = collection.getById(id).value()
            resolve({
                code: 200,
                data: model
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getModelWhere(attrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            const list = collection.find(attrs).value()
            resolve({
                code: 200,
                data: list
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getModelAll() {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            const list = collection.value()
            resolve({
                code: 200,
                data: list
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getModelPagination(pagination, whereAttrs, filterFun) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            const total = collection.size().value()
            const list = collection
                .filter(filterFun)
                .orderBy(pagination.sortBy, pagination.descending ? 'desc' : 'asc')
                .chunk(pagination.rowsPerPage === -1 ? total : pagination.rowsPerPage)
                .take(pagination.page)
                .last() // 因为上面用了chunk，是个二维数组，所以这里取最后一个
                .value()
            resolve({
                code: 200,
                data: {total: total, list: list}
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function postModel(document) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            const model = collection.insert(document).write()
            resolve({
                code: 200,
                data: model
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function postOrPutModel(document) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            const model = collection.upsert(document).write()
            resolve({
                code: 200,
                data: model
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
            const collection = db.get(TableName)
            const model = collection.updateById(id, attrs).write()
            resolve({
                code: 200,
                data: model
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function putModelWhere(whereAttrs, attrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            const model = collection.updateWhere(whereAttrs, attrs).write()
            resolve({
                code: 200,
                data: model
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function replaceModelById(id, attrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            const model = collection.replaceById(id, attrs).write()
            resolve({
                code: 200,
                data: model
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function deleteModelById(id) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            collection.removeById(id).write()
            resolve({
                code: 200
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function deleteModelByIds(ids) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            ids.forEach(id => {
                collection.removeById(id).write()
            })
            resolve({
                code: 200
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function deleteModelWhere(whereAttrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get(TableName)
            const list = collection.removeWhere(whereAttrs).write()
            resolve({
                code: 200,
                data: list
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}