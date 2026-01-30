import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/security/encryption';
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
    const { name, email, password, phone } = body;
    
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }
    
    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // MOCK MODE - No database required
    if (USE_MOCK_MODE) {
      console.log('🔧 Using mock registration (no database)');
      
      try {
        const user = await mockAuthService.register(name, email, password, phone);
        const { accessToken, refreshToken } = generateTokenPair(user.id, user.email);
        
        return NextResponse.json({
          success: true,
          data: {
            user,
            accessToken,
            refreshToken,
          },
        }, { status: 201 });
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: error.message || 'Registration failed' },
          { status: 409 }
        );
      }
    }
    
    // DATABASE MODE - Full registration
    try {
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 409 }
        );
      }
      
      // Hash password
      const passwordHash = await hashPassword(password);
      
      // Create user
      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase(),
        passwordHash,
        name,
        phone: phone || null,
        emailVerified: false,
        phoneVerified: false,
      }).returning();
      
      // Generate tokens
      const { accessToken, refreshToken } = generateTokenPair(newUser.id, newUser.email);
      
      // Store refresh token in database
      await db.insert(userSessions).values({
        userId: newUser.id,
        refreshToken,
        deviceInfo: request.headers.get('user-agent') || 'Unknown',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            phone: newUser.phone,
          },
          accessToken,
          refreshToken,
        },
      }, { status: 201 });
    } catch (dbError: any) {
      console.error('Database error, falling back to mock mode:', dbError.message);
      
      // Fallback to mock mode if database fails
      try {
        const user = await mockAuthService.register(name, email, password, phone);
        const { accessToken, refreshToken } = generateTokenPair(user.id, user.email);
        
        return NextResponse.json({
          success: true,
          data: {
            user,
            accessToken,
            refreshToken,
          },
        }, { status: 201 });
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: error.message || 'Registration failed' },
          { status: 409 }
        );
      }
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
