import type { Tribute } from '$lib/types/tribute';
import { TributeVisibility } from '$lib/types/tribute';

/**
 * Fetch a tribute by its slug
 * @param slug The slug of the tribute to fetch
 * @returns The tribute data or null if not found
 */
export async function getTributeBySlug(slug: string): Promise<Tribute | null> {
  try {
    const response = await fetch(`/api/tributes/by-slug?slug=${encodeURIComponent(slug)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tribute: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tribute by slug:', error);
    return null;
  }
}

/**
 * Search for tributes by name
 * @param query The search query
 * @returns Array of matching tributes
 */
export async function searchTributes(query: string): Promise<Tribute[]> {
  try {
    const response = await fetch(`/api/tributes?search=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching tributes:', error);
    return [];
  }
}

/**
 * Create a new tribute
 * @param tributeData The tribute data to create
 * @returns The created tribute or null if failed
 */
export async function createTribute(tributeData: Omit<Tribute, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tribute | null> {
  try {
    const response = await fetch('/api/tributes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tributeData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create tribute: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating tribute:', error);
    return null;
  }
}

/**
 * Update an existing tribute
 * @param id The ID of the tribute to update
 * @param tributeData The tribute data to update
 * @returns The updated tribute or null if failed
 */
export async function updateTribute(id: string, tributeData: Partial<Tribute>): Promise<Tribute | null> {
  try {
    const response = await fetch(`/api/tributes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tributeData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update tribute: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating tribute:', error);
    return null;
  }
}

/**
 * Mock data for development
 * This is useful for building UI components without a working backend
 */
export function getMockTributes(count: number = 5): Tribute[] {
  const tributes: Tribute[] = [];
  
  const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'William', 'Patricia', 'James', 'Jennifer', 'Michael', 'Linda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const slug = fullName.toLowerCase().replace(/\s+/g, '-');
    
    // Generate random dates
    const birthYear = 1930 + Math.floor(Math.random() * 50);
    const deathYear = birthYear + 50 + Math.floor(Math.random() * 30);
    const birthDate = new Date(birthYear, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)).toISOString();
    const deathDate = new Date(deathYear, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)).toISOString();
    
    // Service date is 1-2 weeks after death
    const serviceDate = new Date(new Date(deathDate).getTime() + (7 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1000).toISOString();
    
    tributes.push({
      id: `tribute-${i + 1}`,
      slug,
      deceased: {
        firstName,
        lastName,
        fullName,
        dateOfBirth: birthDate,
        dateOfPassing: deathDate,
        photoUrl: i % 3 === 0 ? `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 10}.jpg` : undefined
      },
      pointOfContact: {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        email: `family${i + 1}@example.com`,
        phone: `555-${100 + i}-${1000 + i}`
      },
      scheduleDetails: {
        date: serviceDate,
        time: `${10 + Math.floor(Math.random() * 7)}:00`,
        locations: [
          {
            name: `${['Peaceful', 'Serene', 'Tranquil', 'Heavenly', 'Sacred'][Math.floor(Math.random() * 5)]} ${['Gardens', 'Chapel', 'Memorial', 'Sanctuary', 'Church'][Math.floor(Math.random() * 5)]}`,
            address: `${100 + i} Main St, Anytown, USA`,
            city: 'Anytown',
            state: 'CA',
            zipCode: '90210',
            startTime: `${10 + Math.floor(Math.random() * 7)}:00`,
            duration: 2
          }
        ],
        duration: 2,
        timeZone: 'America/Los_Angeles'
      },
      visibility: Math.random() > 0.2 ? TributeVisibility.PUBLIC : TributeVisibility.PRIVATE,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return tributes;
}