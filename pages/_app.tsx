// pages/_app.tsx
import type { AppProps } from "next/app";
import "leaflet/dist/leaflet.css"; // ✅ Leaflet styles
import "../styles/globals.css"; // ✅ Your own styles (if any)
import { FavoritesProvider } from "../context/FavoritesContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FavoritesProvider>
      <Component {...pageProps} />
    </FavoritesProvider>
  );
}
