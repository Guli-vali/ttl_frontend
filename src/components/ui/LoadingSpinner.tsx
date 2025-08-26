interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message = "Загрузка...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center ${className}`}>
      <div className="text-black text-xl font-bold">{message}</div>
    </div>
  );
}
