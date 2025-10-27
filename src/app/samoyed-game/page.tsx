'use client'

import dynamic from 'next/dynamic'

const SamoyedGameShell = dynamic(
  () => import('@/components/samoyed-game/SamoyedGameShell').then((mod) => mod.SamoyedGameShell),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🐕</div>
          <p className="text-xl font-semibold text-purple-700">Loading your Samoyed...</p>
        </div>
      </div>
    ),
  }
)

export default function SamoyedGamePage() {
  return <SamoyedGameShell />
}
