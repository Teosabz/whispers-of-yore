import "leaflet/dist/leaflet.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";

// Example magical font for headings
import { MedievalSharp } from "next/font/google";

const headingFont = MedievalSharp({ subsets: ["latin"], weight: "400" });

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} headingFont={headingFont} />;
}
