import React from 'react'

interface Props {
  onSettingsClick: () => void
}

export function TitleBar({ onSettingsClick }: Props) {
  return (
    <div
      className="drag-region"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        height: '40px'
      }}
    >
      <span style={{
        fontSize: '14px',
        fontWeight: 700,
        color: 'var(--pink-400)',
        letterSpacing: '1px'
      }}>
        🍅 番茄宠物
      </span>

      <div className="no-drag" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          onClick={onSettingsClick}
          style={titleBtnStyle}
          title="设置"
        >
          ⚙
        </button>
        <button
          onClick={() => window.electronAPI?.window.minimize()}
          style={titleBtnStyle}
        >
          ─
        </button>
        <button
          onClick={() => window.electronAPI?.window.close()}
          style={{ ...titleBtnStyle, fontSize: '14px' }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

const titleBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  fontSize: '16px',
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s'
}
