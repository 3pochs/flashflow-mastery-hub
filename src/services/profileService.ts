
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
};

export const updateProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    toast.success('Profile updated successfully!');
    return data;
  } catch (error: any) {
    console.error('Error updating profile:', error.message);
    toast.error(`Failed to update profile: ${error.message}`);
    return null;
  }
};

export const uploadAvatar = async (userId: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    // Delete old avatar if exists
    await supabase
      .storage
      .from('card_media')
      .remove([`${userId}/avatar.*`]);

    // Upload new avatar
    const { data, error } = await supabase
      .storage
      .from('card_media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase
      .storage
      .from('card_media')
      .getPublicUrl(data.path);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: urlData.publicUrl,
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    toast.success('Avatar uploaded successfully!');
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading avatar:', error.message);
    toast.error(`Failed to upload avatar: ${error.message}`);
    return null;
  }
};
