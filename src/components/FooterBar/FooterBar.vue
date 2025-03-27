<template>
  <footer class="w-full bg-white shadow-lg h-16 inset-x-0 bottom-0 border-t border-gray-100 z-10">
    <div class="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
      <!-- Footer content or brand info -->
      <div class="text-xs text-gray-500">
        © {{ currentYear }} Team Finder
      </div>
      
      <!-- Action buttons -->
      <div class="flex items-center">
        <button
          @click="handleClickZurueck"
          class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
          :disabled="props.disableBackButton"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Zurück
          </span>
        </button>
        
        <button
          @click="handleClickWeiter"
          :disabled="buttonDisabled"
          class="ml-3 px-4 py-2 bg-soccer-green text-white font-medium rounded-md hover:bg-opacity-90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-soccer-green focus:ring-opacity-50 disabled:opacity-50"
        >
          <span class="flex items-center">
            Weiter
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref } from "vue";

const emit = defineEmits(["next", "before"]);
const props = defineProps({ 
  disableButton: Boolean, 
  enableButton: Boolean,
  disableBackButton: {
    type: Boolean,
    default: false
  },
  nextButtonText: {
    type: String,
    default: "Weiter"
  }
});

// Get current year for copyright
const currentYear = ref(new Date().getFullYear());

const buttonDisabled = computed(() => {
  return props.disableButton ? true : false;
});

const handleClickZurueck = () => {
  emit("before");
};

const handleClickWeiter = () => {
  emit("next");
};
</script>
</script>
