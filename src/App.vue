<!-- modifikasi src/App.vue -->
<template>
  <ion-app>
    <ion-router-outlet></ion-router-outlet>
    <TabsMenu v-if="showTabs" />
    <!-- tambahkan baris ini -->
  </ion-app>
</template>

<script setup lang="ts">
import TabsMenu from '@/components/TabsMenu.vue'; // import TabsMenu
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// pengecualian TabsMenu pada LoginPage
const authRoutes = ['/', '/login'];

const showTabs = computed(() => {
  return !authRoutes.includes(route.path);
});
</script>
