import { useAppStore } from './store/appStore'
import { TimerCircle } from './components/Timer/TimerCircle'
import { TimerControls } from './components/Timer/TimerControls'
import { TaskList } from './components/Tasks/TaskList'
import { StatsPanel } from './components/Stats/StatsPanel'
import { DesktopPet } from './components/Pet/DesktopPet'
import { MiniTimer } from './components/MiniWindow/MiniTimer'
import { TitleBar } from './components/common/TitleBar'
import { SettingsPanel } from './components/common/SettingsPanel'
import { useTimer } from './hooks/useTimer'
import { useState, useEffect } from 'react'

type Page = 'timer' | 'tasks' | 'stats' | 'settings'

function App() {
  const [page, setPage] = useState<Page>('timer')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const timer = useTimer()
  const { settings, setSettings, setTasks, petMessage } = useAppStore()

  const isMiniWindow = window.location.hash === '#/mini'

  useEffect(() => {
    async function loadData() {
      if (window.electronAPI) {
        const tasks = await window.electronAPI.store.get('tasks') as any[]
        const sessions = await window.electronAPI.store.get('sessions') as any[]
        const savedSettings = await window.electronAPI.store.get('settings') as any
        if (tasks) useAppStore.getState().setTasks(tasks)
        if (sessions) useAppStore.setState({ sessions })
        if (savedSettings) {
          useAppStore.getState().setSettings(savedSettings)
          useAppStore.getState().setTimeLeft(savedSettings.workDuration * 60)
          useAppStore.getState().setTotalTime(savedSettings.workDuration * 60)
        }
      }
    }
    loadData()
  }, [])

  // persist data changes to electron-store
  useEffect(() => {
    if (!window.electronAPI || isMiniWindow) return
    const save = () => {
      const state = useAppStore.getState()
      window.electronAPI!.store.set('tasks', state.tasks)
      window.electronAPI!.store.set('sessions', state.sessions)
    }
    const unsub = useAppStore.subscribe(() => save())
    return unsub
  }, [isMiniWindow])

  useEffect(() => {
    if (window.electronAPI && !isMiniWindow) {
      window.electronAPI.store.set('settings', settings)
    }
  }, [settings])

  // update mini window
  useEffect(() => {
    if (window.electronAPI && !isMiniWindow) {
      window.electronAPI.mini.update({
        time: timer.formattedTime,
        progress: timer.progress,
        running: timer.timerStatus === 'running'
      })
    }
  }, [timer.formattedTime, timer.progress, timer.timerStatus])

  if (isMiniWindow) return <MiniTimer />

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))',
      borderRadius: '20px',
      border: '1px solid var(--pink-200)',
      overflow: 'hidden'
    }}>
      <TitleBar onSettingsClick={() => setSettingsOpen(true)} />

      {/* navigation tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        padding: '8px 0 4px'
      }} className="no-drag">
        {(['timer', 'tasks', 'stats'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              border: 'none',
              padding: '6px 16px',
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: page === p ? 700 : 400,
              color: page === p ? 'var(--pink-500)' : 'var(--text-secondary)',
              background: page === p ? 'var(--pink-100)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            {{ timer: '⏱ 计时', tasks: '📋 任务', stats: '📊 统计' }[p]}
          </button>
        ))}
      </div>

      {/* page content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        {page === 'timer' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', paddingTop: '10px' }}>
            <TimerCircle
              progress={timer.progress}
              formattedTime={timer.formattedTime}
              timerType={timer.timerType}
              timerStatus={timer.timerStatus}
            />
            <TimerControls
              timerStatus={timer.timerStatus}
              timerType={timer.timerType}
              onStart={() => timer.startTimer('work')}
              onPause={timer.pauseTimer}
              onResume={timer.resumeTimer}
              onReset={timer.resetTimer}
              onSkip={timer.skipTimer}
            />
            <DesktopPet petState={timer.getPetState()} message={petMessage ?? undefined} />
          </div>
        )}
        {page === 'tasks' && <TaskList />}
        {page === 'stats' && <StatsPanel />}
      </div>

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onSave={(s) => { setSettings(s); setSettingsOpen(false) }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

export default App
