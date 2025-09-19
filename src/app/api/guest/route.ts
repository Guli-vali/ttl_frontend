import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    // Create guest user
    const guestUser = await authApi.guestLogin();

    return NextResponse.json({
      success: true,
      user: guestUser,
      message: 'Guest account created successfully'
    });
  } catch (error) {
    console.error('Error creating guest user:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create guest account'
      },
      { status: 500 }
    );
  }
}