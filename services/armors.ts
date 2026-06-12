import { getAll, getById, add, update, remove, Armor, getDatabase } from './database';

export { Armor };

export const getArmors = async (searchQuery?: string): Promise<Armor[]> => {
  const armors = getAll<Armor>('armors');
  if (searchQuery) {
    return armors.filter(
      (a) =>
        a.name.includes(searchQuery) ||
        a.code.includes(searchQuery) ||
        a.type.includes(searchQuery)
    );
  }
  return armors.sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getArmorById = async (id: number): Promise<Armor | null> => {
  return getById<Armor>('armors', id) || null;
};

export const addArmor = async (armor: Armor): Promise<number> => {
  return add('armors', armor);
};

export const updateArmor = async (id: number, updates: Partial<Armor>): Promise<void> => {
  await update('armors', id, updates);
};

export const deleteArmor = async (id: number): Promise<void> => {
  const db = getDatabase();
  const characters = db.characters;
  for (const char of characters) {
    if (char.armor_id === id) {
      char.armor_id = undefined;
    }
  }
  await remove('armors', id);
};

export const canEquipArmor = (armor: Armor, character: { strength: number; body: number; agility: number; spirit: number; level: number }) => {
  return (
    character.strength >= armor.min_strength_req &&
    character.body >= armor.min_body_req &&
    character.agility >= armor.min_agility_req &&
    character.spirit >= armor.min_spirit_req &&
    character.level >= armor.min_level_req
  );
};

export const generateArmorCode = async (): Promise<string> => {
  const armors = getAll<Armor>('armors');
  const count = armors.length + 1;
  return `ARM-${count.toString().padStart(3, '0')}`;
}
