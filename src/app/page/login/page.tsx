"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/services/axiosClient";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { UserRole } from "@/types";

// Type definition for login response
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

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (token) {
      router.push("/page/dashboard");
    }
  }, [router]);

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
  
        // Create a user object based on the login response
        const user = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          email: email,
          firstName: 'User',
          lastName: 'Account',
          role: roleName === 'BussinesAdmin' ? UserRole.Admin : UserRole.Customer,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        
        // Store auth data in both formats for compatibility
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("roleName", roleName);
  
        console.log("Login successful, manually redirecting to dashboard");
        
        // Force redirect to dashboard with window.location instead of router
        window.location.href = "/page/dashboard";
        return;
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-primary">
            TimeFlow
          </Link>
          <ThemeToggle />
        </div>
      </header>
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link href="/page/signup" className="font-medium text-primary hover:text-primary-dark">
                create a new account
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} TimeFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
