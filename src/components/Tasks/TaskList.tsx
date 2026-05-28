import React from 'react'
import { useAppStore } from '../../store/appStore'
import type { Task } from '../../types'

export function TaskList() {
  const { tasks, addTask, updateTask, deleteTask, setActiveTask, currentTaskId } = useAppStore()
  const [input, setInput] = React.useState('')
  const [editId, setEditId] = React.useState<string | null>(null)
  const [editText, setEditText] = React.useState('')

  const handleAdd = () => {
    if (!input.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      title: input.trim(),
      estimatedPomodoros: 4,
      completedPomodoros: 0,
      createdAt: new Date().toISOString(),
      active: false
    }
    addTask(task)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  const startEdit = (task: Task) => {
    setEditId(task.id)
    setEditText(task.title)
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      updateTask(id, { title: editText.trim() })
    }
    setEditId(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="添加新任务..."
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '16px',
            border: '2px solid var(--pink-200)',
            background: 'var(--bg-card)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--pink-400)',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          +
        </button>
      </div>

      {/* task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tasks.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            color: 'var(--text-secondary)',
            fontSize: '14px'
          }}>
            还没有任务，添加一个吧 (´▽`ʃ♡ƪ)
          </div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '16px',
              background: task.id === currentTaskId ? 'rgba(236,64,122,0.08)' : 'var(--bg-card)',
              border: task.id === currentTaskId ? '2px solid var(--pink-300)' : '1px solid var(--pink-100)',
              boxShadow: task.id === currentTaskId ? 'var(--shadow)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {/* select button */}
            <button
              onClick={() => setActiveTask(task.id === currentTaskId ? null : task.id)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${task.id === currentTaskId ? 'var(--pink-400)' : 'var(--pink-200)'}`,
                background: task.id === currentTaskId ? 'var(--pink-400)' : 'transparent',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
            >
              {task.id === currentTaskId && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
            </button>

            {/* title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {editId === task.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(task.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--pink-300)',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: task.id === currentTaskId ? 600 : 400,
                    color: 'var(--text-primary)',
                    textDecoration: task.completedPomodoros >= task.estimatedPomodoros && task.completedPomodoros > 0 ? 'line-through' : 'none',
                    opacity: task.completedPomodoros >= task.estimatedPomodoros && task.completedPomodoros > 0 ? 0.5 : 1
                  }}
                >
                  {task.title}
                </span>
              )}
            </div>

            {/* pomodoro count */}
            <span style={{
              fontSize: '12px',
              color: 'var(--pink-400)',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              🍅 {task.completedPomodoros}/{task.estimatedPomodoros}
            </span>

            {/* actions */}
            <button
              onClick={() => startEdit(task)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '14px', padding: '4px', color: 'var(--text-secondary)'
              }}
            >
              ✎
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '14px', padding: '4px', color: 'var(--text-secondary)'
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
