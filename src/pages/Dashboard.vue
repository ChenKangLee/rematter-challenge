<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <div class="col-shrink">
        <div class="text-h6">Title</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-splitter v-model="splitterModel" style="height: 100vh">
          <template #before>
            <div class="row justify-end q-col-gutter-lg q-py-lg">
              <div class="col-12">
                <q-btn
                  label="Generate Data"
                  icon="dataset"
                  color="primary"
                  @click="showPrompt = true"
                />
              </div>
            </div>
            <div class="row justify-center q-pr-lg">
              <div class="col-12">
                <JobTable :rows="pastJobs" @row-click="setSelectedRow" />
              </div>
            </div>
          </template>
          <template #after>
            <JobDetails :selectedRow="selectedRow" />
          </template>
        </q-splitter>
      </div>
    </div>
  </q-page>
  <q-dialog
    v-model="showPrompt"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <PromptDialog @onCapture="onCapture" />
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useJobStore } from "../store/jobStore";
import { computed } from "@vue/reactivity";

export default {
  setup() {
    const store = useJobStore();
    const pastJobs = computed(() => store.jobs);
    const selectedRow = ref(null);

    const onCapture = (job_info) => {
      store.addJob(job_info);
    };

    const setSelectedRow = (row) => {
      selectedRow.value = row;
    };

    return {
      splitterModel: ref(45),
      showPrompt: ref(false),
      pastJobs,
      onCapture,
      setSelectedRow,
      selectedRow,
    };
  },
};
</script>
