// Persistent past job with pinia state management and IndexDB apis
import { defineStore } from "pinia";
import idb from "../api/indexDB";

export const useJobStoreIdb = defineStore("jobs", {
  state: () => ({
    jobs: [],
    autoIncrementKey: 1,
  }),
  actions: {
    async getJobs() {
      let jobs = await idb.getJobs();
      this.jobs = [];
      jobs.forEach((job) => {
        this.jobs.push(job);
      });
    },
    async createJob(job) {
      const jobWithID = {
        ...job,
        id: this.autoIncrementKey,
      };
      await idb.putJob(jobWithID, this.autoIncrementKey);
      return this.autoIncrementKey++;
    },
    async updateJob(job, key) {
      await idb.putJob(job, key);
    },
    async deleteJob(job) {
      await idb.deleteJob(job.id);
    },
  },
});
