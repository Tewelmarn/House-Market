export type Badge = {
  id:           string;
  name:         string;
  description:  string;
  icon:         string;
  type:         "level" | "action" | "milestone";
  requiredLevel?: number;
};

export type Level = {
  level:      number;
  name:       string;
  color:      string;
  minPoints:  number;
  maxPoints:  number;
  progress:   number; // 0-100
};

export const LEVELS = [
  { level: 1, name: "Newcomer",    color: "#8f6f6c", min: 0     },
  { level: 2, name: "Trader",      color: "#875200", min: 100   },
  { level: 3, name: "Merchant",    color: "#6d5049", min: 300   },
  { level: 4, name: "Elder",       color: "#af101a", min: 700   },
  { level: 5, name: "Chief",       color: "#d32f2f", min: 1500  },
  { level: 6, name: "Legend",      color: "#875200", min: 3000  },
];

export function calculateLevel(points: number): Level {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.min) current = l;
  }
  const idx      = LEVELS.indexOf(current);
  const next     = LEVELS[idx + 1];
  const minPts   = current.min;
  const maxPts   = next?.min ?? current.min + 1000;
  const progress = next ? Math.min(100, Math.round(((points - minPts) / (maxPts - minPts)) * 100)) : 100;

  return {
    level:     current.level,
    name:      current.name,
    color:     current.color,
    minPoints: minPts,
    maxPoints: maxPts,
    progress,
  };
}

export const BADGES: Badge[] = [
  { id: "first_product",  name: "First Listing",   description: "Listed your first product",       icon: "??", type: "action"    },
  { id: "first_sale",     name: "First Sale",       description: "Made your first sale",            icon: "??", type: "action"    },
  { id: "five_reviews",   name: "Well Reviewed",    description: "Received 5 positive reviews",     icon: "?", type: "milestone" },
  { id: "affiliate_pro",  name: "Affiliate Pro",    description: "Generated 10 affiliate clicks",   icon: "??", type: "milestone" },
  { id: "level_2",        name: "Trader",           description: "Reached Trader level",            icon: "??", type: "level",     requiredLevel: 2 },
  { id: "level_3",        name: "Merchant",         description: "Reached Merchant level",          icon: "??", type: "level",     requiredLevel: 3 },
  { id: "level_4",        name: "Elder",            description: "Reached Elder level",             icon: "??", type: "level",     requiredLevel: 4 },
  { id: "level_5",        name: "Chief",            description: "Reached Chief level",             icon: "??", type: "level",     requiredLevel: 5 },
  { id: "level_6",        name: "Legend",           description: "Reached Legend status",           icon: "??", type: "level",     requiredLevel: 6 },
  { id: "community_star", name: "Community Star",   description: "Shared 5 affiliate links",        icon: "??", type: "milestone" },
];

export const POINT_EVENTS = {
  PRODUCT_CREATED:    10,
  PRODUCT_SOLD:       50,
  REVIEW_RECEIVED:    20,
  AFFILIATE_CLICK:     2,
  AFFILIATE_CONVERT:  30,
  DAILY_LOGIN:         5,
} as const;
