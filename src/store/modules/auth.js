import ls from 'local-storage'
import store from 'src/store'
import router from 'src/router'
import { STORAGE_AUTH_TOKEN } from 'src/constants'
import api from 'src/services/api'

const state = {
  isLoggedIn: !!ls.get(STORAGE_AUTH_TOKEN),
}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
}

const mutations = {
  LOGIN(state) {
    state.isLoggedIn = true
  },
  LOGOUT(state) {
    state.isLoggedIn = false
  }
}

const actions = {
  async login({ commit }, { email, password, lsToken }) {
    try {
      const { headers: { 'x-auth-token': apiToken } } = lsToken
        ? await api.get(`/sessions/${lsToken}`)
        : await api.post('/sessions', { email, password })
      ls.set(STORAGE_AUTH_TOKEN, apiToken)
      api.setHeader('x-auth-token', apiToken)
      if (!lsToken) {
        commit('LOGIN')
        router.push({name:'Wallet', params:{}});
      }
    } catch (err) {
      if (lsToken) ls.remove(STORAGE_AUTH_TOKEN)
      throw err
    }
  },
  async logout({ commit }) {
    let lsToken = ls.get(STORAGE_AUTH_TOKEN)
    if(!lsToken) return null
    try {
      if(await api.delete(`/sessions/${lsToken}`)) {
        commit('LOGOUT')
        ls.remove(STORAGE_AUTH_TOKEN)
        router.push({name:'SignIn', params:{}});
      }
    } catch (err) {
      throw err
    }
  }
}

export default {
  namespaced: 'auth',
  state,
  getters,
  mutations,
  actions,
}
