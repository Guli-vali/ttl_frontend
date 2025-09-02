import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    // Создаем гостевого пользователя
    const guestUser = await authApi.guestLogin();
    
    return NextResponse.json({
      success: true,
      user: guestUser,
      message: 'Гостевой аккаунт создан успешно'
    });
  } catch (error) {
    console.error('Error creating guest user:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Не удалось создать гостевой аккаунт'
      },
      { status: 500 }
    );
  }
}
