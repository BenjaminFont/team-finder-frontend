<template>
  <div
    v-if="props.player"
    :class="ratingColorClass"
    class="mx-auto w-full sm:w-72 bg-white shadow-md rounded-lg overflow-hidden border-l-4 cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:translate-y-[-2px]"
    @click="handleClick"
  >
    <div class="flex p-3">
      <!-- Player Avatar -->
      <div class="relative">
        <div
          class="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0"
        >
          <img
            :src="
              props.player?.imgSrc ||
              '/user.png'
            "
            :alt="props.player?.name || 'Player'"
            class="h-full w-full object-cover"
          />
        </div>
        <!-- Rating Badge -->
        <div
          class="absolute -bottom-1 -right-1 bg-soccer-green text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md"
        >
          {{ props.player?.rating || "-" }}
        </div>
      </div>

      <!-- Player Info -->
      <div class="ml-3 flex-1">
        <div class="flex flex-col">
          <!-- Player Name -->
          <h3 class="text-base font-bold text-gray-800 mb-1 line-clamp-1">
            {{ props.player?.name || "Unbenannt" }}
          </h3>

          <!-- Top Skills -->
          <div v-if="playerHasSkills" class="flex flex-wrap gap-1">
            <div
              v-for="skill in topSkills"
              :key="skill.skill"
              class="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium"
              :class="getSkillBadgeClass(skill.rating)"
            >
              {{ getSkillShortName(skill.skill) }}: {{ skill.rating }}
            </div>
          </div>
          <div v-else class="text-xs text-gray-500 italic">
            Keine Fähigkeiten verfügbar
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {Player, Skill} from "@/types";

const props = defineProps<{
  player: Player;
}>();
const emits = defineEmits(["click"]);

// Component state
const showSkillDetails = ref(false);

// Check if player has valid skills array
const playerHasSkills = computed(() => {
  return (
    props.player?.skills &&
    Array.isArray(props.player.skills) &&
    props.player.skills.length > 0
  );
});

// Get top 3 skills based on rating
const topSkills = computed(() => {
  if (!playerHasSkills.value || !props.player?.skills) return [];

  try {
    // Make a safe copy, sort by rating (highest first) and take top 3
    return [...props.player.skills]
      .filter((skill) => skill && typeof skill === "object") // Filter out any invalid skills
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  } catch (error) {
    console.error("Error processing skills:", error);
    return [];
  }
});

// Get color class based on player rating
const ratingColorClass = computed(() => {
  if (!props.player?.rating) return "border-gray-300";

  const rating = props.player.rating;
  if (rating >= 90) return "border-amber-300";
  if (rating >= 80) return "border-emerald-300";
  if (rating >= 70) return "border-zinc-300";
  if (rating >= 60) return "border-gray-300";
  return "border-gray-500";
});

// Get short name for skills to save space
function getSkillShortName(skillName?: string): string {
  if (!skillName) return "---";

  const shortNames: Record<string, string> = {
    Schnelligkeit: "SCH",
    Dribbling: "DRI",
    Ausdauer: "AUS",
    Schuss: "SCH",
    Zweikampf: "ZWE",
  };

  // Check if we have a predefined short name
  if (shortNames[skillName]) {
    return shortNames[skillName];
  }

  // Otherwise, safely create an abbreviation
  try {
    return skillName.length > 3
      ? skillName.substring(0, 3).toUpperCase()
      : skillName.toUpperCase();
  } catch (error) {
    console.error("Error shortening skill name:", error);
    return "---";
  }
}

// Get badge color class based on skill rating
function getSkillBadgeClass(rating?: number): string {
  if (rating === undefined || rating === null)
    return "bg-gray-100 text-gray-800";

  if (rating >= 90) return "bg-yellow-100 text-yellow-800";
  if (rating >= 80) return "bg-green-100 text-green-800";
  if (rating >= 70) return "bg-blue-100 text-blue-800";
  if (rating >= 60) return "bg-purple-100 text-purple-800";
  return "bg-gray-100 text-gray-800";
}

// Get text color class for skill rating
function getSkillTextClass(rating?: number): string {
  if (rating === undefined || rating === null) return "text-gray-600";

  if (rating >= 90) return "text-yellow-600";
  if (rating >= 80) return "text-green-600";
  if (rating >= 70) return "text-blue-600";
  if (rating >= 60) return "text-purple-600";
  return "text-gray-600";
}

function handleClick() {
  // Emit the click event along with the player object
  emits("click", props.player);
}
</script>

<style scoped>
/* Optional: Smooth transitions for interactive elements */
.border-l-4 {
  transition: border-color 0.2s ease-in-out;
}

/* Fix Tailwind line-clamp if not working */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
