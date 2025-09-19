import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api/auth';
import type { GuestUpgradeData } from '@/types/profile';

export async function POST(request: NextRequest) {
  try {
    const body: GuestUpgradeData = await request.json();

    // Data validation
    if (!body.email || !body.password || !body.passwordConfirm || !body.name) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required'
        },
        { status: 400 }
      );
    }

    if (body.password !== body.passwordConfirm) {
      return NextResponse.json(
        {
          success: false,
          message: 'Passwords do not match'
        },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must contain at least 6 characters'
        },
        { status: 400 }
      );
    }

    // Update guest account
    const updatedUser = await authApi.upgradeGuest(body);

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Account updated successfully'
    });
  } catch (error) {
    console.error('Error upgrading guest account:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update account'
      },
      { status: 500 }
    );
  }
}
