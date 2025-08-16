'use client';

import Image from 'next/image';
import { useProfileStore } from '@/store/useProfileStore';

export default function ProfilePage() {
  const profile = useProfileStore((state) => state.profile);

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      <header className="p-6 text-black text-left text-3xl font-bold">Профиль</header>
      <main className="flex-1 p-4">
        <div className="bg-white rounded-lg p-6 shadow border-2 border-black flex flex-col items-center">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              width={96} // 24 * 4 = 96px (since w-24 = 6rem ≈ 96px)
              height={96}
              className="w-24 h-24 rounded-full mb-4 border-2 border-black object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mb-4 bg-gray-200 flex items-center justify-center text-3xl border-2 border-black">
              {profile.name[0]}
            </div>
          )}
          <h2 className="text-xl font-bold mb-2 text-black">{profile.name}</h2>
          <p className="mb-2 text-gray-700">{profile.bio}</p>
          <span className="px-3 py-1 bg-yellow-300 rounded-full border border-black text-sm font-semibold">
            {profile.language}
          </span>
        </div>
      </main>
    </div>
  );
}