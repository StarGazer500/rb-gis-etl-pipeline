import { createFileRoute, Outlet } from '@tanstack/react-router'
import Header from '../../components/shared/Header'
import SideBar from '../../components/shared/SideBar'

export const Route = createFileRoute('/buffalo')({
  component: () => (
    <div className="flex flex-col h-screen bg-[#0d1f0a] overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  ),
})
