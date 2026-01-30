import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { kycData } from '@/lib/db/schema';
import { verifyAccessToken } from '@/lib/security/jwt';
import { encryptField } from '@/lib/security/encryption';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { aadhaarNumber, panNumber, address, city, state, pincode, dob } = body;
    
    // Validation
    if (!aadhaarNumber || !panNumber) {
      return NextResponse.json(
        { success: false, error: 'Aadhaar and PAN are required' },
        { status: 400 }
      );
    }
    
    // Validate Aadhaar format (12 digits)
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Aadhaar number format' },
        { status: 400 }
      );
    }
    
    // Validate PAN format (ABCDE1234F)
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid PAN number format' },
        { status: 400 }
      );
    }
    
    // Check if KYC already exists
    const existingKyc = await db.query.kycData.findFirst({
      where: eq(kycData.userId, decoded.userId),
    });
    
    // Encrypt sensitive data
    const encryptedAadhaar = encryptField(aadhaarNumber);
    const encryptedPan = encryptField(panNumber);
    
    if (existingKyc) {
      // Update existing KYC
      const [updated] = await db.update(kycData)
        .set({
          aadhaarNumber: encryptedAadhaar,
          panNumber: encryptedPan,
          address: address || null,
          city: city || null,
          state: state || null,
          pincode: pincode || null,
          dob: dob ? new Date(dob) : null,
          status: 'PENDING',
          submittedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(kycData.userId, decoded.userId))
        .returning();
      
      return NextResponse.json({
        success: true,
        data: {
          status: updated.status,
          submittedAt: updated.submittedAt,
        },
      });
    } else {
      // Create new KYC
      const [newKyc] = await db.insert(kycData).values({
        userId: decoded.userId,
        aadhaarNumber: encryptedAadhaar,
        panNumber: encryptedPan,
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        dob: dob ? new Date(dob) : null,
        status: 'PENDING',
        submittedAt: new Date(),
      }).returning();
      
      return NextResponse.json({
        success: true,
        data: {
          status: newKyc.status,
          submittedAt: newKyc.submittedAt,
        },
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error('KYC submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Fetch KYC data
    const userKyc = await db.query.kycData.findFirst({
      where: eq(kycData.userId, decoded.userId),
    });
    
    if (!userKyc) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'NOT_STARTED',
        },
      });
    }
    
    // Return KYC status without sensitive data
    return NextResponse.json({
      success: true,
      data: {
        status: userKyc.status,
        submittedAt: userKyc.submittedAt,
        verifiedAt: userKyc.verifiedAt,
        rejectionReason: userKyc.rejectionReason,
        city: userKyc.city,
        state: userKyc.state,
      },
    });
    
  } catch (error) {
    console.error('Get KYC error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
