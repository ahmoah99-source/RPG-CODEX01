import AsyncStorage from '@react-native-async-storage/async-storage';

// RPG Character Codex Database Schema
export interface Character {
  id?: number;
  name: string;
  title?: string;
  class: string;
  level: number;
  level_name: string;
  spirit: number;      // الروح
  body: number;        // الجسد
  agility: number;     // الرشاقة
  strength: number;    // القوة
  attack_power: number;
  defense_power: number;
  class_multiplier: number;
  talent_ids: number[];
  skill_ids: number[];
  weapon_id?: number;
  armor_id?: number;
  avatar?: string;     // base64 or data URL
  background?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Weapon {
  id?: number;
  code: string;
  name: string;
  type: string;
  description?: string;
  strength_bonus: number;
  agility_bonus: number;
  spirit_bonus: number;
  body_bonus: number;
  attack_multiplier: number;
  defense_multiplier: number;
  min_spirit_req: number;
  min_body_req: number;
  min_agility_req: number;
  min_strength_req: number;
  min_level_req: number;
  image?: string;
  created_at?: string;
}

export interface Armor {
  id?: number;
  code: string;
  name: string;
  type: string;
  description?: string;
  strength_bonus: number;
  agility_bonus: number;
  spirit_bonus: number;
  body_bonus: number;
  defense_multiplier: number;
  min_spirit_req: number;
  min_body_req: number;
  min_agility_req: number;
  min_strength_req: number;
  min_level_req: number;
  image?: string;
  created_at?: string;
}

export interface Skill {
  id?: number;
  name: string;
  type: string; // هجومي، دفاعي، مساعد
  description: string;
  power_multiplier: number;
  cooldown: number; // بالثواني
  spirit_cost: number;
}

export interface Talent {
  id?: number;
  name: string;
  description: string;
  stat_boosted: 'strength' | 'agility' | 'spirit' | 'body' | 'all';
  boost_amount: number; // نسبة مئوية أو قيمة ثابتة
}

export interface Product {
  id?: number;
  name: string;
  category: string; // لفافة، ترياق، مواد خام
  description: string;
  price: number;
  effect?: string;
}

export interface DatabaseSchema {
  Characters: Character[];
  Weapons: Weapon[];
  Armors: Armor[];
  Skills: Skill[];
  Talents: Talent[];
  Products: Product[];
}

// الكائنات الثابتة للمستويات والفلل
export const LEVELS = [
  { min_score: 0, name: "مبتدئ دنيء", multiplier: 1.0 },
  { min_score: 100, name: "متدرب ناشئ", multiplier: 1.2 },
  { min_score: 300, name: "محارب صلب", multiplier: 1.5 },
  { min_score: 700, name: "خبير متمرس", multiplier: 1.9 },
  { min_score: 1500, name: "سيد النخبة", multiplier: 2.4 },
  { min_score: 3100, name: "بطل أسطوري", multiplier: 3.0 },
  { min_score: 6300, name: "نصف إله دنيوي", multiplier: 3.8 },
  { min_score: 12700, name: "حاكم أبدي", multiplier: 5.0 }
];

export const CLASSES = [
  { name: "سيّاف", attack_mult: 1.3, defense_mult: 1.0 },
  { name: "ساحر", attack_mult: 1.5, defense_mult: 0.7 },
  { name: "مدافع", attack_mult: 0.8, defense_mult: 1.6 },
  { name: "مغتال", attack_mult: 1.4, defense_mult: 0.8 },
  { name: "معالج", attack_mult: 0.7, defense_mult: 1.2 }
];

// ذاكرة محلية مؤقتة (In-Memory Cache) لسرعة العمليات
let localDb: DatabaseSchema = {
  Characters: [],
  Weapons: [],
  Armors: [],
  Skills: [],
  Talents: [],
  Products: []
};

const DB_KEY = '@rpg_codex_database';

// تحميل البيانات من التخزين الدائم للهاتف عند بداية التشغيل
export const loadDatabase = async (): Promise<void> => {
  try {
    const jsonValue = await AsyncStorage.getItem(DB_KEY);
    if (jsonValue != null) {
      localDb = JSON.parse(jsonValue);
      // التأكد من وجود كل المصفوفات وتطابق حالة الأحرف
      if (!localDb.Characters) localDb.Characters = [];
      if (!localDb.Weapons) localDb.Weapons = [];
      if (!localDb.Armors) localDb.Armors = [];
      if (!localDb.Skills) localDb.Skills = [];
      if (!localDb.Talents) localDb.Talents = [];
      if (!localDb.Products) localDb.Products = [];
    } else {
      // إعداد قاعدة بيانات أولية فارغة
      localDb = { Characters: [], Weapons: [], Armors: [], Skills: [], Talents: [], Products: [] };
      await saveDatabase();
    }
  } catch (e) {
    console.error("Failed to load database", e);
  }
};

export const saveDatabase = async (): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(localDb);
    await AsyncStorage.setItem(DB_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save database", e);
  }
};

export const getDatabase = (): DatabaseSchema => localDb;

