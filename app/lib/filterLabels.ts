export const CONDITION_OPTIONS = [
  { value: 'NEW', label: 'Neuf' },
  { value: 'VERY_GOOD', label: 'Très bon état' },
  { value: 'GOOD', label: 'Bon état' },
  { value: 'FAIR', label: 'Satisfaisant' },
] as const;

export const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', '44'] as const;

export const COLOR_OPTIONS = [
  'noir',
  'blanc',
  'rouge',
  'bleu',
  'vert',
  'jaune',
  'rose',
  'beige',
  'marron',
  'gris',
  'multicolore',
] as const;

export const COLOR_HEX: Record<string, string> = {
  noir: '#1a1a1a',
  blanc: '#ffffff',
  rouge: '#dc2626',
  bleu: '#2563eb',
  vert: '#16a34a',
  jaune: '#facc15',
  rose: '#ec4899',
  beige: '#e3d9c6',
  marron: '#7c4a2d',
  gris: '#9ca3af',
  multicolore: 'conic-gradient(red, orange, yellow, green, blue, violet, red)',
};

export const MATERIAL_OPTIONS = [
  'coton',
  'cuir',
  'denim',
  'laine',
  'soie',
  'polyester',
  'lin',
  'velours',
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'popularity', label: 'Popularité' },
] as const;

export const FILTER_LABELS: Record<string, string> = {
  condition: 'État',
  size: 'Taille',
  color: 'Couleur',
  material: 'Matière',
  brand: 'Marque',
  price_min: 'Prix min',
  price_max: 'Prix max',
  category: 'Catégorie',
  subcategory: 'Sous-catégorie',
  tag: 'Tag',
};

export function formatFilterValue(key: string, value: string): string {
  if (key === 'condition') {
    return CONDITION_OPTIONS.find((o) => o.value === value)?.label ?? value;
  }
  if (key === 'sort') {
    return SORT_OPTIONS.find((o) => o.value === value)?.label ?? value;
  }
  if (key === 'price_min' || key === 'price_max') {
    return `${Number(value).toLocaleString('fr-FR')} FCFA`;
  }
  return value;
}
