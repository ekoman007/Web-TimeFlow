"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
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
        Login
      </button>
    </main>
  );
}
