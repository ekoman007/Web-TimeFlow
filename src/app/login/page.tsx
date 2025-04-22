"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/services/axiosClient";

// Definimi i tipit të përgjigjes së login-it
interface LoginResponse {
  success: boolean;
  result: {
    accessToken: string;
    role: "Business" | "User" | "Partner";  // mund të shtosh rolet tjera
  };
  message?: string;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axiosClient.post("/Login/login", { email, password });
  debugger
      if (response.status === 200 && response.data.success) {
        // Ruaj accessToken dhe roleName në localStorage
        const accessToken = response.data.result.accessToken;
        const roleName = response.data.result.roleName;
  
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("roleName", roleName);
  
        // Drejto në dashboard sipas rolit
        if (roleName === "BussinesAdmin") {
          router.push("/business-dashboard");
        } else if (roleName === "User") {
          router.push("/user-dashboard");
        } else {
          router.push("/dashboard");  // default fallback
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };
  

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button onClick={handleLogin} style={{ width: "100%", padding: 10 }}>
        Login
      </button>
    </div>
  );
}
