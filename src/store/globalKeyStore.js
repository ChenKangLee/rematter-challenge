// Persistent global incrementing key for the jobs across refresh
//
import { defineStore } from "pinia";

const STORE_NAME = "keyStore";

const getDefaultState = () => ({
  key: 1,
});

export const useKeyStore = defineStore("key", {
  state: () => ({
    store: localStorage.getItem(STORE_NAME)
      ? JSON.parse(localStorage.getItem(STORE_NAME))
      : getDefaultState(),
  }),
  getters: {
    key: (state) => state.store.key,
  },
  actions: {
    incrementKey() {
      this.store.key = this.store.key + 1;
      localStorage.setItem(STORE_NAME, JSON.stringify(this.store));
    },
  },
});
