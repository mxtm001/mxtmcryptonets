// Saved logins management
export interface SavedLogin {
  id: string
  email: string
  name: string
  country: string
  lastUsed: string
  avatar?: string
}

export function getSavedLogins(): SavedLogin[] {
  try {
    const saved = localStorage.getItem("savedLogins")
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error("Error getting saved logins:", error)
  }
  return []
}

export function saveLogin(email: string, name: string, country: string): void {
  try {
    const savedLogins = getSavedLogins()
    const existingIndex = savedLogins.findIndex((login) => login.email === email)

    const loginData: SavedLogin = {
      id: Date.now().toString(),
      email,
      name,
      country,
      lastUsed: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      // Update existing login
      savedLogins[existingIndex] = loginData
    } else {
      // Add new login
      savedLogins.unshift(loginData)
    }

    // Keep only the last 5 logins
    const trimmedLogins = savedLogins.slice(0, 5)
    localStorage.setItem("savedLogins", JSON.stringify(trimmedLogins))
  } catch (error) {
    console.error("Error saving login:", error)
  }
}

export function removeSavedLogin(email: string): void {
  try {
    const savedLogins = getSavedLogins()
    const filteredLogins = savedLogins.filter((login) => login.email !== email)
    localStorage.setItem("savedLogins", JSON.stringify(filteredLogins))
  } catch (error) {
    console.error("Error removing saved login:", error)
  }
}

export function updateLastUsed(email: string): void {
  try {
    const savedLogins = getSavedLogins()
    const loginIndex = savedLogins.findIndex((login) => login.email === email)

    if (loginIndex >= 0) {
      savedLogins[loginIndex].lastUsed = new Date().toISOString()
      // Move to front
      const updatedLogin = savedLogins.splice(loginIndex, 1)[0]
      savedLogins.unshift(updatedLogin)
      localStorage.setItem("savedLogins", JSON.stringify(savedLogins))
    }
  } catch (error) {
    console.error("Error updating last used:", error)
  }
}
