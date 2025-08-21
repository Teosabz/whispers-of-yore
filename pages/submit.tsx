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
    <div className="min-h-screen bg-purple-50 p-6">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold text-purple-900 mb-6">
        Submit a Story
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded shadow-md"
      >
        {/* Form fields */}
        <label className="block mb-4">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          Text
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
            rows={6}
          />
        </label>

        <label className="block mb-4">
          Region / Country
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          Category (myth, folktale, legend)
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          Author
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          Cover Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full mt-1"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
        >
          {loading ? "Submitting..." : "Submit Story"}
        </button>
      </form>
    </div>
  );
}
