import { create } from 'zustand'
import type { Task, Session, Settings, TimerStatus, TimerType, DayStats } from '../types'

interface AppState {
  tasks: Task[]
  sessions: Session[]
  settings: Settings
  timerStatus: TimerStatus
  timerType: TimerType
  timeLeft: number
  totalTime: number
  completedPomodoros: number
  currentTaskId: string | null
  petMessage: string | null

  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setActiveTask: (id: string | null) => void
  setPetMessage: (msg: string | null) => void

  setSettings: (settings: Settings) => void
  setTimerStatus: (status: TimerStatus) => void
  setTimerType: (type: TimerType) => void
  setTimeLeft: (time: number) => void
  setTotalTime: (time: number) => void
  incrementPomodoro: () => void

  addSession: (session: Session) => void
  updateSession: (id: string, updates: Partial<Session>) => void
  getTodayStats: () => DayStats
  getWeekStats: () => DayStats[]
  getTotalStats: () => { pomodoros: number; minutes: number }
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

export const useAppStore = create<AppState>((set, get) => ({
  tasks: [],
  sessions: [],
  settings: {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    volume: 0.8
  },
  timerStatus: 'idle',
  timerType: 'work',
  timeLeft: 25 * 60,
  totalTime: 25 * 60,
  completedPomodoros: 0,
  currentTaskId: null,
  petMessage: null,

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTask: (id, updates) => set((s) => ({
    tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
  })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  setActiveTask: (id) => set((s) => ({
    currentTaskId: id,
    tasks: s.tasks.map((t) => ({ ...t, active: t.id === id }))
  })),
  setPetMessage: (petMessage) => set({ petMessage }),

  setSettings: (settings) => set({ settings }),
  setTimerStatus: (timerStatus) => set({ timerStatus }),
  setTimerType: (timerType) => set({ timerType }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setTotalTime: (totalTime) => set({ totalTime }),
  incrementPomodoro: () => set((s) => ({ completedPomodoros: s.completedPomodoros + 1 })),

  addSession: (session) => set((s) => ({ sessions: [...s.sessions, session] })),
  updateSession: (id, updates) => set((s) => ({
    sessions: s.sessions.map((sess) => (sess.id === id ? { ...sess, ...updates } : sess))
  })),

  getTodayStats: () => {
    const today = getTodayStr()
    const sessions = get().sessions.filter(
      (s) => s.type === 'work' && s.completed && s.startTime.startsWith(today)
    )
    return {
      date: today,
      completedPomodoros: sessions.length,
      totalWorkMinutes: sessions.length * get().settings.workDuration
    }
  },

  getWeekStats: () => {
    const now = new Date()
    const settings = get().settings
    const stats: DayStats[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const sessions = get().sessions.filter(
        (s) => s.type === 'work' && s.completed && s.startTime.startsWith(dateStr)
      )
      stats.push({
        date: dateStr,
        completedPomodoros: sessions.length,
        totalWorkMinutes: sessions.length * settings.workDuration
      })
    }
    return stats
  },

  getTotalStats: () => {
    const sessions = get().sessions.filter((s) => s.type === 'work' && s.completed)
    return {
      pomodoros: sessions.length,
      minutes: sessions.length * get().settings.workDuration
    }
  }
}))
