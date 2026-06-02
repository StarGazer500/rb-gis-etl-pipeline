import { useState, useRef, useEffect } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useUIStore } from '../../store/uiStore'

const projects = [
  { id: 'akwaaba', label: 'Akwaaba', dot: '#7ab060', active: true },
  { id: 'buffalo', label: 'Buffalo',  dot: '#e87a4a', active: true },
  { id: 'colobus', label: 'Colobus',  dot: '#e8a84a', active: true },
]

function ProjectSwitcher({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const currentId = pathname.split('/')[1] || 'akwaaba'
  const current = projects.find((p) => p.id === currentId) ?? projects[0]
  const subPath = '/' + pathname.split('/').slice(2).filter(Boolean).join('/')

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative px-2 py-2 border-b border-[#2d5a18]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#2d5a18] transition-colors group"
      >
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: current.dot }} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left text-white text-sm font-semibold truncate">
              {current.label}
            </span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              className={`text-[#7ab060] transition-transform ${open ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </>
        )}
      </button>

      {open && !collapsed && (
        <div className="absolute left-2 right-2 top-full mt-1 bg-[#0d1f0a] border border-[#2d5a18] rounded shadow-xl z-50 overflow-hidden">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => {
                navigate({ to: `/${project.id}${subPath === '/' ? '' : subPath}` })
                setOpen(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2d5a18] transition-colors"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: project.dot }} />
              <span className={`flex-1 text-left text-sm ${project.id === currentId ? 'text-white font-medium' : 'text-[#8ab878]'}`}>
                {project.label}
              </span>
              {project.id === currentId && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#7ab060]">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {!project.active && (
                <span className="text-[9px] uppercase tracking-wider text-[#557a44] bg-[#1e3a10] px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface NavItem {
  label: string
  icon: React.ReactNode
}

interface NavSection {
  title: string
  icon: React.ReactNode
  items: NavItem[]
  path?: string
}

const MapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
)

const SeedlingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22V12" />
    <path d="M12 12C12 12 7 10 5 6c3 0 7 2 7 6z" />
    <path d="M12 12C12 12 17 10 19 6c-3 0-7 2-7 6z" />
  </svg>
)

const LandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="3 11 12 2 21 11 21 21 3 21 3 11" />
    <line x1="9" y1="21" x2="9" y2="12" />
    <line x1="15" y1="21" x2="15" y2="12" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
)


const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)


const sections: NavSection[] = [
  {
    title: 'Project Overview',
    icon: <MapIcon />,
    items: [],
  },
  {
    title: 'Current Year Planting',
    icon: <SeedlingIcon />,
    items: [],
    path: '/current-year-planting',
  },
  {
    title: 'Leased Area Stratification',
    icon: <LandIcon />,
    items: [],
    path: '/leased-area-stratification',
  },
//   {
//     title: 'Data Management',
//     icon: <DatabaseIcon />,
//     items: [
//       { label: 'Upload', icon: null },
//       { label: 'Validation', icon: null },
//       { label: 'ETL Jobs', icon: null },
//     ],
//   },
//   {
//     title: 'Reports',
//     icon: <ReportIcon />,
//     items: [
//       { label: 'Export', icon: null },
//       { label: 'History', icon: null },
//     ],
//   },
]

export default function SideBar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const currentId = pathname.split('/')[1] || 'akwaaba'

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Project Overview': true,
  })
  const [activeItem, setActiveItem] = useState('')

  const isProjectOverview = pathname === `/${currentId}` || pathname === `/${currentId}/`

  const isSectionActive = (section: NavSection) => {
    if (section.path) return pathname === `/${currentId}${section.path}`
    return section.title === 'Project Overview' && isProjectOverview
  }

  const handleSectionClick = (section: NavSection) => {
    if (section.items.length === 0) {
      navigate({ to: section.path ? `/${currentId}${section.path}` : `/${currentId}` })
    } else {
      setOpenSections((prev) => ({ ...prev, [section.title]: !prev[section.title] }))
    }
  }

  return (
    <aside
      className={`
        bg-[#1a3a0a] flex flex-col border-r border-[#2d5a18] shrink-0 z-10
        transition-all duration-300 overflow-hidden
        ${collapsed ? 'w-12' : 'w-64'}
      `}
    >
      <ProjectSwitcher collapsed={collapsed} />

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-3 overflow-x-hidden">
        {sections.map((section) => {
          const isActive = isSectionActive(section)
          return (
            <div key={section.title} className="mb-1">
              {/* Section header */}
              <button
                onClick={() => handleSectionClick(section)}
                className={`w-full flex items-center gap-3 px-3 py-2 transition-colors rounded-sm group ${
                  isActive
                    ? 'bg-[#3d6b24] text-white'
                    : 'text-[#a8c896] hover:text-white hover:bg-[#2d5a18]'
                }`}
              >
                <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#7ab060] group-hover:text-white'}`}>
                  {section.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-xs font-semibold uppercase tracking-wider leading-tight">
                      {section.title}
                    </span>
                    {section.items.length > 0 && (
                      <span className="shrink-0 transition-transform duration-200" style={{ transform: openSections[section.title] ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                        <ChevronDown />
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Section items */}
              {!collapsed && openSections[section.title] && section.items.length > 0 && (
                <div className="ml-4 border-l border-[#2d5a18] pl-2 mb-1">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setActiveItem(item.label)}
                      className={`
                        w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors truncate
                        ${activeItem === item.label
                          ? 'text-white bg-[#3d6b24] font-medium'
                          : 'text-[#8ab878] hover:text-white hover:bg-[#2d5a18]'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-[#2d5a18] py-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-[#a8c896] hover:text-white hover:bg-[#2d5a18] transition-colors">
          <span className="shrink-0"><SettingsIcon /></span>
          {!collapsed && <span className="text-sm truncate">Settings</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-[#a8c896] hover:text-white hover:bg-[#2d5a18] transition-colors">
          <span className="shrink-0"><HelpIcon /></span>
          {!collapsed && <span className="text-sm truncate">Help</span>}
        </button>
      </div>
    </aside>
  )
}
