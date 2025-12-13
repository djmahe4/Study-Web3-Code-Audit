# Quick Start Guide 🚀

Get started with Study Web3 Code Audit CLI in under 5 minutes!

## Installation (2 minutes)

```bash
# 1. Clone repository
git clone https://github.com/djmahe4/Study-Web3-Code-Audit.git
cd Study-Web3-Code-Audit

# 2. Install Node.js dependencies
npm install

# 3. Make CLI available globally (optional)
npm link
```

## Your First Session (3 minutes)

### Option A: Using Global Command

```bash
study-web3
```

### Option B: Using npm

```bash
npm start
```

### Option C: Direct Node

```bash
node cli.js
```

## Main Menu Options

```
╔═══════════════════════════════════════════╗
║   Study Web3 Code Audit CLI              ║
║   Token-Optimized Learning System        ║
╚═══════════════════════════════════════════╝

? What would you like to do?
  💡 Get project idea
  📝 Start coding
  🔍 Audit code
  ℹ️  System info
  🗑️  Clear cache
  ❌ Exit
```

## Try These Commands

### 1. View System Info
```bash
study-web3 info
```
Shows cache stats, rate limits, and available security patterns.

### 2. Get Project Idea
```bash
study-web3 idea --cached
```
Browse 12+ project ideas with zero API calls.

### 3. Start Coding
```bash
study-web3 start
```
Open interactive editor with built-in security scanner.

### 4. Audit a Contract
```bash
study-web3 audit --local
```
Scan any Solidity file for vulnerabilities.

## Your First Project

Let's build a secure tip jar in 5 steps:

### Step 1: Get the Idea
```bash
study-web3 idea --cached
```
- Select: **Ethereum / Solidity**
- Choose: **beginner**
- Pick: **Secure Tip Jar**

### Step 2: Start Coding
The starter code will be loaded automatically. Add your implementation:

```solidity
function deposit() public payable {
    balances[msg.sender] += msg.value;
}

function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // Fix reentrancy: Update state BEFORE external call (CEI pattern)
    balances[msg.sender] -= amount;
    
    (bool success,) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

### Step 3: Audit Your Code
While in the editor, type:
```
:audit
```

### Step 4: Save Your Work
```
:save
```
Enter filename: `tip-jar.sol`

### Step 5: Exit
```
:quit
```

## Learning Path

### Beginner (Week 1) - 0 API Calls
```bash
study-web3 idea --cached
```
Complete 3 projects:
1. Secure Tip Jar
2. Simple Voting System
3. Token Faucet

**Goal**: Learn fundamentals with zero token usage.

### Intermediate (Week 2) - Minimal API Calls
```bash
study-web3 start --batch=3
```
Complete 3 projects:
1. Secure Escrow
2. Lottery System
3. Staking Contract

**Goal**: Learn advanced patterns with batched suggestions.

### Advanced (Week 3) - Selective API Use
```bash
study-web3 start
```
Complete 3 projects:
1. Multi-Sig Wallet
2. NFT Marketplace
3. Token Swap

**Goal**: Build complex systems with minimal guidance.

### Exam Prep - Pure Local Mode
```bash
study-web3 audit --local
```
Audit 10+ practice contracts.

**Goal**: Independent security analysis, 0 API calls.

## Editor Quick Reference

| Command | What It Does |
|---------|--------------|
| Type code + Enter | Add line to contract |
| `:suggest` or `:s` | Get AI suggestion (uses buffer) |
| `:audit` or `:a` | Run security scan (free!) |
| `:save` | Save to file |
| `:stats` | View session stats |
| `:undo` or `:u` | Remove last line |
| `:help` or `:h` | Show help |
| `:quit` or `:q` | Exit (prompts to save) |

## Tips for Success

### ✅ Do This
- Start with `idea --cached` to browse projects
- Use `:audit` frequently (it's instant and free)
- Write 3 lines before asking for suggestions
- Complete beginner projects before using API
- Check `:stats` to track your progress

### ❌ Avoid This
- Don't ask for suggestions on every line
- Don't skip the audit step
- Don't ignore security warnings
- Don't clear cache unless needed

## Token Usage Goals

| Week | Mode | API Calls | Tokens |
|------|------|-----------|--------|
| 1 | Cached | 0 | 0 |
| 2 | Batch | 2-3/day | ~500/day |
| 3 | Selective | 3-4/day | ~800/day |
| Exam | Local | 0 | 0 |
| **Total** | **Mixed** | **< 50** | **< 2000** |

## Troubleshooting

### "Rate limit reached"
You've used all 8 API calls this hour. Solutions:
- Use `--cached` mode
- Wait for cooldown (check with `:stats`)
- Continue with local audit (still works!)

### "GEMINI_API_KEY not set"
This is normal! The tool works great without it:
- All cached content available
- Static security library active
- Local audit fully functional
- Only AI suggestions unavailable

### "Command not found: study-web3"
Run `npm link` in the project directory, or use:
```bash
node cli.js
```

## Next Steps

1. ✅ Complete Quick Start
2. ✅ Try first project (Secure Tip Jar)
3. ✅ Read full README.md
4. ✅ Review EXAMPLES.md
5. ✅ Start your learning path
6. ✅ Pass your exam! 🎓

## Support

- 📖 Full docs: [README.md](README.md)
- 💡 Examples: [EXAMPLES.md](EXAMPLES.md)
- 🐛 Issues: [GitHub Issues](https://github.com/djmahe4/Study-Web3-Code-Audit/issues)

---

**Ready to become a Web3 security expert? Start with:**
```bash
study-web3 idea --cached
```

**Happy learning! 🛡️**
