<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <div class="col-shrink">
        <div class="text-h6">Driver's Licence Text Extractor</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-splitter v-model="splitterModel" style="height: 100vh">
          <template #before>
            <div class="row justify-end q-col-gutter-lg q-py-lg">
              <div class="col-12">
                <q-btn
                  label="Create Job"
                  icon="dataset"
                  color="primary"
                  @click="showPrompt = true"
                />
              </div>
            </div>
            <div class="row justify-center q-pr-lg">
              <div class="col-12">
                <JobTable
                  :rows="pastJobs"
                  @row-click="setSelectedRow"
                  @row-delete="deleteRow"
                />
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

<script lang="ts">
import { onMounted, ref, defineComponent } from "vue";
import { useJobStoreIdb } from "../store/jobStoreIdb";
import { useKeyStore } from "../store/globalKeyStore";
import { computed } from "@vue/reactivity";
import useImgProcessing from "../composable/useImageProcessing";
import { CapturedInfo, Job, ExtractedText } from "../types";

export default defineComponent({
  setup() {
    const store = useJobStoreIdb(); // Pinia Store for jobTable
    const globalKeyStore = useKeyStore(); // Pinia Store for persistant globalKey
    const selectedRow = ref<Job>();
    const { extractText } = useImgProcessing();

    const pastJobs = computed(() => store.jobs);

    onMounted(async () => {
      await store.getJobs();
    });

    const onCapture = async (captureInfo: CapturedInfo) => {
      // first store a dummy place holder into the DB and remember the key
      const toStore: Job = {
        ...captureInfo,
        name: "...",
        text: <ExtractedText>{},
        status: "processing",
        id: null,
      };

      const key = globalKeyStore.key;
      globalKeyStore.incrementKey();
      await store.createJob(toStore, key);
      store.getJobs();

      // submit process job
      extractText(captureInfo.imgProcessed)
        .then((extractedText) => {
          const fn = extractedText.matchedFN || "---";
          const ln = extractedText.matchedLN || "---";
          const updatedInfo = {
            ...toStore,
            id: key,
            status: "done",
            name: fn + " " + ln,
            text: extractedText,
          };
          store.updateJob(updatedInfo, key).then(() => {
            store.getJobs();

            // manually update the detail page if it is selected
            if (selectedRow && selectedRow.value!.id == key) {
              selectedRow.value = updatedInfo;
            }
          });
        })
        .catch((error: string) => {
          console.error(error);
          const updatedInfo: Job = {
            ...toStore,
            id: key,
            status: "error",
            name: "...",
            text: { error },
          };
          store.updateJob(updatedInfo, key).then(() => {
            store.getJobs();
          });
        });
    };

    const setSelectedRow = async (row: Job) => {
      selectedRow.value = row;
    };

    const deleteRow = async (row: Job) => {
      // check if the deleted row is the one we are displaying
      if (selectedRow.value && row.id === selectedRow.value.id) {
        selectedRow.value = <Job>{};
      }

      await store.deleteJob(row);
      await store.getJobs();
    };

    return {
      splitterModel: ref(45),
      showPrompt: ref(false),
      pastJobs,
      selectedRow,
      onCapture,
      setSelectedRow,
      deleteRow,
    };
  },
});
</script>
