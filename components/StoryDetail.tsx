import SaveButton from "./SaveButton";
import type { Story } from "../types/models";

export default function StoryDetail({ story }: { story: Story }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">{story.title}</h1>

      <p className="text-sm text-gray-600">
        Region: {story.region} | Category: {story.category}
      </p>

      <p className="text-sm text-gray-600">
        Tags:{" "}
        {story.tags.map((tag) => (
          <span key={tag.name} className="text-blue-600 mr-1">
            #{tag.name}
          </span>
        ))}
      </p>

      <article className="text-gray-800 whitespace-pre-wrap">
        {story.text}
      </article>

      {/* SaveButton expects storyId as string */}
      <SaveButton storyId={String(story.id)} />
    </div>
  );
}
