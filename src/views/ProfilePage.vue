<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Profile</ion-title>

        <!-- Logout Button -->
        <ion-button slot="end" fill="clear" @click="logout" style="--color: gray">
          <ion-icon slot="end" :icon="exit"></ion-icon>
          <ion-label>Logout</ion-label>
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Avatar -->
      <div id="avatar-container">
        <ion-avatar>
          <img alt="Avatar" :src="userPhoto" @error="handleImageError" />
        </ion-avatar>
      </div>

      <!-- Data Profile -->
      <ion-list>
        <ion-item>
          <ion-input label="Nama" :value="user?.displayName" :readonly="true"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input label="Email" :value="user?.email" :readonly="true"></ion-input>
        </ion-item>
      </ion-list>

      <!-- Tabs Menu -->
      <TabsMenu />
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import TabsMenu from '@/components/TabsMenu.vue';
import { useAuthStore } from '@/stores/auth';
import { IonAvatar, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { exit } from 'ionicons/icons';
import { computed, onMounted, ref, watch } from 'vue';

// Import Auth Store
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Logout Function
const logout = () => {
  authStore.logout();
};

// Default Avatar and User Photo
const userPhoto = ref('https://ionicframework.com/docs/img/demos/avatar.svg');

// Watch for Changes in User Data
watch(user, (newValue) => {
  if (newValue?.photoURL) {
    userPhoto.value = `${newValue.photoURL}?t=${Date.now()}`; // Prevent caching issues
    console.log('Updated user photo URL:', userPhoto.value);
  }
});

// Handle Image Load Errors
function handleImageError(event: Event) {
  console.error('Image load error:', event);
  userPhoto.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
}

// Ensure Data Loads Correctly on Component Mount
onMounted(() => {
  if (user.value?.photoURL) {
    userPhoto.value = `${user.value.photoURL}?t=${Date.now()}`; // Prevent caching issues
  }
});
</script>

<style scoped>
#avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

#avatar-icon {
  width: 80px;
  height: 80px;
}
</style>
