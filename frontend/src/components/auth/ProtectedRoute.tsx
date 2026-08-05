import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "src/lib/auth/AuthContext"

/** Gate for any route that requires a signed-in user (not necessarily an admin). */
function ProtectedRoute() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
