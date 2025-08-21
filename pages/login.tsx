// pages/login.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation"; // use next/navigation for App Router

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.push("/favorites");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) throw error;

        setMessage(
          "Check your email to confirm your account before logging in."
        );
        setMode("login");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        {message && <p className="text-red-500 text-sm mb-2">{message}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-700 text-white p-2 rounded mb-2"
          disabled={loading}
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage(null);
          }}
          className="w-full bg-gray-200 text-gray-800 p-2 rounded mb-2"
        >
          {mode === "login" ? "Create a new account" : "Back to login"}
        </button>

        {/* Back Home Button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full bg-gray-300 text-gray-900 p-2 rounded mt-2"
        >
          Back Home
        </button>
      </form>
    </div>
  );
}
