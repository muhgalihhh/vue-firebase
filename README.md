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



## ScreenShot
<div id="#Screenshot"></div>

### Profile SS
<img src="https://github.com/user-attachments/assets/0b090f70-de14-4616-ab7e-2e0a678b86ff" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/26766bf6-2d02-4a24-bcb7-081b53f7d5d7" style="width: 150px; ">

### CRUD SS
<img src="https://github.com/user-attachments/assets/fc5751e7-b131-4679-a3a2-7f58d9a19f9c" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/5a46bacc-aa3e-4006-9b7e-0e4a07a8b308" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/5c80bf29-a273-4f16-a803-26ab01a92ea7" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/4df7617e-1bb3-4c29-8b17-5023a4547572" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/c3b5c9bb-4dc4-4d23-bcc2-c1122e8c7bea" style="width: 150px; ">
<br>
<img src="https://github.com/user-attachments/assets/3c74a99c-c77c-4ed0-9d3a-68c01a72aa4c" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/79d5ba70-d417-45f6-a655-d9048988d58e" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/9ee5ec20-b99a-445d-823e-478a72314ad9" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/1f9b13af-01a7-44db-acbf-b3091f7b1ccc" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/9c6645e5-3fde-45fb-98b0-01ac54402443" style="width: 150px; ">
<img src="https://github.com/user-attachments/assets/b5c3469f-f9ba-48a1-b6dd-fc562e02759f" style="width: 150px; ">

## Proses Login
<div id="#login"></div>

## **1. Proses Login dengan Google**

### **a. Klik Tombol Login**
- Pada halaman login, pengguna menekan tombol **Sign In with Google**.
- Fungsi `loginWithGoogle` dari **Pinia Store (`auth.ts`)** dipanggil untuk memulai proses autentikasi.

#### **Kode yang relevan:**
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

### **b. Inisialisasi GoogleAuth**
- Aplikasi menginisialisasi GoogleAuth menggunakan **clientId** dari Google Cloud Console.
- Login dilakukan melalui Google dengan cakupan data tertentu (misalnya: email, profil).

#### **Kode di Store:**
```ts
await GoogleAuth.initialize({
  clientId: '490957249666-12aai8m9h4rl98b4mp3lrfpq2oq8fi62.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  grantOfflineAccess: true,
});

const googleUser = await GoogleAuth.signIn();
```

- Setelah login, **ID Token** pengguna dikembalikan oleh Google.
```ts
const idToken = googleUser.authentication.idToken;
```

---

### **c. Verifikasi dengan Firebase**
1. **Menggunakan Firebase Auth (`utils/firebase.ts`)**:
   - Firebase mengonfirmasi keabsahan ID Token menggunakan **GoogleAuthProvider**.
   - `signInWithCredential` digunakan untuk mencocokkan ID Token dan mengautentikasi pengguna di Firebase.
   - Firebase kemudian mengembalikan informasi pengguna yang berhasil login.

#### **Kode di Store:**
```ts
const credential = GoogleAuthProvider.credential(idToken);
const result = await signInWithCredential(auth, credential);
user.value = result.user;
```

---

## **2. Peran `utils/firebase.ts`**

### **Fungsi Utama File `utils/firebase.ts`**
File ini bertugas untuk:
1. **Inisialisasi Firebase**:
   Menggunakan konfigurasi proyek dari Firebase Console untuk menghubungkan aplikasi ke Firebase.
2. **Menyediakan Instance**:
   - `auth`: Untuk autentikasi pengguna.
   - `googleProvider`: Untuk login dengan Google.

---

### **Kode `utils/firebase.ts`**

```ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Konfigurasi Firebase dari .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inisialisasi aplikasi Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
```

### **Detail Kode:**
1. **`initializeApp`**: Memulai koneksi ke Firebase.
2. **`getAuth`**: Menginisialisasi autentikasi Firebase.
3. **`GoogleAuthProvider`**: Menyediakan metode autentikasi Google.

---

## **3. Sinkronisasi Status Login**
Firebase memantau status pengguna menggunakan **`onAuthStateChanged`**.  
Saat status pengguna berubah (login/logout), data pengguna otomatis diperbarui di state aplikasi.

#### **Kode:**
```ts
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});
```

---

## **4. Routing ke Halaman Profile**

### **Proteksi Halaman**
- Halaman profil membutuhkan autentikasi (`meta.isAuth: true`).
- Jika pengguna belum login, mereka diarahkan ke halaman login.

