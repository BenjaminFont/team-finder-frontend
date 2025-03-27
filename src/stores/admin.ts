import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api";

interface AuthResponse {
  token: string;
  username: string;
  role: string;
  success: boolean;
  message: string;
}

export const useAdminStore = defineStore("admin", () => {
  // Admin login state
  const isLoggedIn = ref(false);
  const userRole = ref<string | null>(null);
  const username = ref<string | null>(null);
  const token = ref<string | null>(null);
  const loginError = ref<string | null>(null);
  const isLoading = ref(false);

  // Check if there's a stored login state
  const initializeState = () => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("userRole");
    const storedUsername = localStorage.getItem("username");
    
    if (storedToken && storedRole) {
      token.value = storedToken;
      userRole.value = storedRole;
      username.value = storedUsername;
      isLoggedIn.value = true;
      
      // Set authorization header for all future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  };

  // Login function
  const login = async (usernameValue: string, password: string): Promise<boolean> => {
    isLoading.value = true;
    loginError.value = null;
    
    try {
      const response = await api.post<AuthResponse>("/auth/login", { 
        username: usernameValue, 
        password 
      });
      
      const result = response.data;
      
      if (result.success) {
        // Store the JWT token and user info
        token.value = result.token;
        userRole.value = result.role;
        username.value = result.username;
        isLoggedIn.value = true;
        
        // Store in localStorage for persistence
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userRole", result.role);
        localStorage.setItem("username", result.username);
        
        // Set authorization header for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;
        
        return true;
      } else {
        loginError.value = result.message || "Login failed";
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      loginError.value = "Server error. Please try again.";
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear state
    isLoggedIn.value = false;
    userRole.value = null;
    username.value = null;
    token.value = null;
    
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    
    // Remove authorization header
    delete api.defaults.headers.common["Authorization"];
  };

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    return userRole.value === role;
  };

  // Initialize state on store creation
  initializeState();

  return {
    isLoggedIn,
    userRole,
    username,
    loginError,
    isLoading,
    login,
    logout,
    hasRole
  };
});