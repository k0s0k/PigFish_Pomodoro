import { useRef, useCallback, useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import type { TimerType, PetState } from '../types'

function setPetMessage(msg: string) {
  useAppStore.getState().setPetMessage(msg)
}

let audioCtx: AudioContext | null = null

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function playBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

function playCompleteSound() {
  playBeep(880, 0.2, 'sine')
  setTimeout(() => playBeep(1100, 0.3, 'sine'), 200)
  setTimeout(() => playBeep(1320, 0.4, 'sine'), 400)
}

export function useTimer() {
  const intervalRef = useRef<number | null>(null)
  const {
    settings,
    timerStatus,
    timerType,
    timeLeft,
    totalTime,
    completedPomodoros,
    currentTaskId,
    setTimerStatus,
    setTimerType,
    setTimeLeft,
    setTotalTime,
    incrementPomodoro,
    addSession,
    updateSession,
    updateTask,
    tasks
  } = useAppStore()

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback((type: TimerType) => {
    clearTimer()
    let duration: number
    switch (type) {
      case 'work': duration = settings.workDuration * 60; break
      case 'shortBreak': duration = settings.shortBreak * 60; break
      case 'longBreak': duration = settings.longBreak * 60; break
    }
    setTimerType(type)
    setTimeLeft(duration)
    setTotalTime(duration)
    setTimerStatus('running')

    const sessionId = Date.now().toString()
    addSession({
      id: sessionId,
      taskId: type === 'work' ? (currentTaskId ?? undefined) : undefined,
      type,
      startTime: new Date().toISOString(),
      completed: false
    })

    intervalRef.current = window.setInterval(() => {
      const state = useAppStore.getState()
      if (state.timerStatus !== 'running') return

      const newTime = state.timeLeft - 1
      if (newTime <= 0) {
        clearTimer()
        setTimeLeft(0)
        setTimerStatus('finished')
        updateSession(sessionId, { endTime: new Date().toISOString(), completed: true })

        if (type === 'work') {
          incrementPomodoro()
          playCompleteSound()
          window.electronAPI?.notify(
            '番茄完成！',
            '一个番茄钟完成了，休息一下吧 (◕‿◕)'
          )
          window.electronAPI?.pet.updateState('happy', '太棒了！完成了一个番茄～')
          setPetMessage('太棒了！完成了一个番茄～')

          if (currentTaskId) {
            const task = state.tasks.find((t) => t.id === currentTaskId)
            if (task) {
              updateTask(currentTaskId, { completedPomodoros: task.completedPomodoros + 1 })
            }
          }

          const newCount = state.completedPomodoros + 1
          if (newCount % settings.longBreakInterval === 0) {
            setTimeout(() => startTimer('longBreak'), 1500)
          } else {
            setTimeout(() => startTimer('shortBreak'), 1500)
          }
        } else {
          playBeep(660, 0.2, 'sine')
          window.electronAPI?.notify(
            '休息结束！',
            '休息时间到，开始新的番茄吧 (•̀ᴗ•́)و'
          )
          window.electronAPI?.pet.updateState('idle', '休息好了，继续加油吧！')
          setPetMessage('休息好了，继续加油吧！')
        }
        return
      }
      setTimeLeft(newTime)
    }, 1000)
  }, [settings, currentTaskId, clearTimer, setTimerType, setTimeLeft, setTotalTime, setTimerStatus, addSession, incrementPomodoro, updateSession, updateTask, completedPomodoros])

  const pauseTimer = useCallback(() => {
    clearTimer()
    setTimerStatus('paused')
    window.electronAPI?.pet.updateState('idle', '暂停中...')
    setPetMessage('暂停中...')
  }, [clearTimer, setTimerStatus])

  const resumeTimer = useCallback(() => {
    setTimerStatus('running')
    const type = useAppStore.getState().timerType

    intervalRef.current = window.setInterval(() => {
      const state = useAppStore.getState()
      if (state.timerStatus !== 'running') return

      const newTime = state.timeLeft - 1
      if (newTime <= 0) {
        clearTimer()
        setTimeLeft(0)
        setTimerStatus('finished')
        return
      }
      setTimeLeft(newTime)
    }, 1000)
  }, [clearTimer, setTimerStatus, setTimeLeft])

  const resetTimer = useCallback(() => {
    clearTimer()
    setTimerStatus('idle')
    setTimerType('work')
    setTimeLeft(settings.workDuration * 60)
    setTotalTime(settings.workDuration * 60)
    window.electronAPI?.pet.updateState('idle', '准备好了吗？')
    setPetMessage('准备好了吗？')
  }, [clearTimer, settings.workDuration, setTimerStatus, setTimerType, setTimeLeft, setTotalTime])

  const skipTimer = useCallback(() => {
    clearTimer()
    setTimeLeft(0)
    setTimerStatus('finished')
  }, [clearTimer, setTimeLeft, setTimerStatus])

  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const getPetState = (): PetState => {
    if (timerStatus === 'finished' && timerType === 'work') return 'happy'
    if (timerStatus === 'running' && timerType === 'work') return 'working'
    if (timerStatus === 'running' && (timerType === 'shortBreak' || timerType === 'longBreak')) return 'sleep'
    return 'idle'
  }

  return {
    timerStatus,
    timerType,
    timeLeft,
    totalTime,
    progress,
    formattedTime: formatTime(timeLeft),
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipTimer,
    getPetState
  }
}
