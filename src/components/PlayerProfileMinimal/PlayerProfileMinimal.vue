<template>
  <div
    class="bg-white shadow-md rounded-lg cursor-pointer w-full sm:w-36 md:w-44 h-20 transform transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 border-soccer-green"
    @click="handleClick"
  >
    <div class="flex items-center h-full px-2">
      <div
        class="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0"
      >
        <img
          :src="
            props.player.imgSrc || '/user.png'
          "
          :alt="props.player.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="ml-2 sm:ml-3 flex-1 min-w-0">
        <div class="text-sm font-bold text-gray-800 truncate max-w-full">
          {{ props.player.name }}
        </div>
        <div class="flex items-center mt-1 space-x-1">
          <div class="flex items-center bg-gray-100 rounded-md px-1.5 py-0.5">
            <span class="text-xs font-medium text-gray-700">Rating:</span>
            <span class="ml-1 text-sm font-semibold text-soccer-green">{{
              props.player.rating
            }}</span>
          </div>
          <button
            @click.stop="zoomIn"
            class="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 flex justify-center items-center rounded-full hover:bg-gray-100 transition-colors"
            title="Mehr Info"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-gray-500"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from "../../api";
import { computed } from "vue";

const props = defineProps<{
  player: Player;
}>();

const emits = defineEmits(["click", "zoomIn"]);

function zoomIn() {
  emits("zoomIn", props.player);
}

function handleClick() {
  // Emit the click event along with the player object
  emits("click", props.player);
}
</script>
