import { wordpressPages } from '$lib/pages.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params, fetch }) {
    const { slug } = params;
    const fullSlug = `celebration-of-life-for-${slug}`;
    
    // Check if slug exists in the wordpressPages array
    if (wordpressPages.includes(fullSlug)) {
        // Redirect to WordPress site if slug matches one in the list
        throw redirect(307, `https://wp.tributestream.com/${fullSlug}`);
    }

    // Fetch tribute data using our internal API
    try {
        const response = await fetch(`/api/tributes/by-slug/${slug}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching tribute:', errorData);
            
            if (response.status === 404) {
                throw error(404, 'Tribute not found');
            } else {
                throw error(response.status, errorData.message || 'Failed to load tribute data');
            }
        }

        const tributeData = await response.json();
        
        return {
            tribute: tributeData
        };
    } catch (err: unknown) {
        // If the error is already a SvelteKit error, rethrow it
        if (err && typeof err === 'object' && 'status' in err && 'body' in err) {
            throw err;
        }
        
        console.error('Error in load function:', err);
        throw error(500, 'Failed to load tribute data');
    }
}