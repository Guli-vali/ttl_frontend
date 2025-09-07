interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'fullscreen' | 'inline';
}

export function LoadingSpinner({ 
  message = "Загрузка...", 
  className = "", 
  size = 'lg',
  variant = 'fullscreen'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400 ${sizeClasses[size]}`} />
  );

  if (variant === 'inline') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        {spinner}
        {message && (
          <p className="text-sm text-gray-600">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center ${className}`}>
      <div className="text-black text-xl font-bold">{message}</div>
    </div>
  );
}
