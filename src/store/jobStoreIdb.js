// Persistent past job with pinia state management and IndexDB apis
import { defineStore } from "pinia";
import idb from "../api/indexDB";

export const useJobStoreIdb = defineStore("jobs", {
  state: () => ({
    jobs: [],
  }),
  actions: {
    async getJobs() {
      let jobs = await idb.getJobs();
      this.jobs = [];
      jobs.forEach((job) => {
        this.jobs.push(job);
      });
    },
    async createJob(job, key) {
      const jobWithID = {
        ...job,
        id: key,
      };
      await idb.putJob(jobWithID, key);
    },
    async updateJob(job, key) {
      await idb.putJob(job, key);
    },
    async deleteJob(job) {
      await idb.deleteJob(job.id);
    },
  },
});
