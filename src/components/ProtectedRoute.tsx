import { Navigate, useLocation } from 'react-router-dom';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const user = "susil"; // Replace with actual user retrieval logic
const loading = false; // Replace with actual loading state logic
export function ProtectedRoute({ children }: ProtectedRouteProps) {

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
