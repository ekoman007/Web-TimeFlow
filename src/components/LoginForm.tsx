import { useState } from "react";
import { login } from "@/api/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await login({ email, password });
    console.log(response.data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-64">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded p-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded p-2"
        required
      />
      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        Login
      </button>
    </form>
  );
}