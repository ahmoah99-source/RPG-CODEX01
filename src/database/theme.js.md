// قاموس الثيمات والألوان الكامل
export const themesMap = {
    lightSimple: { name: "☀️ الوضع الفاتح البسيط", mainBg: "#f4f6f9", text: "#1e293b", accent: "#2563eb", navBg: "rgba(255, 255, 255, 0.9)", navBorder: "#cbd5e1" },
    minimal: { name: "✨ البساطة المطلقة", mainBg: "#16161a", text: "#fffffe", accent: "#70a1ff", navBg: "rgba(36, 36, 46, 0.9)", navBorder: "rgba(255,255,255,0.1)" },
    glass: { name: "🔮 الزجاج المزجج المتقدم", mainBg: "rgba(240, 244, 248, 0.9)", text: "#1e293b", accent: "#3b82f6", navBg: "rgba(255, 255, 255, 0.8)", navBorder: "#4a90e2" },
    darkGlass: { name: "🌑 الزجاج المظلم المتوهج", mainBg: "#0f0f14", text: "#f8f8f2", accent: "#bd93f9", navBg: "rgba(25, 25, 35, 0.8)", navBorder: "#8a2be2" },
    cyber: { name: "⚡ النيون السيبراني", mainBg: "#020202", text: "#ffffff", accent: "#00ffcc", navBg: "rgba(10, 15, 13, 0.9)", navBorder: "#00ffcc" },
    vintage: { name: "📜 المخطوطة الملكية", mainBg: "#190d2e", text: "#f3e5ab", accent: "#ffd700", navBg: "rgba(44, 22, 84, 0.8)", navBorder: "#c5a059" },
    luxeGold: { name: "👑 الذهب الملكي الفاخر", mainBg: "#08080a", text: "#f5f6fa", accent: "#d4af37", navBg: "rgba(20, 20, 24, 0.9)", navBorder: "#d4af37" },
    neumorph: { name: "🧊 الظلال البارزة", mainBg: "#1e1e2f", text: "#ffffff", accent: "#70a1ff", navBg: "rgba(23, 23, 36, 0.9)", navBorder: "rgba(255,255,255,0.08)" },
    pastel: { name: "🌸 الباستيل الحالم", mainBg: "#fdf6f9", text: "#4a404a", accent: "#ff6f91", navBg: "rgba(255, 255, 255, 0.9)", navBorder: "#ffb7b2" },
    organic: { name: "🌿 نمط الطبيعة الساحر", mainBg: "#0f1610", text: "#cad2c5", accent: "#84a98c", navBg: "rgba(27, 38, 28, 0.9)", navBorder: "#52796f" },
    terminal: { name: "💻 الطرفية الكلاسيكية", mainBg: "#010301", text: "#00ff66", accent: "#00ff66", navBg: "rgba(5, 15, 5, 0.9)", navBorder: "#00ff66" }
};

// قاموس اللغات والنصوص الافتراضية
export const dicts = {
    ar: {
        title: "الصفحة الرئيسية",
        heroesTitle: "قائمة الشخصيات والأبطال",
        settingsTitle: "لوحة الإعدادات",
        editHeroTitle: "لوحة التحكم والتعديل الشاملة",
        addHeroTitle: "لوحة إضافة بطل جديد",
        themesPageTitle: "اختر النمط (الثيم)",
        welcomeMsg: "مرحباً بك أيها البطل",
        welcomeSub: "لم تقترن بأي بطل بعد. اختر بطل من القائمة أو أنشئ بطل جديد للبدء.",
        selectHeroBtn: "استعراض الأبطال",
        searchPlaceholder: "ابحث عن بطل...",
        themeBtnLabel: "🎨 تخصيص الثيمات والأنماط",
        langBtnLabel: "🌐 تبديل لغة النظام (Language)",
        selectBtnText: "تعيين رئيسي",
        detailsBtnText: "التفاصيل",
        statsLabel: "📊 إحصائيات البطل الأساسية"
    }
};
// دالة لجلب الثيم بناءً على المفتاح، ولو مش موجود ترجع الافتراضي
export function getTheme(themeName) {
    return themesMap[themeName] || themesMap.darkGlass;
}
