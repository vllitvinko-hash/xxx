// Тексты на экране ролика про ABC-анализ. Субтитры и тайминг — в captions.json.

export const SHELF = {
  headline: "Кто вас кормит?",
  rows: 14,
  cols: 10,
  // ~20 «кормильцев» из 140 позиций
  winners: [
    3, 12, 17, 25, 31, 38, 44, 49, 56, 62, 67, 73, 79, 86, 91, 98, 104, 111,
    119, 127,
  ],
};

export const HISTORY = {
  headline: "1951 · General Electric",
  year: "1951",
  caption: "СКЛАД · GENERAL ELECTRIC",
  person: "Г. Форд Дики",
  role: "менеджер General Electric",
};

// Типичное распределение ABC: доля позиций и доля выручки
export const GROUPS = [
  { key: "A", items: 20, revenue: 80, label: "основная выручка" },
  { key: "B", items: 30, revenue: 15, label: "середина" },
  { key: "C", items: 50, revenue: 5, label: "длинный хвост" },
] as const;

export const GROUPS_NOTE = "ТИПИЧНОЕ РАСПРЕДЕЛЕНИЕ";

export const ARTICLE = {
  headline: "Доллары, а не копейки",
  journal: "FACTORY MANAGEMENT AND MAINTENANCE · 1951",
  original: "ABC Inventory Analysis Shoots for Dollars, Not Pennies",
  translation: "«Охотьтесь за долларами,\nа не за копейками»",
  byline: "H. Ford Dickie, General Electric",
};

export const NAMES = {
  headline: "Парето? Джуран!",
  pareto: {
    initials: "ВП",
    name: "Вильфредо Парето",
    years: "1848–1923 · Италия",
    fact: "80% земли Италии —\nу 20% населения",
  },
  juran: {
    initials: "ДД",
    name: "Джозеф Джуран",
    years: "1904–2008 · США",
    fact: "назвал правило 80/20\nименем Парето",
  },
  clipping: "THE NON-PARETO PRINCIPLE; MEA CULPA",
  clippingYear: "QUALITY PROGRESS · 1975",
  notJuran: "«принцип Джурана»",
};

export const OWNER = {
  headline: "A — никогда\nне кончаются",
  goldShelf: "НА УРОВНЕ ГЛАЗ",
  outOfStock: "НЕТ В НАЛИЧИИ",
  loss: "−₽",
  cut: "НА СОКРАЩЕНИЕ",
};

export const NEXT_LEVEL = {
  headline: "Что продаётся →\nс чем продаётся",
  left: "ЧТО ПРОДАЁТСЯ",
  right: "С ЧЕМ ПРОДАЁТСЯ",
  ranking: ["Курица-гриль", "Хлеб", "Молоко", "Пиво"],
  center: "Курица-гриль",
  companions: ["Соус", "Лаваш", "Овощи"],
  growth: "средний чек ↑",
};

export const CHANNEL = {
  headline: "Больше разборов\nв канале →",
  kicker: "TELEGRAM-КАНАЛ",
  handle: "@analysis_pro_ru",
  url: "https://t.me/analysis_pro_ru",
  sub: "Приёмы для магазинов и кафе",
  arrow: "ссылка в описании ↓",
};

export const COVER = {
  kicker: "ABC-АНАЛИЗ ДЛЯ МАГАЗИНОВ",
  big: ["20%", "80%"],
  line1: "товаров приносят вам",
  line2: "денег.",
  question: "Какие?",
};
