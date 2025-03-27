<template>
  <div>
    <div class="flex justify-center mb-2">
      <button
        @click="getNewTeams"
        class="ml-2 mr-2 mt-2 px-2 py-1 h-8 w-30 bg-soccer-green text-white font-medium rounded-md hover:bg-opacity-90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-soccer-green focus:ring-opacity-50 disabled:opacity-50"
        :disabled="isShuffling"
      >
        {{ isShuffling ? "Verarbeiten..." : "Neue Teams" }}
      </button>
    </div>
    <div v-if="errorMessage" class="text-red-600 text-center mb-2">
      {{ errorMessage }}
    </div>
    <!-- Team 1 -->
    <div>
      <h3 class="text-xl font-bold text-soccer-green mb-2 pl-2 md:pl-4">Team 1</h3>
      <ol class="flex flex-row flex-wrap justify-center md:justify-start">
        <li
          v-for="player in teams.team2"
          :key="player.id || player.name"
          class="w-full sm:w-auto sm:flex-1 md:flex-none m-2 md:m-3 max-w-full sm:max-w-xs     "
        >
          <PlayerProfileShort :player="player"></PlayerProfileShort>
        </li>
      </ol>
    </div>
    
    <!-- VS Divider -->
    <div class="my-6">
      <div class="bg-gray-100 bg-opacity-80 py-2 shadow-sm rounded-md">
        <div
          class="text-4xl font-sans text-black font-medium text-center"
          style="text-shadow: 1px 2px 3px gray"
        >
          VS
        </div>
      </div>
    </div>
    
    <!-- Team 2 -->
    <div>
      <h3 class="text-xl font-bold text-soccer-green mb-2 pl-2 md:pl-4">Team 2</h3>
      <ol class="flex flex-row flex-wrap justify-center md:justify-start">
        <li
          v-for="player in teams.team1"
          :key="player.id || player.name"
          class="w-full sm:w-auto sm:flex-1 md:flex-none m-2 md:m-3 max-w-full sm:max-w-xs"
        >
          <PlayerProfileShort :player="player"></PlayerProfileShort>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerProfileShort from "../PlayerProfileShort/PlayerProfileShort.vue";
import { onMounted, ref, reactive } from "vue";
import { usePlayerStore } from "../../stores/player";
import { useRouter } from "vue-router";
import { teamApi } from "../../api";
import type { Player } from "../../api";

const playerStore = usePlayerStore();
const router = useRouter();
const isShuffling = ref(false);
const errorMessage = ref("");

// Initialize teams structure
const teams = reactive({
  team1: [] as Player[],
  team2: [] as Player[],
});

// Function to shuffle the players and create new teams using the backend API
const getNewTeams = async () => {
  if (playerStore.selectedPlayers.length === 0) {
    errorMessage.value = "Keine Spieler ausgewählt";
    return;
  }

  isShuffling.value = true;
  errorMessage.value = "";

  try {
    // Get shuffled teams from backend
    const shuffledTeams = await playerStore.getTeams();

    // Update the local teams
    teams.team1 = shuffledTeams.team1;
    teams.team2 = shuffledTeams.team2;
  } catch (err) {
    console.error("Error shuffling teams:", err);
    errorMessage.value = "Fehler beim Erstellen der Teams";
  } finally {
    isShuffling.value = false;
  }
};

onMounted(async () => {
  // Initialize teams on component mount
  try {
    const initialTeams = await playerStore.getTeams();
    teams.team1 = initialTeams.team1;
    teams.team2 = initialTeams.team2;
    console.log(teams.team1);
    console.log(teams.team2);
  } catch (err) {
    console.error("Error initializing teams:", err);
    errorMessage.value = "Fehler beim Laden der Teams";
  }
});
</script>
