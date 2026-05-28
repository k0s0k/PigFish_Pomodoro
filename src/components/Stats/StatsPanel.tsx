import React from 'react'
import { useAppStore } from '../../store/appStore'
import type { DayStats } from '../../types'

export function StatsPanel() {
  const { getTodayStats, getWeekStats, getTotalStats } = useAppStore()
  const todayStats = getTodayStats()
  const weekStats = getWeekStats()
  const totalStats = getTotalStats()

  const maxPomodoros = Math.max(...weekStats.map((s) => s.completedPomodoros), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* overview cards */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <StatCard label="今日番茄" value={todayStats.completedPomodoros} unit="个 🍅" color="#ec407a" />
        <StatCard label="今日专注" value={Math.floor(todayStats.totalWorkMinutes / 60)} unit={`小时 ${todayStats.totalWorkMinutes % 60} 分`} color="#f06292" />
        <StatCard label="总计番茄" value={totalStats.pomodoros} unit="个" color="#d81b60" />
      </div>

      {/* weekly chart */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        padding: '20px',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--pink-100)'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
          本周统计
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          height: '140px',
          padding: '0 4px'
        }}>
          {weekStats.map((day, i) => {
            const dayLabel = ['日', '一', '二', '三', '四', '五', '六'][new Date(day.date).getDay()]
            const isToday = day.date === new Date().toISOString().split('T')[0]
            return (
              <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: isToday ? 'var(--pink-500)' : 'var(--text-secondary)' }}>
                  {day.completedPomodoros}
                </span>
                <div style={{
                  width: '100%',
                  height: `${(day.completedPomodoros / maxPomodoros) * 100}%`,
                  minHeight: day.completedPomodoros > 0 ? '8px' : '4px',
                  background: isToday
                    ? 'linear-gradient(180deg, #ec407a, #f48fb1)'
                    : day.completedPomodoros > 0
                      ? 'linear-gradient(180deg, #f8bbd0, #fce4ec)'
                      : 'var(--pink-100)',
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'height 0.3s ease',
                  minWidth: '20px'
                }} />
                <span style={{ fontSize: '11px', color: isToday ? 'var(--pink-500)' : 'var(--text-secondary)', fontWeight: isToday ? 600 : 400 }}>
                  {dayLabel}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* total */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        padding: '20px',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--pink-100)',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>累计专注时长 </span>
        <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--pink-500)' }}>
          {Math.floor(totalStats.minutes / 60)}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}> 小时 </span>
        <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--pink-500)' }}>
          {totalStats.minutes % 60}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}> 分钟</span>
      </div>
    </div>
  )
}

function StatCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div style={{
      flex: 1,
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-sm)',
      padding: '14px',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--pink-100)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{unit}</div>
    </div>
  )
}
