import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/buffalo/')({
  component: () => (
    <div className="min-h-screen bg-[#0a1f05] flex flex-col items-center justify-center gap-4">
      <p className="text-[#7ab060] text-lg font-medium">Buffalo dashboard coming soon</p>
      <Link to="/" className="text-[#4a8c2a] text-sm hover:text-white transition-colors">
        ← Back to projects
      </Link>
    </div>
  ),
})
