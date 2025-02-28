/**
 * Utilities for creating and handling URL slugs
 */

/**
 * Converts a string to a URL-friendly slug
 * 
 * @param text - Text to convert to a slug
 * @returns URL-friendly slug
 * 
 * @example
 * // Returns "john-doe"
 * slugify("John Doe");
 * 
 * @example
 * // Returns "celebration-of-life"
 * slugify("Celebration of Life!");
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')          // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Generates a tribute slug from a person's name
 * 
 * @param name - Full name of the person
 * @returns URL-friendly slug for the tribute
 * 
 * @example
 * // Returns "celebration-of-life-for-jane-smith"
 * generateTributeSlug("Jane Smith");
 */
export function generateTributeSlug(name: string): string {
  return `celebration-of-life-for-${slugify(name)}`;
}

/**
 * Extracts the name portion from a tribute slug
 * 
 * @param slug - Full tribute slug
 * @returns The name portion of the slug or the original slug if prefix not found
 * 
 * @example
 * // Returns "jane-smith"
 * extractNameFromSlug("celebration-of-life-for-jane-smith");
 */
export function extractNameFromSlug(slug: string): string {
  const prefix = 'celebration-of-life-for-';
  if (slug.startsWith(prefix)) {
    return slug.substring(prefix.length);
  }
  return slug;
}

/**
 * Creates a display name from a slug
 * 
 * @param slug - Slug to convert to display name
 * @returns Human-readable name
 * 
 * @example
 * // Returns "Jane Smith"
 * slugToDisplayName("jane-smith");
 */
export function slugToDisplayName(slug: string): string {
  // Extract name portion if it's a full tribute slug
  const namePortion = extractNameFromSlug(slug);
  
  // Convert to title case with spaces
  return namePortion
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}