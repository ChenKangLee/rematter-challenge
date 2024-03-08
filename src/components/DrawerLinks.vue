<template>
  <q-item clickable :href="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
    },
    caption: {
      type: String,
    },
    link: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  setup() {},
});
</script>
