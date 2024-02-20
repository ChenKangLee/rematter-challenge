// Persistent past job with pinia state management and IndexDB apis
import { defineStore } from "pinia";
import idb from "../api/indexDB";

export const useJobStoreIdb = defineStore("jobs", {
  state: () => ({
    jobs: [],
  }),
  actions: {
    async getJobs() {
      this.jobs = [];
      let jobs = await idb.getJobs();
      jobs.forEach((job) => {
        this.jobs.push(job);
      });
    },
    async putJob(job) {
      await idb.putJob(job);
    },
  },
});
