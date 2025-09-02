import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api/auth';
import type { GuestUpgradeData } from '@/types/profile';

export async function POST(request: NextRequest) {
  try {
    const body: GuestUpgradeData = await request.json();
    
    // Валидация данных
    if (!body.email || !body.password || !body.passwordConfirm || !body.name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Все поля обязательны для заполнения'
        },
        { status: 400 }
      );
    }

    if (body.password !== body.passwordConfirm) {
      return NextResponse.json(
        {
          success: false,
          message: 'Пароли не совпадают'
        },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Пароль должен содержать минимум 6 символов'
        },
        { status: 400 }
      );
    }

    // Обновляем гостевой аккаунт
    const updatedUser = await authApi.upgradeGuest(body);
    
    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Аккаунт успешно обновлен'
    });
  } catch (error) {
    console.error('Error upgrading guest account:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Не удалось обновить аккаунт'
      },
      { status: 500 }
    );
  }
}
