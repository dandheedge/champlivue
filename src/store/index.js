import Vue from "vue";
import Vuex from "vuex";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Chatty } from "@/models";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: {},
    messages: [],
    offline: undefined,
    loading: false,
  },
  getters: {
    getMessages(state) {
      return state.messages;
    },
    getUser(state) {
      return state.user;
    },
    statusOffline(state) {
      return state.offline;
    },
  },
  mutations: {
    SET_MESSAGES(state, payload) {
      state.messages = payload;
    },
    TOGGLE_LOADING(state) {
      state.loading = !state.loading;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    REMOVE_USER(state) {
      state.user = {};
    },
    SET_OFFLINE(state, payload) {
      state.offline = payload;
    },
  },
  actions: {
    loadMessages({ commit }) {
      try {
        commit("TOGGLE_LOADING");
        DataStore.query(Chatty, Predicates.ALL).then((messages) => {
          commit("TOGGLE_LOADING");
          commit("SET_MESSAGES", messages);
        });
      } catch (error) {
        console.log("Error loading messages...", error);
      } finally {
        commit("TOGGLE_LOADING");
      }
    },
  },
});

export { store };
