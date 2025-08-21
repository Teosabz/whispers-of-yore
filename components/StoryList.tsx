import StoryCard, { Story } from "./StoryCard";

type StoryListProps = {
  stories: Story[];
  favs: number[]; // IDs of favorited stories
  toggleFav: (id: number) => void;
  getRegionName: (region?: string) => string;
  getCategoryName: (category?: string) => string;
};

export default function StoryList({
  stories,
  favs,
  toggleFav,
  getRegionName,
  getCategoryName,
}: StoryListProps) {
  if (stories.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No stories found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {stories.map((story) => {
        const fav = favs.includes(story.id);
        return (
          <StoryCard
            key={story.id}
            story={story}
            fav={fav}
            toggleFav={toggleFav}
            getRegionName={getRegionName}
            getCategoryName={getCategoryName}
          />
        );
      })}
    </div>
  );
}
