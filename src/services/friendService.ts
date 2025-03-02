
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface FriendProfile {
  friend_id: string;
  username: string;
  avatar_url: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  is_sender: boolean;
  id: string; // Added to keep track of the friendship ID
}

interface UserSearchResult {
  id: string;
  username: string;
  avatar_url: string | null;
}

// Get all friends and friend requests for a user
export const getUserFriends = async (): Promise<FriendProfile[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .rpc('get_user_friends', { user_uuid: user.user.id });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching friends:', error.message);
    return [];
  }
};

// Search for a user by username
export const searchUserByUsername = async (username: string): Promise<UserSearchResult | null> => {
  try {
    const { data, error } = await supabase
      .rpc('find_user_by_username', { search_username: username });

    if (error) throw error;
    return data?.[0] || null;
  } catch (error: any) {
    console.error('Error searching for user:', error.message);
    return null;
  }
};

// Send a friend request
export const sendFriendRequest = async (friendId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    // Check if friend request already exists
    const { data: existingRequests, error: checkError } = await supabase
      .from('friends')
      .select('*')
      .or(`and(user_id.eq.${user.user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.user.id})`);

    if (checkError) throw checkError;
    
    if (existingRequests && existingRequests.length > 0) {
      toast.error('Friend request already exists');
      return false;
    }

    const { error } = await supabase
      .from('friends')
      .insert({
        user_id: user.user.id,
        friend_id: friendId,
        status: 'pending'
      });

    if (error) throw error;
    toast.success('Friend request sent!');
    return true;
  } catch (error: any) {
    console.error('Error sending friend request:', error.message);
    toast.error(`Error: ${error.message}`);
    return false;
  }
};

// Accept or reject a friend request
export const respondToFriendRequest = async (
  friendshipId: string, 
  status: 'accepted' | 'rejected'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('friends')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', friendshipId);

    if (error) throw error;
    
    toast.success(status === 'accepted' 
      ? 'Friend request accepted!' 
      : 'Friend request rejected');
    
    return true;
  } catch (error: any) {
    console.error(`Error ${status} friend request:`, error.message);
    toast.error(`Error: ${error.message}`);
    return false;
  }
};

// Remove a friend
export const removeFriend = async (friendshipId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', friendshipId);

    if (error) throw error;
    toast.success('Friend removed');
    return true;
  } catch (error: any) {
    console.error('Error removing friend:', error.message);
    toast.error(`Error: ${error.message}`);
    return false;
  }
};
