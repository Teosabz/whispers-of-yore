"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function SubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImageUrl: string | null = null;

      if (coverImage) {
        const { data, error: uploadError } = await supabase.storage
          .from("story-covers")
          .upload(`covers/${Date.now()}-${coverImage.name}`, coverImage);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("story-covers")
          .getPublicUrl(data.path);

        coverImageUrl = urlData?.publicUrl || null;
      }

      const { error: insertError } = await supabase.from("stories").insert({
        title,
        text,
        region,
        category,
        author,
        cover_image: coverImageUrl,
      });

      if (insertError) throw insertError;

      alert("Story submitted successfully!");
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Error submitting story:", message);
      alert("Error submitting story: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Home Button */}
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition w-full sm:w-auto"
        >
          ← Back to Home
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900 mb-6 text-center sm:text-left">
        Submit a Story
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded shadow-md flex flex-col gap-4"
      >
        <label className="flex flex-col">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="flex flex-col">
          Text
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={6}
          />
        </label>

        <label className="flex flex-col">
          Region / Country
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="flex flex-col">
          Category (myth, folktale, legend)
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="flex flex-col">
          Author
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="flex flex-col">
          Cover Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-3 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
        >
          {loading ? "Submitting..." : "Submit Story"}
        </button>
      </form>
    </div>
  );
}
