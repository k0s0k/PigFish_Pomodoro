import React from 'react'
import type { TimerType, TimerStatus } from '../../types'

interface Props {
  progress: number
  formattedTime: string
  timerType: TimerType
  timerStatus: TimerStatus
}

export function TimerCircle({ progress, formattedTime, timerType, timerStatus }: Props) {
  const size = 280
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  const isBreak = timerType === 'shortBreak' || timerType === 'longBreak'
  const ringColor = isBreak ? 'var(--ring-break)' : 'var(--ring-work)'

  const label = timerType === 'work'
    ? '专注'
    : timerType === 'shortBreak' ? '短休息' : '长休息'

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* glow effect */}
      <div style={{
        position: 'absolute',
        width: size + 30,
        height: size + 30,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${isBreak ? 'rgba(102,187,106,0.15)' : 'rgba(236,64,122,0.15)'} 0%, transparent 70%)`,
        animation: timerStatus === 'running' ? 'pet-breathe 2s ease-in-out infinite' : 'none'
      }} />

      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}
      >
        {/* background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--ring-bg)"
          strokeWidth={strokeWidth}
        />
        {/* progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>

      {/* center content */}
      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        zIndex: 2
      }}>
        <span style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontWeight: 500,
          letterSpacing: '2px'
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '52px',
          fontWeight: 700,
          color: ringColor,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '1px',
          lineHeight: 1
        }}>
          {formattedTime}
        </span>
        {timerStatus === 'paused' && (
          <span style={{
            fontSize: '13px',
            color: 'var(--pink-400)',
            fontWeight: 600,
            animation: 'pet-breathe 1.5s ease-in-out infinite'
          }}>
            已暂停
          </span>
        )}
      </div>
    </div>
  )
}
