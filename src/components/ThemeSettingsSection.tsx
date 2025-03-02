
import { useTheme } from "../hooks/useTheme";
import { Moon, Sun, Check } from "lucide-react";

const ThemeSettingsSection = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "light",
      name: "Light Mode",
      description: "Clean, bright interface with a white background",
      icon: <Sun className="h-6 w-6" />,
    },
    {
      id: "dark",
      name: "Dark Mode",
      description: "Easier on the eyes in low-light environments",
      icon: <Moon className="h-6 w-6" />,
    },
    {
      id: "green-light",
      name: "Green Light",
      description: "Light theme with green accents for a refreshing look",
      icon: <Sun className="h-6 w-6 text-green-600" />,
    },
    {
      id: "green-dark",
      name: "Green Dark",
      description: "Dark theme with green accents for a refreshing look",
      icon: <Moon className="h-6 w-6 text-green-400" />,
    },
  ];

  return (
    <div className="glass rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
      <p className="text-muted-foreground mb-6">
        Choose a theme that suits your style and makes studying more enjoyable
      </p>

      <div className="space-y-4">
        {themes.map((themeOption) => (
          <div
            key={themeOption.id}
            className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
              theme === themeOption.id
                ? "bg-primary/10 border border-primary/50"
                : "hover:bg-secondary"
            }`}
            onClick={() => setTheme(themeOption.id as any)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${theme === themeOption.id ? "bg-primary/20" : "bg-secondary"}`}>
                {themeOption.icon}
              </div>
              <div>
                <h3 className="font-medium">{themeOption.name}</h3>
                <p className="text-sm text-muted-foreground">{themeOption.description}</p>
              </div>
            </div>
            {theme === themeOption.id && (
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSettingsSection;
