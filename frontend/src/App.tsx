import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "src/components/ui/sonner"

import { AuthProvider } from "src/lib/auth/AuthContext"
import ProtectedRoute from "src/components/auth/ProtectedRoute"
import RootLayout from "src/components/layout/RootLayout"
import AdminLayout from "src/components/layout/AdminLayout"
import Home from "src/pages/Home"
import Destinations from "src/pages/Destinations"
import DestinationDetail from "src/pages/DestinationDetail"
import TripCustomizer from "src/pages/TripCustomizer"
import Contact from "src/pages/Contact"
import Profile from "src/pages/Profile"
import NotFound from "src/pages/NotFound"
import AdminDashboard from "src/pages/admin/AdminDashboard"
import AdminTripRequests from "src/pages/admin/AdminTripRequests"
import AdminPackages from "src/pages/admin/AdminPackages"
import AdminActivities from "src/pages/admin/AdminActivities"
import AdminEducationalTrips from "src/pages/admin/AdminEducationalTrips"
import AdminCorporateTrips from "src/pages/admin/AdminCorporateTrips"
import LoginPage from "src/pages/auth/Login"
import SignupForm from "src/pages/auth/Register"
import EmailCallback from "src/pages/auth/EmailCallback"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/:slug" element={<DestinationDetail />} />
            <Route path="activities" element={<Destinations type="activity" />} />
            <Route path="activities/:slug" element={<DestinationDetail type="activity" />} />
            <Route path="educational-trips" element={<Destinations type="education" />} />
            <Route path="educational-trips/:slug" element={<DestinationDetail type="education" />} />
            <Route path="corporate-trips" element={<Destinations type="corporate" />} />
            <Route path="corporate-trips/:slug" element={<DestinationDetail type="corporate" />} />
            <Route path="plan-trip" element={<TripCustomizer />} />
            <Route path="contact" element={<Contact />} />
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="trip-requests" element={<AdminTripRequests />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="activities" element={<AdminActivities />} />
            <Route path="educational-trips" element={<AdminEducationalTrips />} />
            <Route path="corporate-trips" element={<AdminCorporateTrips />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<SignupForm />} />
          <Route path="auth/callback" element={<EmailCallback />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
