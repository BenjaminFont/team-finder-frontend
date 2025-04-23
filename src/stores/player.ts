import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { playerApi, teamApi, Player, Skill } from "../api";

export const usePlayerStore = defineStore("players", () => {
  // Define Player class that matches the API interface
  class PlayerClass implements Player {
    id?: number;
    name: string;
    rating: number;
    skills: Skill[]; // renamed from items
    handynummer: string;
    imgSrc?: string;

    constructor(
      name: string,
      rating: number,
      skills: Skill[], // renamed from items
      handynummer: string,
      imgSrc: string = ""
    ) {
      this.name = name;
      this.rating = rating;
      this.skills = skills; // renamed from items
      this.handynummer = handynummer;
      this.imgSrc = imgSrc;
    }
  }

  // Store state
  let selectedPlayers = ref<Player[]>([]);
  let selectablePlayers = ref<Player[]>([]);
  let isLoading = ref(false);
  let error = ref<string | null>(null);

  // Fetch all players from the backend
  async function fetchPlayers() {
    isLoading.value = true;
    error.value = null;
    try {
      const players = await playerApi.getAllPlayers();
      selectablePlayers.value = players;
    } catch (err) {
      console.error("Failed to fetch players:", err);
      error.value = "Failed to load players. Please try again.";
      // Fallback to empty array if API fails
      selectablePlayers.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  // Add a new player
  async function addPlayer(player: Player) {
    isLoading.value = true;
    error.value = null;
    try {
      const newPlayer = await playerApi.createPlayer(player);
      // If API call succeeds, add the new player to the list
      selectablePlayers.value.push(newPlayer);
      return newPlayer;
    } catch (err) {
      console.error("Failed to add player:", err);
      error.value = "Failed to add player. Please try again.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Update player data
  async function updatePlayer(id: number, player: Player) {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedPlayer = await playerApi.updatePlayer(id, player);
      // Update the player in the list
      const index = selectablePlayers.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        selectablePlayers.value[index] = updatedPlayer;
      }
      return updatedPlayer;
    } catch (err) {
      console.error("Failed to update player:", err);
      error.value = "Failed to update player. Please try again.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Delete a player
  async function deletePlayer(id: number) {
    isLoading.value = true;
    error.value = null;
    try {
      await playerApi.deletePlayer(id);
      // Remove player from lists
      selectablePlayers.value = selectablePlayers.value.filter(
        (p) => p.id !== id
      );
      selectedPlayers.value = selectedPlayers.value.filter((p) => p.id !== id);
    } catch (err) {
      console.error("Failed to delete player:", err);
      error.value = "Failed to delete player. Please try again.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Player selection functions
  function setSelectedPlayers(selectedPlayersNew: Player[]) {
    selectedPlayers.value = selectedPlayersNew;
  }

  function setSelectablePlayers(selectablePlayersNew: Player[]) {
    selectablePlayers.value = selectablePlayersNew;
  }

  // Get teams (now will use backend API for shuffling)
  async function getTeams(numTeams = 2) {
    console.log(numTeams);
    if (selectedPlayers.value.length === 0) {
      // Create empty teams based on numTeams
      const teams: Record<string, Player[]> = {};
      for (let i = 1; i <= numTeams; i++) {
        teams[`team${i}`] = [];
      }
      return teams;
    }

    try {
      // If we're connected to backend, use its team shuffling
      const teams = await teamApi.shuffleTeams(selectedPlayers.value, numTeams);
      console.log(JSON.stringify(teams))
      return teams;
    } catch (err) {
      console.error(
        "Failed to shuffle teams from backend, using fallback:",
        err
      );
      // Fallback to local implementation if API fails
      const teams: Record<string, Player[]> = {};
      
      // Distribute players evenly among teams
      for (let i = 0; i < selectedPlayers.value.length; i++) {
        const teamIndex = (i % numTeams) + 1;
        const teamKey = `team${teamIndex}`;
        
        if (!teams[teamKey]) {
          teams[teamKey] = [];
        }
        
        teams[teamKey].push(selectedPlayers.value[i]);
      }
      
      return teams;
    }
  }

  // Initialize the store by loading players
  onMounted(() => {
    fetchPlayers();
  });

  return {
    selectablePlayers,
    selectedPlayers,
    isLoading,
    error,
    fetchPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer,
    setSelectedPlayers,
    setSelectablePlayers,
    getTeams,
    PlayerClass, // Export the class for components that need to create new players
  };
});
