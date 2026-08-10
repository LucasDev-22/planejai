import { type FC } from 'react'

interface LoadingSpinnerProps {
  message?: string
  fullScreen?: boolean
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  message = 'Processando...',
  fullScreen = false,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm'
    : 'flex min-h-[200px] flex-col items-center justify-center p-4'

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <svg
        className="mb-4 h-10 w-10 animate-spin text-violet-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {message && (
        <span className="animate-pulse text-sm font-medium text-gray-600">
          {message}
        </span>
      )}
    </div>
  )
}
