// =======================================================================
// 🚀 المحرك المركزي الشامل والمحلي (Standalone Codex Engine - Ultimate)
// نسخة آمنة ومتوافقة مع تطبيقات React Native المحمولة
// =======================================================================

// ذاكرة تخزين مؤقتة بديلة في حال غياب localStorage في بيئة الموبايل الصرفة
const memoryStorage = {};

const safeStorage = {
    getItem: (key) => {
        try {
            if (typeof localStorage !== 'undefined' && localStorage.getItem) {
                return localStorage.getItem(key);
            }
        } catch (e) {
            console.log("Storage read error:", e);
        }
        return memoryStorage[key] || null;
    },
    setItem: (key, value) => {
        try {
            if (typeof localStorage !== 'undefined' && localStorage.setItem) {
                localStorage.setItem(key, value);
                return;
            }
        } catch (e) {
            console.log("Storage write error:", e);
        }
        memoryStorage[key] = value;
    }
};

export default class StandaloneCodexEngine {
constructor() {
this.storageKeys = {
heroes: "rpg_heroes",
backpack: "rpg_backpack",
skills: "rpg_skills",
shop: "rpg_shop",
levels: "rpg_levels",
quests: "rpg_quests",
backpackCategories: "rpg_backpack_categories",
skillCategories: "rpg_skill_categories",
shopCategories: "rpg_shop_categories"
};
this.initDefaults();
}

initDefaults() {
    try {
        if (!safeStorage.getItem(this.storageKeys.heroes)) {
            safeStorage.setItem(this.storageKeys.heroes, JSON.stringify([
                {
                    id: "hero_1",
                    hero_name: "البطل الأسطوري",
                    hero_avatar: "",
                    hero_level: 1,
                    hero_exp: 0,
                    hero_max_exp: 100,
                    hero_strength: 15,
                    hero_agility: 12,
                    hero_body: 10,
                    hero_spirit: 10,
                    hero_wealth: 500,
                    hero_hp: 100,
                    hero_max_hp: 100,
                    hero_mp: 50,
                    hero_max_mp: 50,
                    hero_skills: [],
                    hero_inventory: [],
                    hero_quests: []
                }
            ]));
        }

        if (!safeStorage.getItem(this.storageKeys.backpack)) {
            safeStorage.setItem(this.storageKeys.backpack, JSON.stringify([
                { id: "item_1", name: "سيف البداية الحاد", category: "الأسلحة", subCategory: "سيوف", desc: "سيف قوي للمبتدئين", img: "", bonusStr: 5, bonusAgi: 2, bonusBody: 0, bonusSpirit: 0 }
            ]));
        }

        if (!safeStorage.getItem(this.storageKeys.skills)) {
            safeStorage.setItem(this.storageKeys.skills, JSON.stringify([
                { id: "skill_1", name: "ضربة قاضية", category: "القدرات الهجومية", subCategory: "ضربات قاضية", desc: "ضربة قوية تضاعف الضرر", img: "", bonusStr: 10, bonusAgi: 0, bonusBody: 0, bonusSpirit: 0 }
            ]));
        }

        if (!safeStorage.getItem(this.storageKeys.shop)) {
            safeStorage.setItem(this.storageKeys.shop, JSON.stringify([
                { id: "shop_1", name: "إكسير الصحة الملكي", price: 50, category: "الجرعات", subCategory: "إكسير الصحة", desc: "يعيد كامل الصحة", img: "", bonusStr: 0, bonusAgi: 0, bonusBody: 5, bonusSpirit: 0 }
            ]));
        }

        if (!safeStorage.getItem(this.storageKeys.quests)) {
            safeStorage.setItem(this.storageKeys.quests, JSON.stringify([
                { name: "مهمة تطهير الغابة", desc: "القضاء على الوحوش الضعيفة", expReward: 50, wealthReward: 20 }
            ]));
        }

        if (!safeStorage.getItem(this.storageKeys.levels)) {
            safeStorage.setItem(this.storageKeys.levels, JSON.stringify({
                "قوة التدمير": {
                    systemImg: "",
                    categories: {
                        "الفئة الأولى: فئة الإنسان": {
                            levels: {
                                "المستوى 1: طفل بشري": { age: "0 - 1 سنة", power: "0.2", desc: "مراحل النمو المبكرة", img: "" },
                                "المستوى 2: الإنسان العادي": { age: "6 - 12 سنة", power: "1.0", desc: "المرجعية الأساسية", img: "" }
                            }
                        }
                    }
                }
            }));
        }

        if (!safeStorage.getItem(this.storageKeys.backpackCategories)) {
            safeStorage.setItem(this.storageKeys.backpackCategories, JSON.stringify({
                "الأسلحة": ["سيوف", "خناجر", "دروع", "فؤوس"],
                "الجرعات": ["إكسير الصحة", "إكسير المانا", "سموم"],
                "الملابس": ["خوذات", "دروع بدنية", "أحذية"],
                "أشياء أخرى": ["أدوات", "مستلزمات"],
                "عام / متفرقات": ["عامة"]
            }));
        }

        if (!safeStorage.getItem(this.storageKeys.skillCategories)) {
            safeStorage.setItem(this.storageKeys.skillCategories, JSON.stringify({
                "القدرات الهجومية": ["ضربات قاضية", "هجمات مساحية", "مهارات اسطورية"],
                "التعاويذ السحرية": ["عناصر النار", "عناصر الجليد", "تعاويذ الشفاء"],
                "المواهب السلبية": ["زيادة السرعة", "تحمل الألم", "تركيز ذهني"]
            }));
        }

        if (!safeStorage.getItem(this.storageKeys.shopCategories)) {
            safeStorage.setItem(this.storageKeys.shopCategories, JSON.stringify({
                "الأسلحة": ["سيوف", "خناجر", "دروع", "فؤوس"],
                "المهارات": ["قدرات هجومية", "تعاويذ سحرية", "مواهب سلبية"],
                "الجرعات": ["إكسير الصحة", "إكسير المانا", "سموم"],
                "الملابس": ["خوذات", "دروع بدنية", "أحذية"],
                "أشياء أخرى": ["أدوات", "مستلزمات"]
            }));
        }
    } catch (err) {
        console.log("Init defaults error:", err);
    }
}

getData(key) {
    try {
        let data = safeStorage.getItem(this.storageKeys[key] || key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

saveData(key, data) {
    try {
        safeStorage.setItem(this.storageKeys[key] || key, JSON.stringify(data));
    } catch (e) {
        console.log("Save data error:", e);
    }
}

// =========================================================================
// 👥 دوال إدارة الشخصيات والأبطال (Heroes Management)
// =========================================================================
getHeroData(heroId) {
    let heroes = this.getData('heroes');
    let heroObj = heroes.find(h => h.id === heroId || h.hero_name === heroId) || heroes[0];
    if (!heroObj) return null;

    let body = heroObj.hero_body ?? 10;
    let spirit = heroObj.hero_spirit ?? 10;

    return {
        raw: heroObj,
        id: heroObj.id,
        name: heroObj.hero_name || "بطل مجهول",
        avatarPath: heroObj.hero_avatar || "",
        imgSrc: heroObj.hero_avatar || "https://i.imgur.com/8Km9tLL.png",
        level: heroObj.hero_level || 1,
        exp: heroObj.hero_exp || 0,
        maxExp: heroObj.hero_max_exp || 100,
        strength: heroObj.hero_strength ?? 10,
        agility: heroObj.hero_agility ?? 10,
        body: body,
        spirit: spirit,
        wealth: heroObj.hero_wealth ?? 100,
        hp: heroObj.hero_hp ?? (body * 10),
        maxHp: heroObj.hero_max_hp ?? (body * 10),
        mp: heroObj.hero_mp ?? (spirit * 10),
        maxMp: heroObj.hero_max_mp ?? (spirit * 10),
        skills: heroObj.hero_skills || [],
        inventory: heroObj.hero_inventory || [],
        quests: heroObj.hero_quests || []
    };
}

saveHeroData(heroId, updatedData) {
    let heroes = this.getData('heroes');
    let index = heroes.findIndex(h => h.id === heroId || h.hero_name === heroId);
    if (index !== -1) {
        heroes[index] = { ...heroes[index], ...updatedData };
        this.saveData('heroes', heroes);
        return true;
    }
    return false;
}

createHero(heroObj) {
    let heroes = this.getData('heroes');
    heroObj.id = "hero_" + Date.now();
    heroes.push(heroObj);
    this.saveData('heroes', heroes);
    return heroObj;
}

deleteHero(heroId) {
    let heroes = this.getData('heroes');
    let filtered = heroes.filter(h => h.id !== heroId && h.hero_name !== heroId);
    this.saveData('heroes', filtered);
}

// =========================================================================
// ⭐ دوال مستويات القوة وأنظمة الطاقة (Energy Systems & Levels)
// =========================================================================
loadEnergySystems() {
    return this.getData('levels');
}

saveEnergySystems(systemsData) {
    this.saveData('levels', systemsData);
}

// =========================================================================
// ⚡ دوال المهارات والفئات (Skills & Categories Management)
// =========================================================================
getSkillCategories() {
    return this.getData('skillCategories');
}

saveSkillCategories(categories) {
    this.saveData('skillCategories', categories);
}

addSkillItem(skill) {
    let skills = this.getData('skills');
    skills.push(skill);
    this.saveData('skills', skills);
}

updateSkillItem(skillName, updatedData) {
    let skills = this.getData('skills');
    let index = skills.findIndex(s => s.name === skillName);
    if (index !== -1) {
        skills[index] = { ...skills[index], ...updatedData };
        this.saveData('skills', skills);
        return true;
    }
    return false;
}

deleteSkillItem(skillName) {
    let skills = this.getData('skills');
    let filtered = skills.filter(s => s.name !== skillName);
    this.saveData('skills', filtered);
}

equipSkillToHero(heroId, skillName) {
    let heroes = this.getData('heroes');
    let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId);
    if (!hero) return false;
    if (!hero.hero_skills) hero.hero_skills = [];
    if (!hero.hero_skills.includes(skillName)) {
        hero.hero_skills.push(skillName);
        this.saveData('heroes', heroes);
        return true;
    }
    return false;
}

removeSkillFromHero(heroId, skillName) {
    let heroes = this.getData('heroes');
    let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId);
    if (!hero || !hero.hero_skills) return false;
    hero.hero_skills = hero.hero_skills.filter(s => s !== skillName);
    this.saveData('heroes', heroes);
    return true;
}

// =========================================================================
// 🎒 دوال الحقيبة والعتاد والفئات (Backpack, Inventory & Categories)
// =========================================================================
getBackpackCategories() {
    return this.getData('backpackCategories');
}

saveBackpackCategories(categories) {
    this.saveData('backpackCategories', categories);
}

addBackpackItem(item) {
    let items = this.getData('backpack');
    items.push(item);
    this.saveData('backpack', items);
}

updateBackpackItem(itemName, updatedData) {
    let items = this.getData('backpack');
    let index = items.findIndex(i => i.name === itemName);
    if (index !== -1) {
        items[index] = { ...items[index], ...updatedData };
        this.saveData('backpack', items);
        return true;
    }
    return false;
}

deleteBackpackItem(itemName) {
    let items = this.getData('backpack');
    let filtered = items.filter(i => i.name !== itemName);
    this.saveData('backpack', filtered);
}

equipItemToHero(heroId, itemObj) {
    let heroes = this.getData('heroes');
    let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId);
    if (!hero) return { success: false, msg: "البطل غير موجود!" };
    if (!hero.hero_inventory) hero.hero_inventory = [];
    
    if (hero.hero_inventory.some(eq => eq.name === itemObj.name)) {
        return { success: false, msg: "⚠️ هذا البطل يرتدي القطعة بالفعل!" };
    }

    hero.hero_inventory.push(itemObj);
    this.saveData('heroes', heroes);
    return { success: true, msg: "✨ تم إلباس القطعة للبطل بنجاح!" };
}

unequipItemFromHero(heroId, itemName) {
    let heroes = this.getData('heroes');
    let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId);
    if (!hero || !hero.hero_inventory) return { success: false };

