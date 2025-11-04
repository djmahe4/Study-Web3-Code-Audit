const { getCache, setCache } = require('./cache');
const { canCallAPI, logCall, getRemainingCalls } = require('./rate-limiter');
const { scanCode, getExplanation } = require('./security-lib');
const { spawn } = require('child_process');
const path = require('path');

const BATCH_SIZE = 3;

class Editor {
  constructor(platform, project) {
    this.platform = platform;
    this.project = project;
    this.code = [];
    this.buffer = [];
    this.suggestions = [];
    this.cacheHits = 0;
    this.apiCalls = 0;
  }

  /**
   * Add a line of code
   */
  addLine(line) {
    this.buffer.push(line);
    this.code.push(line);
    
    return {
      lineNumber: this.code.length,
      totalLines: this.code.length
    };
  }

  /**
   * Get suggestion for next line(s)
   * Uses batching to minimize API calls
   */
  async getSuggestion(forceBatch = false) {
    // If buffer isn't full and not forced, wait for more lines
    if (!forceBatch && this.buffer.length < BATCH_SIZE) {
      return {
        waiting: true,
        bufferSize: this.buffer.length,
        batchSize: BATCH_SIZE,
        message: `Buffering... (${this.buffer.length}/${BATCH_SIZE} lines)`
      };
    }

    // Get context from last few lines
    const context = this.getContext();
    const cacheKey = `suggestion-${this.platform}-${JSON.stringify(context)}`;
    
    // Try cache first
    const cached = getCache(cacheKey);
    if (cached) {
      this.cacheHits++;
      this.buffer = [];
      return {
        source: 'cache',
        suggestion: cached,
        cacheHits: this.cacheHits
      };
    }

    // Check if we can call API
    if (!canCallAPI()) {
      // Fall back to static analysis
      return this.getStaticSuggestion();
    }

    // Call API (or simulate for now)
    const suggestion = await this.callGeminiAPI(context);
    
    if (suggestion) {
      // Cache the result
      setCache(cacheKey, suggestion);
      logCall();
      this.apiCalls++;
      this.buffer = [];
      
      return {
        source: 'api',
        suggestion: suggestion,
        apiCalls: this.apiCalls,
        remainingCalls: getRemainingCalls()
      };
    }

    // Fallback to static
    return this.getStaticSuggestion();
  }

  /**
   * Get context from recent code
   */
  getContext() {
    // Use last 5 lines as context (diff-based)
    const contextSize = 5;
    const startIdx = Math.max(0, this.code.length - contextSize);
    return this.code.slice(startIdx);
  }

  /**
   * Get static suggestion without API
   */
  getStaticSuggestion() {
    const currentCode = this.code.join('\n');
    const findings = scanCode(currentCode);
    
    this.buffer = [];

    if (findings.length > 0) {
      const latest = findings[findings.length - 1];
      return {
        source: 'static',
        suggestion: {
          type: 'warning',
          message: latest.description,
          fix: latest.fix,
          severity: latest.severity
        },
        cacheHits: this.cacheHits
      };
    }

    return {
      source: 'static',
      suggestion: {
        type: 'general',
        message: 'Continue writing code. Remember security best practices.',
        tips: this.getPlatformTips()
      },
      cacheHits: this.cacheHits
    };
  }

  /**
   * Get platform-specific tips
   */
  getPlatformTips() {
    const tips = {
      ethereum: [
        'Follow CEI pattern: Checks, Effects, Interactions',
        'Use require() for input validation',
        'Emit events for important state changes',
        'Consider gas optimization'
      ],
      solana: [
        'Always validate account ownership',
        'Check signer permissions',
        'Verify PDA derivation',
        'Handle errors explicitly'
      ]
    };
    
    return tips[this.platform] || tips.ethereum;
  }

  /**
   * Call Gemini API (simulated for now)
   * In production, this would call Python backend
   */
  async callGeminiAPI(context) {
    // Simulate API call
    // In production: spawn Python process or make HTTP request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          type: 'suggestion',
          message: 'Consider adding error handling',
          code: '// Add your implementation here'
        });
      }, 100);
    });
  }

  /**
   * Run security audit on current code
   */
  auditCode() {
    const currentCode = this.code.join('\n');
    const findings = scanCode(currentCode);
    
    return {
      totalLines: this.code.length,
      findings: findings,
      summary: {
        critical: findings.filter(f => f.severity === 'CRITICAL').length,
        high: findings.filter(f => f.severity === 'HIGH').length,
        medium: findings.filter(f => f.severity === 'MEDIUM').length,
        low: findings.filter(f => f.severity === 'LOW').length
      }
    };
  }

  /**
   * Get current code
   */
  getCode() {
    return this.code.join('\n');
  }

  /**
   * Save code to file
   */
  saveToFile(filename) {
    const fs = require('fs');
    const content = this.getCode();
    fs.writeFileSync(filename, content);
    return filename;
  }

  /**
   * Get session statistics
   */
  getStats() {
    return {
      totalLines: this.code.length,
      cacheHits: this.cacheHits,
      apiCalls: this.apiCalls,
      bufferSize: this.buffer.length,
      remainingAPICalls: getRemainingCalls()
    };
  }

  /**
   * Undo last line
   */
  undo() {
    if (this.code.length > 0) {
      const removed = this.code.pop();
      if (this.buffer.length > 0) {
        this.buffer.pop();
      }
      return {
        success: true,
        removed: removed,
        totalLines: this.code.length
      };
    }
    return {
      success: false,
      message: 'No lines to undo'
    };
  }

  /**
   * Clear buffer without removing from code
   */
  clearBuffer() {
    this.buffer = [];
  }
}

module.exports = Editor;
