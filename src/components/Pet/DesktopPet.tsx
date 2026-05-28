import React, { useEffect, useState } from 'react'
import type { PetState } from '../../types'
import '../../styles/pet-animations.css'
import pigfishImg from '../../assets/pigfish.jpg'

interface Props {
  petState?: PetState
  message?: string
}

export function DesktopPet({ petState: propState, message: propMessage }: Props) {
  const [petState, setPetState] = useState<PetState>(propState || 'idle')
  const [bubble, setBubble] = useState<string | null>(null)
  const [bubbleKey, setBubbleKey] = useState(0)

  const showBubble = (msg: string) => {
    setBubble(msg)
    setBubbleKey(k => k + 1)
    setTimeout(() => setBubble(null), 3500)
  }

  // sync from props
  useEffect(() => {
    if (propState) setPetState(propState)
  }, [propState])

  useEffect(() => {
    if (propMessage) showBubble(propMessage)
  }, [propMessage])

  // listen to IPC for pet window mode
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.pet.onStateChanged((state, message) => {
        if (!propState) setPetState(state as PetState)
        if (message) showBubble(message)
      })
    }
  }, [propState])

  // show random bubbles periodically
  useEffect(() => {
    const idleMessages = [
      '今天也要加油哦～ 💪',
      '休息一下，效率更高！',
      '摸摸头～(・ω・)ノ',
      '一起努力吧！',
      '别忘了喝水哦～'
    ]
    const interval = setInterval(() => {
      if (petState === 'idle' && !bubble) {
        const msg = idleMessages[Math.floor(Math.random() * idleMessages.length)]
        showBubble(msg)
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [petState, bubble])

  const animClass = `pet-${petState}`

  return (
    <div
      className="drag-region"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative'
      }}
      onDoubleClick={() => showBubble(petState === 'idle' ? '嘻嘻，别戳我～' : '正在认真工作呢！')}
    >
      {/* speech bubble */}
      {bubble && (
        <div
          key={bubbleKey}
          style={{
            position: 'absolute',
            bottom: '150px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '16px',
            padding: '8px 14px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            maxWidth: '150px',
            textAlign: 'center',
            animation: 'bubble-pop 3.5s ease forwards',
            whiteSpace: 'nowrap'
          }}
        >
          {bubble}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '12px',
            height: '12px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '2px'
          }} />
        </div>
      )}

      {/* the pet - pigfish image */}
      <div className={animClass} style={{ position: 'relative', marginBottom: '10px' }}>
        <img
          src={pigfishImg}
          alt="pigfish"
          style={{
            width: '130px',
            height: '100px',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(236,64,122,0.25)'
          }}
        />

        {/* sleep zzz */}
        {petState === 'sleep' && (
          <div style={{ position: 'absolute', top: '-20px', right: '-10px', fontSize: '18px', animation: 'float-up 2s ease-in-out infinite' }}>
            💤
          </div>
        )}

        {/* working sweat */}
        {petState === 'working' && (
          <div style={{ position: 'absolute', top: '-5px', right: '-10px', fontSize: '14px', animation: 'pet-bounce 0.5s ease-in-out infinite' }}>
            💦
          </div>
        )}

        {/* happy sparkles */}
        {petState === 'happy' && (
          <>
            <div style={{ position: 'absolute', top: '-15px', left: '0px', fontSize: '12px', animation: 'float-up 1.5s ease-in-out infinite' }}>✨</div>
            <div style={{ position: 'absolute', top: '-5px', right: '0px', fontSize: '12px', animation: 'float-up 1.8s ease-in-out infinite 0.3s' }}>✨</div>
          </>
        )}
      </div>
    </div>
  )
}
