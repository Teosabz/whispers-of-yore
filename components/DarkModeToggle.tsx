import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, check if dark mode is enabled in localStorage or OS preference
    const darkPreference =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(darkPreference);
    updateHtmlClass(darkPreference);
  }, []);

  function updateHtmlClass(enableDark: boolean) {
    const html = window.document.documentElement;
    if (enableDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  function toggleDarkMode() {
    const newDark = !isDark;
    setIsDark(newDark);
    updateHtmlClass(newDark);
  }

  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle Dark Mode"
      className="px-3 py-1 rounded bg-yellow-300 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-200 hover:bg-yellow-400 dark:hover:bg-yellow-600 transition"
    >
      {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
