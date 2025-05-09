"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBusiness, setIsBusiness] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form submission function
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const userData = {
      username,
      email,
      password,
      isBusiness,
    };

    try {
      // API call for registration
      const response = await axios.post("/api/ApplicationUser/create", userData);

      // Check if registration was successful
      if (response.status === 200 && response.data.success) {
        // Show success popup
        toast.success("Registration successful! Please login.");
        
        // Wait a few seconds and then redirect to login
        setTimeout(() => {
          router.push("/page/login");
        }, 3000);
      } else if (response.status === 200 && !response.data.success) {
        // If there's an error message from backend (e.g. user exists)
        toast.error(response.data.message);
      }
    } catch (err) {
      // API request error
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
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
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link href="/page/login" className="font-medium text-primary hover:text-primary-dark">
                sign in to your account
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Type
                </label>
                <div className="mt-2 flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id="business"
                      name="account-type"
                      type="radio"
                      checked={isBusiness}
                      onChange={() => setIsBusiness(true)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700"
                    />
                    <label htmlFor="business" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Business
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="user"
                      name="account-type"
                      type="radio"
                      checked={!isBusiness}
                      onChange={() => setIsBusiness(false)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700"
                    />
                    <label htmlFor="user" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      User
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing up..." : "Sign up"}
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
      
      {/* ToastContainer for notifications */}
      <ToastContainer theme="colored" position="top-right" />
    </div>
  );
} 