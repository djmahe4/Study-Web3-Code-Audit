# Usage Examples

## Example 1: Get Project Idea (Cached Mode - 0 API Calls)

```bash
$ study-web3 idea --cached

📚 Project Ideas

✓ Using cached ideas (0 API calls)

? Select platform: Ethereum / Solidity
? Select difficulty: beginner
? Choose a project: Secure Tip Jar - Learn reentrancy protection with a simple payment contract

┌─────────────────────────────────────────────────────┐
│                                                     │
│   Secure Tip Jar                                    │
│                                                     │
│   Goal: Learn reentrancy protection with a         │
│         simple payment contract                     │
│   Vulnerability: reentrancy                         │
│   Difficulty: beginner                              │
│   Estimated lines: 35                               │
│                                                     │
│   Starter code:                                     │
│   // SPDX-License-Identifier: MIT                   │
│   pragma solidity ^0.8.0;                           │
│                                                     │
│   contract TipJar {                                 │
│       mapping(address => uint256) public balances;  │
│                                                     │
│       // Add your code here                         │
│   }                                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Example 2: Interactive Coding Session

```bash
$ study-web3 start

📝 Interactive Code Editor

Commands:
  - Type code and press Enter to add line
  - Type ":suggest" for AI suggestion
  - Type ":audit" to run security scan
  - Type ":save" to save your code
  - Type ":stats" to view statistics
  - Type ":undo" to remove last line
  - Type ":quit" to exit

