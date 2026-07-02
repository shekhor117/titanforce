// Data validation utilities for admin CRUD operations

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validatePlayer(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Player name is required and must be a non-empty string'
  }

  if (data.number === undefined || data.number === null) {
    errors.number = 'Player number is required'
  } else if (!Number.isInteger(Number(data.number)) || Number(data.number) < 0 || Number(data.number) > 99) {
    errors.number = 'Player number must be an integer between 0 and 99'
  }

  if (data.position && typeof data.position !== 'string') {
    errors.position = 'Position must be a string'
  }

  if (data.status && !['active', 'injured', 'suspended', 'Active'].includes(data.status)) {
    errors.status = 'Invalid player status'
  }

  if (data.goals !== undefined && (typeof data.goals !== 'number' || data.goals < 0)) {
    errors.goals = 'Goals must be a non-negative number'
  }

  if (data.assists !== undefined && (typeof data.assists !== 'number' || data.assists < 0)) {
    errors.assists = 'Assists must be a non-negative number'
  }

  if (data.appearances !== undefined && (typeof data.appearances !== 'number' || data.appearances < 0)) {
    errors.appearances = 'Appearances must be a non-negative number'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateMatch(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  // Support both field naming conventions
  const homeTeam = data.home || data.home_team
  const awayTeam = data.away || data.away_team
  const matchDate = data.date || data.match_date
  const matchTime = data.time || data.match_time

  if (!homeTeam || typeof homeTeam !== 'string' || homeTeam.trim().length === 0) {
    errors.home_team = 'Home team is required'
  }

  if (!awayTeam || typeof awayTeam !== 'string' || awayTeam.trim().length === 0) {
    errors.away_team = 'Away team is required'
  }

  if (!matchDate || typeof matchDate !== 'string') {
    errors.match_date = 'Match date is required'
  }

  // Match time is optional for upcoming matches
  if (matchTime && typeof matchTime !== 'string') {
    errors.match_time = 'Match time must be a string'
  }

  // Venue is optional
  if (data.venue && typeof data.venue !== 'string') {
    errors.venue = 'Venue must be a string'
  }

  if (data.home_score !== undefined && data.home_score !== null && (typeof data.home_score !== 'number' || data.home_score < 0)) {
    errors.home_score = 'Home score must be a non-negative number'
  }

  if (data.away_score !== undefined && data.away_score !== null && (typeof data.away_score !== 'number' || data.away_score < 0)) {
    errors.away_score = 'Away score must be a non-negative number'
  }

  if (data.status && !['live', 'completed', 'upcoming', 'postponed'].includes(data.status)) {
    errors.status = 'Invalid match status'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validatePartner(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Partner name is required'
  }

  if (data.category && typeof data.category !== 'string') {
    errors.category = 'Category must be a string'
  }

  if (data.description && typeof data.description !== 'string') {
    errors.description = 'Description must be a string'
  }

  if (data.link && typeof data.link !== 'string') {
    errors.link = 'Link must be a string'
  } else if (data.link && !isValidUrl(data.link)) {
    errors.link = 'Link must be a valid URL'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateFan(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Fan name is required'
  }

  if (data.email && typeof data.email !== 'string') {
    errors.email = 'Email must be a string'
  } else if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Email must be valid'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateAdminSetup(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email must be valid'
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.password = 'Password is required'
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (data.name && typeof data.name !== 'string') {
    errors.name = 'Name must be a string'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateProduct(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Product name is required'
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.description = 'Product description is required'
  }

  if (!data.category || typeof data.category !== 'string') {
    errors.category = 'Product category is required'
  }

  if (data.price === undefined || data.price === null) {
    errors.price = 'Product price is required'
  } else if (typeof data.price !== 'number' || data.price < 0) {
    errors.price = 'Price must be a non-negative number'
  }

  if (data.stock !== undefined && data.stock !== null) {
    if (typeof data.stock !== 'number' || data.stock < 0) {
      errors.stock = 'Stock must be a non-negative number'
    }
  }

  if (data.imageUrl && typeof data.imageUrl !== 'string') {
    errors.imageUrl = 'Image URL must be a string'
  } else if (data.imageUrl && !isValidUrl(data.imageUrl)) {
    errors.imageUrl = 'Image URL must be valid'
  }

  if (data.sizes && !Array.isArray(data.sizes)) {
    errors.sizes = 'Sizes must be an array'
  }

  if (data.colors && !Array.isArray(data.colors)) {
    errors.colors = 'Colors must be an array'
  }

  if (data.rating !== undefined && (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5)) {
    errors.rating = 'Rating must be between 0 and 5'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateOrder(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.trim().length === 0) {
    errors.customerName = 'Customer name is required'
  }

  if (!data.customerEmail || typeof data.customerEmail !== 'string') {
    errors.customerEmail = 'Customer email is required'
  } else if (!isValidEmail(data.customerEmail)) {
    errors.customerEmail = 'Customer email must be valid'
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.items = 'Order must have at least one item'
  }

  if (data.total === undefined || data.total === null) {
    errors.total = 'Order total is required'
  } else if (typeof data.total !== 'number' || data.total < 0) {
    errors.total = 'Order total must be a non-negative number'
  }

  if (data.status && !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(data.status)) {
    errors.status = 'Invalid order status'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateNews(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.title = 'News title is required'
  }

  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    errors.content = 'News content is required'
  }

  if (data.image_url && typeof data.image_url !== 'string') {
    errors.image_url = 'Image URL must be a string'
  } else if (data.image_url && !isValidUrl(data.image_url)) {
    errors.image_url = 'Image URL must be valid'
  }

  if (data.status && !['draft', 'published', 'archived'].includes(data.status)) {
    errors.status = 'Invalid news status'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateMedia(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.title = 'Media title is required'
  }

  if (!data.url || typeof data.url !== 'string') {
    errors.url = 'Media URL is required'
  } else if (!isValidUrl(data.url)) {
    errors.url = 'Media URL must be valid'
  }

  if (!data.type || typeof data.type !== 'string') {
    errors.type = 'Media type is required'
  }

  if (data.description && typeof data.description !== 'string') {
    errors.description = 'Description must be a string'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateTrophy(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Trophy name is required'
  }

  if (!data.category || typeof data.category !== 'string') {
    errors.category = 'Trophy category is required'
  }

  if (data.year === undefined || data.year === null) {
    errors.year = 'Trophy year is required'
  } else if (!Number.isInteger(Number(data.year)) || Number(data.year) < 1900 || Number(data.year) > new Date().getFullYear()) {
    errors.year = 'Trophy year must be valid'
  }

  if (data.description && typeof data.description !== 'string') {
    errors.description = 'Description must be a string'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateContact(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Contact name is required'
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'Contact email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Contact email must be valid'
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.message = 'Message is required'
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }

  if (data.status && !['new', 'read', 'responded', 'archived'].includes(data.status)) {
    errors.status = 'Invalid contact status'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateInjury(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.playerId || typeof data.playerId !== 'string') {
    errors.playerId = 'Player ID is required'
  }

  if (!data.injuryType || typeof data.injuryType !== 'string' || data.injuryType.trim().length === 0) {
    errors.injuryType = 'Injury type is required'
  }

  if (!data.injuryDate || typeof data.injuryDate !== 'string') {
    errors.injuryDate = 'Injury date is required'
  }

  if (data.status && !['active', 'recovering', 'recovered'].includes(data.status)) {
    errors.status = 'Invalid injury status'
  }

  if (data.recoveryProgress !== undefined && (typeof data.recoveryProgress !== 'number' || data.recoveryProgress < 0 || data.recoveryProgress > 100)) {
    errors.recoveryProgress = 'Recovery progress must be between 0 and 100'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateLineup(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.formation || typeof data.formation !== 'string') {
    errors.formation = 'Formation is required'
  }

  if (!data.playerIds || !Array.isArray(data.playerIds)) {
    errors.playerIds = 'Player IDs must be an array'
  } else if (data.playerIds.length > 11) {
    errors.playerIds = 'Lineup cannot have more than 11 players'
  }

  if (data.matchId && typeof data.matchId !== 'string') {
    errors.matchId = 'Match ID must be a string'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateMotm(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.matchId || typeof data.matchId !== 'string') {
    errors.matchId = 'Match ID is required'
  }

  if (!data.playerId || typeof data.playerId !== 'string') {
    errors.playerId = 'Player ID is required'
  }

  if (data.rating !== undefined && (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 10)) {
    errors.rating = 'Rating must be between 0 and 10'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateRanking(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.playerId || typeof data.playerId !== 'string') {
    errors.playerId = 'Player ID is required'
  }

  if (data.goals !== undefined && (typeof data.goals !== 'number' || data.goals < 0)) {
    errors.goals = 'Goals must be a non-negative number'
  }

  if (data.assists !== undefined && (typeof data.assists !== 'number' || data.assists < 0)) {
    errors.assists = 'Assists must be a non-negative number'
  }

  if (data.rank !== undefined && (typeof data.rank !== 'number' || data.rank < 1)) {
    errors.rank = 'Rank must be a positive number'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateNewsUpdate(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.title = 'News update title is required'
  }

  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    errors.content = 'News update content is required'
  }

  if (data.imageUrl && typeof data.imageUrl !== 'string') {
    errors.imageUrl = 'Image URL must be a string'
  } else if (data.imageUrl && !isValidUrl(data.imageUrl)) {
    errors.imageUrl = 'Image URL must be valid'
  }

  if (data.status && !['draft', 'published', 'archived'].includes(data.status)) {
    errors.status = 'Invalid news update status'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validatePlayerProfile(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.userId || typeof data.userId !== 'string') {
    errors.userId = 'User ID is required'
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Player name is required'
  }

  if (data.position && typeof data.position !== 'string') {
    errors.position = 'Position must be a string'
  }

  if (data.jerseyNumber !== undefined && (typeof data.jerseyNumber !== 'number' || data.jerseyNumber < 1 || data.jerseyNumber > 99)) {
    errors.jerseyNumber = 'Jersey number must be between 1 and 99'
  }

  if (data.age !== undefined && (typeof data.age !== 'number' || data.age < 16 || data.age > 50)) {
    errors.age = 'Age must be between 16 and 50'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateUser(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'User name is required'
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.email = 'User email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'User email must be valid'
  }

  if (data.role && !['admin', 'user', 'moderator'].includes(data.role)) {
    errors.role = 'Invalid user role'
  }

  if (data.status && !['active', 'inactive', 'suspended'].includes(data.status)) {
    errors.status = 'Invalid user status'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateAnalytics(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (data.playerId && typeof data.playerId !== 'string') {
    errors.playerId = 'Player ID must be a string'
  }

  if (data.sessions && !Array.isArray(data.sessions)) {
    errors.sessions = 'Sessions must be an array'
  }

  if (data.avgFitness !== undefined && (typeof data.avgFitness !== 'number' || data.avgFitness < 0 || data.avgFitness > 100)) {
    errors.avgFitness = 'Average fitness must be between 0 and 100'
  }

  if (data.avgIntensity !== undefined && (typeof data.avgIntensity !== 'number' || data.avgIntensity < 0 || data.avgIntensity > 100)) {
    errors.avgIntensity = 'Average intensity must be between 0 and 100'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateFeature(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Feature name is required'
  }

  if (data.description && typeof data.description !== 'string') {
    errors.description = 'Description must be a string'
  }

  if (typeof data.enabled !== 'boolean') {
    errors.enabled = 'Enabled must be a boolean'
  }

  if (!data.category || !['tools', 'analytics', 'engagement'].includes(data.category)) {
    errors.category = 'Category must be one of: tools, analytics, engagement'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateSettings(data: any): ValidationResult {
  const errors: Record<string, string> = {}

  if (data.siteName && typeof data.siteName !== 'string') {
    errors.siteName = 'Site name must be a string'
  }

  if (data.siteDescription && typeof data.siteDescription !== 'string') {
    errors.siteDescription = 'Site description must be a string'
  }

  if (data.primaryColor && !/^#[0-9A-F]{6}$/i.test(data.primaryColor)) {
    errors.primaryColor = 'Primary color must be a valid hex color'
  }

  if (data.socialLinks && typeof data.socialLinks !== 'object') {
    errors.socialLinks = 'Social links must be an object'
  }

  if (data.maintenanceMode && typeof data.maintenanceMode !== 'boolean') {
    errors.maintenanceMode = 'Maintenance mode must be a boolean'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
