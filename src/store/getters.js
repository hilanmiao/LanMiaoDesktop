const getters = {
  sidebar: state => state.app.sidebar,
  user: state => state.auth.user,
  accessToken: state => state.auth.accessToken,
  refreshToken: state => state.auth.refreshToken,
  routerLoading: state => state.router.loading,
  onlineUserSocketIds: state => state.socket.onlineUserSocketIds,
  unreadNotifications: state => state.notification.unreadNotifications
}
export default getters
