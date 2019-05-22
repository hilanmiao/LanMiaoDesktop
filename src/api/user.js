import db from '../datastore'

export function login(data) {
    return new Promise((resolve, reject) => {
        try {
            const user = db.get('user').find({userId: data.name, password: data.password}).value()
            resolve(user)
        } catch (err) {
            return reject(err)
        }
    })
}