#### **Kode Router:**
```ts
if (to.meta.isAuth && !authStore.isAuth) {
  next('/login');
} else {
  next();
}
```

---

## **5. Penampilan Data di Halaman Profile**

### **a. Data Pengguna di Store**
- Data pengguna (`user`) yang berhasil login disimpan di **Pinia Store**:
  - `displayName`: Nama pengguna.
  - `email`: Email pengguna.
  - `photoURL`: URL foto profil pengguna.

#### **Kode Store:**
```ts
const user = ref<User | null>(null);
const isAuth = computed(() => user.value !== null);
```

---

### **b. Komponen Halaman Profile**
1. **Avatar dan Data Profil**:
   - Avatar pengguna ditampilkan menggunakan URL dari `photoURL`.
   - Data profil (nama, email) diambil dari state `user` dan ditampilkan menggunakan **IonInput** dengan properti `readonly`.

2. **Handle Gambar Error**:
   - Jika URL gambar pengguna tidak valid, digunakan gambar default.

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

#### **Script di Halaman Profile:**
```ts
const user = computed(() => authStore.user);
const userPhoto = ref(user.value?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg');

function handleImageError() {
  userPhoto.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
}
```

---

## **6. Ringkasan Alur**
1. **Login**:
   - Pengguna login melalui Google, ID Token diverifikasi oleh Firebase.
   - Data pengguna disimpan di state aplikasi (**Pinia Store**).
2. **Sinkronisasi**:
   - Firebase memantau status login pengguna, memperbarui state `user` secara otomatis.
3. **Routing**:
   - Halaman profil dicek autentikasi (hanya dapat diakses jika login).
4. **Tampilan Profil**:
   - Data pengguna (nama, email, foto) diambil dari state dan ditampilkan di halaman **Profile**. Jika ada masalah dengan foto, gambar default digunakan.
  


## CRUD Todos
<div id="#crud"></div>

### 1. **Create (Tambah Data)**
   - **Mekanisme:**  
     Pengguna menekan tombol "Add Todo" (ikon `add` pada `ion-fab-button`), lalu modal `InputModal` akan terbuka. Pengguna mengisi judul dan deskripsi, lalu menekan tombol "Add Todo" dalam modal.

   - **Kode yang terlibat:**
     - **Membuka Modal:**
       ```vue
       <ion-fab-button @click="isOpen = true">
         <ion-icon :icon="add" size="large"></ion-icon>
       </ion-fab-button>
       ```
       ```vue
       <InputModal v-model:isOpen="isOpen" v-model:editingId="editingId" :todo="todo" @submit="handleSubmit" />
       ```
     - **Mengirimkan Data ke Firestore:**
       ```ts
       const handleSubmit = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
         if (!todo.title) {
           await showToast('Title is required', 'warning', warningOutline);
           return;
         }
         try {
           if (editingId.value) {
             await firestoreService.updateTodo(editingId.value, todo as Todo);
             await showToast('Todo updated successfully', 'success', checkmarkCircle);
           } else {
             await firestoreService.addTodo(todo as Todo);
             await showToast('Todo added successfully', 'success', checkmarkCircle);
           }
           loadTodos();
         } catch (error) {
           await showToast('An error occurred', 'danger', closeCircle);
           console.error(error);
         } finally {
           editingId.value = null;
         }
       };
       ```
     - **Fungsi `addTodo` pada Firestore:**
       ```ts
       async addTodo(todo: Omit<Todo, 'id'>) {
         try {
           const todoRef = this.getTodoRef();
           const docRef = await addDoc(todoRef, {
             ...todo,
             status: false,
             createdAt: Timestamp.now(),
             updatedAt: Timestamp.now(),
           });
           return docRef.id;
         } catch (error) {
           console.error('Error Tambah Todo:', error);
           throw error;
         }
       }
       ```

---

### 2. **Read (Membaca Data)**
   - **Mekanisme:**  
     Data todos dimuat dari Firestore setiap kali halaman diakses atau di-refresh.

   - **Kode yang terlibat:**
     - **Fungsi untuk Memuat Todos:**
       ```ts
       const loadTodos = async (isLoading = true) => {
         let loading;
         if (isLoading) {
           loading = await loadingController.create({
             message: 'Loading...',
           });
           await loading.present();
         }

         try {
           todos.value = await firestoreService.getTodos();
         } catch (error) {
           console.error(error);
         } finally {
           if (loading) {
             await loading.dismiss();
           }
         }
       };
       ```
     - **Fungsi `getTodos` pada Firestore:**
       ```ts
       async getTodos(): Promise<Todo[]> {
         try {
           const todoRef = this.getTodoRef();
           const q = query(todoRef, orderBy('updatedAt', 'desc'));
           const snapshot = await getDocs(q);
           return snapshot.docs.map(
             (doc) =>
               ({
                 id: doc.id,
                 ...doc.data(),
               } as Todo)
           );
         } catch (error) {
           console.error('Error Get Todos:', error);
           throw error;
         }
       }
       ```
     - **Pemanggilan `loadTodos` saat halaman dimuat:**
       ```ts
       onMounted(() => {
         loadTodos();
         intervalId = setInterval(() => {
           timeUpdateTrigger.value++;
         }, 60000);
       });
       ```

