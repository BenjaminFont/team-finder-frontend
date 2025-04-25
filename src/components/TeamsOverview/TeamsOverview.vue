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
    
    <!-- Dynamic Teams -->
    <div v-for="(players, teamKey, index) in teams" :key="teamKey">
      <!-- Team Header -->
      <h3 class="text-xl font-bold text-soccer-green mb-2 pl-2 md:pl-4">
        Team {{ teamKey.replace('team', '') }}
      </h3>
      
      <!-- Team Players -->
      <ol class="flex flex-row flex-wrap justify-center md:justify-start">
        <li
          v-for="player in players"
          :key="player.id || player.name"
          class="w-full sm:w-auto sm:flex-1 md:flex-none m-2 md:m-3 max-w-full sm:max-w-xs"
        >
          <PlayerProfileShort :player="player"></PlayerProfileShort>
        </li>
      </ol>
      
      <!-- VS Divider (except after last team) -->
      <div class="my-6" v-if="index < Object.keys(teams).length - 1">
        <div class="bg-gray-100 bg-opacity-80 py-2 shadow-sm rounded-md">
          <div
            class="text-4xl font-sans text-black font-medium text-center"
            style="text-shadow: 1px 2px 3px gray"
          >
            VS
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerProfileShort from "../PlayerProfileShort/PlayerProfileShort.vue";
import { onMounted, ref, reactive } from "vue";
import { usePlayerStore } from "../../stores/player";
import { useTeamCountStore } from "../../stores/teamCount";
import { teamApi } from "../../api";

import {Player} from "@/types";

const playerStore = usePlayerStore();
const teamCountStore = useTeamCountStore();
const isShuffling = ref(false);
const errorMessage = ref("");

// Initialize teams structure as a reactive object that can hold any number of teams
const teams = reactive({} as Record<string, Player[]>);

// Function to shuffle the players and create new teams using the backend API
const getNewTeams = async () => {
  if (playerStore.selectedPlayers.length === 0) {
    errorMessage.value = "Keine Spieler ausgewählt";
    return;
  }

  if (playerStore.selectedPlayers.length < teamCountStore.teamCount) {
    errorMessage.value = "Die Spielerzahl muss mindestens so groß wie die Teamanzahl sein.";
    return;
  }

  isShuffling.value = true;
  errorMessage.value = "";

  try {
    // Get shuffled teams from backend with the specified number of teams
    const shuffledTeams = await playerStore.getTeams(teamCountStore.teamCount);
    
    // Clear existing teams
    Object.keys(teams).forEach(key => {
      delete teams[key];
    });
    
    // Add each team from the response
    Object.entries(shuffledTeams).forEach(([key, players]) => {
      teams[key] = players;
    });
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
    const initialTeams = await playerStore.getTeams(teamCountStore.teamCount);
    // Clear existing teams
    Object.keys(teams).forEach(key => {
      delete teams[key];
    });
    
    // Add each team from the response
    Object.entries(initialTeams).forEach(([key, players]) => {
      teams[key] = players;
    });
  } catch (err) {
    console.error("Error initializing teams:", err);
    errorMessage.value = "Fehler beim Laden der Teams";
  }
});
</script>