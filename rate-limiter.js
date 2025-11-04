const fs = require('fs');
const path = require('path');

const MAX_CALLS_PER_HOUR = 8;
const LOG_FILE = './.study-cache/rate-limit.json';

/**
 * Load call log from file
 */
function loadCallLog() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const data = fs.readFileSync(LOG_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading call log:', error.message);
  }
  return [];
}

/**
 * Save call log to file
 */
function saveCallLog(log) {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
  } catch (error) {
    console.error('Error saving call log:', error.message);
  }
}

/**
 * Check if API call is allowed
 * @returns {boolean} - True if call is allowed
 */
function canCallAPI() {
  const now = Date.now();
  const oneHourAgo = now - 3600000; // 1 hour in milliseconds
  
  let callLog = loadCallLog();
  
  // Remove calls older than 1 hour
  callLog = callLog.filter(timestamp => timestamp > oneHourAgo);
  
  // Save filtered log
  saveCallLog(callLog);
  
  return callLog.length < MAX_CALLS_PER_HOUR;
}

/**
 * Log a new API call
 */
function logCall() {
  const now = Date.now();
  let callLog = loadCallLog();
  
  callLog.push(now);
  saveCallLog(callLog);
}

/**
 * Get remaining API calls for current hour
 * @returns {number} - Number of remaining calls
 */
function getRemainingCalls() {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  
  let callLog = loadCallLog();
  callLog = callLog.filter(timestamp => timestamp > oneHourAgo);
  
  return Math.max(0, MAX_CALLS_PER_HOUR - callLog.length);
}

/**
 * Get time until next available call
 * @returns {number} - Milliseconds until next call available (0 if available now)
 */
function getTimeUntilNextCall() {
  if (canCallAPI()) {
    return 0;
  }
  
  const callLog = loadCallLog();
  if (callLog.length === 0) {
    return 0;
  }
  
  // Find oldest call in current window
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  const recentCalls = callLog.filter(timestamp => timestamp > oneHourAgo);
  
  if (recentCalls.length === 0) {
    return 0;
  }
  
  // Calculate when oldest call will expire
  const oldestCall = Math.min(...recentCalls);
  const timeUntilExpiry = (oldestCall + 3600000) - now;
  
  return Math.max(0, timeUntilExpiry);
}

/**
 * Reset rate limiter (for testing or manual reset)
 */
function reset() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.unlinkSync(LOG_FILE);
    }
  } catch (error) {
    console.error('Error resetting rate limiter:', error.message);
  }
}

/**
 * Get rate limiter statistics
 */
function getStats() {
  const remaining = getRemainingCalls();
  const used = MAX_CALLS_PER_HOUR - remaining;
  const timeUntil = getTimeUntilNextCall();
  
  return {
    maxPerHour: MAX_CALLS_PER_HOUR,
    used: used,
    remaining: remaining,
    canCall: canCallAPI(),
    timeUntilNextCall: timeUntil,
    timeUntilNextCallMinutes: Math.ceil(timeUntil / 60000)
  };
}

module.exports = {
  canCallAPI,
  logCall,
  getRemainingCalls,
  getTimeUntilNextCall,
  reset,
  getStats,
  MAX_CALLS_PER_HOUR
};
