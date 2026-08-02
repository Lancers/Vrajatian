import { Outlet } from "react-router-dom"

import Header from "../common/Header"
import Footer from "../common/Footer"
import ChatWidget from "../chat/ChatWidget"

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default RootLayout
