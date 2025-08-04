import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function SubmitPage() {
  const [form, setForm] = useState({
    title: "",
    region: "",
    category: "",
    contributor: "",
    tags: "",
    text: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setStatus("success");
      setForm({
        title: "",
        region: "",
        category: "",
        contributor: "",
        tags: "",
        text: "",
      });
    } catch (err) {
      console.error("Error submitting story:", err);
      setStatus("error");
    }
  };

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 bg-yellow-50 min-h-screen text-yellow-900">
        <div className="flex justify-start mb-6">
          {/* ✅ Styled Back Button */}
          <Link
            href="/"
            className="px-4 py-2 rounded bg-yellow-600 text-yellow-100 hover:bg-yellow-700 transition"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-yellow-800">
          📘 Contribute a Story
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block font-semibold mb-1 text-yellow-900"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full border border-yellow-400 bg-yellow-100 px-3 py-2 rounded focus:outline-yellow-500 focus:ring-yellow-400"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            <div>
              <label
                htmlFor="region"
                className="block font-semibold mb-1 text-yellow-900"
              >
                Region
              </label>
              <input
                type="text"
                name="region"
                id="region"
                required
                value={form.region}
                onChange={handleChange}
                className="w-full border border-yellow-400 bg-yellow-100 px-3 py-2 rounded focus:outline-yellow-500 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block font-semibold mb-1 text-yellow-900"
              >
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full border border-yellow-400 bg-yellow-100 px-3 py-2 rounded focus:outline-yellow-500 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block font-semibold mb-1 text-yellow-900"
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border border-yellow-400 bg-yellow-100 px-3 py-2 rounded focus:outline-yellow-500 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="contributor"
              className="block font-semibold mb-1 text-yellow-900"
            >
              Contributor Name (optional)
            </label>
            <input
              type="text"
              name="contributor"
              id="contributor"
              value={form.contributor}
              onChange={handleChange}
              className="w-full border border-yellow-400 bg-yellow-100 px-3 py-2 rounded focus:outline-yellow-500 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="text"
              className="block font-semibold mb-1 text-yellow-900"
            >
              Story Text
            </label>
            <textarea
              name="text"
              id="text"
              required
              rows={8}
              value={form.text}
              onChange={handleChange}
              className="w-full border border-yellow-400 bg-yellow-100 px-3 py-2 rounded resize-y focus:outline-yellow-500 focus:ring-yellow-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="px-6 py-2 rounded bg-yellow-700 text-yellow-100 hover:bg-yellow-800 transition disabled:opacity-50"
          >
            {status === "submitting" ? "Submitting..." : "📤 Submit Story"}
          </button>

          {status === "success" && (
            <p className="text-green-600 mt-2">
              ✅ Story submitted successfully!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 mt-2">
              ❌ Something went wrong. Try again.
            </p>
          )}
        </form>
      </main>
    </>
  );
}
