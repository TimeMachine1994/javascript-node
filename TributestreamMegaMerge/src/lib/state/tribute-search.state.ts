import type { Tribute, PaginatedResponse } from '$lib/types/api';

class TributeSearchState {
    searchQuery = $state('');
    tributes = $state<Tribute[]>([]);
    filteredTributes = $state<Tribute[]>([]);
    isLoading = $state(false);
    error = $state<Error | null>(null);
    
    constructor() {
        // Effect to handle filtering
        $effect(() => {
            this.filterTributes();
        });
    }
    
    private filterTributes() {
        if (!this.searchQuery.trim()) {
            this.filteredTributes = this.tributes;
            return;
        }
        
        const terms = this.searchQuery.toLowerCase().split(' ');
        this.filteredTributes = this.tributes.filter(tribute => {
            const searchableFields = [
                tribute.title,
                tribute.content,
                tribute.author || '',
                tribute.excerpt || ''
            ];
            
            return terms.every(term =>
                searchableFields.some(field => 
                    field.toLowerCase().includes(term)
                )
            );
        });
    }
    
    async loadTributes() {
        try {
            this.isLoading = true;
            this.error = null;
            
            const response = await fetch('/api/tributes?per_page=100');
            const data = await response.json() as PaginatedResponse<Tribute>;
            
            if ('error' in data) {
                throw new Error(data.message || 'Failed to load tributes');
            }
            
            this.tributes = data.items || [];
        } catch (err) {
            this.error = err instanceof Error ? err : new Error('Failed to load tributes');
            console.error('Failed to load tributes:', err);
        } finally {
            this.isLoading = false;
        }
    }
}

export const tributeSearchState = new TributeSearchState();