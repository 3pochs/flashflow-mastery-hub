
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getUserFriends, searchUserByUsername, sendFriendRequest, respondToFriendRequest, removeFriend } from "../services/friendService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, UserPlus, User, CheckCircle, XCircle, UserX, Clock } from "lucide-react";
import { toast } from "sonner";

const FriendsPage = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');

  useEffect(() => {
    fetchFriends();
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;
    
    setLoading(true);
    const friendsData = await getUserFriends();
    setFriends(friendsData);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a username to search");
      return;
    }
    
    setIsSearching(true);
    setSearchResults(null);
    
    try {
      const result = await searchUserByUsername(searchQuery);
      
      if (result) {
        // Check if it's the current user
        if (result.id === user?.id) {
          toast.error("You can't add yourself as a friend");
          setSearchResults(null);
        } else {
          setSearchResults(result);
        }
      } else {
        toast.error("User not found");
        setSearchResults(null);
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      toast.error("Error searching for user");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (friendId: string) => {
    if (!user) return;
    
    const success = await sendFriendRequest(friendId);
    if (success) {
      await fetchFriends();
      setSearchResults(null);
      setSearchQuery("");
    }
  };

  const handleRespondToRequest = async (friendshipId: string, status: 'accepted' | 'rejected') => {
    const success = await respondToFriendRequest(friendshipId, status);
    if (success) {
      await fetchFriends();
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    const success = await removeFriend(friendshipId);
    if (success) {
      await fetchFriends();
    }
  };
  
  // Filter friends based on active tab
  const filteredFriends = friends.filter(friend => {
    if (activeTab === 'all') return true;
    if (activeTab === 'requests') return friend.status === 'pending' && !friend.is_sender;
    return true;
  });
  
  // Count pending requests
  const pendingRequestsCount = friends.filter(friend => 
    friend.status === 'pending' && !friend.is_sender
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl font-bold mb-8">Friends</h1>
          
          {/* Search for users */}
          <div className="glass rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Find Friends</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="search"
                  placeholder="Search for users by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9 w-full"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary flex items-center gap-1"
              >
                {isSearching ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  "Search"
                )}
              </button>
            </form>
            
            {searchResults && (
              <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                      {searchResults.avatar_url ? (
                        <img
                          src={searchResults.avatar_url}
                          alt={searchResults.username}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <User size={20} className="text-muted-foreground" />
                      )}
                    </div>
                    <span className="font-medium">{searchResults.username}</span>
                  </div>
                  
                  <button
                    onClick={() => handleSendRequest(searchResults.id)}
                    className="btn-outline-primary flex items-center gap-1 text-sm"
                  >
                    <UserPlus size={16} />
                    Add Friend
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Friends List with Tabs */}
          <div className="glass rounded-lg overflow-hidden">
            <div className="flex border-b">
              <button
                className={`px-4 py-3 font-medium text-sm flex items-center gap-1 ${
                  activeTab === "all"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Friends
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm flex items-center gap-1 ${
                  activeTab === "requests"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("requests")}
              >
                Friend Requests
                {pendingRequestsCount > 0 && (
                  <span className="bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
            </div>
            
            <div className="p-4">
              {filteredFriends.length > 0 ? (
                <div className="space-y-3">
                  {filteredFriends.map((friend) => (
                    <div key={friend.friend_id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                          {friend.avatar_url ? (
                            <img
                              src={friend.avatar_url}
                              alt={friend.username}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            <User size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{friend.username}</div>
                          {friend.status === 'pending' && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock size={12} />
                              {friend.is_sender ? 'Request sent' : 'Request received'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {friend.status === 'pending' ? (
                          friend.is_sender ? (
                            <button
                              onClick={() => handleRemoveFriend(friend.id)}
                              className="p-2 hover:bg-secondary rounded-full text-muted-foreground"
                              title="Cancel Request"
                            >
                              <XCircle size={18} />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRespondToRequest(friend.id, 'accepted')}
                                className="p-2 hover:bg-green-100 rounded-full text-green-600"
                                title="Accept"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleRespondToRequest(friend.id, 'rejected')}
                                className="p-2 hover:bg-red-100 rounded-full text-red-600"
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )
                        ) : (
                          <button
                            onClick={() => handleRemoveFriend(friend.id)}
                            className="p-2 hover:bg-secondary rounded-full text-muted-foreground"
                            title="Remove Friend"
                          >
                            <UserX size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary/30 mb-4">
                    <User size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === 'requests' ? 'No friend requests' : 'No friends yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'requests' 
                      ? 'When people send you friend requests, they will appear here.' 
                      : 'Start by searching for users and sending friend requests.'}
                  </p>
                  {activeTab === 'requests' && (
                    <button 
                      onClick={() => setActiveTab('all')}
                      className="btn-outline"
                    >
                      View All Friends
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FriendsPage;