---

### 3. **Update (Memperbarui Data)**
   - **Mekanisme:**  
     Pengguna dapat menekan tombol edit (ikon `create`) untuk membuka modal `InputModal` dengan data todo yang sudah ada. Setelah mengedit data, tombol "Edit Todo" dalam modal akan menyimpan perubahan.

   - **Kode yang terlibat:**
     - **Menampilkan Modal dengan Data Lama:**
       ```ts
       const handleEdit = async (editTodo: Todo) => {
         const slidingItem = itemRefs.value.get(editTodo.id!);
         await slidingItem?.close();

         editingId.value = editTodo.id!;
         todo.value = {
           title: editTodo.title,
           description: editTodo.description,
         };
         isOpen.value = true;
       };
       ```
     - **Mengupdate Data di Firestore:**
       ```ts
       const handleSubmit = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
         if (editingId.value) {
           await firestoreService.updateTodo(editingId.value, todo as Todo);
           await showToast('Todo updated successfully', 'success', checkmarkCircle);
         }
       };
       ```
     - **Fungsi `updateTodo` pada Firestore:**
       ```ts
       async updateTodo(id: string, todo: Partial<Todo>) {
         try {
           const todoRef = this.getTodoRef();
           const docRef = doc(todoRef, id);
           await updateDoc(docRef, {
             ...todo,
             updatedAt: Timestamp.now(),
           });
         } catch (error) {
           console.error('Error Update Todo:', error);
           throw error;
         }
       }
       ```

---

### 4. **Delete (Menghapus Data)**
   - **Mekanisme:**  
     Pengguna dapat menghapus todo dengan menggeser ke kiri atau menekan tombol hapus (ikon `trash`).

   - **Kode yang terlibat:**
     - **Handle Swipe atau Klik Tombol Hapus:**
       ```ts
       const handleDelete = async (deleteTodo: Todo) => {
         try {
           await firestoreService.deleteTodo(deleteTodo.id!);
           await showToast('Todo deleted successfully', 'success', checkmarkCircle);
           loadTodos();
         } catch (error) {
           await showToast('Failed to delete todo', 'danger', closeCircle);
           console.error(error);
         }
       };
       ```
     - **Fungsi `deleteTodo` pada Firestore:**
       ```ts
       async deleteTodo(id: string) {
         try {
           const todoRef = this.getTodoRef();
           const docRef = doc(todoRef, id);
           await deleteDoc(docRef);
         } catch (error) {
           console.error('Error Delete Todo:', error);
           throw error;
         }
       }
       ```

---

### 5. **Update Status (Aktif/Completed)**
   - **Mekanisme:**  
     Pengguna dapat menggeser ke kanan atau menekan tombol untuk menandai todo sebagai aktif atau selesai.

   - **Kode yang terlibat:**
     - **Handle Swipe atau Klik Tombol Status:**
       ```ts
       const handleStatus = async (statusTodo: Todo) => {
         const slidingItem = itemRefs.value.get(statusTodo.id!);
         await slidingItem?.close();
         try {
           await firestoreService.updateStatus(statusTodo.id!, !statusTodo.status);
           await showToast(`Todo marked as ${!statusTodo.status ? 'completed' : 'active'}`, 'success', checkmarkCircle);
           loadTodos();
         } catch (error) {
           await showToast('Failed to update status', 'danger', closeCircle);
           console.error(error);
         }
       };
       ```
     - **Fungsi `updateStatus` pada Firestore:**
       ```ts
       async updateStatus(id: string, status: boolean) {
         try {
           const todoRef = this.getTodoRef();
           const docRef = doc(todoRef, id);
           await updateDoc(docRef, { status: status, updatedAt: Timestamp.now() });
         } catch (error) {
           console.error('Error Update Status:', error);
           throw error;
         }
       }
       ```


