// Все тексты ролика — с сайта analytic-pro.ru. Правьте здесь, анимация не пострадает.

export const HOOK = {
  kicker: "АНАЛИЗ ПОКУПАТЕЛЬСКОЙ КОРЗИНЫ",
  lead: "Ваш зал",
  marked: "теряет деньги",
  tail: "на расстоянии\nмежду полками",
};

export const PLAN = {
  titleApart: "Гречка — в одном конце зала,\nтушёнка — в другом",
  titleTogether: "А в чеках они вместе —\nв каждой 12-й покупке",
  titleFix: "Решение — просто\nпереставить полку",
  itemA: "ГРЕЧКА",
  itemB: "ТУШЁНКА",
  receiptsLabel: "1 из 12 чеков",
};

export const CASES_TITLE = "Такие связки видно\nтолько в чеках";

export const CASES = [
  {
    tag: "ПРОДУКТЫ · МАГАЗИН У ДОМА",
    title: "Соус хотели вывести\nкак неликвид",
    found: "в 58% чеков с курицей-гриль",
    result: "+34%",
    resultLabel: "продажи соуса",
  },
  {
    tag: "HORECA · СЕТЬ КОФЕЕН",
    title: "Два лимонада в меню\nотнимали выручку\nдруг у друга",
    found: "развели по разным разделам",
    result: "+22%",
    resultLabel: "выручка по двум позициям",
  },
  {
    tag: "РИТЕЙЛ · ЭЛЕКТРОНИКА",
    title: "После игрового монитора\nпокупают… лампу",
    found: "40% покупателей мониторов",
    result: "+15%",
    resultLabel: "средний чек",
  },
];

export const STATS_TITLE = "На выходе — не отчёт,\nа что переставить";

export const STATS = [
  { value: 500, suffix: "+", label: "связок в чеках\nобычного магазина" },
  { value: 20, suffix: "", label: "отбираем —\nвнедрить сразу" },
  { value: 5, suffix: " дней", label: "от выгрузки\nдо рекомендаций" },
  { value: 0, suffix: " ₽", label: "на внедрение:\nтолько перестановка" },
];

export const CTA = {
  kicker: "БЕСПЛАТНО · ДО 10 МАГАЗИНОВ В МЕСЯЦ",
  title: "Пришлите выгрузку чеков —\nпокажем 3 связки\nв ваших товарах",
  button: "Бесплатный разбор",
  site: "analytic-pro.ru",
  telegram: "Telegram  @analysis_pro_ru",
};
