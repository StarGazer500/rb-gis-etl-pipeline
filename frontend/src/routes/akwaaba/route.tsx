import { createFileRoute, Outlet } from '@tanstack/react-router'
import Header from '../../components/shared/Header'
import SideBar from '../../components/shared/SideBar'
// @ts-ignore – Footer is temporarily commented out but kept for future use
import Footer from '../../components/shared/Footer'

export const Route = createFileRoute('/akwaaba')({
  component: () => (
    <div className="flex flex-col h-screen bg-[#0d1f0a] overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  ),
})
