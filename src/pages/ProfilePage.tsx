
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { getProfile, updateProfile, uploadAvatar } from "../services/profileService";
import { getDecks } from "../services/deckService";
import { toast } from "sonner";
import { User, Pencil, Calendar, Save, Users } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userDecks, setUserDecks] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const profileData = await getProfile(user.id);
        setProfile(profileData);
        setUsername(profileData?.username || "");
        
        const decksData = await getDecks(user.id);
        setUserDecks(decksData);
        
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      const updatedProfile = await updateProfile(user.id, {
        username,
      });
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // in MB
    
    if (fileSize > 5) {
      toast.error("File size must be less than 5MB");
      return;
    }
    
    try {
      const avatarUrl = await uploadAvatar(user.id, file);
      if (avatarUrl) {
        setProfile({
          ...profile,
          avatar_url: avatarUrl,
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass rounded-xl p-8 card-shadow mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-secondary/50 flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.username} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={36} className="text-muted-foreground" />
                  )}
                </div>
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <span className="text-white text-xs">Change</span>
                </label>
                
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field flex-1"
                      />
                      <button
                        onClick={handleUpdateProfile}
                        className="btn-primary flex items-center gap-1"
                      >
                        <Save size={16} />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{profile?.username}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 hover:bg-secondary rounded-full transition-colors"
                      aria-label="Edit profile"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  <span>
                    Joined {new Date(profile?.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userDecks.length}</div>
                    <div className="text-xs text-muted-foreground">Decks</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {userDecks.reduce((total, deck) => total + deck.cards_count, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Cards</div>
                  </div>
                  
                  <Link to="/friends" className="ml-auto flex items-center gap-1 bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-md transition-colors">
                    <Users size={16} />
                    <span>Friends</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-4">Your Decks</h2>
          
          {userDecks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userDecks.map((deck) => (
                <Link
                  key={deck.deck_id}
                  to={`/decks/${deck.deck_id}`}
                  className="glass rounded-lg overflow-hidden card-shadow transition-transform hover:translate-y-[-4px]"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/80">
                        {deck.category || "Uncategorized"}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${deck.is_public ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {deck.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {deck.description || "No description"}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div>{deck.cards_count} cards</div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{deck.avg_rating ? deck.avg_rating.toFixed(1) : 'No ratings'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground mb-4">You haven't created any decks yet.</p>
              <Link to="/create" className="btn-primary">
                Create Your First Deck
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
