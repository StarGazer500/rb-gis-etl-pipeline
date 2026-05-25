import { useUIStore } from '../../store/uiStore'

export default function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  return (
    <header className="h-14 bg-[#1e3d10] flex items-center justify-between px-4 border-b border-[#2d5a18] shrink-0 z-20">
      {/* Left — brand + hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-[#a8c896] hover:text-white transition-colors p-1 rounded"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#4a8c2a] flex items-center justify-center text-white font-bold text-xs select-none">
            RB
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm">Rainforestbuilder</p>
            <p className="text-[#a8c896] text-[10px]">Geospatial Dashboard</p>
          </div>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative text-[#a8c896] hover:text-white transition-colors" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#4a8c2a] rounded-full" />
        </button>

        {/* Settings */}
        {/* <button className="text-[#a8c896] hover:text-white transition-colors" aria-label="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button> */}

        {/* Divider */}
        <div className="w-px h-5 bg-[#2d5a18]" />

        {/* User */}
        {/* <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-[#4a8c2a] flex items-center justify-center text-white text-[11px] font-semibold select-none">
            MA
          </div>
          <span className="text-[#a8c896] group-hover:text-white text-sm transition-colors">Martin</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a8c896]">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div> */}
      </div>
    </header>
  )
}
