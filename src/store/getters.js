const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  errorLogs: state => state.errorLog.logs,

  token: state => state.user.token,
  roles: state => state.user.roles,
  name: state => state.user.name,
  permission_routes: state => state.permission.routes
}
export default getters
