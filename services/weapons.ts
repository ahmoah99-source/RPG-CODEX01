import { getAll, getById, add, update, remove, Weapon, getDatabase } from './database';

export { Weapon };

export const getWeapons = async (searchQuery?: string): Promise<Weapon[]> => {
  const weapons = getAll<Weapon>('weapons');
  if (searchQuery) {
    return weapons.filter(
      (w) => w.name.includes(searchQuery) || w.code.includes(searchQuery) || w.type.includes(searchQuery)
    );
  }
  return weapons.sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getWeaponById = async (id: number): Promise<Weapon | null> => {
  const weapons = getAll<Weapon>('weapons');
  return weapons.find(w => w.id === id) || null;
};

export const getWeaponByCode = async (code: string): Promise<Weapon | null> => {
  const weapons = getAll<Weapon>('weapons');
  return weapons.find(w => w.code === code) || null;
};

export const addWeapon = async (weapon: Weapon): Promise<number> => {
  return add('weapons', weapon);
};

export const updateWeapon = async (id: number, updates: Partial<Weapon>): Promise<void> => {
  await update('weapons', id, updates);
};

export const deleteWeapon = async (id: number): Promise<void> => {
  const db = getDatabase();
  const characters = db.characters;
  for (const char of characters) {
    if (char.weapon_id === id) {
      char.weapon_id = undefined;
    }
  }
  await remove('weapons', id);
};

export const canEquipWeapon = (weapon: Weapon, character: { strength: number; body: number; agility: number; spirit: number; level: number }) => {
  return (
    character.strength >= weapon.min_strength_req &&
    character.body >= weapon.min_body_req &&
    character.agility >= weapon.min_agility_req &&
    character.spirit >= weapon.min_spirit_req &&
    character.level >= weapon.min_level_req
  );
};

export const getWeaponTypes = async (): Promise<string[]> => {
  const weapons = getAll<Weapon>('weapons');
  const types = new Set(weapons.map(w => w.type));
  return Array.from(types);
};

export const generateWeaponCode = async (): Promise<string> => {
  const weapons = getAll<Weapon>('weapons');
  const count = weapons.length + 1;
  return `WPN-${count.toString().padStart(3, '0')}`;
};
