import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging class names and handling Tailwind conflicts
 * Combines the functionality of clsx for conditional classes
 * with tailwind-merge to handle Tailwind class conflicts
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * // Basic usage
 * <div class={cn('text-red-500', 'font-bold')}>Text</div>
 * 
 * @example
 * // Conditional classes
 * <div class={cn('text-black', isActive && 'text-blue-500')}>Text</div>
 * 
 * @example
 * // Tailwind conflict resolution
 * <div class={cn('px-4', props.className)}>Text</div>
 * // If props.className includes 'px-2', it will override the px-4
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}