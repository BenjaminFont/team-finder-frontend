<template>
  <div class="mx-auto mt-24 flex justify-center">
    <form
      @submit.prevent="handleClick"
      class="m-4 border border-gray-300 p-4 rounded-md w-96"
      :class="{ 'h-auto': true }"
    >
      <div class="flex items-start flex-col">
        <div class="mb-5 text-lg">
          <h2 class="font-bold text-xl">Wie viele Spieler seid ihr?</h2>
        </div>
        <div class="mb-4 w-full">
          <label for="teamsize" class="block text-sm font-medium text-gray-700"
            >Spielerzahl</label
          >
          <input
            v-model="teamsize"
            type="text"
            id="teamsize"
            name="teamsize"
            placeholder="10"
            class="mt-1 p-2 border rounded-md w-full"
            :maxlength="2"
          />
          <p v-if="sizeRuleViolation" class="mt-2 text-xs text-red-500">
            Spielerzahl muss eine Zahl zwischen 4 und 99 sein.
          </p>
        </div>

        <div class="mb-4 w-full">
          <label for="teamcount" class="block text-sm font-medium text-gray-700"
            >Anzahl der Teams</label
          >
          <input
            v-model="teamcount"
            type="text"
            id="teamcount"
            name="teamcount"
            placeholder="2"
            class="mt-1 p-2 border rounded-md w-full"
            :maxlength="1"
          />
          <p v-if="countRuleViolation" class="mt-2 text-xs text-red-500">
            Teamanzahl muss eine Zahl zwischen 2 und 9 sein.
          </p>
          <p v-if="insufficientPlayersError" class="mt-2 text-xs text-red-500">
            Die Spielerzahl muss mindestens so groß wie die Teamanzahl sein.
          </p>
        </div>

        <button
          @click="handleClick"
          :disabled="formInvalid"
          :style="disabledClasses()"
          type="submit"
          class="mt-2 mb-2 w-full bg-[#004d3f] text-white p-2 rounded-md hover:bg-green-900 focus:outline-none focus:ring focus:border-green-600 active:bg-green-1000"
        >
          Erstellen
        </button>
      </div>
    </form>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTeamNumberStore } from "../../stores/teamNumber";
import { useTeamCountStore } from "../../stores/teamCount";
import { storeToRefs } from "pinia";

const emits = defineEmits(["teamSizeOk", "teamSizeNotOk", "teamSelection"]);

let teamsize = ref("10");
let teamcount = ref("2");

const teamNumStore = useTeamNumberStore();
const teamCountStore = useTeamCountStore();

const { teamNumber } = storeToRefs(teamNumStore);
const { teamCount } = storeToRefs(teamCountStore);
const { setNumber } = teamNumStore;
const { setTeamCount } = teamCountStore;

// Validate player count
const sizeRuleViolation = computed(() => {
  return !/^\d+$/.test(teamsize.value) || 
         parseInt(teamsize.value) < 4 || 
         parseInt(teamsize.value) > 99;
});

// Validate team count
const countRuleViolation = computed(() => {
  return !/^\d+$/.test(teamcount.value) || 
         parseInt(teamcount.value) < 2 || 
         parseInt(teamcount.value) > 9;
});

// Check if player count is sufficient for team count
const insufficientPlayersError = computed(() => {
  if (!/^\d+$/.test(teamsize.value) || !/^\d+$/.test(teamcount.value)) {
    return false;
  }
  return parseInt(teamsize.value) < parseInt(teamcount.value);
});

// Determine if form submission should be disabled
const formInvalid = computed(() => {
  return sizeRuleViolation.value || countRuleViolation.value || insufficientPlayersError.value;
});

// Update emit based on form validation
watch(formInvalid, (invalid) => {
  if (invalid) {
    emits("teamSizeNotOk");
  } else {
    emits("teamSizeOk");
  }
});

function disabledClasses() {
  if (formInvalid.value) {
    return "background-color: #808080";
  }
  return "";
}

// Update store when values change
watch(teamsize, () => {
  if (!sizeRuleViolation.value) {
    setNumber(parseInt(teamsize.value));
  }
});

watch(teamcount, () => {
  if (!countRuleViolation.value) {
    setTeamCount(parseInt(teamcount.value));
  }
});

const handleClick = () => {
  if (formInvalid.value) {
    return;
  }
  
  setNumber(parseInt(teamsize.value));
  setTeamCount(parseInt(teamcount.value));
  emits("teamSelection");
};
</script>