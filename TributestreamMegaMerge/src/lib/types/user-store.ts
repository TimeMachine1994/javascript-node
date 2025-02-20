import type { UserMetadata, ApiError } from './user-metadata';

/**
 * Represents the structure of the user store that will be managed at the root layout level
 */
export interface UserStore {
  isLoading: boolean;
  error: ApiError | null;
  data: UserMetadata | null;
}

/**
 * Represents the structure of parsed cookie data
 */
export interface ParsedCookieData {
  token: string | null;
  userData: UserMetadata | null;
}

/**
 * Error types for user data management
 */
export const USER_DATA_ERROR_TYPES = {
  INVALID_TOKEN: 'invalid_token',
  MISSING_DATA: 'missing_data',
  PARSE_ERROR: 'parse_error'
} as const;

export type UserDataErrorType = typeof USER_DATA_ERROR_TYPES[keyof typeof USER_DATA_ERROR_TYPES];

/**
 * Custom error for user data management
 */
export class UserDataError extends Error {
  constructor(
    public type: UserDataErrorType,
    message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = 'UserDataError';
  }
}