// دالات عامة للتعامل مع الجداول (Generic CRUD Operations)
export function getAll<T>(table: keyof DatabaseSchema): T[] {
  return localDb[table] as unknown as T[];
}

export function getById<T extends { id?: number }>(table: keyof DatabaseSchema, id: number): T | undefined {
  const list = localDb[table] as unknown as T[];
  return list.find(item => item.id === id);
}

export async function add<T extends { id?: number; created_at?: string }>(table: keyof DatabaseSchema, item: T): Promise<number> {
  const list = localDb[table] as any[];
  const nextId = list.length > 0 ? Math.max(...list.map(i => i.id || 0)) + 1 : 1;
  
  const newItem = {
    ...item,
    id: nextId,
    created_at: new Date().toISOString()
  };
  
  list.push(newItem);
  await saveDatabase();
  return nextId;
}

export async function update<T extends { id?: number; updated_at?: string }>(table: keyof DatabaseSchema, id: number, updates: Partial<T>): Promise<void> {
  const list = localDb[table] as any[];
  const idx = list.findIndex(item => item.id === id);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    await saveDatabase();
  }
}

export async function remove(table: keyof DatabaseSchema, id: number): Promise<void> {
  const list = localDb[table] as any[];
  const idx = list.findIndex(item => item.id === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    await saveDatabase();
  }
}

// حساب النقاط الكلية للشخصية لتقييم مستواها البشري الموحد
export const calculateTotalScore = (char: Character): number => {
  return (char.strength * 1.5) + (char.agility * 1.2) + (char.body * 1.0) + (char.spirit * 2.0);
};

export const getLevelByScore = (score: number) => {
  let activeLevel = LEVELS[0];
  for (const lvl of LEVELS) {
    if (score >= lvl.min_score) {
      activeLevel = lvl;
    } else {
      break;
    }
  }
  return activeLevel;
};

// حساب الخصائص النهائية بعد دمج إضافات الأسلحة والدروع والمواهب
export const calculateCharacterStats = (char: Character) => {
  const score = calculateTotalScore(char);
  const currentLevel = getLevelByScore(score);
  
  let bonusStrength = 0;
  let bonusAgility = 0;
  let bonusBody = 0;
  let bonusSpirit = 0;
  let attackMult = CLASSES.find(c => c.name === char.class)?.attack_mult || 1.0;
  let defenseMult = CLASSES.find(c => c.name === char.class)?.defense_mult || 1.0;

  // 1. حساب إضافات السلاح المجهز
  if (char.weapon_id) {
    const wp = getById<Weapon>('Weapons', char.weapon_id);
    if (wp) {
      bonusStrength += wp.strength_bonus;
      bonusAgility += wp.agility_bonus;
      bonusBody += wp.body_bonus;
      bonusSpirit += wp.spirit_bonus;
      attackMult *= wp.attack_multiplier;
      defenseMult *= wp.defense_multiplier;
    }
  }

  // 2. حساب إضافات الدرع المجهز
  if (char.armor_id) {
    const ar = getById<Armor>('Armors', char.armor_id);
    if (ar) {
      bonusStrength += ar.strength_bonus;
      bonusAgility += ar.agility_bonus;
      bonusBody += ar.body_bonus;
      bonusSpirit += ar.spirit_bonus;
      defenseMult *= ar.defense_multiplier;
    }
  }

  // 3. حساب إضافات المواهب
  if (char.talent_ids && char.talent_ids.length > 0) {
    for (const tId of char.talent_ids) {
      const tl = getById<Talent>('Talents', tId);
      if (tl) {
        if (tl.stat_boosted === 'strength' || tl.stat_boosted === 'all') bonusStrength += tl.boost_amount;
        if (tl.stat_boosted === 'agility' || tl.stat_boosted === 'all') bonusAgility += tl.boost_amount;
        if (tl.stat_boosted === 'body' || tl.stat_boosted === 'all') bonusBody += tl.boost_amount;
        if (tl.stat_boosted === 'spirit' || tl.stat_boosted === 'all') bonusSpirit += tl.boost_amount;
      }
    }
  }

  const finalStrength = char.strength + bonusStrength;
  const finalAgility = char.agility + bonusAgility;
  const finalBody = char.body + bonusBody;
  const finalSpirit = char.spirit + bonusSpirit;

  const attack_power = Math.round((finalStrength * 10 + finalAgility * 5) * attackMult * currentLevel.multiplier);
  const defense_power = Math.round((finalBody * 15 + finalStrength * 2) * defenseMult * currentLevel.multiplier);

  return {
    attack_power,
    defense_power,
    level: LEVELS.indexOf(currentLevel) + 1,
    level_name: currentLevel.name,
    level_multiplier: currentLevel.multiplier,
    finalStrength,
    finalAgility,
    finalBody,
    finalSpirit
  };
};

export const clearAllData = async (): Promise<void> => {
  localDb = { Characters: [], Weapons: [], Armors: [], Skills: [], Talents: [], Products: [] };
  await saveDatabase();
};
