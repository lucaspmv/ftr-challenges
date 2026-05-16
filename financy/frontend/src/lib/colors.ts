export const CATEGORY_COLORS = [
  'blue','purple','pink','red','orange','yellow','green',
] as const;
export type CategoryColor = typeof CATEGORY_COLORS[number];

export const TAG_CLASSES: Record<CategoryColor, string> = {
  blue:   'bg-cat-blue-light text-cat-blue-dark',
  purple: 'bg-cat-purple-light text-cat-purple-dark',
  pink:   'bg-cat-pink-light text-cat-pink-dark',
  red:    'bg-cat-red-light text-cat-red-dark',
  orange: 'bg-cat-orange-light text-cat-orange-dark',
  yellow: 'bg-cat-yellow-light text-cat-yellow-dark',
  green:  'bg-cat-green-light text-cat-green-dark',
};

export const ICON_BG_CLASSES: Record<CategoryColor, string> = {
  blue:   'bg-cat-blue-light text-cat-blue-base',
  purple: 'bg-cat-purple-light text-cat-purple-base',
  pink:   'bg-cat-pink-light text-cat-pink-base',
  red:    'bg-cat-red-light text-cat-red-base',
  orange: 'bg-cat-orange-light text-cat-orange-base',
  yellow: 'bg-cat-yellow-light text-cat-yellow-base',
  green:  'bg-cat-green-light text-cat-green-base',
};

export const SWATCH_CLASSES: Record<CategoryColor, string> = {
  blue:   'bg-cat-blue-base',
  purple: 'bg-cat-purple-base',
  pink:   'bg-cat-pink-base',
  red:    'bg-cat-red-base',
  orange: 'bg-cat-orange-base',
  yellow: 'bg-cat-yellow-base',
  green:  'bg-cat-green-base',
};

export const RING_CLASSES: Record<CategoryColor, string> = {
  blue:   'ring-cat-blue-base',
  purple: 'ring-cat-purple-base',
  pink:   'ring-cat-pink-base',
  red:    'ring-cat-red-base',
  orange: 'ring-cat-orange-base',
  yellow: 'ring-cat-yellow-base',
  green:  'ring-cat-green-base',
};
