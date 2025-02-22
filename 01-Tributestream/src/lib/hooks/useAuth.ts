import { onMount } from 'svelte';
import { writable, derived } from 'svelte/store';
import type { WPUserData } from '$lib/types/user-metadata';
import {
    getToken,
    getUserData,
    validateToken,
    refreshUserData,
    clearAuthData,
    storeAuthData
} from '$lib/utils/auth';

// Create stores for authentication state
const token = writable<string | null>(null);
const userData = writable<WPUserData | null>(null);
const isLoading = writable(true);
const error = writable<string | null>(null);

// Derived store for authentication state
export const isAuthenticated = derived(token, $token => !!$token);

// Initialize authentication state
function initAuth() {
    const storedToken = getToken();
    const storedUserData = getUserData();

    if (storedToken && storedUserData) {
        token.set(storedToken);
        userData.set(storedUserData);
        
        // Validate token and refresh user data
        validateToken(storedToken).then(isValid => {
            if (!isValid) {
                logout();
                error.set('Session expired. Please log in again.');
            } else {
                refreshUserData().then(updatedData => {
                    if (updatedData) {
                        userData.set(updatedData);
                    }
                });
            }
        });
    }

    isLoading.set(false);
}

// Login function
export async function login(username: string, password: string): Promise<boolean> {
    isLoading.set(true);
    error.set(null);

    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            error.set(data.message || 'Login failed');
            return false;
        }

        // Store authentication data
        storeAuthData(data.token, {
            displayName: data.user_display_name,
            email: data.user_email,
            nicename: data.user_nicename,
            roles: data.roles,
            capabilities: data.capabilities,
            isAdmin: data.roles.includes('administrator'),
            metaResult: {
                success: true,
                message: 'Login successful',
                user_id: data.user_id,
                meta_key: 'auth',
                meta_value: data.token
            }
        });

        // Update stores
        token.set(data.token);
        userData.set(getUserData());

        return true;
    } catch (err) {
        console.error('Login error:', err);
        error.set('An error occurred during login');
        return false;
    } finally {
        isLoading.set(false);
    }
}

// Logout function
export function logout() {
    clearAuthData();
    token.set(null);
    userData.set(null);
}

// Hook for components to use
export function useAuth() {
    onMount(() => {
        initAuth();
    });

    return {
        token: { subscribe: token.subscribe },
        userData: { subscribe: userData.subscribe },
        isAuthenticated: { subscribe: isAuthenticated.subscribe },
        isLoading: { subscribe: isLoading.subscribe },
        error: { subscribe: error.subscribe },
        login,
        logout
    };
}

// Helper functions for role and capability checks
export function useRoles() {
    const currentUserData = (): WPUserData | null => {
        let data: WPUserData | null = null;
        userData.subscribe(value => {
            data = value;
        })();
        return data;
    };

    return {
        hasRole: (role: string): boolean => {
            const user = currentUserData();
            return user?.roles?.includes(role) ?? false;
        },
        hasCapability: (capability: string): boolean => {
            const user = currentUserData();
            return user?.capabilities?.[capability] ?? false;
        },
        isAdmin: (): boolean => {
            const user = currentUserData();
            return user?.isAdmin ?? false;
        }
    };
}