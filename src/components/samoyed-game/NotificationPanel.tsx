'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { notificationsAtom, dismissNotificationAtom } from '@/state/samoyed-game/atoms'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { playSound } from '@/lib/sound-effects'

export function NotificationPanel() {
  const notifications = useAtomValue(notificationsAtom)
  const dismissNotification = useSetAtom(dismissNotificationAtom)

  const activeNotifications = notifications.filter((n) => !n.dismissed)

  useEffect(() => {
    const lastNotif = activeNotifications[activeNotifications.length - 1]
    if (lastNotif && lastNotif.type !== 'success' && lastNotif.type !== 'info') {
      playSound('notification', 0.2)
    }
  }, [activeNotifications.length])

  if (activeNotifications.length === 0) return null

  return (
    <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50 space-y-2 max-w-[calc(100vw-1rem)] sm:max-w-sm">
      {activeNotifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'p-3 sm:p-4 rounded-xl shadow-2xl backdrop-blur-sm border-2 animate-in slide-in-from-right',
            'flex items-start gap-2 sm:gap-3 transition-all duration-300',
            notification.type === 'critical' && 'bg-red-100/90 border-red-400 text-red-900',
            notification.type === 'warning' && 'bg-yellow-100/90 border-yellow-400 text-yellow-900',
            notification.type === 'info' && 'bg-blue-100/90 border-blue-400 text-blue-900',
            notification.type === 'success' && 'bg-green-100/90 border-green-400 text-green-900'
          )}
          role="alert"
          aria-live={notification.type === 'critical' ? 'assertive' : 'polite'}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">
                {notification.type === 'critical' && '🚨'}
                {notification.type === 'warning' && '⚠️'}
                {notification.type === 'info' && 'ℹ️'}
                {notification.type === 'success' && '✅'}
              </span>
              <span className="font-semibold text-sm capitalize">{notification.type}</span>
            </div>
            <p className="text-sm">{notification.message}</p>
          </div>
          <button
            onClick={() => dismissNotification(notification.id)}
            className={cn(
              'text-xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 rounded',
              notification.type === 'critical' && 'focus:ring-red-400',
              notification.type === 'warning' && 'focus:ring-yellow-400',
              notification.type === 'info' && 'focus:ring-blue-400',
              notification.type === 'success' && 'focus:ring-green-400'
            )}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
