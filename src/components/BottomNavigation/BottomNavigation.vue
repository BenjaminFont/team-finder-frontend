<template>
  <nav
    class="w-full bg-white shadow-lg fixed bottom-0 border-t border-gray-200 z-40"
  >
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-around h-16">
        <!-- Player Profiles -->
        <router-link
          to="/playerProfiles"
          class="flex flex-col items-center text-xs font-medium text-gray-600 hover:text-soccer-green transition-colors"
          :class="{'text-soccer-green': isActivePath('/playerProfiles')}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span class="mt-1">Spieler</span>
        </router-link>

        <!-- Add Player - Only visible for admins -->
        <router-link
          v-if="adminStore.isLoggedIn && adminStore.hasRole('ADMIN')"
          to="/addPlayer"
          class="flex flex-col items-center text-xs font-medium text-gray-600 hover:text-soccer-green transition-colors"
          :class="{'text-soccer-green': isActivePath('/addPlayer')}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          <span class="mt-1">Hinzufügen</span>
        </router-link>

        <!-- Team Creation -->
        <router-link
          to="/teamCreation"
          class="flex flex-col items-center text-xs font-medium text-gray-600 hover:text-soccer-green transition-colors"
          :class="{'text-soccer-green': isActivePath('/teamCreation')}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span class="mt-1">Teams</span>
        </router-link>
        
        <!-- User/Admin button -->
        <button 
          @click="adminStore.isLoggedIn ? handleLogout() : showLoginDialog = true"
          class="flex flex-col items-center text-xs font-medium text-gray-600 hover:text-soccer-green transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              v-if="adminStore.isLoggedIn"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="1.5" 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="1.5" 
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
            />
          </svg>
          <span class="mt-1">{{ adminStore.isLoggedIn ? 'Logout' : 'Login' }}</span>
        </button>
      </div>
    </div>
    
    <!-- Admin Login Dialog -->
    <admin-login-dialog 
      :showDialog="showLoginDialog" 
      @close="showLoginDialog = false"
      @login-success="onLoginSuccess"
    />
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAdminStore } from "../../stores/admin";
import AdminLoginDialog from "../AdminLogin/AdminLoginDialog.vue";

// Get current year for copyright
const currentYear = ref(new Date().getFullYear());
const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const showLoginDialog = ref(false);

// Check if current route matches the given path
const isActivePath = (path) => {
  return route.path.startsWith(path);
};

const handleLogout = () => {
  adminStore.logout();
  
  // If user is on a protected route, redirect to a public route
  const currentRoute = router.currentRoute.value;
  if (currentRoute.path === '/addPlayer') {
    router.push('/playerProfiles');
  }
};

const onLoginSuccess = () => {
  // Handle any post-login actions if needed
};
</script>