<template>
  <div class="max-w-3xl mx-auto py-10 px-4">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="bg-soccer-green p-4 text-white">
        <h2 class="text-xl font-bold">Neuen Spieler hinzufügen</h2>
        <p class="text-sm text-gray-100">
          Fülle das Formular aus, um einen neuen Spieler zu registrieren
        </p>
      </div>

      <form @submit.prevent="handelSubmit" class="p-6">
        <!-- Messages -->
        <div v-if="successMessage" class="p-2 mb-4 bg-green-50 text-green-700 border border-green-200 rounded">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-2 mb-4 bg-red-50 text-red-700 border border-red-200 rounded">
          {{ errorMessage }}
        </div>
        
        <!-- Name field -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Spielername</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              v-model="name"
              placeholder="Spielername eingeben"
              class="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soccer-green focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <!-- Profile Image Section -->
        <div class="mb-8 flex items-start">
          <div class="mr-6 relative">
            <div
              class="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center"
            >
              <img
                v-if="fileData"
                :src="fileData"
                alt="Spieler Foto"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-6xl text-gray-300">👤</span>
            </div>
          </div>

          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{
                fileUploaded ? "Profilbild hochgeladen" : "Profilbild hochladen"
              }}
            </label>
            <div class="flex space-x-3">
              <label
                for="file"
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
                {{ fileUploaded ? "Ändern" : "Hochladen" }}
              </label>
              <input
                type="file"
                id="file"
                @change="handleFileUpload"
                accept="image/png, image/jpeg, image/bmp"
                class="hidden"
              />

              <button
                v-if="fileUploaded"
                type="button"
                @click="handleDeleteFile"
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

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Kontaktinformation</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                />
              </svg>
            </div>
            <input
              type="tel"
              v-model="handynummer"
              placeholder="Handynummer eingeben"
              class="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soccer-green focus:border-transparent"
            />
          </div>
        </div>

        <!-- Player Skills Section -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-4"
            >Spieler Fähigkeiten</label
          >

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Schnelligkeit -->
            <div class="skill-input">
              <label
                class="block text-xs uppercase tracking-wide text-gray-500 mb-1"
                >Schnelligkeit</label
              >
              <div class="flex items-center">
                <input
                  type="range"
                  v-model="schnelligkeit"
                  min="1"
                  max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-soccer-green"
                />
                <span class="ml-2 text-sm font-medium w-5 text-center">{{
                  schnelligkeit || 1
                }}</span>
              </div>
            </div>

            <!-- Dribbling -->
            <div class="skill-input">
              <label
                class="block text-xs uppercase tracking-wide text-gray-500 mb-1"
                >Dribbling</label
              >
              <div class="flex items-center">
                <input
                  type="range"
                  v-model="dribbling"
                  min="1"
                  max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-soccer-green"
                />
                <span class="ml-2 text-sm font-medium w-5 text-center">{{
                  dribbling || 1
                }}</span>
              </div>
            </div>

            <!-- Ausdauer -->
            <div class="skill-input">
              <label
                class="block text-xs uppercase tracking-wide text-gray-500 mb-1"
                >Ausdauer</label
              >
              <div class="flex items-center">
                <input
                  type="range"
                  v-model="ausdauer"
                  min="1"
                  max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-soccer-green"
                />
                <span class="ml-2 text-sm font-medium w-5 text-center">{{
                  ausdauer || 1
                }}</span>
              </div>
            </div>

            <!-- Schuss -->
            <div class="skill-input">
              <label
                class="block text-xs uppercase tracking-wide text-gray-500 mb-1"
                >Schuss</label
              >
              <div class="flex items-center">
                <input
                  type="range"
                  v-model="schuss"
                  min="1"
                  max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-soccer-green"
                />
                <span class="ml-2 text-sm font-medium w-5 text-center">{{
                  schuss || 1
                }}</span>
              </div>
            </div>

            <!-- Zweikampf -->
            <div class="skill-input">
              <label
                class="block text-xs uppercase tracking-wide text-gray-500 mb-1"
                >Zweikampf</label
              >
              <div class="flex items-center">
                <input
                  type="range"
                  v-model="zweikampf"
                  min="1"
                  max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-soccer-green"
                />
                <span class="ml-2 text-sm font-medium w-5 text-center">{{
                  zweikampf || 1
                }}</span>
              </div>
            </div>

            <!-- Passen -->
            <div class="skill-input">
              <label
                class="block text-xs uppercase tracking-wide text-gray-500 mb-1"
                >Passen</label
              >
              <div class="flex items-center">
                <input
                  type="range"
                  v-model="passen"
                  min="1"
                  max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-soccer-green"
                />
                <span class="ml-2 text-sm font-medium w-5 text-center">{{
                  passen || 1
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md mr-3 hover:bg-gray-200 transition duration-200"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-soccer-green text-white rounded-md hover:bg-opacity-90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-soccer-green focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? "Speichern..." : "Spieler speichern" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePlayerStore } from "../../stores/player";
import { useRouter } from "vue-router";
import { playerApi } from "../../api";

const playerStore = usePlayerStore();
const router = useRouter();

// Form state
const name = ref("");
const files = ref<File | null>(null);
const handynummer = ref("");
const schnelligkeit = ref("3");
const dribbling = ref("3");
const ausdauer = ref("3");
const schuss = ref("3");
const zweikampf = ref("3");
const passen = ref("3");

let fileData = ref<string | null>(null);
let fileUploaded = ref(false);
let isSubmitting = ref(false);
let errorMessage = ref<string | null>(null);
let successMessage = ref<string | null>(null);

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    try {
      // Still show a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      fileUploaded.value = true;
      
      // We'll upload to S3 only when the form is submitted
      files.value = file;
    } catch (error) {
      console.error("Error preparing file:", error);
      errorMessage.value = "Fehler beim Vorbereiten der Datei. Bitte versuchen Sie es erneut.";
    }
  }
};

