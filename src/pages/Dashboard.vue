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
            <JobDetails
              :selectedRow="selectedRow"
              :processedImage="processedImage"
            />
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
import { onMounted, ref, watch } from "vue";
import { useJobStoreIdb } from "../store/jobStoreIdb";
import { computed } from "@vue/reactivity";
import useTesseract from "../composable/useTesseract.js";
import useJimp from "../composable/useImageProcessing";

export default {
  setup() {
    const store = useJobStoreIdb();
    const selectedRow = ref(null);
    const { recognize } = useTesseract();
    const { preprocessImage } = useJimp();
    const processedImage = ref(null);

    const pastJobs = computed(() => store.jobs);

    onMounted(async () => {
      await store.getJobs();
    });

    const onCapture = async (job_info) => {
      /*try {
        recognize(job_info.img).then((text) => {
          console.log(text);
        });
      } catch (error) {
        console.log(error);
        return;
      }*/

      processedImage.value = await preprocessImage(job_info.img);

      store.putJob(job_info);
      await store.getJobs();
    };

    const setSelectedRow = async (row) => {
      processedImage.value = await preprocessImage(row.img);
      selectedRow.value = row;
    };

    return {
      splitterModel: ref(45),
      showPrompt: ref(false),
      pastJobs,
      onCapture,
      setSelectedRow,
      selectedRow,
      processedImage,
    };
  },
};
</script>
