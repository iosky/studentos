import { asyncRouterMap, constantRouterMap } from '@/router'

function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role)
  }
  return true
}

function filterAsyncRouter(asyncRouterMap, role) {
  const assessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(role, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, role)
      }
      return true
    }
    return false
  })
  return assessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    generateRouters: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        try {
          const { role } = data
          let accessedRouters
          accessedRouters = filterAsyncRouter(asyncRouterMap, role)
          console.log(accessedRouters)
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}

export default permission
