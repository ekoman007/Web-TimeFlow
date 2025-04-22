// services/refreshToken.js
import axiosClient from "@/services/axiosClient";

// Funksioni për rinovimin e accessToken
export const refreshAccessToken = async () => {
  try {
    const response = await axiosClient.post("/refresh-token");

    if (response.status === 200 && response.data.success) {
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken); // Ruaj token të rinovuar në localStorage
      return accessToken;
    } else {
      // Nëse nuk mund të rinovohet tokeni, drejto në login
      window.location.href = "/login";
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    window.location.href = "/login"; // Nëse ndodh gabim, drejto në login
    return null;
  }
};
