// =======================================================================
// 🚀 المحرك المركزي الشامل والمحلي (Standalone Codex Engine - Ultimate)
// نسخة آمنة ومتوافقة مع تطبيقات React Native المحمولة والشاشات كافة
// =======================================================================

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
            images: "rpg_images",
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
                        name: "البطل الأسطوري",
                        hero_name: "البطل الأسطوري",
                        hero_avatar: "",
                        avatarPath: "",
                        level: 1,
                        hero_level: 1,
                        hero_exp: 0,
                        hero_max_exp: 100,
                        hero_strength: 15,
                        strength: 15,
                        hero_agility: 12,
                        agility: 12,
                        hero_body: 10,
                        body: 10,
                        hero_spirit: 10,
                        spirit: 10,
                        wealth: 500,
                        hero_wealth: 500,
                        hero_hp: 100,
                        hp: 100,
                        hero_max_hp: 100,
                        maxHp: 100,
                        hero_mp: 50,
                        mp: 50,
                        hero_max_mp: 50,
                        maxMp: 50,
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

            if (!safeStorage.getItem(this.storageKeys.images)) {
                safeStorage.setItem(this.storageKeys.images, JSON.stringify([
                    { name: "صورة افتراضية", uri: "https://i.imgur.com/8Km9tLL.png", path: "https://i.imgur.com/8Km9tLL.png" }
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
            return data ? JSON.parse(data) : (key === 'levels' || key === 'backpackCategories' || key === 'skillCategories' || key === 'shopCategories' ? {} : []);
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
        let heroObj = heroes.find(h => h.id === heroId || h.hero_name === heroId || h.name === heroId) || heroes[0];
        if (!heroObj) return null;

        let body = heroObj.hero_body ?? heroObj.body ?? 10;
        let spirit = heroObj.hero_spirit ?? heroObj.spirit ?? 10;

        return {
            raw: heroObj,
            id: heroObj.id,
            name: heroObj.name || heroObj.hero_name || "بطل مجهول",
            avatarPath: heroObj.hero_avatar || heroObj.avatarPath || "",
            imgSrc: heroObj.hero_avatar || heroObj.avatarPath || "https://i.imgur.com/8Km9tLL.png",
            level: heroObj.level || heroObj.hero_level || 1,
            exp: heroObj.hero_exp || 0,
            maxExp: heroObj.hero_max_exp || 100,
            strength: heroObj.strength ?? heroObj.hero_strength ?? 10,
            agility: heroObj.agility ?? heroObj.hero_agility ?? 10,
            body: body,
            spirit: spirit,
            wealth: heroObj.wealth ?? heroObj.hero_wealth ?? 100,
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
        let index = heroes.findIndex(h => h.id === heroId || h.hero_name === heroId || h.name === heroId);
        if (index !== -1) {
            heroes[index] = { ...heroes[index], ...updatedData };
            this.saveData('heroes', heroes);
            return true;
        }
        return false;
    }

    updateHero(heroId, updatedData) {
        return this.saveHeroData(heroId, updatedData);
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
        let filtered = heroes.filter(h => h.id !== heroId && h.hero_name !== heroId && h.name !== heroId);
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

    addEnergySystem(sysName, imgPath) {
        let systems = this.getData('levels');
        if (!systems[sysName]) {
            systems[sysName] = { systemImg: imgPath || "", categories: {} };
            this.saveData('levels', systems);
        }
    }

    renameEnergySystem(oldName, newName) {
        let systems = this.getData('levels');
        if (systems[oldName] && !systems[newName]) {
            systems[newName] = systems[oldName];
            delete systems[oldName];
            this.saveData('levels', systems);
        }
    }

    deleteEnergySystem(sysName) {
        let systems = this.getData('levels');
        if (systems[sysName]) {
            delete systems[sysName];
            this.saveData('levels', systems);
        }
    }

    updateSystemImage(sysName, imgPath) {
        let systems = this.getData('levels');
        if (systems[sysName]) {
            systems[sysName].systemImg = imgPath;
            this.saveData('levels', systems);
        }
    }

    addEnergyCategory(sysName, catName) {
        let systems = this.getData('levels');
        if (systems[sysName] && systems[sysName].categories && !systems[sysName].categories[catName]) {
            systems[sysName].categories[catName] = { levels: {} };
            this.saveData('levels', systems);
        }
    }

    renameEnergyCategory(sysName, oldCat, newCat) {
        let systems = this.getData('levels');
        if (systems[sysName] && systems[sysName].categories[oldCat] && !systems[sysName].categories[newCat]) {
            systems[sysName].categories[newCat] = systems[sysName].categories[oldCat];
            delete systems[sysName].categories[oldCat];
            this.saveData('levels', systems);
        }
    }

    deleteEnergyCategory(sysName, catName) {
        let systems = this.getData('levels');
        if (systems[sysName] && systems[sysName].categories[catName]) {
            delete systems[sysName].categories[catName];
            this.saveData('levels', systems);
        }
    }

    addEnergyLevel(sysName, catName, levelName, levelObj) {
        let systems = this.getData('levels');
        if (systems[sysName] && systems[sysName].categories[catName]) {
            if (!systems[sysName].categories[catName].levels) {
                systems[sysName].categories[catName].levels = {};
            }
            systems[sysName].categories[catName].levels[levelName] = levelObj;
            this.saveData('levels', systems);
        }
    }

    updateEnergyLevel(sysName, catName, levelName, levelObj) {
        this.addEnergyLevel(sysName, catName, levelName, levelObj);
    }

    deleteEnergyLevel(sysName, catName, levelName) {
        let systems = this.getData('levels');
        if (systems[sysName] && systems[sysName].categories[catName] && systems[sysName].categories[catName].levels[levelName]) {
            delete systems[sysName].categories[catName].levels[levelName];
            this.saveData('levels', systems);
        }
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

    addSkill(skill) {
        this.addSkillItem(skill);
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
        let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId || h.name === heroId);
        if (!hero) return false;
        if (!hero.hero_skills) hero.hero_skills = [];
        if (!hero.hero_skills.includes(skillName)) {
            hero.hero_skills.push(skillName);
            this.saveData('heroes', heroes);
            return true;
        }
        return false;
    }

    equipSkillToHeroByPath(heroId, skillName) {
        return this.equipSkillToHero(heroId, skillName);
    }

    removeSkillFromHero(heroId, skillName) {
        let heroes = this.getData('heroes');
        let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId || h.name === heroId);
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
        let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId || h.name === heroId);
        if (!hero) return { success: false, msg: "البطل غير موجود!" };
        if (!hero.hero_inventory) hero.hero_inventory = [];
        
        if (hero.hero_inventory.some(eq => eq.name === itemObj.name)) {
            return { success: false, msg: "⚠️ هذا البطل يرتدي القطعة بالفعل!" };
        }

        hero.hero_inventory.push(itemObj);
        this.saveData('heroes', heroes);
        return { success: true, msg: "✨ تم إلباس القطعة للبطل بنجاح!" };
    }

    equipItemToHeroByPath(heroId, itemObj) {
        return this.equipItemToHero(heroId, itemObj);
    }

    unequipItemFromHero(heroId, itemName) {
        let heroes = this.getData('heroes');
        let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId || h.name === heroId);
        if (!hero || !hero.hero_inventory) return { success: false, msg: "⚠️ البطل غير موجود!" };

        let idx = hero.hero_inventory.findIndex(eq => eq.name === itemName);
        if (idx === -1) return { success: false, msg: "⚠️ القطعة غير مجهزة أصلاً لدى هذا البطل!" };

        hero.hero_inventory.splice(idx, 1);
        this.saveData('heroes', heroes);
        return { success: true, msg: "🗑️ تم نزع القطعة بنجاح!" };
    }

    unequipItemFromHeroByPath(heroId, itemName) {
        return this.unequipItemFromHero(heroId, itemName);
    }

    // =========================================================================
    // 📜 دوال إدارة المهام (Quests Management)
    // =========================================================================
    addQuestToHero(heroId, quest) {
        let heroes = this.getData('heroes');
        let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId || h.name === heroId);
        if (!hero) return { success: false, msg: "البطل غير موجود!" };

        if (!hero.hero_quests) hero.hero_quests = [];
        hero.hero_quests.push(quest);
        this.saveData('heroes', heroes);
        return { success: true, msg: "📜 تم قبول المهمة بنجاح!" };
    }

    completeHeroQuest(heroId, questIndex) {
        let heroes = this.getData('heroes');
        let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId || h.name === heroId);
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
        let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId || h.name === heroId);
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
        let hero = heroes.find(h => h.id === heroId || h.hero_name === heroId || h.name === heroId);
        if (!hero) return { success: false, msg: "البطل غير موجود!" };

        let wealth = hero.wealth ?? hero.hero_wealth ?? 100;
        let price = item.price ?? 50;

        if (wealth < price) {
            return { success: false, msg: "عذراً، لا يملك البطل ما يكفي من المال!" };
        }

        hero.wealth = wealth - price;
        hero.hero_wealth = hero.wealth;

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

    buyItemForHero(heroId, item) {
        return this.buyShopItem(heroId, item);
    }
}
