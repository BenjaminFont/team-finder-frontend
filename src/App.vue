<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <header-bar></header-bar>

    <!-- Main content container -->
    <main class="flex-grow pb-16">
      <div class="page-container">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from "./components/HeaderBar/HeaderBar.vue";
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

:root {
  --soccer-green: #004d3f;
}

* {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

body {
  @apply bg-gray-50;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page-container {
  @apply max-w-6xl mx-auto px-4 py-6;
}

/* Transitions for page changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar - only apply on desktop */
@media (min-width: 768px) {
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #004d3f;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #003d32;
  }
}

/* Mobile specific styles */
@media (max-width: 767px) {
  .page-container {
    @apply px-2 py-4;
  }
}
</style>
