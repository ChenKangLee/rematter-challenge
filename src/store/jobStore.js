import { defineStore } from 'pinia'

export const useJobStore = defineStore('jobs', {
    state: () => ({
        jobs: []
    }),
    actions: {
        addJob(job_info) {
            this.jobs.push({
                ...job_info
            })
        }
    }
})