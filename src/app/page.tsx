"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("page/login");
  };

  const goToSingUp = () => {
    router.push("page/singup");
  };

  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to TimeFlow Web!</h1>
      <button
        onClick={goToLogin}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Loginsw
      </button>
      <button
        onClick={goToSingUp}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sing Up
      </button>
    </main>
  );
}
