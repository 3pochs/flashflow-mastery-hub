
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { Settings, Moon, Sun, ArrowLeft, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const SettingsPage = () => {
  const { theme, setTheme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [showHints, setShowHints] = useState(true);
  
  const handleThemeChange = (newTheme: "light" | "dark" | "green-light" | "green-dark") => {
    setTheme(newTheme);
    toast.success(`Theme updated to ${newTheme.replace("-", " ")}`);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={handleGoBack}
              className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings size={24} /> Settings
            </h1>
          </div>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-6">
              <div className="glass p-6 rounded-lg card-shadow">
                <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
                <Separator className="my-4" />
                
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">Color Theme</h3>
                  <RadioGroup 
                    defaultValue={theme} 
                    onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "green-light" | "green-dark")}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className={`flex items-center space-x-2 p-4 rounded-lg border ${theme === "light" ? "border-primary" : "border-border"}`}>
                      <RadioGroupItem value="light" id="light" />
                      <div className="flex items-center justify-between w-full">
                        <Label htmlFor="light" className="cursor-pointer">Light</Label>
                        <Sun className="text-yellow-500" size={18} />
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 p-4 rounded-lg border ${theme === "dark" ? "border-primary" : "border-border"}`}>
                      <RadioGroupItem value="dark" id="dark" />
                      <div className="flex items-center justify-between w-full">
                        <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
                        <Moon className="text-blue-400" size={18} />
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 p-4 rounded-lg border ${theme === "green-light" ? "border-primary" : "border-border"}`}>
                      <RadioGroupItem value="green-light" id="green-light" />
                      <div className="flex items-center justify-between w-full">
                        <Label htmlFor="green-light" className="cursor-pointer">Green Light</Label>
                        <div className="w-5 h-5 rounded-full bg-green-500" />
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 p-4 rounded-lg border ${theme === "green-dark" ? "border-primary" : "border-border"}`}>
                      <RadioGroupItem value="green-dark" id="green-dark" />
                      <div className="flex items-center justify-between w-full">
                        <Label htmlFor="green-dark" className="cursor-pointer">Green Dark</Label>
                        <div className="w-5 h-5 rounded-full bg-green-700" />
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      {isDarkMode ? "Currently using dark mode" : "Currently using light mode"}
                    </p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={isDarkMode}
                    onCheckedChange={(checked) => {
                      if (theme === "light" || theme === "green-light") {
                        handleThemeChange(checked ? (theme === "light" ? "dark" : "green-dark") : (theme === "dark" ? "light" : "green-light"));
                      } else {
                        handleThemeChange(checked ? theme : (theme === "dark" ? "light" : "green-light"));
                      }
                    }}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <div className="glass p-6 rounded-lg card-shadow">
                <h2 className="text-xl font-semibold mb-4">Study Preferences</h2>
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-advance">Auto Advance Cards</Label>
                      <p className="text-sm text-muted-foreground">Automatically move to the next card after revealing answer</p>
                    </div>
                    <Switch 
                      id="auto-advance" 
                      checked={autoAdvance}
                      onCheckedChange={setAutoAdvance}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-hints">Show Hints</Label>
                      <p className="text-sm text-muted-foreground">Display hints when available on difficult cards</p>
                    </div>
                    <Switch 
                      id="show-hints" 
                      checked={showHints}
                      onCheckedChange={setShowHints}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="glass p-6 rounded-lg card-shadow">
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-notifications">Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about activity</p>
                    </div>
                    <Switch 
                      id="enable-notifications" 
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="study-reminders">Study Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminders to study your decks</p>
                    </div>
                    <Switch 
                      id="study-reminders" 
                      checked={studyReminders}
                      onCheckedChange={setStudyReminders}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6">
              <div className="glass p-6 rounded-lg card-shadow">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <Separator className="my-4" />
                
                <p className="text-sm text-muted-foreground mb-6">
                  Manage your account settings and profile information
                </p>
                
                <div className="flex flex-col space-y-2">
                  <button className="btn-outline text-left flex justify-between items-center" onClick={() => navigate("/profile")}>
                    <span>View Profile</span>
                    <Check size={16} />
                  </button>
                  
                  <button className="btn-outline text-left flex justify-between items-center">
                    <span>Change Password</span>
                    <Check size={16} />
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
