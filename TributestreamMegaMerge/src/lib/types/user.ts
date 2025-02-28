/**
 * User data model types for the Tributestream platform
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

export enum UserRole {
  FAMILY_MEMBER = 'family_member',
  FUNERAL_DIRECTOR = 'funeral_director',
  CONTRIBUTOR = 'contributor',
  ADMIN = 'admin'
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
  };
  error?: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
  };
  displayMode: 'light' | 'dark' | 'system';
  timezone?: string;
}

export interface UserMetadata {
  memorial_form_data?: string; // JSON string of MemorialFormData
  calculator_data?: string;    // JSON string of CalculatorData
  payment_history?: string;    // JSON string of payment records
  recent_activity?: string;    // JSON string of user activity log
}