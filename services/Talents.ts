Import { getAll, getById, add, update, remove, Talent } from './database';

Export { Talent };

Export const getTalents = async (searchQuery?: string): Promise<Talent[]> => {
  Const talents = getAll<Talent>('talents');
  If (searchQuery) {
    Return talents.filter(
      (t) => t.name.includes(searchQuery) || t.description.includes(searchQuery)
    );
  }
  Return talents.sort((a, b) => (b.id || 0) - (a.id || 0));
};

Export const getTalentById = async (id: number): Promise<Talent | null> => {
  Return getById<Talent>('talents', id) || null;
};

Export const addTalent = async (talent: Talent): Promise<number> => {
  Return add('talents', talent);
};

Export const updateTalent = async (id: number, updates: Partial<Talent>): Promise<void> => {
  Await update('talents', id, updates);
};

Export const deleteTalent = async (id: number): Promise<void> => {
  Await remove('talents', id);
};
