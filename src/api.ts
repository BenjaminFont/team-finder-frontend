import axios from "axios";

// Create an axios instance with base URL and common headers
const api = axios.create({
  baseURL: "http://localhost:9000/api", // Match your Spring Boot API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Types based on backend models
export interface Skill {
  skill: string;
  rating: number;
}

export interface Player {
  id?: number;
  name: string;
  rating: number; // overall rating
  skills: Skill[]; // individual skills (renamed from items)
  handynummer: string;
  imgSrc?: string;
}

// Player API endpoints
export const playerApi = {
  // Get all players
  getAllPlayers: async (): Promise<Player[]> => {
    const response = await api.get("/players");
    return response.data;
  },

  // Get player by ID
  getPlayerById: async (id: number): Promise<Player> => {
    const response = await api.get(`/players/${id}`);
    return response.data;
  },

  // Create new player
  createPlayer: async (player: Player): Promise<Player> => {
    const response = await api.post("/players", player);
    return response.data;
  },

  // Update player
  updatePlayer: async (id: number, player: Player): Promise<Player> => {
    const response = await api.put(`/players/${id}`, player);
    return response.data;
  },

  // Delete player
  deletePlayer: async (id: number): Promise<void> => {
    await api.delete(`/players/${id}`);
  },
};

// Team API endpoints
export const teamApi = {
  // Shuffle and create balanced teams from selected players
  shuffleTeams: async (
    players: Player[]
  ): Promise<{ team1: Player[]; team2: Player[] }> => {
    const response = await api.post("/teams/shuffle", players);
    console.log(JSON.stringify(response.data) + "SHUFFLE!!!!!!!!");
    return response.data;
  },
};

export default api;
