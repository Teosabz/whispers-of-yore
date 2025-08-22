"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user?.email_confirmed_at === null) {
          setMessage("Please confirm your email before logging in.");
        } else {
          router.push("/favorites");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        });
        if (error) throw error;
        setMessage(
          "Check your email to confirm your account before logging in."
        );
        setMode("login");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Password strength color
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  // Password hints
  const getHints = () => {
    const hints = [];
    if (password.length < 6) hints.push("At least 6 characters");
    if (!/[A-Z]/.test(password)) hints.push("Add an uppercase letter");
    if (!/[0-9]/.test(password)) hints.push("Add a number");
    if (!/[^A-Za-z0-9]/.test(password)) hints.push("Add a special character");
    return hints;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-8">
      <form className="bg-white p-6 sm:p-8 rounded shadow-md w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        {message && (
          <p className="text-red-500 text-sm mb-4 text-center">{message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border mb-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border mb-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Password Strength Meter */}
        {mode === "signup" && (
          <>
            <div className="h-2 w-full bg-gray-200 rounded mb-1">
              <div
                className={`h-2 rounded ${getStrengthColor()}`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              ></div>
            </div>
            <ul className="text-xs text-gray-600 mb-3 list-disc pl-5">
              {getHints().map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          </>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-700 text-white p-3 rounded mb-3 hover:bg-purple-800 transition"
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
          className="w-full bg-gray-200 text-gray-800 p-3 rounded mb-3 hover:bg-gray-300 transition"
        >
          {mode === "login" ? "Create a new account" : "Back to login"}
        </button>

        {/* Back Home Button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full bg-gray-300 text-gray-900 p-3 rounded hover:bg-gray-400 transition"
        >
          ← Back Home
        </button>
      </form>
    </div>
  );
}
