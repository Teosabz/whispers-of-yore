import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import StoryCard from "../../components/StoryCard";
import type { Author, Story } from "../../types/models";

export default function AuthorProfile() {
  const router = useRouter();
  const { id } = router.query;

  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data: Author) => {
        setAuthor(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {loading ? (
          <p className="text-gray-600">Loading contributor profile...</p>
        ) : author ? (
          <>
            <h1 className="text-3xl font-bold">{author.name}</h1>
            <p className="text-gray-500 mb-4">Contributor ID: {author.id}</p>
            {author.email && (
              <p className="text-gray-600 mb-6">
                <strong>Email:</strong> {author.email}
              </p>
            )}

            <h2 className="text-2xl font-semibold mb-4">Submitted Stories</h2>
            {author.contributions.length > 0 ? (
              <div className="space-y-6">
                {author.contributions.map((story: Story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                This contributor has not submitted any stories yet.
              </p>
            )}
          </>
        ) : (
          <p className="text-red-600 text-center">Contributor not found.</p>
        )}
      </main>
    </>
  );
}
