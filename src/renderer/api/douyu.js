import request from '@/utils/request'

// 获取所有分类
export function getCateList() {
    return request({
        url: 'http://open.douyucdn.cn/api/RoomApi/game',
        method: 'get'
    })
}

// 获取房间详情
export function getRoomDetail(id) {
    return request({
        url: 'http://open.douyucdn.cn/api/RoomApi/room/' + id,
        method: 'get'
    })
}

// 获取所有房间
export function getRoomListAll() {
    let url = 'http://open.douyucdn.cn/api/RoomApi/live'
    return request({
        url: url,
        method: 'get'
    })
}

// 获取房间列表
export function getRoomList(params, cateid) {
    let url = 'http://open.douyucdn.cn/api/RoomApi/live'
    if (cateid) {
        url = url + '/' + cateid
    }
    return request({
        url: url,
        method: 'get',
        params
    })
}
