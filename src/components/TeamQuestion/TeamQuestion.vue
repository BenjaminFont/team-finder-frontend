<template>
  <div class="mx-auto mt-24 flex justify-center">
    <form
      @submit.prevent="handleClick"
      class="m-4 border border-gray-300 p-4 rounded-md w-96"
      :class="{ 'h-76': ruleViolation, 'h-66': !ruleViolation }"
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
            :pattern="[0 - 9]"
          />
          <p v-if="ruleViolation" class="mt-2 text-xs text-red-500">
            Teamgröße muss eine Zahl zwischen 10 und 99 sein.
          </p>
        </div>
        <button
          @click="handleClick"
          :disabled="ruleViolation"
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
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useTeamNumberStore } from "../../stores/teamNumber";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const emits = defineEmits(["teamSizeOk", "teamSizeNotOk", "teamSelection"]);
let teamsize = ref("10");
const teamNumStore = useTeamNumberStore();
const ruleViolation = computed(() => {
  if (!/^\d+$/.test(teamsize.value) || teamsize.value.length !== 2) {
    emits("teamSizeNotOk");
    return true;
  } else {
    emits("teamSizeOk");
    return false;
  }
});

const { teamNumber } = storeToRefs(teamNumStore);
const { setNumber } = teamNumStore;

function disabledClasses() {
  if (teamsize.value < 10) {
    return "background-color: #808080";
  }
}
watch(teamsize, ()=>{
  setNumber(teamsize.value);
})
const handleClick = () => {
  setNumber(teamsize.value);
  emits("teamSelection");
  teamsize.value = "";
};
</script>
