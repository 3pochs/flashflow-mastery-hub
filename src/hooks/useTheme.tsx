
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "green-light" | "green-dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "light";
  });

  const isDarkMode = theme === "dark" || theme === "green-dark";

  useEffect(() => {
    // Update localStorage
    localStorage.setItem("theme", theme);

    // Update document classes
    const root = document.documentElement;
    root.classList.remove("light", "dark", "green-light", "green-dark");
    root.classList.add(theme);

    // Update specific colors for green themes
    if (theme === "green-light" || theme === "green-dark") {
      root.style.setProperty("--primary", theme === "green-light" ? "142 76% 36%" : "143 55% 62%");
      root.style.setProperty("--primary-foreground", theme === "green-light" ? "0 0% 100%" : "0 0% 0%");
      root.style.setProperty("--accent", theme === "green-light" ? "142 71% 45%" : "143 50% 72%");
    } else {
      // Reset to default theme colors
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--accent");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
