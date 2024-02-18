<template>
  <component :is="layout" />
</template>
<script>
import DefaultLayout from './layouts/DefaultLayout.vue'
import { shallowRef, watch, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const layout = shallowRef(DefaultLayout)
    const route = useRoute()

    watch(
      () => route.meta?.layout,
      async (value) => {
        try {
          const component = defineAsyncComponent({
            loader: () => import(`./layouts/${value}Layout.vue`)
          })
          layout.value = component || DefaultLayout
        } catch (e) {
          layout.value = DefaultLayout
        }
      }
    )

    return { layout }
  }
}
</script>

