import type { ParsedCookieData } from '$lib/types/user-store';
import type { UserMetadata } from '$lib/types/user-metadata';
import { USER_DATA_ERROR_TYPES, UserDataError } from '$lib/types/user-store';

/**
 * Parse and validate JWT token from cookie
 * @param cookieStr - Raw cookie string
 * @returns Parsed token string or null
 */
function parseToken(cookieStr: string): string | null {
  const tokenMatch = cookieStr.match(/jwt_token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

/**
 * Validate the structure of parsed user data
 * @param data - Data to validate
 * @returns true if valid, throws error if invalid
 */
function validateUserData(data: unknown): data is UserMetadata {
  if (!data || typeof data !== 'object') {
    throw new UserDataError(
      USER_DATA_ERROR_TYPES.PARSE_ERROR,
      'Invalid user data structure'
    );
  }

  const userData = data as Partial<UserMetadata>;

  // Check for required top-level properties
  if (!userData.memorial_form_data || !userData.calculator_data) {
    throw new UserDataError(
      USER_DATA_ERROR_TYPES.MISSING_DATA,
      'Missing required user data fields'
    );
  }

  // Validate memorial form data structure
  const memorial = userData.memorial_form_data;
  if (!memorial.director || !memorial.familyMember || !memorial.deceased || !memorial.contact) {
    throw new UserDataError(
      USER_DATA_ERROR_TYPES.MISSING_DATA,
      'Missing required memorial form fields'
    );
  }

  return true;
}

/**
 * Parse user data from cookie
 * @param cookieStr - Raw cookie string
 * @returns Parsed cookie data
 */
function parseUserData(cookieStr: string): UserMetadata | null {
  const userDataMatch = cookieStr.match(/user_data=([^;]+)/);
  if (!userDataMatch) return null;

  try {
    const decodedData = decodeURIComponent(userDataMatch[1]);
    const parsedData = JSON.parse(decodedData);
    
    if (validateUserData(parsedData)) {
      return parsedData;
    }
    
    return null;
  } catch (error) {
    if (error instanceof UserDataError) {
      throw error;
    }
    throw new UserDataError(
      USER_DATA_ERROR_TYPES.PARSE_ERROR,
      'Failed to parse user data'
    );
  }
}

/**
 * Parse and validate cookies containing user data and token
 * @param cookieStr - Raw cookie string from request
 * @returns Parsed cookie data with token and user data
 */
export function parseCookies(cookieStr: string): ParsedCookieData {
  if (!cookieStr) {
    return { token: null, userData: null };
  }

  const token = parseToken(cookieStr);
  if (!token) {
    throw new UserDataError(
      USER_DATA_ERROR_TYPES.INVALID_TOKEN,
      'Missing or invalid JWT token'
    );
  }

  const userData = parseUserData(cookieStr);

  return {
    token,
    userData
  };
}