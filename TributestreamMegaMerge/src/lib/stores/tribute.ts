import { writable, derived } from 'svelte/store';
import type { Tribute } from '$lib/types/tribute';

/**
 * Create a store for managing tribute data
 * Uses a Map for efficient lookups by ID
 */
const createTributeStore = () => {
  const { subscribe, set, update } = writable<Map<string, Tribute>>(new Map());
  
  return {
    subscribe,
    set,
    update,
    
    /**
     * Add a single tribute to the store
     * @param tribute The tribute to add
     */
    addTribute: (tribute: Tribute) => update(tributes => {
      tributes.set(tribute.id, tribute);
      return tributes;
    }),
    
    /**
     * Add multiple tributes to the store
     * @param tributesList The list of tributes to add
     */
    addTributes: (tributesList: Tribute[]) => update(tributes => {
      for (const tribute of tributesList) {
        tributes.set(tribute.id, tribute);
      }
      return tributes;
    }),
    
    /**
     * Get a tribute by ID
     * @param id The ID of the tribute to get
     * @returns The tribute or undefined if not found
     */
    getTribute: (id: string) => {
      let result: Tribute | undefined;
      update(tributes => {
        result = tributes.get(id);
        return tributes;
      });
      return result;
    },
    
    /**
     * Get a tribute by slug
     * @param slug The slug of the tribute to get
     * @returns The tribute or undefined if not found
     */
    getTributeBySlug: (slug: string) => {
      let result: Tribute | undefined;
      update(tributes => {
        for (const tribute of tributes.values()) {
          if (tribute.slug === slug) {
            result = tribute;
            break;
          }
        }
        return tributes;
      });
      return result;
    },
    
    /**
     * Remove a tribute by ID
     * @param id The ID of the tribute to remove
     */
    removeTribute: (id: string) => update(tributes => {
      tributes.delete(id);
      return tributes;
    }),
    
    /**
     * Clear all tributes from the store
     */
    clear: () => set(new Map())
  };
};

// Create and export the main tribute store
export const tributeStore = createTributeStore();

// Derived stores for common operations

/**
 * List of all tributes as an array
 */
export const tributesList = derived(tributeStore, $tributeStore => 
  Array.from($tributeStore.values())
);

/**
 * Most recently updated tributes (up to 5)
 */
export const recentTributes = derived(tributeStore, $tributeStore => 
  Array.from($tributeStore.values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
);