[0 lines] > // SPDX-License-Identifier: MIT
[1 lines] > pragma solidity ^0.8.0;
[2 lines] > 
[3 lines] > contract TipJar {

💡 Hint: Type :suggest for AI suggestion

[4 lines] >     mapping(address => uint256) public balances;
[5 lines] >     
[6 lines] >     function deposit() public payable {
[7 lines] >         balances[msg.sender] += msg.value;
[8 lines] >     }
[9 lines] > :audit

🔍 Security Audit Report

Total lines: 9
Critical: 0
High: 0
Medium: 0
Low: 0

✓ No vulnerabilities detected!

[9 lines] > :stats

┌────────────────────────────────────────┐
│   Session Statistics                   │
│                                        │
│   Code:                                │
│     Lines written: 9                   │
│     Buffer size: 0                     │
│                                        │
│   API Usage:                           │
│     API calls made: 0                  │
│     Cache hits: 0                      │
│     Remaining calls: 8/8               │
│                                        │
│   Cache:                               │
│     Cached items: 0                    │
│     Cache size: 0.00 KB                │
└────────────────────────────────────────┘

[9 lines] > :save
? Save as: tip-jar.sol
✓ Saved to tip-jar.sol

[9 lines] > :quit
? Save before exiting? Yes
✓ Editor closed

👋 Happy learning!
```

## Example 3: Audit Existing Contract (Local Mode - 0 API Calls)

```bash
$ study-web3 audit --local

🔍 Security Audit (Local Mode)

✓ Using local analysis only (0 API calls)

? File to audit: test-contract.sol

Auditing: test-contract.sol

1. [HIGH] Line 12: tx.origin Authentication
   Never use tx.origin for authorization. An attacker can trick your contract via a proxy contract.
   Fix: Use msg.sender instead of tx.origin for authentication.

2. [CRITICAL] Line 24: Reentrancy Risk
   External call with value transfer before state update creates reentrancy vulnerability.
   Fix: Follow Checks-Effects-Interactions (CEI) pattern. Update state before external calls.

3. [MEDIUM] Line 36: Transfer Gas Limit
   transfer() and send() forward only 2300 gas. Can fail with smart contract recipients.
   Fix: Use call{value: amount}("") with reentrancy guards instead.

4. [HIGH] Line 41: Selfdestruct Vulnerability
   Selfdestruct can be called by unauthorized users or force-send Ether.
   Fix: Protect selfdestruct with proper access control. Be aware it force-sends Ether.
```

## Example 4: View System Info

```bash
$ study-web3 info

╭───────────────────────────────────────╮
│                                       │
│   System Information                  │
│                                       │
│   Cache:                              │
│     Cached items: 12                  │
│     Cache size: 4.23 KB               │
│                                       │
│   Rate Limiter:                       │
│     Max calls/hour: 8                 │
│     Used: 2                           │
│     Remaining: 6                      │
│     Can call API: Yes                 │
│                                       │
│   Security Library:                   │
│     Known patterns: 15                │
│                                       │
│   Token Savings:                      │
│     ✓ Aggressive caching enabled      │
│     ✓ Batched suggestions (3 lines)   │
│     ✓ Static fallbacks ready          │
│                                       │
╰───────────────────────────────────────╯
```

## Example 5: Interactive Editor with Suggestions

```bash
[10 lines] > :suggest

💾 Suggestion (cache):

Consider adding error handling and event emissions.

Fix: Add events for important state changes and use require for validation.

Cache hits: 1
```

## Example 6: Progressive Learning Path

### Week 1 - Fundamentals (Cached Mode Only)

```bash
# Day 1-3: Learn basics with zero API calls
$ study-web3 idea --cached  # Select beginner projects

# Complete projects:
# 1. Secure Tip Jar
# 2. Simple Voting System  
# 3. Token Faucet

# API Calls: 0
# Token Usage: 0
```

### Week 2 - Advanced Topics

```bash
# Day 4-7: Use batched suggestions
$ study-web3 start --batch=3

# Complete projects:
# 4. Secure Escrow
# 5. Lottery System
# 6. Staking Contract

# API Calls: 2-3 per day
# Token Usage: ~500 per day
```

### Week 3 - Real-World Patterns

```bash
# Day 8-14: Mix cached and batch modes
$ study-web3 start

# Complete projects:
# 7. Multi-Sig Wallet
# 8. NFT Marketplace
# 9. Token Swap

# API Calls: 3-4 per day
# Token Usage: ~800 per day
```

### Exam Week - Practice

```bash
# Use local audit exclusively
$ study-web3 audit --local contract1.sol
$ study-web3 audit --local contract2.sol
$ study-web3 audit --local contract3.sol

# API Calls: 0
# Token Usage: 0
```

## Example 7: Security Checklist

When starting a project, view the platform-specific security checklist:

```bash
$ study-web3 idea --cached

? Select platform: Ethereum / Solidity
? Select difficulty: beginner
? Choose a project: Secure Tip Jar
? What would you like to do? View security checklist

🔒 Security Checklist for ethereum:

  1. Check for reentrancy vulnerabilities
  2. Verify integer overflow/underflow protection
  3. Validate all external calls
  4. Use CEI pattern (Checks-Effects-Interactions)
  5. Protect against front-running
  6. Validate access controls
  7. Check for proper input validation
  8. Avoid weak randomness sources
  9. Protect sensitive data
  10. Test with various gas limits
```

## Example 8: Clear Cache

```bash
$ study-web3 clear

? Clear all cache? Yes

✓ Cache cleared

$ study-web3 info

╭───────────────────────────────────────╮
│   Cache:                              │
│     Cached items: 0                   │
│     Cache size: 0.00 KB               │
│                                       │
│   Rate Limiter:                       │
│     Used: 0                           │
│     Remaining: 8                      │
╰───────────────────────────────────────╯
```

## Example 9: Editor Commands Quick Reference

```bash
[5 lines] > :help

📖 Help

Commands:
  :suggest, :s    - Get AI suggestion
  :audit, :a      - Run security audit
  :save           - Save code to file
  :stats          - View statistics
  :undo, :u       - Undo last line
  :help, :h       - Show this help
  :quit, :q       - Exit editor
```

## Example 10: Python Backend Testing

```bash
# Check cache stats
$ cd backend
$ python3 gemini.py --stats
Cache statistics:
  Files: 0
  Size: 0.0 KB
  Location: /home/user/backend/cache

# Test a prompt (without API key)
$ python3 gemini.py "Explain reentrancy"
Response: GEMINI_API_KEY not set. Using static analysis mode.
Cached: False
Tokens: 0

# Clear Python cache
$ python3 gemini.py --clear
Cache cleared
```

## Tips for Minimizing Token Usage

### ✅ Do This:
- Use `--cached` flag for ideas
- Write 3 lines before asking for suggestions
- Run `:audit` frequently (it's free!)
- Review static security library first
- Complete beginner projects before using API
- Check `:stats` to monitor API usage

### ❌ Avoid This:
- Don't ask for suggestions on every line
- Don't ignore rate limit warnings
- Don't skip the cached mode learning phase
- Don't forget to save your work
- Don't clear cache unnecessarily

## Token Usage Comparison

| Activity | Traditional | This Tool | Savings |
|----------|------------|-----------|---------|
| Get project idea | 500 tokens | 0 tokens | 100% |
| Line-by-line suggestions | 3000 tokens | 500 tokens | 83% |
| Security audit | 1000 tokens | 0 tokens | 100% |
| Explanations | 400 tokens | 0 tokens | 100% |
| **Total per session** | **4900 tokens** | **500 tokens** | **~90%** |

## Exam Prep Workflow

```bash
# Week 1-2: Build knowledge base (0 API calls)
study-web3 idea --cached  # Browse all projects
study-web3 start          # Code with local audit
study-web3 audit --local  # Practice auditing

# Week 3: Selective API usage (minimal calls)
study-web3 start --batch=3  # Batched suggestions only

# Exam Week: Pure local mode (0 API calls)
study-web3 audit --local    # Audit practice files
study-web3 info            # Track your progress
```

## Success Metrics

After completing all projects, you should be able to:

- ✅ Identify 15+ common vulnerability patterns
- ✅ Write secure smart contracts from scratch
- ✅ Audit contracts without external tools
- ✅ Explain security best practices
- ✅ Use < 2000 tokens total across entire learning path
- ✅ Pass Web3 security certification exams

---

**Remember**: The goal is to learn deeply, not quickly. Use the static resources first, then selectively use AI for complex questions. You'll learn more and save tokens!
