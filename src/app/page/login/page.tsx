"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/services/axiosClient";

// Definimi i tipit të përgjigjes së login-it
interface LoginResponse {
  success: boolean;
  result: {
    accessToken: string;
    roleName: string;
  };
  message?: string;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log("Attempting login with:", { email });
      
      // Make login request
      const response = await axiosClient.post<LoginResponse>("/Login/login", { email, password });
      console.log("Login response:", response.status);

      if (response.data && response.data.success) {
        // Store tokens and user info
        const accessToken = response.data.result.accessToken;
        const roleName = response.data.result.roleName;
  
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("roleName", roleName);
  
        console.log("Login successful, redirecting based on role:", roleName);
        
        // Redirect based on role
        if (roleName === "BussinesAdmin") {
          router.push("/page/dashboard"); 
        } else if (roleName === "User") {
          router.push("/page/user-dashboard");
        } else {
          router.push("/page/dashboard");  // default fallback
        }
      } else {
        // Handle unsuccessful login with valid response
        setError(response.data?.message || "Login failed - invalid credentials");
      }
    } catch (err: any) {
      // Handle request errors
      console.error("Login error:", err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        
        if (err.response.status === 500) {
          setError("Server error - please try again later or contact support");
        } else if (err.response.status === 401) {
          setError("Invalid credentials");
        } else {
          setError(err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("No response from server - please check your connection");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Request failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red", marginBottom: 15 }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button 
        onClick={handleLogin} 
        style={{ width: "100%", padding: 10 }}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
