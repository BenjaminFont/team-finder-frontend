<template>
  <div>
    <div class="mt-10 text-xl text-center">
      {{ selectedPlayers.length }} von {{ currentNumber }}
    </div>

    <div class="p-2 flex justify-start rounded-sm border-b-2 border-gray-200 mb-3">
      <div class="text-ms font-sans text-gray-600 font-medium">
        Wählbare Spieler:
      </div>
    </div>
    <div class="h-60 overflow-y-auto">
      <ol class="grid grid-cols-1 max-sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        <li
          v-for="player in selectablePlayers"
          :key="player.name"
          class="flex justify-center my-2 mx-1 h-fit max-sm:w-full sm:w-full"
        >
          <player-profile-minimal
            :player="player"
            @zoomIn="handleZoomInSelectablePlayer"
            @click="handleClickSelectablePlayers"
          >
          </player-profile-minimal>
        </li>
      </ol>
    </div>

    <div class="p-2 flex justify-start rounded-sm border-b-2 border-gray-200 mb-3">
      <div class="text-ms font-sans text-gray-600 font-medium">Auswahl:</div>
    </div>
    <div class="h-60 overflow-y-auto">
      <ol class="grid grid-cols-1 max-sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        <li
          v-for="player in selectedPlayers"
          :key="player.name"
          class="flex justify-center my-2 mx-1 h-fit max-sm:w-full sm:w-full"
        >
          <player-profile-minimal
            :player="player"
            @zoomIn="handleZoomInSelectedPlayer"
            @click="handleClickSelectedPlayers"
          >
          </player-profile-minimal>
        </li>
      </ol>
    </div>
    <div :style="modalOverlayStyles">
      <div v-if="modal" class="modal flex flex-col items-center">
        <player-profile :player="modalObject"></player-profile>
        <button
          @click="close"
          class="mt-2 mb-2 w-50 bg-green-800 text-white p-2 rounded-md hover:bg-green-900 focus:outline-none focus:ring focus:border-green-600 active:bg-green-1000"
        >
          Schließen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import PlayerProfile from "../PlayerProfile/PlayerProfile.vue";
import PlayerProfileMinimal from "../PlayerProfileMinimal/PlayerProfileMinimal.vue";
import { ref, computed, reactive } from "vue";
import { useTeamNumberStore } from "../../stores/teamNumber";
import { usePlayerStore } from "../../stores/player";
import { useRouter } from "vue-router";

const emits = defineEmits(["selectedPlayersOk", "selectedPlayersNotOk"]);
const playerStore = usePlayerStore();
const teamNumStore = useTeamNumberStore();
const router = useRouter();

const selectablePlayers = computed(() => playerStore.selectablePlayers);
const selectedPlayers = computed(() => playerStore.selectedPlayers);
const currentNumber = ref(teamNumStore.teamNumber).value;
const modal = ref(false);
const modalObject = ref({});

const modalOverlayStyles = reactive({
  display: "none",
  position: "fixed",
  zIndex: 50,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
});

function close() {
  modal.value = false;
  modalOverlayStyles.display = "none";
}

function handleZoomInSelectablePlayer(player) {
  let filtered = selectablePlayers.value.filter((element) => {
    return element.name === player.name;
  });
  modalObject.value = filtered[0];
  modal.value = true;
  modalOverlayStyles.display = "";
}

function handleZoomInSelectedPlayer(player) {
  let filtered = selectedPlayers.value.filter((element) => {
    return element.name === player.name;
  });
  modalObject.value = filtered[0];
  modal.value = true;
  modalOverlayStyles.display = "";
}

function handleClickSelectablePlayers(player) {
  if (selectedPlayers.value.length < currentNumber) {
    const matchingElements = selectablePlayers.value.filter((element) => {
      return element.name === player.name;
    });
    playerStore.setSelectedPlayers([
      ...selectedPlayers.value,
      ...matchingElements,
    ]);

    playerStore.setSelectablePlayers(
      selectablePlayers.value.filter((element) => {
        return element.name !== player.name;
      })
    );
  }
  checkTeamSize();
}

function handleClickSelectedPlayers(player) {
  const matchingElements = selectedPlayers.value.filter((element) => {
    return element.name === player.name;
  });
  playerStore.setSelectablePlayers([
    ...selectablePlayers.value,
    ...matchingElements,
  ]);

  playerStore.setSelectedPlayers(
    selectedPlayers.value.filter((element) => {
      return element.name !== player.name;
    })
  );
  checkTeamSize();
}

const checkTeamSize = () => {
  if (selectedPlayers.value.length == currentNumber) {
    emits("selectedPlayersOk");
  } else {
    emits("selectedPlayersNotOk");
  }
};
</script>

<style scoped>
/* Modal Content/Box */
.modal {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 90%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}
</style>
