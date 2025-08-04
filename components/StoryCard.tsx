import Image from "next/image";
import Link from "next/link";
import SaveButton from "./SaveButton";
import type { Story } from "../types/models";

type StoryCardProps = {
  story: Story;
  showActions?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
};

// Helper to format snake_case or lowercase into Capitalized Words
function formatLabel(label: string): string {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function StoryCard({
  story,
  showActions = false,
  onApprove,
  onReject,
}: StoryCardProps) {
  return (
    <li className="rounded-2xl border border-yellow-300 bg-white shadow-sm hover:shadow-lg transition overflow-hidden">
      <Link href={`/story/${story.slug || story.id}`} className="block">
        {/* Image Section */}
        <div className="relative w-full h-48 bg-yellow-50">
          <Image
            src={story.cover_image || "/images/placeholder.jpg"}
            alt={story.title}
            fill
            className="rounded-t-2xl object-cover"
            priority
            unoptimized // remove if using external loader config
          />
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2">
          <h2 className="font-bold text-yellow-900 text-lg hover:text-yellow-700 transition">
            {story.title}
          </h2>
          <p className="text-sm text-yellow-800 leading-snug">
            {story.text.slice(0, 100)}...
          </p>
          <p className="text-xs text-yellow-700">
            🌍 {story.region ? formatLabel(story.region) : "Unknown"} • 🏷{" "}
            {story.category ? formatLabel(story.category) : "Uncategorized"}
          </p>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {story.tags.map((tag) => (
                <Link key={tag.name} href={`/tags/${tag.name}`}>
                  <span className="text-xs bg-yellow-200 rounded-full px-2 py-0.5 text-yellow-800 hover:bg-yellow-300 transition">
                    #{tag.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="px-4 pb-4 space-y-2">
        {/* Save Button */}
        {!showActions && <SaveButton storyId={String(story.id)} />}

        {/* Admin Actions */}
        {showActions && (
          <div className="flex justify-between items-center space-x-2">
            <button
              onClick={() => onApprove?.(story.id)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => onReject?.(story.id)}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
