import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import firebase from 'firebase/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    videos: [],
    favorite: []
  },
  mutations: {
    saveVideosFromYoutube(state, items) {
      state.videos = items
    },
    auth(state, token) {
      state.user = token
    },
    saveFavorites(state, list) {
      state.favorite = list
    },
    addOneFavorite(state, item) {
      state.favorite.push(item)
      console.log(state.favorite)
    },
    updateOneFavorite(state, {q, name, count, order, id}) {
      console.log(id)
      const idx = state.favorite.findIndex(c => c.id == id)
      state.favorite[idx].q = q
      state.favorite[idx].name = name
      state.favorite[idx].count = count
      state.favorite[idx].order = order
    },
    cleanVideos(state) {
      state.videos = []
    },
    cleanFavorites(state) {
      state.favorite = []
    }
  },
  actions: {
    async login({ commit, dispatch }, { email, password }) {
      try {
        const result = await firebase.auth().signInWithEmailAndPassword(email, password).then(res => res.user.uid)
        await commit('auth', result)
        await dispatch('loadFavorites')
        return result
      } catch (error) {
        console.log(error)
      }
    },
    async logout({ commit }) {
      await firebase.auth().signOut()
      commit('auth', null)
      commit('cleanFavorites')
    },
    getUid() {
      const user = firebase.auth().currentUser
      return user ? user.uid : null
    },
    async fetchVideosFromYoutube({ commit }, { q, count = 12, order = 'relevance' }) {
      let videosList = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=${order}&maxResults=${count}&q=${q}&type=video&key=${process.env.VUE_APP_YOUTUBE_API}`).then((res) => { return res.data })

      let allID = [];
      for (let i = 0; i < videosList.items.length; i++) {
        allID += "id=" + videosList.items[i].id.videoId + "&";
      }

      let viewsList = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=statistics&${allID}key=${process.env.VUE_APP_YOUTUBE_API}`).then((res) => { return res.data.items })

      for (let i = 0; i < videosList.items.length; i++) {
        videosList.items[i].views = viewsList[i].statistics.viewCount;
      }
      commit('saveVideosFromYoutube', videosList.items)
      return videosList.pageInfo.totalResults
    },
    async createFavorite({ commit, dispatch }, { q, name, count = 12, order = 'relevance' }) {
      const uid = await dispatch('getUid')
      const request = await firebase.database().ref(`/users/${uid}/categories`).push({ q, name, count, order })
      commit('addOneFavorite', { q, name, count, order })
      return request
    },
    async updateFavorite({ commit, dispatch }, { q, name, count = 12, order = 'relevance', id }) {
      const uid = await dispatch('getUid')
      const request = await firebase.database().ref(`/users/${uid}/categories`).child(id).update({ q, name, count, order })
      commit('updateOneFavorite', { q, name, count, order, id })
      return request
    },
    async loadFavorites({ commit, dispatch }) {
      const uid = await dispatch('getUid')
      const requests = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val()
      const arrayRequest = Object.keys(requests).map(key => ({ ...requests[key], id: key }))
      commit('saveFavorites', arrayRequest)
    },
    cleanVideos({ commit }) {
      commit('cleanVideos')
    }
  },
  getters: {
    videos(state) {
      return state.videos
    },
    favorites(state) {
      return state.favorite
    },
    isLoggedIn(state) { return !!state.user }
  }
})
