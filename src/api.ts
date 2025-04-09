import axios from "axios";

// Create an axios instance with base URL and common headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //"https://team-finder-backend-3ffr.onrender.com/api", // "http://localhost:9000/api", //Match your Spring Boot API base URL
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

  // Upload player profile image to S3
  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    // Create a custom instance for this request to avoid Content-Type: application/json
    const response = await axios.post(
      `${api.defaults.baseURL}/players/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    console.log(response.data.imageUrl);

    return response.data.imageUrl;
  },
};

// Team API endpoints
export const teamApi = {
  // Shuffle and create balanced teams from selected players
  shuffleTeams: async (
    players: Player[]
  ): Promise<{ team1: Player[]; team2: Player[] }> => {
    const response = await api.post("/teams/shuffle", players);
    return response.data;
  },
};

export default api;
