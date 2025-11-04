/**
 * Static security explanations library
 * Zero-token vulnerability knowledge base
 */

const STATIC_EXPLANATIONS = {
  // Common Solidity vulnerabilities
  'tx.origin': {
    title: 'tx.origin Authentication',
    severity: 'HIGH',
    description: 'Never use tx.origin for authorization. An attacker can trick your contract via a proxy contract.',
    fix: 'Use msg.sender instead of tx.origin for authentication.',
    example: 'require(msg.sender == owner); // SAFE\nrequire(tx.origin == owner); // UNSAFE'
  },
  
  'call{value}': {
    title: 'Reentrancy Risk',
    severity: 'CRITICAL',
    description: 'External call with value transfer before state update creates reentrancy vulnerability.',
    fix: 'Follow Checks-Effects-Interactions (CEI) pattern. Update state before external calls.',
    example: 'balances[msg.sender] = 0; // Update state first\n(bool success,) = msg.sender.call{value: amount}(""); // Then interact'
  },
  
  'unchecked': {
    title: 'Integer Overflow/Underflow',
    severity: 'HIGH',
    description: 'Solidity <0.8: No automatic overflow checks. >=0.8: Built-in checks.',
    fix: 'Solidity <0.8: Use SafeMath library. >=0.8: Built-in overflow checks (or use unchecked{} for gas optimization).',
    example: 'uint256 result = a + b; // Safe in Solidity >=0.8.0'
  },
  
  'selfdestruct': {
    title: 'Selfdestruct Vulnerability',
    severity: 'HIGH',
    description: 'Selfdestruct can be called by unauthorized users or force-send Ether.',
    fix: 'Protect selfdestruct with proper access control. Be aware it force-sends Ether.',
    example: 'require(msg.sender == owner);\nselfdestruct(payable(owner));'
  },
  
  'delegatecall': {
    title: 'Delegatecall Security',
    severity: 'CRITICAL',
    description: 'delegatecall executes code in caller\'s context. Wrong usage can allow storage manipulation.',
    fix: 'Ensure storage layout matches between contracts. Validate delegatecall targets carefully.',
    example: '// Storage layouts must match!\n// Validate target address'
  },
  
  'transfer': {
    title: 'Transfer Gas Limit',
    severity: 'MEDIUM',
    description: 'transfer() and send() forward only 2300 gas. Can fail with smart contract recipients.',
    fix: 'Use call{value: amount}("") with reentrancy guards instead.',
    example: '(bool success,) = recipient.call{value: amount}("");\nrequire(success, "Transfer failed");'
  },
  
  'blockhash': {
    title: 'Weak Randomness',
    severity: 'HIGH',
    description: 'blockhash, block.timestamp, block.difficulty can be manipulated by miners.',
    fix: 'Use Chainlink VRF or commit-reveal schemes for randomness.',
    example: '// Use Chainlink VRF for secure randomness'
  },
  
  'private': {
    title: 'Private Data Visibility',
    severity: 'MEDIUM',
    description: 'Private variables are still visible on blockchain. Anyone can read storage.',
    fix: 'Never store sensitive data in private variables. Use encryption or off-chain storage.',
    example: '// Private != Secret. All data on chain is public!'
  },
  
  'require': {
    title: 'Input Validation',
    severity: 'MEDIUM',
    description: 'Always validate inputs with require statements.',
    fix: 'Use require() for input validation, assert() for invariants.',
    example: 'require(amount > 0, "Amount must be positive");\nrequire(msg.value >= price, "Insufficient payment");'
  },
  
  'approve': {
    title: 'ERC20 Approve Race Condition',
    severity: 'MEDIUM',
    description: 'approve() can be front-run to spend both old and new allowance.',
    fix: 'Set allowance to 0 first, or use increaseAllowance/decreaseAllowance.',
    example: 'token.approve(spender, 0);\ntoken.approve(spender, newAmount);'
  },
  
  'timestamp': {
    title: 'Block Timestamp Manipulation',
    severity: 'MEDIUM',
    description: 'Miners can manipulate block.timestamp within ~15 seconds.',
    fix: 'Don\'t use for critical logic. Allow ~15 second tolerance.',
    example: '// OK for long timeframes, not for precise timing'
  },
  
  'gas': {
    title: 'Gas Limit DoS',
    severity: 'MEDIUM',
    description: 'Unbounded loops can exceed gas limit, causing DoS.',
    fix: 'Avoid unbounded loops. Use pagination or pull-over-push pattern.',
    example: '// Use withdrawal pattern instead of sending to all users'
  },
  
  'constructor': {
    title: 'Unprotected Constructor',
    severity: 'CRITICAL',
    description: 'Uninitialized implementation contracts can be taken over.',
    fix: 'Use initializer pattern for upgradeable contracts. Protect constructors.',
    example: 'constructor() {\n  _disableInitializers(); // For UUPS proxies\n}'
  },
  
  'fallback': {
    title: 'Fallback Function Security',
    severity: 'MEDIUM',
    description: 'Fallback functions receive Ether and can be entry points for attacks.',
    fix: 'Keep fallback functions simple. Use receive() for plain Ether transfers.',
    example: 'receive() external payable {}\nfallback() external payable {}'
  },
  
  'suicide': {
    title: 'Deprecated Suicide',
    severity: 'LOW',
    description: 'suicide() is deprecated, use selfdestruct().',
    fix: 'Replace suicide() with selfdestruct().',
    example: 'selfdestruct(payable(owner)); // Use this instead of suicide()'
  }
};

