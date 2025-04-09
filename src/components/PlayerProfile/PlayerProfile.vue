<template>
  <div
    class="mx-auto w-full sm:w-80 bg-white shadow-lg rounded-lg overflow-hidden border-t-4 border-soccer-green transition-transform duration-300 hover:scale-105"
  >
    <div class="flex p-4">
      <div class="h-24 w-24 mr-4 flex-shrink-0">
        <img
          :src="
            props.player.imgSrc || '/user.png'
          "
          :alt="props.player.name"
          class="h-full w-full object-cover rounded-full border-2 border-soccer-green shadow-md"
        />
      </div>
      <div class="flex flex-col justify-center">
        <h3 class="text-lg font-bold text-gray-800">{{ props.player.name }}</h3>
        <div class="flex items-center mt-1">
          <span
            class="text-sm font-medium bg-soccer-green text-white px-2 py-0.5 rounded"
          >
            Rating: {{ props.player.rating }}
          </span>
        </div>
        <p class="text-sm text-gray-600 mt-2" v-if="adminStore.isLoggedIn && adminStore.hasRole('ADMIN') && props.player.handynummer">
          <span class="font-medium">Tel:</span>
          {{ formatPhone(props.player.handynummer) }}
        </p>
      </div>
    </div>

    <div class="px-4 pb-4">
      <h4 class="text-sm font-bold uppercase text-gray-500 mb-2">
        Spieler Fähigkeiten
      </h4>
      <div class="bg-gray-50 rounded-lg p-2">
        <table class="w-full">
          <thead>
            <tr>
              <th
                class="text-left text-xs uppercase font-semibold text-gray-500"
              >
                Skill
              </th>
              <th
                class="text-left text-xs uppercase font-semibold text-gray-500"
              >
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in props.player.skills"
              :key="item.skill"
              class="border-b border-gray-100 last:border-0"
            >
              <td class="py-2 text-sm">{{ item.skill }}</td>
              <td class="py-2 text-sm">
                <div class="flex items-center">
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full"
                      :style="{ width: `${item.rating * 20}%` }"
                    ></div>
                  </div>
                  <span class="ml-2 min-w-[20px] text-xs font-medium">{{
                    item.rating
                  }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from "../../api";
import { useAdminStore } from "../../stores/admin";
const adminStore = useAdminStore();


// const player = defineProps({
//   name: { type: String, required: true },
//   items: { type: Object, required: true }, // Renamed from 'items' to 'skills' in the backend model
//   handynummer: { type: Number, required: false },
//   imgSrc: { type: String, required: false },
//   rating: { type: Number, required: true },
// });
const props = defineProps<{
  player: Player;
}>();

// Format phone number for better readability
const formatPhone = (phone) => {
  if (!phone) return "";
  const phoneStr = phone.toString();
  if (phoneStr.length === 10) {
    return `${phoneStr.substring(0, 3)}-${phoneStr.substring(
      3,
      6
    )}-${phoneStr.substring(6)}`;
  }
  return phoneStr;
};
</script>
