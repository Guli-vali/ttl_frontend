// src/app/auth/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Globe, Heart, User } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';

const LANGUAGES = [
  'Русский', 'English', 'Español', 'Français', 'Deutsch', 'Italiano',
  '中文', '日本語', '한국어', 'العربية', 'Português', 'Nederlands',
  'Svenska', 'Polski', 'Türkçe', 'हिन्दी'
];

const COUNTRIES = [
  'Россия', 'США', 'Великобритания', 'Германия', 'Франция', 'Испания',
  'Италия', 'Китай', 'Япония', 'Южная Корея', 'Бразилия', 'Канада',
  'Австралия', 'Нидерланды', 'Швеция', 'Польша', 'Турция', 'Индия'
];

const INTERESTS = [
  'Путешествия', 'Кино', 'Музыка', 'Спорт', 'Кулинария', 'Книги',
  'Искусство', 'Технологии', 'Фотография', 'Игры', 'Мода', 'История',
  'Наука', 'Природа', 'Танцы', 'Йога'
];

export default function AuthPage() {
  const router = useRouter();
  const { login, register, isLoading, error } = useProfileStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  // Основная информация
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    age: '',
    country: '',
    city: '',
    bio: '',
    nativeLanguages: [] as string[],
    learningLanguages: [] as string[],
    interests: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin && !formData.name.trim()) newErrors.name = 'Введите имя';
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    if (!isLogin && !formData.password) newErrors.password = 'Введите пароль';
    if (isLogin && !formData.password) newErrors.password = 'Введите пароль';
    if (!isLogin && formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (formData.nativeLanguages.length === 0) {
      newErrors.nativeLanguages = 'Выберите хотя бы один родной язык';
    }
    if (formData.learningLanguages.length === 0) {
      newErrors.learningLanguages = 'Выберите хотя бы один изучаемый язык';
    }
    if (!formData.country) newErrors.country = 'Выберите страну';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLanguageToggle = (language: string, type: 'native' | 'learning') => {
    const field = type === 'native' ? 'nativeLanguages' : 'learningLanguages';
    const currentLanguages = formData[field];
    
    if (currentLanguages.includes(language)) {
      setFormData({
        ...formData,
        [field]: currentLanguages.filter(lang => lang !== language)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentLanguages, language]
      });
    }
  };

  const handleInterestToggle = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  const handleLogin = async () => {
    if (!validateStep1()) return;

    const success = await login(formData.email, formData.password);
    if (success) {
      router.push('/cards');
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleRegister = async () => {
    const success = await register({
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      name: formData.name,
      bio: formData.bio,
      nativeLanguages: formData.nativeLanguages,
      learningLanguages: formData.learningLanguages,
      age: formData.age ? parseInt(formData.age) : undefined,
      country: formData.country,
      city: formData.city,
      interests: formData.interests,
    });

    if (success) {
      router.push('/cards');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      {!isLogin && (
        <div>
          <input
            type="text"
            placeholder="Имя"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>
      )}

      <div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Пароль"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="w-full border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
      </div>

      {!isLogin && (
        <>
          <div>
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
              className="w-full border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.passwordConfirm && <p className="text-red-600 text-sm mt-1">{errors.passwordConfirm}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Возраст (опционально)"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
            <select
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Страна</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Город (опционально)"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="w-full border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
          />
        </>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Globe className="text-black" size={20} />
          На каких языках вы говорите?
        </h3>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(language => (
            <button
              key={language}
              onClick={() => handleLanguageToggle(language, 'native')}
              className={`px-3 py-1 rounded-full border-2 border-black text-sm transition-colors ${
                formData.nativeLanguages.includes(language)
                  ? 'bg-black text-yellow-300'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
        {errors.nativeLanguages && <p className="text-red-600 text-sm mt-2">{errors.nativeLanguages}</p>}
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Heart className="text-black" size={20} />
          Какие языки изучаете?
        </h3>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(language => (
            <button
              key={language}
              onClick={() => handleLanguageToggle(language, 'learning')}
              className={`px-3 py-1 rounded-full border-2 border-black text-sm transition-colors ${
                formData.learningLanguages.includes(language)
                  ? 'bg-black text-yellow-300'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
        {errors.learningLanguages && <p className="text-red-600 text-sm mt-2">{errors.learningLanguages}</p>}
      </div>

      {errors.country && <p className="text-red-600 text-sm">{errors.country}</p>}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-3">Ваши интересы</h3>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`px-3 py-1 rounded-full border-2 border-black text-sm transition-colors ${
                formData.interests.includes(interest)
                  ? 'bg-black text-yellow-300'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3">Расскажите о себе</h3>
        <textarea
          placeholder="Напишите немного о себе, ваших увлечениях и целях изучения языков..."
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          className="w-full border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
          rows={4}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-black p-6 w-full max-w-md shadow-lg">
        
        {/* Заголовок */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <User className="text-yellow-300" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black">
            {isLogin ? 'Вход' : step === 1 ? 'Регистрация' : step === 2 ? 'Языки' : 'Завершение'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Добро пожаловать обратно!' : 'Присоединяйтесь к языковому сообществу'}
          </p>
        </div>

        {/* Прогресс регистрации */}
        {!isLogin && (
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= stepNumber ? 'bg-black text-yellow-300' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-8 h-1 ${step > stepNumber ? 'bg-black' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Формы */}
        {isLogin || step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}

        {/* Ошибка */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Кнопки */}
        <div className="mt-6 space-y-3">
          {isLogin ? (
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-black text-yellow-300 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          ) : step < 3 ? (
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors border-2 border-black"
                >
                  Назад
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="flex-1 bg-black text-yellow-300 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors border-2 border-black"
              >
                Далее
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors border-2 border-black"
              >
                Назад
              </button>
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="flex-1 bg-black text-yellow-300 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Регистрация...' : 'Готово'}
              </button>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setStep(1);
                setErrors({});
              }}
              className="text-black hover:underline"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}