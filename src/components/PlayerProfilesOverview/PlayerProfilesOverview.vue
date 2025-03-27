<template>
  <div>
    <!-- Status Messages -->
    <div v-if="loading" class="text-center my-4 p-4 bg-gray-100 rounded">
      <p class="text-gray-700">Spieler werden geladen...</p>
    </div>

    <div
      v-if="error"
      class="text-center my-4 p-4 bg-red-50 text-red-700 rounded"
    >
      {{ error }}
    </div>

    <!-- Player List -->
    <ol
      v-if="!loading && players.length > 0"
      class="flex justify-center md:justify-start flex-wrap"
    >
      <li
        v-for="player in players"
        :key="player.id || player.name"
        class="flex-none m-2 md:m-3 w-full sm:w-auto relative"
      >
        <div v-if="adminStore.isLoggedIn && adminStore.hasRole('ADMIN')" class="edit-button absolute top-2 right-2 z-10">
          <button
            @click="openEditDialog(player)"
            class="bg-soccer-green text-white p-2 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-md"
            title="Spieler bearbeiten"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
          </button>
        </div>
        <player-profile :player="player"></player-profile>
      </li>
    </ol>

    <div
      v-if="!loading && players.length === 0"
      class="text-center my-8 p-6 bg-gray-50 rounded"
    >
      <p class="text-gray-600 mb-4">Keine Spieler gefunden</p>
      <button
        v-if="adminStore.isLoggedIn && adminStore.hasRole('ADMIN')"
        @click="$router.push('/addPlayer')"
        class="px-4 py-2 bg-soccer-green text-white rounded hover:bg-opacity-90"
      >
        Spieler hinzufügen
      </button>
      <p v-else class="text-sm text-gray-500 mt-2">
        Melden Sie sich als Administrator an, um Spieler hinzuzufügen.
      </p>
    </div>

    <!-- Edit Player Dialog -->
    <div
      v-if="showEditDialog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="bg-soccer-green p-4 text-white">
          <h2 class="text-xl font-bold">Spieler bearbeiten</h2>
          <p class="text-sm text-gray-100">
            Bearbeite die Spielerinformationen und Fähigkeiten
          </p>
        </div>

        <form @submit.prevent="handleUpdate" class="p-6">
          <!-- Messages -->
          <div
            v-if="updateSuccess"
            class="p-2 mb-4 bg-green-50 text-green-700 border border-green-200 rounded"
          >
            {{ updateSuccess }}
          </div>
          <div
            v-if="updateError"
            class="p-2 mb-4 bg-red-50 text-red-700 border border-red-200 rounded"
          >
            {{ updateError }}
          </div>

          <!-- Name field -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Spielername</label
            >
            <input
              type="text"
              v-model="editingPlayer.name"
              placeholder="Spielername eingeben"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soccer-green focus:border-transparent"
              required
            />
          </div>

          <!-- Contact Information -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Kontaktinformation</label
            >
            <input
              type="tel"
              v-model="editingPlayer.handynummer"
              placeholder="Handynummer eingeben"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soccer-green focus:border-transparent"
            />
          </div>

          <!-- Player Skills Section -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-4"
              >Spieler Fähigkeiten</label
            >

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(skill, index) in editingPlayer.skills"
                :key="skill.skill"
                class="skill-input"
              >
                <label
                  class="block text-xs uppercase tracking-wide text-gray-500 mb-1"
                >
                  {{ skill.skill }}
                </label>
                <div class="flex items-center">
                  <input
                    type="range"
                    v-model="editingPlayer.skills[index].rating"
                    min="1"
                    max="100"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-soccer-green"
                  />
                  <span class="ml-2 text-sm font-medium w-5 text-center">
                    {{ skill.rating }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="button"
              @click="showEditDialog = false"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md mr-3 hover:bg-gray-200 transition duration-200"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              :disabled="updating"
              class="px-6 py-2 bg-soccer-green text-white rounded-md hover:bg-opacity-90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-soccer-green focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ updating ? "Wird gespeichert..." : "Änderungen speichern" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PlayerProfile from "../PlayerProfile/PlayerProfile.vue";
import { usePlayerStore } from "../../stores/player";
import { useAdminStore } from "../../stores/admin";
import type { Player } from "../../api";

const playerStore = usePlayerStore();
const adminStore = useAdminStore();

// Component state
const loading = ref(false);
const error = ref<string | null>(null);
const players = ref<Player[]>([]);

// Edit dialog state
const showEditDialog = ref(false);
const editingPlayer = ref<Player | null>(null);
const updating = ref(false);
const updateSuccess = ref<string | null>(null);
const updateError = ref<string | null>(null);

// Fetch players on component mount
onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    await playerStore.fetchPlayers();
    players.value = playerStore.selectablePlayers;
  } catch (err) {
    console.error("Failed to load players:", err);
    error.value =
      "Fehler beim Laden der Spieler. Bitte versuchen Sie es später erneut.";
  } finally {
    loading.value = false;
  }
});

// Open edit dialog with player data
const openEditDialog = (player: Player) => {
  // Create a deep copy of the player to avoid modifying the original
  editingPlayer.value = JSON.parse(JSON.stringify(player));
  showEditDialog.value = true;
  updateError.value = null;
  updateSuccess.value = null;
};

// Calculate overall rating based on skills
const calculateOverallRating = (skills: any[]) => {
  if (!skills || skills.length === 0) return 0;

  const sum = skills.reduce(
    (total, skill) => total + parseInt(skill.rating.toString()),
    0
  );
  return Math.round(sum / skills.length);
};

// Update player with backend
const handleUpdate = async () => {
  if (!editingPlayer.value || !editingPlayer.value.id) {
    updateError.value = "Spieler-ID fehlt. Aktualisierung nicht möglich.";
    return;
  }

  updating.value = true;
  updateError.value = null;
  updateSuccess.value = null;

  try {
    // Update the overall rating based on skills
    editingPlayer.value.rating = calculateOverallRating(
      editingPlayer.value.skills
    );

    // Call the API to update the player
    const updatedPlayer = await playerStore.updatePlayer(
      editingPlayer.value.id,
      editingPlayer.value
    );

    // Update local players list
    const index = players.value.findIndex((p) => p.id === updatedPlayer.id);
    if (index !== -1) {
      players.value[index] = updatedPlayer;
    }

    updateSuccess.value = "Spieler erfolgreich aktualisiert!";

    // Close dialog after a short delay
    setTimeout(() => {
      showEditDialog.value = false;
    }, 1500);
  } catch (err) {
    console.error("Failed to update player:", err);
    updateError.value =
      "Fehler beim Aktualisieren des Spielers. Bitte versuchen Sie es erneut.";
  } finally {
    updating.value = false;
  }
};
</script>

<style scoped>
/* Custom styling for range inputs */
input[type="range"] {
  height: 6px;
  border-radius: 5px;
  background: #e5e7eb;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #004d3f;
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}
</style>
