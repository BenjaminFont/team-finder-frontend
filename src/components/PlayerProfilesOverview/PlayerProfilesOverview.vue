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
        <div
          v-if="adminStore.isLoggedIn && adminStore.hasRole('SYSTEM_ADMIN')"
          class="edit-button absolute top-2 right-2 z-10"
        >
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
        v-if="adminStore.isLoggedIn && adminStore.hasRole('SYSTEM_ADMIN')"
        @click="router.push('/addPlayer')"
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
          
          <!-- Profile Image Section -->
          <div class="mb-8 flex items-start">
            <div class="mr-6 relative">
              <div
                class="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center"
              >
                <img
                  v-if="imagePreview || editingPlayer.imgSrc"
                  :src="imagePreview || editingPlayer.imgSrc"
                  alt="Spieler Foto"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-6xl text-gray-300">👤</span>
              </div>
            </div>

            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{
                  imageSelected ? "Profilbild hochgeladen" : "Profilbild hochladen"
                }}
              </label>
              <div class="flex space-x-3">
                <label
                  for="editImage"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition duration-200 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ editingPlayer.imgSrc || imagePreview ? "Ändern" : "Hochladen" }}
                </label>
                <input
                  type="file"
                  id="editImage"
                  @change="handleEditImageUpload"
                  accept="image/png, image/jpeg, image/bmp"
                  class="hidden"
                />

                <button
                  v-if="editingPlayer.imgSrc || imagePreview"
                  type="button"
                  @click="handleDeleteEditImage"
                  class="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Löschen
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Unterstützte Formate: PNG, JPEG, BMP. Maximal 5MB.
              </p>
            </div>
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
import PlayerProfile from "@/components/PlayerProfile/PlayerProfile.vue";
import { usePlayerStore } from "../../stores/player";
import { useAdminStore } from "../../stores/admin";
import { useRouter } from "vue-router";
import { playerApi, type Player } from "../../api";

const playerStore = usePlayerStore();
const adminStore = useAdminStore();
const router = useRouter();

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
const imagePreview = ref<string | null>(null);
const imageSelected = ref(false);
const imageFile = ref<File | null>(null);

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
  imagePreview.value = null;
  imageSelected.value = false;
  imageFile.value = null;
};

// Handle image upload in edit dialog
const handleEditImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    imageSelected.value = true;
    imageFile.value = file;
  }
};

// Handle delete image in edit dialog
const handleDeleteEditImage = () => {
  imagePreview.value = null;
  imageSelected.value = false;
  imageFile.value = null;
  
  if (editingPlayer.value) {
    editingPlayer.value.imgSrc = ""; // Clear the existing image URL
  }
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
    // Upload new image to S3 if selected
    if (imageFile.value) {
      try {
        const imageUrl = await playerApi.uploadProfileImage(imageFile.value);
        editingPlayer.value.imgSrc = imageUrl;
      } catch (error) {
        console.error("Error uploading image to S3:", error);
        updateError.value = "Fehler beim Hochladen des Bildes. Bitte versuchen Sie es erneut.";
        updating.value = false;
        return;
      }
    }
    
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

    // Reset image state
    imagePreview.value = null;
    imageSelected.value = false;
    imageFile.value = null;

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
