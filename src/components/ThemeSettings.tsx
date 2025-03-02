
import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Check, Moon, Sun, Palette } from "lucide-react";

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { id: "light", name: "Light", icon: <Sun className="h-4 w-4" /> },
    { id: "dark", name: "Dark", icon: <Moon className="h-4 w-4" /> },
    { id: "green-light", name: "Green Light", icon: <Palette className="h-4 w-4 text-green-600" /> },
    { id: "green-dark", name: "Green Dark", icon: <Palette className="h-4 w-4 text-green-400" /> },
  ];

  return (
    <div className="glass rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Appearance</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {themeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setTheme(option.id as any)}
            className={`relative aspect-square overflow-hidden rounded-lg flex flex-col items-center justify-center border-2 ${
              theme === option.id
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground/30"
            }`}
          >
            <div className={`absolute inset-0 ${option.id} opacity-80`} />
            <div className="relative z-10 flex flex-col items-center gap-1">
              {option.icon}
              <span className="text-xs font-medium">{option.name}</span>
            </div>
            {theme === option.id && (
              <div className="absolute top-2 right-2 rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSettings;
