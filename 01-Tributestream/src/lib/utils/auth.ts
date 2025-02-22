/**
 * Authentication utilities for handling JWT tokens and user sessions
 */

import type { WPUserData } from '$lib/types/user-metadata';

// Constants
const TOKEN_KEY = 'tributestream_token';
const USER_DATA_KEY = 'tributestream_user';

/**
 * Store the JWT token and user data in localStorage
 */
export function storeAuthData(token: string, userData: WPUserData): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

/**
 * Clear authentication data from localStorage
 */
export function clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
}

/**
 * Get the stored JWT token
 */
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the stored user data
 */
export function getUserData(): WPUserData | null {
    const data = localStorage.getItem(USER_DATA_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}

/**
 * Check if the user has a specific role
 */
export function hasRole(role: string): boolean {
    const userData = getUserData();
    return userData?.roles?.includes(role) ?? false;
}

/**
 * Check if the user has a specific capability
 */
export function hasCapability(capability: string): boolean {
    const userData = getUserData();
    return userData?.capabilities?.[capability] ?? false;
}

/**
 * Get headers for authenticated requests
 */
export function getAuthHeaders(): HeadersInit {
    const token = getToken();
    return token
        ? {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          }
        : {
              'Content-Type': 'application/json',
          };
}

/**
 * Validate a JWT token
 * @param token The JWT token to validate
 * @returns Promise that resolves to true if token is valid
 */
export async function validateToken(token: string): Promise<boolean> {
    try {
        const response = await fetch('https://wp.tributestream.com/wp-json/jwt-auth/v1/token/validate', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            clearAuthData();
            return false;
        }

        const data = await response.json();
        return data.code === 'jwt_auth_valid_token';
    } catch (error) {
        console.error('Error validating token:', error);
        clearAuthData();
        return false;
    }
}

/**
 * Refresh user data from the server
 * This is useful when user roles or capabilities might have changed
 */
export async function refreshUserData(): Promise<WPUserData | null> {
    const token = getToken();
    if (!token) return null;

    try {
        const response = await fetch('https://wp.tributestream.com/wp-json/tributestream/v1/user-cap', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            clearAuthData();
            return null;
        }

        const data = await response.json();
        const userData = getUserData();
        if (userData && data.roles && data.capabilities) {
            const updatedUserData = {
                ...userData,
                roles: data.roles,
                capabilities: data.capabilities,
            };
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUserData));
            return updatedUserData;
        }
    } catch (error) {
        console.error('Error refreshing user data:', error);
    }

    return null;
}