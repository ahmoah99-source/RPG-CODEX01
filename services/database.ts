import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Character {
  id?: number; name: string; title?: string; class: string; level: number; level_name: string;
  spirit: number; body: number; agility: number; strength: number; attack_power: number;
  defense_power: number; class_multiplier: number; talent_ids: number[]; skill_ids: number[];
  weapon_id?: number; armor_id?: number; avatar?: string; background?: string;
  created_at?: string; updated_at?: string;
}

export interface DatabaseSchema {
  characters: Character[]; weapons: any[]; armors: any[]; skills: any[]; talents: any[]; products: any[];
}

let localDb: DatabaseSchema = { characters: [], weapons: [], armors: [], skills: [], talents: [], products: [] };
const DB_KEY = '@rpg_codex_database';

export const loadDatabase = async (): Promise<void> => {
  try {
    const jsonValue = await AsyncStorage.getItem(DB_KEY);
    if (jsonValue != null) {
      try {
        localDb = JSON.parse(jsonValue);
      } catch (e) {
        localDb = { characters: [], weapons: [], armors: [], skills: [], talents: [], products: [] };
      }
    }
  } catch (e) {
    localDb = { characters: [], weapons: [], armors: [], skills: [], talents: [], products: [] };
  }
};

export const saveDatabase = async (): Promise<void> => {
  await AsyncStorage.setItem(DB_KEY, JSON.stringify(localDb));
};

export function getAll<T>(table: keyof DatabaseSchema): T[] { return localDb[table] as unknown as T[]; }
export async function add<T extends { id?: number; created_at?: string }>(table: keyof DatabaseSchema, item: T): Promise<number> {
  const list = localDb[table] as any[];
  const nextId = list.length > 0 ? Math.max(...list.map(i => i.id || 0)) + 1 : 1;
  list.push({ ...item, id: nextId, created_at: new Date().toISOString() });
  await saveDatabase();
  return nextId;
}
export async function update<T extends { id?: number; updated_at?: string }>(table: keyof DatabaseSchema, id: number, updates: Partial<T>): Promise<void> {
  const list = localDb[table] as any[];
  const idx = list.findIndex(item => item.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    await saveDatabase();
  }
}
export async function remove(table: keyof DatabaseSchema, id: number): Promise<void> {
  const list = localDb[table] as any[];
  const idx = list.findIndex(item => item.id === id);
  if (idx !== -1) { list.splice(idx, 1); await saveDatabase(); }
}
