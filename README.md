<table>
  <tr>
    <td style="text-align: center;">
      <img src="https://github.com/user-attachments/assets/595d8118-e3e4-48a0-ab91-1e181ead8217" height="120" alt="anime-yes"/>
    </td>
    <td style="vertical-align: middle;">
      <h5>Nama: Muhamad Galih</h5>
      <h5>NIM: H1D022052</h5>
      <h5>Shift: E (Baru)</h5>
    </td>
  </tr>
</table>


## Bukti Dokumentasi Program :
<img src="https://github.com/user-attachments/assets/0b090f70-de14-4616-ab7e-2e0a678b86ff" style="width: 150px;">
<img src="https://github.com/user-attachments/assets/26766bf6-2d02-4a24-bcb7-081b53f7d5d7" style="width: 150px;">


Berikut penjelasan alur dari proses login hingga data pengguna dapat ditampilkan pada halaman **Profile**:

---

## **1. Proses Login**

### **a. Klik Tombol Login**
- Pengguna menekan tombol **Sign In with Google** pada halaman login.
- Fungsi `loginWithGoogle` dari store autentikasi (`auth.ts`) dipanggil.

#### **Kode:**
```html
<ion-button @click="login" color="light">
  <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
  <ion-label>Sign In with Google</ion-label>
</ion-button>
```

```ts
const login = async () => {
  await authStore.loginWithGoogle();
};
```

---

### **b. Autentikasi Google**
- Aplikasi menginisialisasi Google Authentication dengan `GoogleAuth.initialize`.
- Pengguna melakukan login via Google, dan ID token dikembalikan.
```ts
await GoogleAuth.initialize({
  clientId: '490957249666-12aai8m9h4rl98b4mp3lrfpq2oq8fi62.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  grantOfflineAccess: true,
});

const googleUser = await GoogleAuth.signIn();
const idToken = googleUser.authentication.idToken;
```

---

### **c. Verifikasi Firebase**
- Token dari Google diverifikasi oleh Firebase melalui `signInWithCredential`.
- Firebase mengembalikan informasi pengguna (`user`), yang disimpan dalam state aplikasi.

#### **Kode:**
```ts
const credential = GoogleAuthProvider.credential(idToken);
const result = await signInWithCredential(auth, credential);
user.value = result.user;
```

---

### **d. Navigasi ke Halaman Home**
- Jika login berhasil, pengguna diarahkan ke halaman `/home`.
```ts
router.push('/home');
```

---

## **2. Sinkronisasi Status Pengguna**

### **a. Pemantauan Status Login**
- Firebase memantau status autentikasi melalui `onAuthStateChanged`.
- Ketika status login berubah (misalnya login berhasil), informasi pengguna disimpan ke variabel `user` di **Pinia Store**.

#### **Kode:**
```ts
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});
```

---

## **3. Routing ke Halaman Profile**
### **a. Proteksi Halaman**
- Halaman **Profile** membutuhkan autentikasi. Jika pengguna mencoba mengakses tanpa login, mereka akan diarahkan ke halaman login (`/login`).

#### **Kode Router:**
```ts
if (to.meta.isAuth && !authStore.isAuth) {
  next('/login');
}
```

---

## **4. Penampilan Data Pengguna**
### **a. Data di Store**
- State `user` di **Pinia Store** menyimpan informasi pengguna yang berhasil login, seperti:
  - `displayName`: Nama pengguna.
  - `email`: Email pengguna.
  - `photoURL`: URL foto profil pengguna.

#### **Kode Store:**
```ts
const user = ref<User | null>(null);
const isAuth = computed(() => user.value !== null);
```

---

### **b. Mengambil Data di Halaman Profile**
- Halaman **Profile** mengakses state `user` melalui **Pinia Store** dengan `computed`.
- Jika pengguna belum memiliki foto profil, digunakan foto default.

#### **Kode:**
```ts
const user = computed(() => authStore.user);
const userPhoto = ref(user.value?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg');

function handleImageError() {
  userPhoto.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
}
```

---

### **c. Menampilkan Data di UI**
- Informasi pengguna (nama dan email) ditampilkan menggunakan elemen **IonInput** dengan properti `readonly`.
- Foto profil ditampilkan menggunakan **IonAvatar**, dan jika gagal memuat, foto default digunakan.

#### **Kode UI:**
```html
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
```

---

## **Ringkasan Alur**
1. **Login**: Pengguna login melalui Google, dan Firebase memverifikasi kredensial.
2. **Store**: Data pengguna disimpan di state aplikasi menggunakan **Pinia Store**.
3. **Routing**: Pengguna diarahkan ke halaman yang relevan (contoh: `/profile`).
4. **Display**: Halaman **Profile** menampilkan data pengguna (nama, email, foto profil) yang diambil dari store.
