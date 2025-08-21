import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export type Story = {
  id: number;
  title: string;
  text: string;
  region?: string;
  category?: string;
  cover_image?: string | null;
  slug?: string;
  author?: string;
};

type StoryCardProps = {
  story: Story;
  fav: boolean;
  toggleFav: (id: number) => void;
  getRegionName: (region?: string) => string;
  getCategoryName: (category?: string) => string;
};

export default function StoryCard({
  story,
  fav,
  toggleFav,
  getRegionName,
  getCategoryName,
}: StoryCardProps) {
  const totalFallbackImages = 448;
  const fallbackIndex = (story.id % totalFallbackImages) + 1;
  const fallbackImage = `/images/fallback/pics (${fallbackIndex}).jpeg`;
  const imageSrc = story.cover_image || fallbackImage;

  const handleFavClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to favorite stories.");
      return;
    }
    toggleFav(story.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Image
        src={imageSrc}
        alt={story.title}
        className="w-full h-48 object-cover"
        width={400}
        height={300}
      />

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-purple-900">
          <Link href={`/story/${story.id}`}>{story.title}</Link>
        </h3>

        {story.author && (
          <p className="text-sm text-gray-600 mb-2">By {story.author}</p>
        )}

        <p className="text-gray-700 line-clamp-3 mb-3">{story.text}</p>

        <div className="flex gap-2 flex-wrap mb-3 text-xs">
          {story.region && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {getRegionName(story.region)}
            </span>
          )}
          {story.category && (
            <span className="border border-purple-300 px-2 py-1 rounded">
              {getCategoryName(story.category)}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFavClick}
            className={`px-3 py-1 rounded ${
              fav ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {fav ? "♥ Favorited" : "♡ Favorite"}
          </button>

          <Link
            href={`/story/${story.id}`}
            className="px-3 py-1 rounded bg-purple-700 text-white hover:bg-purple-800 transition"
          >
            Read
          </Link>
        </div>
      </div>
    </div>
  );
}
