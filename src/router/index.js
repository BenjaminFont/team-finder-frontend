import PlayerProfilesOverviewVue from "@/components/PlayerProfilesOverview/PlayerProfilesOverview.vue";
import AddPlayer from "@/components/AddPlayer/AddPlayer.vue";
import TeamCreation from "../components/TeamCreation/TeamCreation.vue";
import TeamQuestion from "@/components/TeamQuestion/TeamQuestion.vue";
import TeamSelection from "@/components/TeamSelection/TeamSelection.vue";
import TeamOverview from "@/components/TeamsOverview/TeamsOverview.vue";

import { createRouter, createWebHistory } from "vue-router";
import { useAdminStore } from "../stores/admin";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/playerProfiles",
      name: "PlayerProfiles",
      component: PlayerProfilesOverviewVue,
    },
    {
      path: "/addPlayer",
      name: "AddPlayer",
      component: AddPlayer,
      meta: { requiresAdmin: true }
    },
    {
      path: "/teamCreation",
      name: "TeamCreation",
      component: TeamCreation,
    },
    { path: "/teamSelection", name: "TeamSelection", component: TeamSelection },
    {
      path: "/teamOverview",
      name: "TeamOverview",
      component: TeamOverview,
    },
    {
      path: "/teamQuestion",
      name: "TeamQuestion",
      component: TeamQuestion,
    },
    {
      path: "/",
      redirect: "/playerProfiles"
    }
  ],
});

// Navigation guard for admin-only routes
router.beforeEach((to, from, next) => {
  // Check if the route requires admin access
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    const adminStore = useAdminStore();
    
    // If not logged in or not an admin, redirect to the player profiles page
    if (!adminStore.isLoggedIn || !adminStore.hasRole('SYSTEM_ADMIN')) {
      next({ path: '/playerProfiles' });
    } else {
      next(); // Admin is logged in, proceed
    }
  } else {
    next(); // Not a protected route, proceed
  }
});

export default router;