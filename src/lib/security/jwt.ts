import jwt from 'jsonwebtoken';
import { generateSecureToken } from './encryption';

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function getJWTSecret(type: 'access' | 'refresh'): string {
  const secret = type === 'access' 
    ? process.env.JWT_SECRET 
    : process.env.JWT_REFRESH_SECRET;
    
  if (!secret) {
    throw new Error(`JWT_${type.toUpperCase()}_SECRET environment variable is not set`);
  }
  
  return secret;
}

export function generateAccessToken(userId: string, email: string): string {
  const payload: TokenPayload = {
    userId,
    email,
    type: 'access',
  };
  
  return jwt.sign(payload, getJWTSecret('access'), {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(userId: string, email: string): string {
  const payload: TokenPayload = {
    userId,
    email,
    type: 'refresh',
  };
  
  return jwt.sign(payload, getJWTSecret('refresh'), {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, getJWTSecret('access')) as DecodedToken;
    
    if (decoded.type !== 'access') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
}

export function verifyRefreshToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, getJWTSecret('refresh')) as DecodedToken;
    
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch (error) {
    return null;
  }
}

export function generateTokenPair(userId: string, email: string) {
  return {
    accessToken: generateAccessToken(userId, email),
    refreshToken: generateRefreshToken(userId, email),
  };
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}
