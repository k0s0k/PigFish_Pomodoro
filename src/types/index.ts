export interface Task {
  id: string
  title: string
  estimatedPomodoros: number
  completedPomodoros: number
  createdAt: string
  active: boolean
}

export interface Session {
  id: string
  taskId?: string
  type: 'work' | 'shortBreak' | 'longBreak'
  startTime: string
  endTime?: string
  completed: boolean
}

export interface Settings {
  workDuration: number
  shortBreak: number
  longBreak: number
  longBreakInterval: number
  volume: number
}

export interface DayStats {
  date: string
  completedPomodoros: number
  totalWorkMinutes: number
}

export interface AppData {
  tasks: Task[]
  sessions: Session[]
  settings: Settings
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'
export type TimerType = 'work' | 'shortBreak' | 'longBreak'
export type PetState = 'idle' | 'working' | 'happy' | 'sleep'
