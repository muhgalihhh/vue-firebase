<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div></div>
      <TabsMenu />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import TabsMenu from '@/components/TabsMenu.vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
</script>
