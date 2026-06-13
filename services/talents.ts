import { getAll, getById, add, update, remove, Talent } from './database';

export { Talent };

export const getTalents = async (searchQuery?: string): Promise<Talent[]> => {
  const talents = getAll<Talent>('talents');
  if (searchQuery) {
    return talents.filter(
      (t) => t.name.includes(searchQuery) || t.description.includes(searchQuery)
    );
  }
  return talents.sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getTalentById = async (id: number): Promise<Talent | null> => {
  return getById<Talent>('talents', id) || null;
};

export const addTalent = async (talent: Talent): Promise<number> => {
  return add('talents', talent);
};

export const updateTalent = async (id: number, updates: Partial<Talent>): Promise<void> => {
  await update('talents', id, updates);
};

export const deleteTalent = async (id: number): Promise<void> => {
  await remove('talents', id);
};