const handleDeleteFile = () => {
  fileData.value = null;
  fileUploaded.value = false;
};

const resetForm = () => {
  name.value = "";
  fileData.value = null;
  fileUploaded.value = false;
  handynummer.value = "";
  schnelligkeit.value = "3";
  dribbling.value = "3";
  ausdauer.value = "3";
  schuss.value = "3";
  zweikampf.value = "3";
  passen.value = "3";
  errorMessage.value = null;
  successMessage.value = null;
};

const handelSubmit = async () => {
  if (!name.value) {
    errorMessage.value = "Bitte geben Sie einen Namen ein";
    return;
  }

  if (!handynummer.value) {
    errorMessage.value = "Bitte geben Sie eine Telefonnummer ein";
    return;
  }

  errorMessage.value = null;
  isSubmitting.value = true;
  
  try {
    // Upload image to S3 if a file was selected
    let imageUrl = "";
    if (files.value) {
      try {
        imageUrl = await playerApi.uploadProfileImage(files.value);
      } catch (error) {
        console.error("Error uploading image to S3:", error);
        errorMessage.value = "Fehler beim Hochladen des Bildes. Bitte versuchen Sie es erneut.";
        isSubmitting.value = false;
        return;
      }
    }
    
    // Calculate overall rating based on skills (average)
    const skillValues = [
      parseInt(schnelligkeit.value),
      parseInt(dribbling.value),
      parseInt(ausdauer.value),
      parseInt(schuss.value),
      parseInt(zweikampf.value),
      parseInt(passen.value),
    ];
    
    const overallRating = Math.round(
      skillValues.reduce((sum, value) => sum + value, 0) / skillValues.length
    );
    
    // Create player object in the format expected by the API
    const player = {
      name: name.value,
      rating: overallRating,
      handynummer: handynummer.value,
      imgSrc: imageUrl || "", // Use the S3 URL
      skills: [
        { skill: "Schnelligkeit", rating: parseInt(schnelligkeit.value) },
        { skill: "Dribbling", rating: parseInt(dribbling.value) },
        { skill: "Ausdauer", rating: parseInt(ausdauer.value) },
        { skill: "Schuss", rating: parseInt(schuss.value) },
        { skill: "Zweikampf", rating: parseInt(zweikampf.value) },
        { skill: "Passen", rating: parseInt(passen.value) },
      ]
    };

    // Send to API via store
    await playerStore.addPlayer(player);
    successMessage.value = "Spieler erfolgreich hinzugefügt!";
    
    // Reset form after successful submission
    resetForm();
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/players');
    }, 1500);
  } catch (error) {
    console.error("Error adding player:", error);
    errorMessage.value = "Fehler beim Hinzufügen des Spielers. Bitte versuchen Sie es erneut.";
  } finally {
    isSubmitting.value = false;
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
