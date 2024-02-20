<template>
  <div v-if="isSet">
    <div class="row q-col-gutter-lg justify-center">
      <div class="col-10">
        <q-card class="my-card" flat bordered>
          <q-item>
            <q-item-section>
              <div class="text-h6">Detection Job {{ toDisplay.id }}</div>
              <q-item-label caption>
                Captured on x{{ toDisplay.date }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-card-section>
            <q-card-section class="justify-center">
              <q-img
                :src="toDisplay.img"
                spinner-color="white"
                :ratio="16 / 9"
                class="rounded-borders"
              />
            </q-card-section>

            <q-separator />

            <q-card-section class="col-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </q-card-section>
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

    watch(selectedRow, () => {
      isSet.value = true;
      toDisplay.value = selectedRow.value;
    });

    return {
      isSet,
      toDisplay,
    };
  },
};
</script>
