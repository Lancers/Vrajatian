import { BrowserRouter, Routes, Route } from "react-router-dom"

import RootLayout from "src/components/layout/RootLayout"
import AdminLayout from "src/components/layout/AdminLayout"
import Home from "src/pages/Home"
import Destinations from "src/pages/Destinations"
import TripCustomizer from "src/pages/TripCustomizer"
import Contact from "src/pages/Contact"
import NotFound from "src/pages/NotFound"
import AdminDashboard from "src/pages/AdminDashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="plan-trip" element={<TripCustomizer />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
