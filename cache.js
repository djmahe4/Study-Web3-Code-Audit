const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = './.study-cache';

/**
 * Generate MD5 hash for cache key
 */
function hash(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * Retrieve cached value by key
 * @param {string} key - Cache key
 * @returns {any|null} - Cached value or null if not found
 */
function getCache(key) {
  try {
    const file = path.join(CACHE_DIR, `${hash(key)}.json`);
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf8');
      const cached = JSON.parse(data);
      
      // Check if cache has expiration and if it's expired
      if (cached.expires && Date.now() > cached.expires) {
        fs.unlinkSync(file);
        return null;
      }
      
      return cached.value;
    }
  } catch (error) {
    console.error('Cache read error:', error.message);
  }
  return null;
}

/**
 * Store value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in milliseconds (optional)
 */
function setCache(key, value, ttl = null) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    
    const cacheData = {
      value: value,
      created: Date.now(),
      expires: ttl ? Date.now() + ttl : null
    };
    
    const file = path.join(CACHE_DIR, `${hash(key)}.json`);
    fs.writeFileSync(file, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error('Cache write error:', error.message);
  }
}

/**
 * Clear all cache
 */
function clearCache() {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      files.forEach(file => {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      });
    }
  } catch (error) {
    console.error('Cache clear error:', error.message);
  }
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      return { count: 0, size: 0, sizeKB: '0.00' };
    }
    
    const files = fs.readdirSync(CACHE_DIR);
    let totalSize = 0;
    
    files.forEach(file => {
      const stats = fs.statSync(path.join(CACHE_DIR, file));
      totalSize += stats.size;
    });
    
    return {
      count: files.length,
      size: totalSize,
      sizeKB: (totalSize / 1024).toFixed(2)
    };
  } catch (error) {
    return { count: 0, size: 0, sizeKB: '0.00' };
  }
}

module.exports = {
  getCache,
  setCache,
  clearCache,
  getCacheStats,
  hash
};
