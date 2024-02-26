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

<script>
import { onMounted, ref } from "vue";
import { useJobStoreIdb } from "../store/jobStoreIdb";
import { useKeyStore } from "../store/globalKeyStore";
import { computed } from "@vue/reactivity";
import useImgProcessing from "../composable/useImageProcessing";

export default {
  setup() {
    const store = useJobStoreIdb();
    const globalKeyStore = useKeyStore();
    const selectedRow = ref(null);
    const { extractText } = useImgProcessing();

    const pastJobs = computed(() => store.jobs);

    onMounted(async () => {
      await store.getJobs();
    });

    const onCapture = async (captureInfo) => {
      // first store a dummy place holder into the DB and remember the key
      const toStore = {
        ...captureInfo,
        name: "...",
        text: {},
        status: "processing",
      };

      // first call we dont supply the primary key and rely on auto increment return
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
            if (selectedRow && selectedRow.value.id == key) {
              selectedRow.value = updatedInfo;
            }
          });
        })
        .catch((error) => {
          console.error(error);
          const updatedInfo = {
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

    const setSelectedRow = async (row) => {
      selectedRow.value = row;
    };

    const deleteRow = async (row) => {
      // check if the deleted row is the one we are displaying
      if (selectedRow.value && row.id === selectedRow.value.id) {
        selectedRow.value = null;
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
};
</script>
