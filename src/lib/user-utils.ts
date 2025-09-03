// User utilities for managing user identification
// This is a simple implementation - in production, use proper authentication

/**
 * Get or generate a user ID for the current session
 * Uses localStorage to persist the user ID across sessions
 */
export function getCurrentUserId(): string {
  if (typeof window === 'undefined') {
    // Server-side: return a default user for SSR
    return 'demo-user'
  }

  const STORAGE_KEY = 'ielts_user_id'
  
  // Try to get existing user ID from localStorage
  let userId = localStorage.getItem(STORAGE_KEY)
  
  if (!userId) {
    // Generate a new user ID if none exists
    userId = generateUserId()
    localStorage.setItem(STORAGE_KEY, userId)
  }
  
  return userId
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `user-${timestamp}-${random}`
}

/**
 * Set a custom user ID (useful for testing or admin purposes)
 */
export function setUserId(userId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ielts_user_id', userId)
  }
}

/**
 * Reset/clear the current user ID (will generate a new one on next access)
 */
export function resetUserId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ielts_user_id')
  }
}

/**
 * Get user display name based on user ID
 */
export function getUserDisplayName(userId: string): string {
  if (userId === 'demo-user') {
    return 'Demo User'
  }
  
  if (userId.startsWith('user-')) {
    const parts = userId.split('-')
    if (parts.length >= 3) {
      const timestamp = parseInt(parts[1])
      const date = new Date(timestamp)
      return `User ${date.toLocaleDateString()}`
    }
  }
  
  return userId
}