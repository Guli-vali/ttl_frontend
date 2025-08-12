
export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      <header className="p-6 text-black text-left text-3xl font-bold">Профиль</header>
      <main className="flex-1 p-4">
        <div className="bg-white rounded-lg p-6 shadow border-2 border-black">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          <p>Здесь будет информация о пользователе.</p>
        </div>
      </main>
    </div>
  );
}