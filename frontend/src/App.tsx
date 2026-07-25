import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "src/components/ui/sonner"

import RootLayout from "src/components/layout/RootLayout"
import AdminLayout from "src/components/layout/AdminLayout"
import Home from "src/pages/Home"
import Destinations from "src/pages/Destinations"
import DestinationDetail from "src/pages/DestinationDetail"
import TripCustomizer from "src/pages/TripCustomizer"
import Contact from "src/pages/Contact"
import MyBookings from "src/pages/MyBookings"
import NotFound from "src/pages/NotFound"
import AdminDashboard from "src/pages/admin/AdminDashboard"
import LoginPage from "src/pages/auth/Login"
import SignupForm from "src/pages/auth/Register"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="destinations/:slug" element={<DestinationDetail />} />
          <Route path="plan-trip" element={<TripCustomizer />} />
          <Route path="contact" element={<Contact />} />
          <Route path="my-bookings" element={<MyBookings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<SignupForm />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
