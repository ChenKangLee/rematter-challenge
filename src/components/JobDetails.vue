<template>
  <div v-if="isSet">
    <div class="row q-col-gutter-lg justify-center">
      <div class="col-lg-8 col-md-10">
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <q-item-section>
              <div class="text-h6">Detection Job {{ selectedRow.id }}</div>
              <q-item-label caption>
                Captured on {{ selectedRow.date }}
              </q-item-label>
            </q-item-section>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="q-pa-lg detail-image justify-center">
              <q-img
                :src="selectedRow.imgOriginal"
                spinner-color="white"
                :ratio="16 / 9"
                class="rounded-borders"
              />
            </div>
            <q-separator />
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              label="Processed Image"
            >
              <div class="q-pa-lg detail-image justify-center">
                <q-img
                  :src="selectedRow.imgProcessed"
                  spinner-color="white"
                  :ratio="16 / 9"
                  class="rounded-borders"
                />
              </div>
            </q-expansion-item>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div
              v-if="selectedRow.status === 'processing'"
              class="row justify-center"
            >
              <q-spinner color="primary" size="4em" />
            </div>
            <div v-if="selectedRow.status === 'error'" class="detail-error">
              <q-icon name="error_outline" />
              {{ selectedRow.text.error }}
            </div>
            <div v-if="selectedRow.status === 'done'">
              <div>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <span class="text-bold">
                        {{ selectedRow.text.matchedState }} DRIVERS LICENSE
                      </span>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-bold">DL #</q-item-label>
                      <q-item-label>{{
                        selectedRow.text.matchedDLN || "---"
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-bold">
                        Expiration Date
                      </q-item-label>
                      <q-item-label>{{
                        selectedRow.text.matchedEXP || "---"
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-bold">Last Name</q-item-label>
                      <q-item-label>{{
                        selectedRow.text.matchedLN || "---"
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-bold">First Name</q-item-label>
                      <q-item-label>{{
                        selectedRow.text.matchedFN || "---"
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-bold">
                        Date of Birth
                      </q-item-label>
                      <q-item-label>{{
                        selectedRow.text.matchedDOB || "---"
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-bold">Address</q-item-label>
                      <q-item-label>{{
                        selectedRow.text.matchedAddr1 || "---"
                      }}</q-item-label>
                      <q-item-label>{{
                        selectedRow.text.matchedAddr2 || "---"
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-bold">
                        License Issued Date
                      </q-item-label>
                      <q-item-label>{{
                        selectedRow.text.matchedISS || "---"
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { toRefs, watch } from "vue";

export default {
  props: ["selectedRow"],
  setup(props) {
    const { selectedRow } = toRefs(props);
    const isSet = ref(false);
    const toDisplay = ref(null);

    watch(selectedRow, (newVal, oldVal) => {
      if (newVal) {
        isSet.value = true;
      } else {
        isSet.value = false;
      }
    });

    return {
      isSet,
      toDisplay,
      selectedRow,
    };
  },
};
</script>
