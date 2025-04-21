// api/auth.ts
import axiosClient from "@/services/axiosClient";

export const login = async (credentials: { email: string; password: string }) => {
  try {
    // POST to /api/Login/login (proxied via Next.js rewrite)
    const response = await axiosClient.post("/Login/login", credentials);

    if (response.status === 200 && response.data.success) {
      const { accessToken } = response.data.result;
debugger
      // Ruaj vetëm accessToken në localStorage
      localStorage.setItem("accessToken", accessToken);

      // refreshToken do të vijë në HttpOnly cookie, nuk e vendosim në JS
      return response;
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  } catch (error) {
    // Më tej e trajto në caller
    throw error;
  }
  //TEst
};