    let idx = hero.hero_inventory.findIndex(eq => eq.name === itemName);
    if (idx === -1) return { success: false, msg: "⚠️ القطعة غير مجهزة أصلاً لدى هذا البطل!" };

    hero.hero_inventory.splice(idx, 1);
    this.saveData('heroes', heroes);
    return { success: true, msg: "🗑️ تم نزع القطعة بنجاح!" };
}

// =========================================================================
// 📜 دوال إدارة المهام (Quests Management)
// =========================================================================
addQuestToHero(heroId, quest) {
    let heroes = this.getData('heroes');
    let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId);
    if (!hero) return { success: false, msg: "البطل غير موجود!" };

    if (!hero.hero_quests) hero.hero_quests = [];
    hero.hero_quests.push(quest);
    this.saveData('heroes', heroes);
    return { success: true, msg: "📜 تم قبول المهمة بنجاح!" };
}

completeHeroQuest(heroId, questIndex) {
    let heroes = this.getData('heroes');
    let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId);
    if (!hero || !hero.hero_quests || !hero.hero_quests[questIndex]) return { success: false };

    let q = hero.hero_quests[questIndex];
    hero.hero_exp = (hero.hero_exp || 0) + (q.expReward || 50);
    hero.hero_wealth = (hero.hero_wealth || 0) + (q.wealthReward || 20);

    while (hero.hero_exp >= (hero.hero_max_exp || 100)) {
        hero.hero_exp -= (hero.hero_max_exp || 100);
        hero.hero_level = (hero.hero_level || 1) + 1;
        hero.hero_max_exp = (hero.hero_max_exp || 100) + 50;
    }

    hero.hero_quests.splice(questIndex, 1);
    this.saveData('heroes', heroes);
    return { success: true, hero: hero, msg: "🏆 تم إنجاز المهمة واستلام المكافآت!" };
}

