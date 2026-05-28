import React, { useState } from 'react'
import type { Settings } from '../../types'

interface Props {
  settings: Settings
  onSave: (settings: Settings) => void
  onClose: () => void
}

export function SettingsPanel({ settings, onSave, onClose }: Props) {
  const [local, setLocal] = useState<Settings>({ ...settings })

  const handleChange = (key: keyof Settings, value: number) => {
    setLocal((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div
      className="no-drag"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        borderRadius: '20px'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '28px',
        width: '300px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>设置</h3>

        <SettingField label="专注时长 (分钟)" value={local.workDuration} onChange={(v) => handleChange('workDuration', v)} min={1} max={60} />
        <SettingField label="短休息 (分钟)" value={local.shortBreak} onChange={(v) => handleChange('shortBreak', v)} min={1} max={30} />
        <SettingField label="长休息 (分钟)" value={local.longBreak} onChange={(v) => handleChange('longBreak', v)} min={1} max={60} />
        <SettingField label="长休息间隔 (番茄数)" value={local.longBreakInterval} onChange={(v) => handleChange('longBreakInterval', v)} min={1} max={8} />

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px', borderRadius: '16px', border: '1px solid var(--pink-200)',
              background: '#fff', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'inherit'
            }}
          >
            取消
          </button>
          <button
            onClick={() => onSave(local)}
            style={{
              padding: '8px 20px', borderRadius: '16px', border: 'none',
              background: 'var(--pink-400)', color: '#fff', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, fontFamily: 'inherit'
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingField({ label, value, onChange, min, max }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          style={stepperBtnStyle}
        >−</button>
        <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          style={stepperBtnStyle}
        >+</button>
      </div>
    </div>
  )
}

const stepperBtnStyle: React.CSSProperties = {
  width: '28px', height: '28px', borderRadius: '50%',
  border: '1px solid var(--pink-200)', background: 'var(--bg-card)',
  cursor: 'pointer', fontSize: '16px', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  color: 'var(--pink-400)', fontWeight: 600
}
