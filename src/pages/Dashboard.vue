<template>
  <q-page padding>
    <div class="row justify-between q-col-gutter-lg">
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
            <div class="row q-pr-lg">
              <div class="col-12">
                <JobTable />
              </div>
            </div>
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
    <PromptDialog />
  </q-dialog>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      splitterModel: ref(40),
      showPrompt: ref(false),
    };
  },
};
</script>
