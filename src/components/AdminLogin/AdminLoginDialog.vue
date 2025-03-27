<template>
  <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800">Admin Login</h2>
        <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div v-if="errorMessage" class="bg-red-50 text-red-700 p-3 rounded mb-4">
          {{ errorMessage }}
        </div>
        
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soccer-green"
            required
          />
        </div>
        
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soccer-green"
            required
          />
        </div>
        
        <div class="flex justify-end">
          <button 
            type="button" 
            @click="closeDialog" 
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isLoading" 
            class="px-4 py-2 text-white bg-soccer-green rounded-md hover:bg-opacity-90 disabled:opacity-70"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAdminStore } from '../../stores/admin';

// Props and emits
const props = defineProps<{
  showDialog: boolean;
}>();

const emit = defineEmits(['close', 'login-success']);

// State
const username = ref('');
const password = ref('');
const adminStore = useAdminStore();

// Computed
const isLoading = computed(() => adminStore.isLoading);
const errorMessage = computed(() => adminStore.loginError);

// Methods
const closeDialog = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  username.value = '';
  password.value = '';
};

const handleLogin = async () => {
  const success = await adminStore.login(username.value, password.value);
  
  if (success) {
    emit('login-success');
    closeDialog();
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>