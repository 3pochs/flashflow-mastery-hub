
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const getCardsByDeckId = async (deckId: string) => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching cards:', error.message);
    toast.error(`Failed to fetch cards: ${error.message}`);
    return [];
  }
};

export const createCard = async (card: any) => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .insert([card])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating card:', error.message);
    toast.error(`Failed to create card: ${error.message}`);
    return null;
  }
};

export const createCards = async (cards: any[]) => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .insert(cards)
      .select();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating cards:', error.message);
    toast.error(`Failed to create cards: ${error.message}`);
    return null;
  }
};

export const updateCard = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating card:', error.message);
    toast.error(`Failed to update card: ${error.message}`);
    return null;
  }
};

export const deleteCard = async (id: string) => {
  try {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting card:', error.message);
    toast.error(`Failed to delete card: ${error.message}`);
    return false;
  }
};

export const updateCardReviewStatus = async (id: string, status: 'correct' | 'incorrect' | 'hard') => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('cards')
      .update({
        last_reviewed: now,
        review_count: supabase.rpc('increment', { x: 1 }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating card review status:', error.message);
    return null;
  }
};

export const uploadCardMedia = async (file: File, deckId: string, cardId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${deckId}/${cardId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase
      .storage
      .from('card_media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase
      .storage
      .from('card_media')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading media:', error.message);
    toast.error(`Failed to upload media: ${error.message}`);
    return null;
  }
};
