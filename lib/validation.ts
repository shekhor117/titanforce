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

  if (!data.home || typeof data.home !== 'string' || data.home.trim().length === 0) {
    errors.home = 'Home team is required'
  }

  if (!data.away || typeof data.away !== 'string' || data.away.trim().length === 0) {
    errors.away = 'Away team is required'
  }

  if (!data.date || typeof data.date !== 'string') {
    errors.date = 'Match date is required'
  }

  if (!data.time || typeof data.time !== 'string') {
    errors.time = 'Match time is required'
  }

  if (!data.venue || typeof data.venue !== 'string' || data.venue.trim().length === 0) {
    errors.venue = 'Venue is required'
  }

  if (data.home_score !== undefined && data.home_score !== null && (typeof data.home_score !== 'number' || data.home_score < 0)) {
    errors.home_score = 'Home score must be a non-negative number'
  }

  if (data.away_score !== undefined && data.away_score !== null && (typeof data.away_score !== 'number' || data.away_score < 0)) {
    errors.away_score = 'Away score must be a non-negative number'
  }

  if (data.status && !['live', 'completed', 'upcoming'].includes(data.status)) {
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
