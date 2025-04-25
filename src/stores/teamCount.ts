import { defineStore } from "pinia";
import { ref } from "vue";

export const useTeamCountStore = defineStore("teamCount", () => {
  // Default to 2 teams
  const teamCount = ref(2);
  
  function setTeamCount(count: number) {
    teamCount.value = count;
  }

  return { teamCount, setTeamCount };
});