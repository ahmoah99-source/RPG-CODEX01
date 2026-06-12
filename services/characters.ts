import {
  getAll,
  getById,
  add,
  update,
  remove,
  Character,
  calculateCharacterStats,
  calculateTotalScore,
  getLevelByScore,
  LEVELS,
  CLASSES,
} from './database';

export { Character, LEVELS, CLASSES, calculateCharacterStats, calculateTotalScore, getLevelByScore };

export const getCharacters = async (searchQuery?: string): Promise<Character[]> => {
  const characters = getAll<Character>('characters');
  if (searchQuery) {
    return characters.filter(
      (c) =>
        c.name.includes(searchQuery) ||
        c.class.includes(searchQuery) ||
        c.title?.includes(searchQuery)
    );
  }
  return characters.sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getCharacterById = async (id: number): Promise<Character | null> => {
  return getById<Character>('characters', id) || null;
};

export const addCharacter = async (character: Character): Promise<number> => {
  // Calculate initial stats
  const stats = calculateCharacterStats({
    ...character,
    class_multiplier: CLASSES.find(c => c.name === character.class)?.attack_mult || 1.0,
  });

  const newChar: Character = {
    ...character,
    attack_power: stats.attack_power,
    defense_power: stats.defense_power,
    level: stats.level,
    level_name: stats.level_name,
    class_multiplier: stats.level_multiplier,
    talent_ids: character.talent_ids || [],
    skill_ids: character.skill_ids || [],
  };

  return add('characters', newChar);
};

export const updateCharacter = async (id: number, updates: Partial<Character>): Promise<void> => {
  // Get current character
  const current = await getCharacterById(id);
  if (!current) return;

  // Merge updates and recalculate stats
  const updated = { ...current, ...updates };
  const stats = calculateCharacterStats(updated);

  await update('characters', id, {
    ...updates,
    attack_power: stats.attack_power,
    defense_power: stats.defense_power,
    level: stats.level,
    level_name: stats.level_name,
  });
};

export const deleteCharacter = async (id: number): Promise<void> => {
  await remove('characters', id);
};

export const equipWeapon = async (characterId: number, weaponId: number | undefined): Promise<void> => {
  await update('characters', characterId, { weapon_id: weaponId });
};

export const equipArmor = async (characterId: number, armorId: number | undefined): Promise<void> => {
  await update('characters', characterId, { armor_id: armorId });
};

export const addTalentToCharacter = async (characterId: number, talentId: number): Promise<void> => {
  const char = await getCharacterById(characterId);
  if (!char) return;

  const talents = char.talent_ids || [];
  if (!talents.includes(talentId)) {
    talents.push(talentId);
    await update('characters', characterId, { talent_ids: talents });
  }
};

export const removeTalentFromCharacter = async (characterId: number, talentId: number): Promise<void> => {
  const char = await getCharacterById(characterId);
  if (!char) return;

  const talents = (char.talent_ids || []).filter(id => id !== talentId);
  await update('characters', characterId, { talent_ids: talents });
};

export const addSkillToCharacter = async (characterId: number, skillId: number): Promise<void> => {
  const char = await getCharacterById(characterId);
  if (!char) return;

  const skills = char.skill_ids || [];
  if (!skills.includes(skillId)) {
    skills.push(skillId);
    await update('characters', characterId, { skill_ids: skills });
  }
};

export const removeSkillFromCharacter = async (characterId: number, skillId: number): Promise<void> => {
  const char = await getCharacterById(characterId);
  if (!char) return;

  const skills = (char.skill_ids || []).filter(id => id !== skillId);
  await update('characters', characterId, { skill_ids: skills });
};

export const compareCharacters = async (id1: number, id2: number) => {
  const char1 = await getCharacterById(id1);
  const char2 = await getCharacterById(id2);

  if (!char1 || !char2) return null;

  return {
    character1: {
      ...char1,
      calculated: calculateCharacterStats(char1),
    },
    character2: {
      ...char2,
      calculated: calculateCharacterStats(char2),
    },
  };
};