/**
 * Get security explanation for a pattern
 * @param {string} pattern - Security pattern or keyword
 * @returns {object|null} - Security explanation or null
 */
function getExplanation(pattern) {
  const key = Object.keys(STATIC_EXPLANATIONS).find(k => 
    pattern.toLowerCase().includes(k.toLowerCase())
  );
  
  return key ? STATIC_EXPLANATIONS[key] : null;
}

/**
 * Scan code for known vulnerabilities
 * @param {string} code - Code to scan
 * @returns {array} - Array of found vulnerabilities
 */
function scanCode(code) {
  const findings = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    Object.keys(STATIC_EXPLANATIONS).forEach(pattern => {
      if (line.toLowerCase().includes(pattern.toLowerCase())) {
        findings.push({
          line: index + 1,
          pattern: pattern,
          code: line.trim(),
          ...STATIC_EXPLANATIONS[pattern]
        });
      }
    });
  });
  
  return findings;
}

/**
 * Get all vulnerability patterns
 * @returns {array} - Array of all patterns
 */
function getAllPatterns() {
  return Object.keys(STATIC_EXPLANATIONS).map(key => ({
    pattern: key,
    ...STATIC_EXPLANATIONS[key]
  }));
}

/**
 * Get security checklist for platform
 * @param {string} platform - ethereum, solana, etc.
 * @returns {array} - Platform-specific checklist
 */
function getSecurityChecklist(platform) {
  const checklists = {
    ethereum: [
      'Check for reentrancy vulnerabilities',
      'Verify integer overflow/underflow protection',
      'Validate all external calls',
      'Use CEI pattern (Checks-Effects-Interactions)',
      'Protect against front-running',
      'Validate access controls',
      'Check for proper input validation',
      'Avoid weak randomness sources',
      'Protect sensitive data',
      'Test with various gas limits'
    ],
    solana: [
      'Verify PDA derivation',
      'Check account ownership',
      'Validate signer authorities',
      'Protect against account confusion',
      'Verify rent exemption',
      'Check for arithmetic overflow',
      'Validate instruction data',
      'Protect program upgrades',
      'Check for proper error handling',
      'Verify token account validation'
    ],
    default: [
      'Validate all inputs',
      'Check access controls',
      'Verify external calls',
      'Test edge cases',
      'Check for proper error handling'
    ]
  };
  
  return checklists[platform] || checklists.default;
}

module.exports = {
  STATIC_EXPLANATIONS,
  getExplanation,
  scanCode,
  getAllPatterns,
  getSecurityChecklist
};
