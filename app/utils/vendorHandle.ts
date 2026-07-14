export function vendorHandle(name?: string | null): string {
  if (!name) return '@vendeur';
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
  return `@${slug || 'vendeur'}`;
}
