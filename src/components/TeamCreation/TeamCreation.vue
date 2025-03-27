<template>
  <div class="pb-16">
    <!-- Progress Stepper -->
    <div class="max-w-4xl mx-auto px-2 sm:px-4 my-4 sm:my-8">
      <div class="flex items-center justify-center">
        <!-- Steps connected with lines -->
        <div class="w-full max-w-md flex items-center justify-between">
          <!-- Step 1 -->
          <div class="relative flex flex-col items-center">
            <div :class="getCircleClasses(0)" class="z-10">
              {{ steps[0].value }}
            </div>
            <p class="mt-2 text-xs sm:text-sm font-medium text-center" :class="getTextClasses(0)">
              {{ steps[0].title }}
            </p>
          </div>

          <!-- Line 1-2 -->
          <div
            class="flex-grow mx-1 sm:mx-2 h-0.5"
            :class="currentStep >= 1 ? 'bg-soccer-green' : 'bg-gray-200'"
          ></div>

          <!-- Step 2 -->
          <div class="relative flex flex-col items-center">
            <div :class="getCircleClasses(1)" class="z-10">
              {{ steps[1].value }}
            </div>
            <p class="mt-2 text-xs sm:text-sm font-medium text-center" :class="getTextClasses(1)">
              {{ steps[1].title }}
            </p>
          </div>

          <!-- Line 2-3 -->
          <div
            class="flex-grow mx-1 sm:mx-2 h-0.5"
            :class="currentStep >= 2 ? 'bg-soccer-green' : 'bg-gray-200'"
          ></div>

          <!-- Step 3 -->
          <div class="relative flex flex-col items-center">
            <div :class="getCircleClasses(2)" class="z-10">
              {{ steps[2].value }}
            </div>
            <p class="mt-2 text-xs sm:text-sm font-medium text-center" :class="getTextClasses(2)">
              {{ steps[2].title }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Container -->
    <div class="max-w-5xl mx-auto px-4 min-h-[60vh]">
      <!-- Step Content -->
      <div
        v-if="currentStep == 0"
        class="bg-white p-6 rounded-lg shadow-md animate-fadeIn"
      >
        <team-question
          @teamSizeOk="enableButton"
          @teamSizeNotOk="disableButton"
          @teamSelection="handleClickWeiter"
        ></team-question>
      </div>

      <div
        v-if="currentStep == 1"
        class="bg-white p-6 rounded-lg shadow-md animate-fadeIn"
      >
        <team-selection
          @selectedPlayersOk="enableButton"
          @selectedPlayersNotOk="disableButton"
        ></team-selection>
      </div>

      <div
        v-if="currentStep == 2"
        class="bg-white p-6 rounded-lg shadow-md animate-fadeIn"
      >
        <team-overview></team-overview>
      </div>
    </div>

    <!-- Navigation Footer -->
    <footer
      class="w-full bg-white shadow-lg h-16 fixed inset-x-0 bottom-0 border-t border-gray-200 z-30"
    >
      <div
        class="max-w-4xl mx-auto px-4 h-full flex items-center justify-between"
      >
        <!-- Progress indicator -->
        <div class="text-sm text-gray-500">
          Schritt {{ currentStep + 1 }} von {{ steps.length }}
        </div>

        <!-- Navigation buttons -->
        <div class="flex">
          <button
            @click="handleClickZurueck"
            class="px-4 py-2 mr-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
            :disabled="currentStep === 0"
          >
            Zurück
          </button>

          <button
            @click="handleClickWeiter"
            :disabled="buttonDisabled"
            class="px-4 py-2 bg-soccer-green text-white font-medium rounded-md hover:bg-opacity-90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-soccer-green focus:ring-opacity-50 disabled:opacity-50"
          >
            {{ currentStep === 2 ? "Fertig" : "Weiter" }}
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TeamQuestion from "@/components/TeamQuestion/TeamQuestion.vue";
import TeamSelection from "@/components/TeamSelection/TeamSelection.vue";
import TeamOverview from "@/components/TeamsOverview/TeamsOverview.vue";
import { usePlayerStore } from "@/stores/player";

const playerStore = usePlayerStore();
let currentStep = ref(0);
let buttonDisabled = ref(false);

// Function to reset player selection
function resetPlayerSelection() {
  // Get all players (selected and selectable)
  const allPlayers = [...playerStore.selectedPlayers, ...playerStore.selectablePlayers];
  
  // Reset selected players to empty array
  playerStore.setSelectedPlayers([]);
  
  // Set all players back to selectable
  playerStore.setSelectablePlayers(allPlayers);
}

const steps = [
  { value: 1, title: "Spielerzahl bestimmen" },
  { value: 2, title: "Spielerauswahl" },
  { value: 3, title: "Teams Ansicht" },
];

function handleClickZurueck() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function handleClickWeiter() {
  if (currentStep.value < 2) {
    currentStep.value++;
  } else if (currentStep.value === 2) {
    // Reset player selection
    resetPlayerSelection();
    // Reset to step 1
    currentStep.value = 0;
  }
}

function disableButton() {
  buttonDisabled.value = true;
}

function enableButton() {
  buttonDisabled.value = false;
}

// Helper function to get circle classes based on step
const getCircleClasses = (step) => {
  if (step < currentStep.value) {
    // Completed step
    return "w-8 h-8 sm:w-10 sm:h-10 bg-soccer-green border-2 border-soccer-green rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-base";
  } else if (step === currentStep.value) {
    // Current step
    return "w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-soccer-green rounded-full flex items-center justify-center font-bold text-soccer-green text-sm sm:text-base";
  } else {
    // Future step
    return "w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center font-semibold text-gray-400 text-sm sm:text-base";
  }
};

// Helper function to get text classes based on step
const getTextClasses = (step) => {
  if (step === currentStep.value) {
    return "text-soccer-green";
  } else {
    return "text-gray-500";
  }
};
</script>

<style>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
