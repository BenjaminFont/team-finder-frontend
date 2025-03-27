<template>
  <header class="w-full bg-soccer-green shadow-md">
    <div class="w-full flex flex-row justify-between items-center px-4 h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <div class="text-white text-xl font-bold">Team Finder</div>
      </div>
      
      <!-- Desktop Navigation - Hidden on mobile -->
      <nav class="hidden md:flex items-center">
        <router-link 
          class="ml-4 text-white hover:text-gray-200 transition duration-200 text-sm font-medium flex items-center"
          to="/playerProfiles"
        >
          <span class="mr-1">👥</span> Spieler Profile
        </router-link>
        <router-link 
          v-if="adminStore.isLoggedIn && adminStore.hasRole('ADMIN')"
          class="ml-4 text-white hover:text-gray-200 transition duration-200 text-sm font-medium flex items-center"
          to="/addPlayer"
        >
          <span class="mr-1">➕</span> Spieler Hinzufügen
        </router-link>
        <router-link 
          class="ml-4 text-white hover:text-gray-200 transition duration-200 text-sm font-medium flex items-center"
          to="/teamCreation"
        >
          <span class="mr-1">🏆</span> Team erstellen
        </router-link>
        
        <!-- Admin Login/Logout Button -->
        <div class="ml-4 relative">
          <button 
            @click="adminStore.isLoggedIn ? handleLogout() : showLoginDialog = true" 
            class="text-white hover:text-gray-200 transition duration-200 text-sm font-medium flex items-center"
          >
            <span class="mr-1">{{ adminStore.isLoggedIn ? '🔓' : '🔒' }}</span>
            <span v-if="adminStore.isLoggedIn">
              Logout ({{ adminStore.username }})
            </span>
            <span v-else>Login</span>
          </button>
        </div>
      </nav>
      
      <!-- Mobile Menu Button - Only visible on mobile -->
      <button 
        @click="toggleMobileMenu" 
        class="md:hidden text-white focus:outline-none"
        aria-label="Toggle mobile menu"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            v-if="mobileMenuOpen" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M6 18L18 6M6 6l12 12"
          />
          <path 
            v-else 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
    
    <!-- Mobile Menu - Only visible when open -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden bg-soccer-green border-t border-gray-700 shadow-lg"
    >
      <div class="px-4 py-3 space-y-4">
        <router-link 
          @click="mobileMenuOpen = false"
          to="/playerProfiles"
          class="block text-white hover:text-gray-300 font-medium py-2"
        >
          <span class="mr-2">👥</span> Spieler Profile
        </router-link>
        
        <router-link 
          v-if="adminStore.isLoggedIn && adminStore.hasRole('ADMIN')"
          @click="mobileMenuOpen = false"
          to="/addPlayer"
          class="block text-white hover:text-gray-300 font-medium py-2"
        >
          <span class="mr-2">➕</span> Spieler Hinzufügen
        </router-link>
        
        <router-link 
          @click="mobileMenuOpen = false"
          to="/teamCreation"
          class="block text-white hover:text-gray-300 font-medium py-2"
        >
          <span class="mr-2">🏆</span> Team erstellen
        </router-link>
        
        <button 
          @click="mobileLogin"
          class="block text-white hover:text-gray-300 font-medium py-2 w-full text-left"
        >
          <span class="mr-2">{{ adminStore.isLoggedIn ? '🔓' : '🔒' }}</span>
          <span v-if="adminStore.isLoggedIn">
            Logout ({{ adminStore.username }})
          </span>
          <span v-else>Login</span>
        </button>
      </div>
    </div>
  </header>
  
  <!-- Admin Login Dialog -->
  <admin-login-dialog 
    :showDialog="showLoginDialog" 
    @close="showLoginDialog = false"
    @login-success="onLoginSuccess"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAdminStore } from "../../stores/admin";
import { useRouter } from "vue-router";
import AdminLoginDialog from "../AdminLogin/AdminLoginDialog.vue";

const adminStore = useAdminStore();
const router = useRouter();
const showLoginDialog = ref(false);
const mobileMenuOpen = ref(false);

const handleLogout = () => {
  adminStore.logout();
  
  // If user is on a protected route, redirect to a public route
  const currentRoute = router.currentRoute.value;
  if (currentRoute.path === '/addPlayer') {
    router.push('/playerProfiles');
  }
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const mobileLogin = () => {
  if (adminStore.isLoggedIn) {
    handleLogout();
  } else {
    showLoginDialog.value = true;
  }
  mobileMenuOpen.value = false;
};

const onLoginSuccess = () => {
  // Handle any post-login actions if needed
};
</script>