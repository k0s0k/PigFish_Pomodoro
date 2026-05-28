import React, { useState, useEffect } from 'react'
import { useTimer } from '../../hooks/useTimer'
import '../../styles/pet-animations.css'

export function MiniTimer() {
  const timer = useTimer()
  const [petState, setPetState] = useState('idle')

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.pet.onStateChanged((state) => {
        setPetState(state)
      })
    }
  }, [])

  const animClass = petState ? `pet-${petState}` : ''

  return (
    <div
      className="drag-region"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        background: 'rgba(255,240,245,0.92)',
        borderRadius: '16px',
        border: '2px solid var(--pink-200)',
        padding: '10px 20px'
      }}
    >
      {/* tiny pet */}
      <div className={animClass}>
        <div style={{
          width: '40px',
          height: '44px',
          background: 'linear-gradient(180deg, #fff, #fce4ec)',
          borderRadius: '50%',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(236,64,122,0.15)'
        }}>
          {/* eyes */}
          <div style={{ position: 'absolute', top: '11px', left: '9px', width: '6px', height: '7px', background: '#5d4037', borderRadius: '50%' }}>
            <div style={{ width: '2px', height: '2px', background: '#fff', borderRadius: '50%', margin: '1px 0 0 2px' }} />
          </div>
          <div style={{ position: 'absolute', top: '11px', right: '9px', width: '6px', height: '7px', background: '#5d4037', borderRadius: '50%' }}>
            <div style={{ width: '2px', height: '2px', background: '#fff', borderRadius: '50%', margin: '1px 0 0 2px' }} />
          </div>
          {/* blush */}
          <div style={{ position: 'absolute', top: '16px', left: '6px', width: '5px', height: '3px', background: 'rgba(236,64,122,0.3)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '16px', right: '6px', width: '5px', height: '3px', background: 'rgba(236,64,122,0.3)', borderRadius: '50%' }} />
        </div>
      </div>

      {/* timer */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontSize: '24px',
          fontWeight: 700,
          color: timer.timerType === 'work' ? 'var(--pink-500)' : '#66bb6a',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '1px',
          lineHeight: 1.1
        }}>
          {timer.formattedTime}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          {timer.timerType === 'work' ? '专注中' : '休息中'}
        </span>
      </div>
    </div>
  )
}
