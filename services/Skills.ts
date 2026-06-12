import { getAll, getById, add, update, remove, Skill } from './database';

export { Skill };

export const getSkills = async (searchQuery?: string): Promise<Skill[]> => {
  const skills = getAll<Skill>('skills');
  if (searchQuery) {
    return skills.filter(
      (s) => s.name.includes(searchQuery) || s.type.includes(searchQuery) || s.description.includes(searchQuery)
    );
  }
  return skills.sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getSkillById = async (id: number): Promise<Skill | null> => {
  return getById<Skill>('skills', id) || null;
};

export const addSkill = async (skill: Skill): Promise<number> => {
  return add('skills', skill);
};

export const updateSkill = async (id: number, updates: Partial<Skill>): Promise<void> => {
  await update('skills', id, updates);
};

export const deleteSkill = async (id: number): Promise<void> => {
  await remove('skills', id);
};
