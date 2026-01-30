import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/security/encryption';
import { generateTokenPair } from '@/lib/security/jwt';
import { mockAuthService } from '@/lib/mock-auth-service';

// Try to import database, but handle if it's not available
let db: any = null;
let users: any = null;
let userSessions: any = null;
let eq: any = null;

try {
  const dbModule = require('@/lib/db/client');
  const schemaModule = require('@/lib/db/schema');
  db = dbModule.db;
  users = schemaModule.users;
  userSessions = schemaModule.userSessions;
  const drizzleModule = require('drizzle-orm');
  eq = drizzleModule.eq;
} catch (error) {
  console.warn('⚠️ Database not available, using mock mode');
}

const USE_MOCK_MODE = !db || !process.env.DATABASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // MOCK MODE - No database required
    if (USE_MOCK_MODE) {
      console.log('🔧 Using mock authentication (no database)');
      
      try {
        const user = await mockAuthService.login(email, password);
        const { accessToken, refreshToken } = generateTokenPair(user.id, user.email);
        
        return NextResponse.json({
          success: true,
          data: {
            user,
            accessToken,
            refreshToken,
          },
        });
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: error.message || 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    // DATABASE MODE - Full authentication
    try {
      // Find user
      const user = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      // Verify password
      const isValidPassword = await verifyPassword(password, user.passwordHash);
      
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      // Check if user is active
      if (!user.isActive) {
        return NextResponse.json(
          { success: false, error: 'Account is deactivated' },
          { status: 403 }
        );
      }
      
      // Generate tokens
      const { accessToken, refreshToken } = generateTokenPair(user.id, user.email);
      
      // Store refresh token in database
      await db.insert(userSessions).values({
        userId: user.id,
        refreshToken,
        deviceInfo: request.headers.get('user-agent') || 'Unknown',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      
      // Update last login
      await db.update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));
      
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            emailVerified: user.emailVerified,
            mfaEnabled: user.mfaEnabled,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (dbError: any) {
      console.error('Database error, falling back to mock mode:', dbError.message);
      
      // Fallback to mock mode if database fails
      try {
        const user = await mockAuthService.login(email, password);
        const { accessToken, refreshToken } = generateTokenPair(user.id, user.email);
        
        return NextResponse.json({
          success: true,
          data: {
            user,
            accessToken,
            refreshToken,
          },
        });
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: error.message || 'Invalid credentials' },
          { status: 401 }
        );
      }
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
