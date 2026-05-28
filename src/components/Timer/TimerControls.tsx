import React from 'react'
import type { TimerStatus, TimerType } from '../../types'

interface Props {
  timerStatus: TimerStatus
  timerType: TimerType
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  onSkip: () => void
}

const btnStyle: React.CSSProperties = {
  padding: '10px 24px',
  borderRadius: '24px',
  border: 'none',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontFamily: 'inherit'
}

export function TimerControls({ timerStatus, timerType, onStart, onPause, onResume, onReset, onSkip }: Props) {
  const isBreak = timerType === 'shortBreak' || timerType === 'longBreak'
  const primaryColor = isBreak ? '#66bb6a' : 'var(--pink-500)'
  const primaryHover = isBreak ? '#4caf50' : 'var(--pink-600)'

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {(timerStatus === 'idle' || timerStatus === 'finished') && (
        <button
          onClick={onStart}
          style={{
            ...btnStyle,
            background: primaryColor,
            color: '#fff',
            boxShadow: `0 4px 15px ${isBreak ? 'rgba(102,187,106,0.4)' : 'rgba(236,64,122,0.4)'}`,
            fontSize: '17px',
            padding: '12px 36px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = primaryColor)}
        >
          {isBreak ? '开始休息 🌸' : '开始专注 ✨'}
        </button>
      )}

      {timerStatus === 'running' && (
        <button
          onClick={onPause}
          style={{
            ...btnStyle,
            background: '#fff',
            color: 'var(--text-primary)',
            border: '2px solid var(--pink-200)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pink-100)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
        >
          暂停 ⏸
        </button>
      )}

      {timerStatus === 'paused' && (
        <button
          onClick={onResume}
          style={{
            ...btnStyle,
            background: primaryColor,
            color: '#fff',
            boxShadow: `0 4px 15px ${isBreak ? 'rgba(102,187,106,0.4)' : 'rgba(236,64,122,0.4)'}`
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = primaryColor)}
        >
          继续 ▶
        </button>
      )}

      {(timerStatus === 'running' || timerStatus === 'paused') && (
        <>
          <button
            onClick={onReset}
            style={{ ...btnStyle, background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fce4ec')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}
          >
            重置 ↺
          </button>
          <button
            onClick={onSkip}
            style={{ ...btnStyle, background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fce4ec')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}
          >
            跳过 ⏭
          </button>
        </>
      )}
    </div>
  )
}
