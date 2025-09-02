import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredGuests } from '@/lib/utils/guestUtils';

export async function POST(request: NextRequest) {
  try {
    // Проверяем секретный ключ для безопасности
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CLEANUP_SECRET_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized'
        },
        { status: 401 }
      );
    }

    // Очищаем просроченные гостевые аккаунты
    const deletedCount = await cleanupExpiredGuests();
    
    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Удалено ${deletedCount} просроченных гостевых аккаунтов`
    });
  } catch (error) {
    console.error('Error cleaning up expired guests:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Не удалось очистить просроченные аккаунты'
      },
      { status: 500 }
    );
  }
}
