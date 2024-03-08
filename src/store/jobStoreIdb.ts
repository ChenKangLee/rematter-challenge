// Persistent past job with pinia state management and IndexDB apis
import { defineStore } from "pinia";
import { Job } from "../types";
import idb from "../api/indexDB";

type State = {
  jobs: Job[];
};

export const useJobStoreIdb = defineStore("jobs", {
  state: (): State => ({
    jobs: [],
  }),
  actions: {
    async getJobs() {
      let jobs = await idb.getJobs();
      this.jobs = [];
      jobs.forEach((job: Job) => {
        this.jobs.push(job);
      });
    },
    async createJob(job: Job, key: number) {
      const jobWithID = {
        ...job,
        id: key,
      };
      await idb.putJob(jobWithID, key);
    },
    async updateJob(job: Job, key: number) {
      await idb.putJob(job, key);
    },
    async deleteJob(job: Job) {
      await idb.deleteJob(job.id);
    },
  },
});
