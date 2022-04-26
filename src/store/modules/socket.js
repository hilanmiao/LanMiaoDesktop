import { getAccessToken } from '@/utils/auth'
import { MessageBox } from 'element-ui'
import router from '@/router'
import store from '@/store'

const SocketStatus = {
  // 连接中
  CONNECTING: 'CONNECTING',
  // 已连接
  CONNECTED: 'CONNECTED',
  // 已关闭
  CLOSE: 'CLOSE'
}
// const staticEvents = [
//   // socket instance listen
//   'connect',
//   'connect_error',
//   'disconnect',
//   'disconnecting',
//   'newListener',
//   'removeListener',
//   // Manager listen
//   'error',
//   'reconnect',
//   'reconnect_attempt',
//   'reconnect_error',
//   'reconnect_failed',
//   'ping',
//   'pong'
// ]

const state = {
  status: SocketStatus.CLOSE,
  onlineUserSocketIds: [], // 所有在线用户socketIds
  isConnected: false,
  message: '',
  reconnectError: false,
  event: null,
  count: 0,
  serverMessage: ''
}

const mutations = {
  SOCKET_CONNECT(state) {
    state.reconnectError = false
    state.isConnected = true
    state.event = 'connected'
    state.serverMessage = 'socket connected'
  },
  SOCKET_ERROR(state) {
    state.isConnected = false
    state.event = 'error'
    state.serverMessage = 'socket error'
  },
  SOCKET_DISCONNECT(state) {
    state.isConnected = false
    state.reconnectError = false
    state.event = 'disconnect'
    state.serverMessage = 'socket disconnect'
  },
  SOCKET_RECONNECT(state) {
    state.reconnectError = false
    state.serverMessage = 'socket reconnect'
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.reconnectError = true
    state.serverMessage = 'socket reconnect error'
  },
  SOCKET_RECONNECT_ATTEMPT(state) {
    state.reconnectError = true
    state.count = state.count + 1
    state.serverMessage = 'socket reconnect error'
  },
  SOCKET_CONNECT_ERROR(state) {
    state.isConnected = false
    state.event = 'connect error'
    state.serverMessage = 'socket connect error'
  },
  // SOCKET_SERVER_MESSAGE(state, message) {
  //   console.log(message)
  //   state.message = message
  //   state.serverMessage = 'message received'
  // },
  SOCKET_ONLINE: (state, message) => {
    console.log(message)
    state.message = message
    state.serverMessage = 'message received'
    state.onlineUserSocketIds = message.clients
  },
  SOCKET_KICK(state, message) {
    console.log(message)
    state.isConnected = false
    state.reconnectError = false
    state.event = 'kick'
    state.serverMessage = 'socket kicked'
  }
}

const actions = {
  // vue-socket.io-extended 插件 mutation、action 命名有区别，而且自动 dispatched or committed
  socket_connect() {
    const eventName = this._vm.$socket.client.id
    // 监听自身 id 以实现 p2p 通讯
    // this._vm.$socket.$subscribe(eventName, payload => {
    //   console.log('socket receive', payload)
    // })
    this._vm.$socket.client.on(eventName, payload => {
      // 这里主要验证了token
      console.log('socket receive', payload)
    })
    console.log('socket connected')
  },
  async socket_kick() {
    // 解决下线自己时不弹框的问题，因为messagebox关闭设置了延迟，
    // 如果不setTimeout的话，上一个下线的messagebox还没关闭，导致这个messagebox没有正确显示出来
    setTimeout(async() => {
      // 被踢下线，强制用户登录
      await store.dispatch('auth/clearAuth')
      MessageBox.confirm('您已被踢下线，请重新登录', '警告', {
        confirmButtonText: '重新登录',
        showCancelButton: false,
        type: 'warning'
      }).finally(() => {
        console.debug('被踢下线，强制用户登录')
        router.push('/login')
      })
    }, 500)

    console.log('socket kicked')
  },
  socket_error() {
    console.log('socket error')
  },
  socket_disconnect() {
    const eventName = this._vm.$socket.client.id
    if (eventName) {
      this._vm.$socket.client.off(eventName)
      // this._vm.$socket.$unsubscribe(eventName)
    }
    console.log(this._vm.$socket)
    console.log('socket disconnect')
  },
  socket_reconnect() {
    console.log('socket reconnect')
  },
  socket_reconnect_error() {
    console.log('socket reconnect error')
  },
  socket_connect_error() {
    console.log('socket connect error')
  },
  socket_online() {
    console.log('socket online')
  },
  initSocket({ commit, state }, data) {
    // 注释掉这里可以验证 this._vm.$socket.client.on(eventName 监听自身 id 以实现 p2p 通讯
    // this._vm.$socket.client.io.opts.query = { username: data.username, accessToken: 1 }
    this._vm.$socket.client.io.opts.query = { username: data.username, accessToken: getAccessToken() }
    this._vm.$socket.client.open()
    console.debug('socket 连接')
  },
  closeSocket({ commit, state }) {
    this._vm.$socket.client.close()
    console.debug('socket 断开')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
