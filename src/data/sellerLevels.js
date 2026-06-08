export const SELLER_LEVELS = [
  { level: 1,  name: 'Haus Wantok',      minPts: 0,     maxPts: 199,   group: 'starter',      maxProducts: 1,    perks: ['1 shop', 'basic profile'] },
  { level: 2,  name: 'Stoa Nupela',       minPts: 200,   maxPts: 499,   group: 'starter',      maxProducts: 2,    perks: ['2 products', 'community chat'] },
  { level: 3,  name: 'Wok Wok',           minPts: 500,   maxPts: 899,   group: 'starter',      maxProducts: 5,    perks: ['5 products', 'chat history'] },
  { level: 4,  name: 'Gutpela Stat',      minPts: 900,   maxPts: 1399,  group: 'starter',      maxProducts: 10,   perks: ['10 products', 'affiliate links'] },
  { level: 5,  name: 'Ples Bisnis',       minPts: 1400,  maxPts: 1999,  group: 'starter',      maxProducts: 15,   perks: ['15 products', 'WhatsApp badge'] },
  { level: 6,  name: 'Hausman',           minPts: 2000,  maxPts: 2799,  group: 'growing',      maxProducts: 20,   perks: ['20 products', 'verified eligible'] },
  { level: 7,  name: 'Treda Wantok',      minPts: 2800,  maxPts: 3699,  group: 'growing',      maxProducts: 25,   perks: ['25 products', 'bulk tools'] },
  { level: 8,  name: 'Bisnis Meri/Man',   minPts: 3700,  maxPts: 4699,  group: 'growing',      maxProducts: 30,   perks: ['30 products', 'promo banners'] },
  { level: 9,  name: 'Mipela Stoa',       minPts: 4700,  maxPts: 5799,  group: 'growing',      maxProducts: 40,   perks: ['40 products', 'priority chat'] },
  { level: 10, name: 'Strongpela Bisnis', minPts: 5800,  maxPts: 7099,  group: 'growing',      maxProducts: 50,   perks: ['50 products', 'basic analytics'] },
  { level: 11, name: 'Bigman Treda',      minPts: 7100,  maxPts: 8699,  group: 'established',  maxProducts: 60,   perks: ['60 products', 'search boost'] },
  { level: 12, name: 'Narapela Lain',     minPts: 8700,  maxPts: 10499, group: 'established',  maxProducts: 75,   perks: ['75 products', 'multi-manager'] },
  { level: 13, name: 'Stoa Bilong PNG',   minPts: 10500, maxPts: 12599, group: 'established',  maxProducts: 100,  perks: ['100 products', 'pro analytics'] },
  { level: 14, name: 'Komuniti Lida',     minPts: 12600, maxPts: 14999, group: 'established',  maxProducts: null, perks: ['unlimited products', 'homepage feature'] },
  { level: 15, name: 'Provins Bigman',    minPts: 15000, maxPts: 17699, group: 'established',  maxProducts: null, perks: ['province leaderboard pin'] },
  { level: 16, name: 'Haus Lida',         minPts: 17700, maxPts: 20699, group: 'elite',        maxProducts: null, perks: ['national leaderboard entry'] },
  { level: 17, name: 'Nambawan Treda',    minPts: 20700, maxPts: 24099, group: 'elite',        maxProducts: null, perks: ['early plugin access'] },
  { level: 18, name: 'Bird of Paradise',  minPts: 24100, maxPts: 27999, group: 'elite',        maxProducts: null, perks: ['featured seller spotlight'] },
  { level: 19, name: 'PNG Champion',      minPts: 28000, maxPts: 32499, group: 'elite',        maxProducts: null, perks: ['custom shop banner'] },
  { level: 20, name: 'Haus Warlord',      minPts: 32500, maxPts: null,  group: 'elite',        maxProducts: null, perks: ['all perks', 'Warlord crown'] },
];

export function getLevelByPoints(points) {
  return [...SELLER_LEVELS].reverse().find(l => points >= l.minPts) ?? SELLER_LEVELS[0];
}

export function getNextLevel(currentLevel) {
  return SELLER_LEVELS.find(l => l.level === currentLevel + 1) ?? null;
}

export function getLevelProgress(points) {
  const current = getLevelByPoints(points);
  const next = getNextLevel(current.level);
  if (!next) return { current, next: null, percent: 100, ptsNeeded: 0 };
  const range = next.minPts - current.minPts;
  const earned = points - current.minPts;
  return {
    current,
    next,
    percent: Math.min(100, Math.round((earned / range) * 100)),
    ptsNeeded: next.minPts - points,
  };
}
