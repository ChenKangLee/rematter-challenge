<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!--<q-toolbar-title> ReMatter Fullstack SWE Challenge </q-toolbar-title>-->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Links </q-item-label>

        <DrawerLinks
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-page-scroller
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 18]"
      >
        <q-btn fab icon="keyboard_arrow_up" color="accent" glossy size="sm" />
      </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import { ref, defineComponent } from "vue";

const linksList = [
  {
    title: "About Me",
    caption: "Chen-Kang Lee's LinkedIn",
    icon: "account_circle",
    link: "https://www.linkedin.com/in/chen-kang-lee-64058a18b/",
  },
  {
    title: "Github Repo",
    caption: "ChenKangLee/rematter-challenge",
    icon: "ramp_left",
    link: "https://github.com/ChenKangLee/rematter-challenge",
  },
];

export default defineComponent({
  setup() {
    const leftDrawerOpen = ref(false);
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };
    return {
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer,
    };
  },
});
</script>
