
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const getDecks = async (userId?: string) => {
  try {
    let query = supabase
      .from('deck_stats')
      .select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      // If no userId is provided, only get public decks
      query = query.eq('is_public', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching decks:', error.message);
    toast.error(`Failed to fetch decks: ${error.message}`);
    return [];
  }
};

export const getDeckById = async (deckId: string) => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*, cards(*)')
      .eq('id', deckId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching deck:', error.message);
    toast.error(`Failed to fetch deck: ${error.message}`);
    return null;
  }
};

export const createDeck = async (deck: any) => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .insert([deck])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating deck:', error.message);
    toast.error(`Failed to create deck: ${error.message}`);
    return null;
  }
};

export const updateDeck = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating deck:', error.message);
    toast.error(`Failed to update deck: ${error.message}`);
    return null;
  }
};

export const deleteDeck = async (id: string) => {
  try {
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting deck:', error.message);
    toast.error(`Failed to delete deck: ${error.message}`);
    return false;
  }
};

export const rateDeck = async (userId: string, deckId: string, rating: number, comment?: string) => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .upsert({
        user_id: userId,
        deck_id: deckId,
        rating,
        comment,
      }, {
        onConflict: 'user_id,deck_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error rating deck:', error.message);
    toast.error(`Failed to rate deck: ${error.message}`);
    return null;
  }
};
