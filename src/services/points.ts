import { supabase } from './supabase'

const POINTS_KEY = 'user_points'
const LAST_RESET_KEY = 'points_last_reset'
const COMPLETED_TASKS_KEY = 'completed_tasks'
const UPGRADE_STATUS_KEY = 'upgrade_status'
const DAILY_POINTS = 10
const TOOL_COST = 1

// Custom event for points updates
const POINTS_UPDATE_EVENT = 'POINTS_UPDATE'
const UPGRADE_STATUS_EVENT = 'UPGRADE_STATUS_UPDATE'

export interface UserPoints {
  id: string
  user_id: string
  points: number
  last_reset: string
  completed_tasks: string[]
  is_pro: boolean
  tasks_completed: number
}

export interface UpgradeStatus {
  isPro: boolean
  tasksCompleted: number
  totalTasks: number
  unlockedFeatures: string[]
}

// Helper function to dispatch custom events
function dispatchPointsUpdate(points: number) {
  const event = new CustomEvent(POINTS_UPDATE_EVENT, { detail: points })
  window.dispatchEvent(event)
}

function dispatchUpgradeUpdate(status: UpgradeStatus) {
  const event = new CustomEvent(UPGRADE_STATUS_EVENT, { detail: status })
  window.dispatchEvent(event)
}

export async function initializePoints() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return DAILY_POINTS

  // Get user's points from database
  const { data: userPoints } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!userPoints) {
    // Create new user points record
    const { data } = await supabase
      .from('user_points')
      .insert({
        user_id: user.id,
        points: DAILY_POINTS,
        last_reset: new Date().toISOString(),
        completed_tasks: [],
        is_pro: false,
        tasks_completed: 0
      })
      .select()
      .single()
    
    if (data) {
      dispatchPointsUpdate(DAILY_POINTS)
      return DAILY_POINTS
    }
  } else {
    // Check if points need to be reset
    const lastReset = new Date(userPoints.last_reset)
    const today = new Date()
    if (lastReset.toDateString() !== today.toDateString()) {
      // Reset points for new day
      const { data } = await supabase
        .from('user_points')
        .update({
          points: DAILY_POINTS,
          last_reset: today.toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()
      
      if (data) {
        dispatchPointsUpdate(DAILY_POINTS)
        return DAILY_POINTS
      }
    }
    dispatchPointsUpdate(userPoints.points)
    return userPoints.points
  }

  return DAILY_POINTS
}

export async function getCurrentPoints(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return DAILY_POINTS

  const { data: userPoints } = await supabase
    .from('user_points')
    .select('points')
    .eq('user_id', user.id)
    .single()

  return userPoints?.points ?? DAILY_POINTS
}

export function getCompletedTasks(): string[] {
  const tasks = localStorage.getItem(COMPLETED_TASKS_KEY)
  return tasks ? JSON.parse(tasks) : []
}

export async function completeTask(taskId: string, pointReward: number): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: userPoints } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!userPoints) return false

  if (!userPoints.completed_tasks.includes(taskId)) {
    const newPoints = userPoints.points + pointReward
    const newTasksCompleted = userPoints.tasks_completed + 1
    const isPro = newTasksCompleted >= 2 // 2 tasks for pro
    const completedTasks = [...userPoints.completed_tasks, taskId]

    const { data } = await supabase
      .from('user_points')
      .update({
        points: newPoints,
        completed_tasks: completedTasks,
        tasks_completed: newTasksCompleted,
        is_pro: isPro
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (data) {
      dispatchPointsUpdate(newPoints)
      dispatchUpgradeUpdate({
        isPro,
        tasksCompleted: newTasksCompleted,
        totalTasks: 2,
        unlockedFeatures: isPro ? [
          'Unlimited daily points',
          'Priority analysis',
          'Advanced statistics',
          'Custom AI responses'
        ] : []
      })
      return true
    }
  }

  return false
}

export async function usePoint(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.log('No user found')
    return false
  }

  try {
    // First check if user has enough points
    const { data: userPoints, error: fetchError } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', user.id)
      .single()

    console.log('Current points:', userPoints?.points)
    console.log('Is pro user:', userPoints?.is_pro)

    if (fetchError || !userPoints) {
      console.error('Error fetching points:', fetchError)
      return false
    }

    // Pro users don't consume points
    if (userPoints.is_pro) {
      console.log('Pro user - no points deducted')
      return true
    }

    // Check if user has enough points
    if (userPoints.points >= TOOL_COST) {
      console.log('Attempting to deduct', TOOL_COST, 'points')
      
      // Use decrement for atomic update
      const { data, error: updateError } = await supabase.rpc('deduct_point', {
        user_id_input: user.id,
        points_to_deduct: TOOL_COST
      })

      console.log('Deduction result:', data)
      
      if (updateError) {
        console.error('Error deducting points:', updateError)
        return false
      }

      // Get updated points after deduction
      const { data: updatedPoints } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', user.id)
        .single()

      console.log('Points after deduction:', updatedPoints?.points)

      if (updatedPoints) {
        dispatchPointsUpdate(updatedPoints.points)
        return true
      }
    } else {
      console.log('Not enough points. Current:', userPoints.points, 'Required:', TOOL_COST)
    }

    return false
  } catch (error) {
    console.error('Error in usePoint:', error)
    return false
  }
}

export const addPoints = (amount: number) => {
  const currentPoints = getCurrentPoints()
  const newPoints = currentPoints + amount
  localStorage.setItem(POINTS_KEY, String(newPoints))
  dispatchPointsUpdate(newPoints)
}

export async function getUpgradeStatus(): Promise<UpgradeStatus> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {
    isPro: false,
    tasksCompleted: 0,
    totalTasks: 2,
    unlockedFeatures: []
  }

  const { data: userPoints } = await supabase
    .from('user_points')
    .select('is_pro, tasks_completed, completed_tasks')
    .eq('user_id', user.id)
    .single()

  if (!userPoints) return {
    isPro: false,
    tasksCompleted: 0,
    totalTasks: 2,
    unlockedFeatures: []
  }

  return {
    isPro: userPoints.is_pro,
    tasksCompleted: userPoints.tasks_completed,
    totalTasks: 2,
    unlockedFeatures: userPoints.is_pro ? [
      'Unlimited daily points',
      'Priority analysis',
      'Advanced statistics',
      'Custom AI responses'
    ] : []
  }
}

// Function to check if user has enough points
export async function hasEnoughPoints(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: userPoints } = await supabase
    .from('user_points')
    .select('points, is_pro')
    .eq('user_id', user.id)
    .single()

  return userPoints?.is_pro || (userPoints?.points ?? 0) >= TOOL_COST
}

// Export event names for components to use
export const EVENTS = {
  POINTS_UPDATE: POINTS_UPDATE_EVENT,
  UPGRADE_STATUS: UPGRADE_STATUS_EVENT
} 