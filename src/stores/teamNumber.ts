import { defineStore } from "pinia";
import { ref } from "vue";

export const useTeamNumberStore = defineStore("teamNumber", () => {
  const teamNumber = ref(0);
  function setNumber(number: number) {
    teamNumber.value = number;
  }

  return { teamNumber, setNumber };
});
