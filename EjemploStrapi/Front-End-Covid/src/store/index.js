import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: {
      titulo: "",
      estado: false,
      color: "primary",
    },
    token1: "",
    authenticated: {
      estado: false,
      popup: true,
    },
  },
  mutations: {
    mostrarLoading(state, payload) {
      state.loading.titulo = payload.titulo;
      state.loading.color = payload.color;
      state.loading.estado = true;
    },
    ocultarLoading(state) {
      state.loading.estado = false;
    },
    asignartoken(state, t) {
      state.token1 = t;
    },
    authenticatedT(state) {
      state.authenticated.estado = true;
    },
  },
  actions: {},
  modules: {},
});