cancelHeroQuest(heroId, questIndex) {
    let heroes = this.getData('heroes');
    let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId);
    if (!hero || !hero.hero_quests || !hero.hero_quests[questIndex]) return { success: false };

    hero.hero_quests.splice(questIndex, 1);
    this.saveData('heroes', heroes);
    return { success: true, msg: "⚠️ تم إلغاء المهمة." };
}

// =========================================================================
// 🛒 دوال المتجر وعمليات الشراء الذكية (Shop & Economy Management)
// =========================================================================
getShopCategories() {
    return this.getData('shopCategories');
}

saveShopCategories(categories) {
    this.saveData('shopCategories', categories);
}

buyShopItem(heroId, item) {
    let heroes = this.getData('heroes');
    let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId);
    if (!hero) return { success: false, msg: "البطل غير موجود!" };

    let wealth = hero.hero_wealth ?? 100;
    if (wealth < item.price) {
        return { success: false, msg: "عذراً، لا يملك البطل ما يكفي من المال!" };
    }

    hero.hero_wealth = wealth - item.price;

    let isSkill = item.category?.includes("مهارة") || item.subCategory?.includes("مهارة") || item.category?.includes("مواهب") || item.subCategory?.includes("مواهب");
    if (isSkill) {
        if (!hero.hero_skills) hero.hero_skills = [];
        if (!hero.hero_skills.includes(item.name)) hero.hero_skills.push(item.name);
        this.addSkillItem(item);
    } else {
        if (!hero.hero_inventory) hero.hero_inventory = [];
        if (!hero.hero_inventory.some(eq => eq.name === item.name)) hero.hero_inventory.push(item);
        this.addBackpackItem(item);
    }

    this.saveData('heroes', heroes);
    return { success: true, msg: "✨ تمت عملية الشراء بنجاح وإضافة العنصر للبطل!" };
}
}
