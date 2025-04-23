"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";  // Importoni React Toastify
import "react-toastify/dist/ReactToastify.css";  // Importoni CSS për Toastify

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBusiness, setIsBusiness] = useState(false);  // Përdoruesi mund të zgjedhë Business apo User
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Funksioni për dërgimin e të dhënave të formularit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const userData = {
      username,
      email,
      password,
      isBusiness,  // Dërgojmë vetëm një vlerë të thjeshtë për të treguar nëse është Business apo User
    };

    try {
      // Thirrja e API për regjistrim
      const response = await axios.post("/api/ApplicationUser/create", userData);

      // Kontrollo nëse regjistrimi ka qenë i suksesshëm
      if (response.status === 200 && response.data.success) {
        // Tregoni një popup për sukses
        toast.success("Regjistrimi ishte i suksesshëm! Të lutem logohu.");
        
        // Pritni disa sekonda dhe pastaj drejto te login
        setTimeout(() => {
          router.push("page/login");
        }, 3000);  // Pas 3 sekondash do të drejtoni përdoruesin në login
      } else if (response.status === 200 && !response.data.success) {
        // Nëse ka një mesazh gabimi nga backend (p.sh. përdoruesi ekziston)
        toast.error(response.data.message); // Tregon mesazhin e gabimit
      }
    } catch (err) {
      // Gabimi në rastin e kërkesës API
      toast.error("Ka ndodhur një gabim gjatë regjistrimit. Provoni përsëri.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="username" style={{ display: "block" }}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: "8px", width: "100%", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ display: "block" }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "8px", width: "100%", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password" style={{ display: "block" }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "8px", width: "100%", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Zgjidh Llojin e Llogarisë</label>
          <div style={{ marginTop: "5px" }}>
            <label>
              <input
                type="radio"
                value="business"
                checked={isBusiness}
                onChange={() => setIsBusiness(true)}
              />
              Business
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input
                type="radio"
                value="user"
                checked={!isBusiness}
                onChange={() => setIsBusiness(false)}
              />
              User
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Regjistrohem..." : "Sign Up"}
        </button>
      </form>

      {/* Këtu vendosni komponentin e ToastContainer */}
      <ToastContainer />
    </main>
  );
}
