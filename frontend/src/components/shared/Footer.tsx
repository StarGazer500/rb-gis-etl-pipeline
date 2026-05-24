export default function Footer() {
  return (
    <footer className="h-8 bg-[#1e3d10] border-t border-[#2d5a18] flex items-center justify-between px-4 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <span className="text-[#a8c896] text-xs">© 2025 RB GIS Dashboard</span>
        <span className="text-[#2d5a18]">|</span>
        <span className="text-[#a8c896] text-xs">v1.0.0</span>
      </div>
      <span className="text-[#a8c896] text-xs">Powered by Leaflet & PostGIS</span>
    </footer>
  )
}
