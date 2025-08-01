import { useFavorites } from "../context/FavoritesContext";

export default function FavoriteButton({ storyId }: { storyId: number }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorited = isFavorite(storyId);

  return (
    <button
      onClick={() => toggleFavorite(storyId)}
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 ${
        favorited
          ? "bg-pink-600 text-white hover:bg-pink-700"
          : "bg-pink-100 text-pink-700 hover:bg-pink-200"
      } mt-2`}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      {favorited ? "💖 Unfavorite" : "🤍 Add to Favorites"}
    </button>
  );
}
