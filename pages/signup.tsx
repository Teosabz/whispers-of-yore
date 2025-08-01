import { useState } from "react";
import Header from "../components/Header";

export default function ContributorSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      setMessage("Please enter your name and email.");
      setError(true);
      return;
    }

    setSubmitting(true);
    setError(false);
    setMessage("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Thank you! You’ve been added as a contributor.");
        setName("");
        setEmail("");
        setError(false);
      } else {
        setMessage(data.error || "Signup failed.");
        setError(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Something went wrong.");
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Contributor Signup</h1>
        <p className="mb-6 text-gray-600">
          Want to share a tale from your region or family lineage? Become a
          contributor below.
        </p>

        <form onSubmit={submitForm} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white transition ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              error ? "text-red-600" : "text-green-700"
            }`}
            aria-live="polite"
          >
            {message}
          </p>
        )}
      </main>
    </>
  );
}
