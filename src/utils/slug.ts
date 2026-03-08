export function slugify(value: string): string {
  return value
    .normalize("NFD")                 
    .replace(/[\u0300-\u036f]/g, "")  
    .toLowerCase()                    
    .trim()                           
    .replace(/[^a-z0-9\s-]/g, "")     
    .replace(/\s+/g, "-")             
    .replace(/-+/g, "-");             
}

export async function buildUniqueSlug(
  value: string,
  slugExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = slugify(value);

  let slug = baseSlug;
  let suffix = 2;

  while (await slugExists(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  return slug;
}