import { ReactNode } from 'react';

interface LoadingSpinnerProps {
  children?: ReactNode;
}

export default function LoadingSpinner({ children }: LoadingSpinnerProps) {
  if (children) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}