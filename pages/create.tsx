import { useState } from "react";
import Header from "../components/Header";

export default function Create() {
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    region: "",
    category: "",
    language: "",
    sourceUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const res = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (res.ok) {
      setMessage("Story submitted successfully!");
      setFormData({
        title: "",
        text: "",
        region: "",
        category: "",
        language: "",
        sourceUrl: "",
      });
    } else {
      setMessage(result.error || "Failed to submit story.");
    }

    setSubmitting(false);
  };

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Share Your Story</h1>
        {message && (
          <p className="mb-4 text-center text-sm text-gray-700">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
          <textarea
            name="text"
            placeholder="Your story..."
            value={formData.text}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 h-40 resize-none"
          />
          <input
            type="text"
            name="region"
            placeholder="Region (e.g. West Africa)"
            value={formData.region}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Myth, Fable)"
            value={formData.category}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="language"
            placeholder="Language (e.g. Shona)"
            value={formData.language}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="url"
            name="sourceUrl"
            placeholder="Source URL (optional)"
            value={formData.sourceUrl}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {submitting ? "Submitting..." : "Submit Story"}
          </button>
        </form>
      </main>
    </>
  );
}
