// Тексты на экране. Субтитры и тайминг сцен — в captions.json.

export const CHECKOUT = {
  item: "ПИВО СВЕТЛОЕ 0,5",
  price: "119,00",
  missed: "ЧИПСЫ",
  stamp: "НЕ КУПИЛ",
  headline: "Минус чек.",
  headlineTail: "Каждый день.",
};

export const BLIND = {
  counter: 300,
  counterLabel: "раз в день",
  headline: "Продажи ≠ связи",
  left: "Как вы смотрите",
  right: "Как это устроено",
  items: ["Пиво", "Чипсы", "Хлеб", "Молоко"],
  bars: [0.9, 0.55, 0.75, 0.65],
};

export const RECEIPTS = {
  headline: "Ваши чеки знают\nбольше, чем кажется",
  magnet: "магнит",
  killers: "убивают друг друга",
  nodes: [
    { id: "beer", label: "Пиво", x: 270, y: 560 },
    { id: "chips", label: "Чипсы", x: 790, y: 520 },
    { id: "chicken", label: "Курица-гриль", x: 300, y: 790 },
    { id: "sauce", label: "Соус", x: 800, y: 760 },
    { id: "lemonA", label: "Лимонад №1", x: 280, y: 1020 },
    { id: "lemonB", label: "Лимонад №2", x: 790, y: 1020 },
  ],
  links: [
    { from: "beer", to: "chips", kind: "magnet" },
    { from: "chicken", to: "sauce", kind: "magnet" },
    { from: "lemonA", to: "lemonB", kind: "killer" },
  ],
} as const;

export const TYPES_HEADLINE = ["Золотые", "Скрытые", "Опасные"];

// Цифры — из опубликованных кейсов analytic-pro.ru/keysy
export const TYPE_CARDS = [
  {
    kind: "gold",
    tag: "ЗОЛОТАЯ ПАРА · СТАВИТЬ РЯДОМ",
    pair: "Игровой монитор → настольная лампа",
    fact: "40% покупателей монитора\nвозвращаются за лампой",
    lift: "6,2",
    result: "+15%",
    resultLabel: "средний чек",
    source: "КЕЙС: МАГАЗИН ЭЛЕКТРОНИКИ",
  },
  {
    kind: "hidden",
    tag: "СКРЫТАЯ СВЯЗЬ",
    pair: "Курица-гриль → соус к мясу",
    fact: "в 58% чеков с курицей —\nа соус хотели вывести",
    lift: "3,1",
    result: "+34%",
    resultLabel: "продажи соуса",
    source: "КЕЙС: МАГАЗИНЫ У ДОМА",
  },
  {
    kind: "danger",
    tag: "ОПАСНАЯ ПАРА · КАННИБАЛЫ",
    pair: "Облепиховый ↔ малиновый лимонад",
    fact: "делили один спрос:\nвзяли один — второй не нужен",
    lift: "0,4",
    result: "+22%",
    resultLabel: "выручка после разведения",
    source: "КЕЙС: СЕТЬ КОФЕЕН",
  },
] as const;

export const REPORT = {
  headline: "Топ-20 решений\nс метриками",
  slideTitle: "ТОП-20 РЕКОМЕНДАЦИЙ",
  rows: [
    { action: "ПЕРЕСТАВИТЬ", text: "Тушёнку — к крупам", lift: "2,4" },
    { action: "КОМПЛЕКТ", text: "Курица-гриль + соус", lift: "3,1" },
    { action: "УБРАТЬ ИЗ ПРОМО", text: "Лимонад №2", lift: "0,4" },
  ],
  more: "…и ещё 17 решений",
  rule: {
    title: "Купили гречку — возьмут тушёнку",
    metrics: [
      { name: "SUPPORT", value: "8%" },
      { name: "CONFIDENCE", value: "63%" },
      { name: "LIFT", value: "2,4" },
    ],
    explain:
      "Связь в 2,4 раза сильнее случайной.\nПолку с тушёнкой — рядом с крупами.",
  },
};

export const ONLY_EXPORT = {
  headline: "Только выгрузка чеков",
  crossed: ["Внедрение систем", "Доступ к кассе", "Участие IT"],
  file: "чеки.csv",
  rows: [
    ["004812", "Пиво светлое"],
    ["004812", "Чипсы"],
    ["004813", "Гречка"],
    ["004813", "Тушёнка"],
  ],
  chips: ["Разово", "Быстро", "Понятно"],
};

export const FINAL = {
  kicker: "БЕСПЛАТНО · ДО 10 МАГАЗИНОВ В МЕСЯЦ",
  title: "Бесплатный\nэкспресс-разбор",
  sub: "3 находки по вашим чекам\nза 2 рабочих дня",
  site: "analytic-pro.ru",
  telegram: "Telegram  @analysis_pro_ru",
  email: "vladlitvinko@mail.ru",
  arrow: "ссылка ниже ↓",
};
