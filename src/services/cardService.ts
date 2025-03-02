
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Card } from '../types';

export const getCardsByDeckId = async (deckId: string): Promise<Card[]> => {
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

export const createCard = async (card: Partial<Card>) => {
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

export const createCards = async (cards: Partial<Card>[]) => {
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

export const updateCard = async (id: string, updates: Partial<Card>) => {
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
    const updates: Record<string, any> = {
      last_reviewed: now
    };
    
    // Increment review count
    const { data: card, error: fetchError } = await supabase
      .from('cards')
      .select('review_count')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    updates.review_count = (card.review_count || 0) + 1;
    
    const { data, error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Update local storage for study tracking
    if (typeof window !== 'undefined') {
      try {
        const { data: deckData } = await supabase
          .from('cards')
          .select('deck_id')
          .eq('id', id)
          .single();
          
        if (deckData) {
          const userId = (await supabase.auth.getUser()).data.user?.id;
          if (userId) {
            // Save study timestamp
            const studyKey = `recent-study-${userId}`;
            const storedData = localStorage.getItem(studyKey) || '{}';
            const studyData = JSON.parse(storedData);
            studyData[deckData.deck_id] = Date.now();
            localStorage.setItem(studyKey, JSON.stringify(studyData));
          }
        }
      } catch (e) {
        console.error("Error updating study tracking:", e);
      }
    }
    
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
