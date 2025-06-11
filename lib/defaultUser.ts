// lib/defaultUser.ts
export interface DefaultUserType {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
  profileImage?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  verificationStatus: string;
}

export interface DefaultSessionType {
  user: DefaultUserType;
  isAuthenticated: boolean;
  expires: Date;
  token?: string;
}

export const DEFAULT_USER: DefaultUserType = {
  id: 1,
  email: 'default@mavuso.app',
  name: 'Default User',
  password: 'mavuso2024',
  role: 'admin',
  isVerified: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  permissions: [
    'full_access',
    'create_experience',
    'book_experience', 
    'chat',
    'review',
    'admin_panel',
    'manage_users',
    'manage_experiences',
    'manage_bookings',
    'view_analytics'
  ],
  profileImage: '/images/default-avatar.png',
  bio: 'Default system user with full access to all features of the Mavuso dating platform. This account provides unrestricted access to all functionality.',
  location: 'Global',
  interests: ['technology', 'travel', 'food', 'music', 'art', 'fitness', 'adventure', 'culture'],
  verificationStatus: 'verified'
};

export const DEFAULT_SESSION: DefaultSessionType = {
  user: DEFAULT_USER,
  isAuthenticated: true,
  expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  token: 'default-session-token-mavuso-2024'
};

// Helper functions for default user operations
export function getDefaultUser(): DefaultUserType {
  return { ...DEFAULT_USER, updatedAt: new Date() };
}

export function getDefaultSession(): DefaultSessionType {
  return {
    ...DEFAULT_SESSION,
    user: getDefaultUser()
  };
}

export function isDefaultAuthMode(): boolean {
  return process.env.DEFAULT_AUTH_MODE === 'true' || process.env.NODE_ENV === 'development';
}

export function generateDefaultToken(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2);
  return `default_${timestamp}_${randomStr}`;
}

// Validation helpers
export function validateDefaultUser(user: any): boolean {
  return user && user.id === DEFAULT_USER.id && user.email === DEFAULT_USER.email;
}

export function hasPermission(permission: string): boolean {
  return DEFAULT_USER.permissions.includes(permission) || DEFAULT_USER.permissions.includes('full_access');
}

// Constants for the application
export const DEFAULT_USER_CONSTANTS = {
  PASSWORD_HASH: '$2b$10$defaulthashfordefaultuser123456789',
  SESSION_DURATION: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
  TOKEN_PREFIX: 'default_mavuso_',
  COOKIE_NAME: 'mavuso_default_auth',
  HEADER_USER_ID: 'x-user-id',
  HEADER_USER_EMAIL: 'x-user-email',
  HEADER_USER_ROLE: 'x-user-role'
} as const;
