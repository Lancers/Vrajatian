import { Outlet } from "react-router-dom"

import Header from "../common/Header"
import Footer from "../common/Footer"

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
