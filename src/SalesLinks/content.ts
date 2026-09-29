// Все тексты ролика в одном месте — правьте здесь, не трогая анимацию.

export const HOOK = [
  { text: "Реклама работает", ok: true },
  { text: "Заявки идут", ok: true },
  { text: "А продажи стоят", ok: false },
];

export const ISOLATED_TITLE = "По отдельности\nвсё «нормально»";

export const HIDDEN_TITLE = "Проблема —\nв связках между ними";

// Узлы сети: id, подпись, позиция центра на кадре 1080×1920
export const NODES = [
  { id: "ads", label: "Реклама", x: 285, y: 600 },
  { id: "leads", label: "Заявки", x: 795, y: 600 },
  { id: "managers", label: "Менеджеры", x: 285, y: 900 },
  { id: "deals", label: "Сделки", x: 795, y: 900 },
  { id: "discounts", label: "Скидки", x: 285, y: 1200 },
  { id: "profit", label: "Прибыль", x: 795, y: 1200 },
] as const;

export type NodeId = (typeof NODES)[number]["id"];

// Скрытые связки, которые ролик «вскрывает» по очереди
export const LINKS: {
  from: NodeId;
  to: NodeId;
  caption: string;
}[] = [
  {
    from: "ads",
    to: "deals",
    caption: "Дешёвые заявки из рекламы\nредко доходят до сделки",
  },
  {
    from: "managers",
    to: "leads",
    caption: "Ответ через час вместо 5 минут —\nи клиент уже у конкурента",
  },
  {
    from: "discounts",
    to: "profit",
    caption: "Скидки растят заказы,\nно съедают прибыль",
  },
];

export const SOLUTION_TITLE = "Аналитика\nнаходит эти связки";
export const SOLUTION_SUB = "и показывает, где\nвы теряете продажи";

export const CTA_TITLE = "Узнайте, что мешает\nрасти вашим продажам";
export const CTA_BUTTON = "Разбор ваших данных";
export const CTA_SITE = "analytic-pro.ru";
