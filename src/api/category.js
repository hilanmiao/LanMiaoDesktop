import db from '../datastore'

export function getCategoryById(id) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const category = collection.getById(id).value()
            resolve({
                code: 200,
                data: category
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getCategoryWhere(attrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const category = collection.find(attrs).value()
            resolve({
                code: 200,
                data: category
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getCategoryAll() {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const categoryAll = collection.value()
            resolve({
                code: 200,
                data: categoryAll
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function getCategoryPagination(params) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const total = collection.size().value()
            const categoryList = collection
                .filter(params.key)
                .sortBy(params.sortBy, params.descending ? 'desc' : 'asc')
                .chunk(params.rowsPerPage === -1 ? total : params.rowsPerPage)
                .take(params.page)
                .last() // 因为上面用了chunk，是个二维数组，所以这里取最后一个
                .value()
            resolve({
                code: 200,
                data: {total: total, list: categoryList}
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function postCategory(document) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const newCategory = collection.insert(document).write()
            resolve({
                code: 200,
                data: newCategory
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function postOrPutCategory(document) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const newCategory = collection.upsert(document).write()
            resolve({
                code: 200,
                data: newCategory
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function putCategoryById(id, attrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const newCategory = collection.updateById(id, attrs).write()
            resolve({
                code: 200,
                data: newCategory
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function putCategoryWhere(whereAttrs, attrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const newCategory = collection.updateWhere(whereAttrs, attrs).write()
            resolve({
                code: 200,
                data: newCategory
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function replaceCategoryById(id, attrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const newCategory = collection.replaceById(id, attrs).write()
            resolve({
                code: 200,
                data: newCategory
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}

export function deleteCategoryById(id) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
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

export function deleteCategoryWhere(whereAttrs) {
    return new Promise((resolve, reject) => {
        try {
            const collection = db.get('category')
            const categoryList = collection.removeWhere(whereAttrs).write()
            resolve({
                code: 200,
                data: categoryList
            })
        } catch (err) {
            return reject({
                code: 400,
                message: err.message
            })
        }
    })
}