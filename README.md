# Study Web3 Code Audit CLI 🛡️

> **Token-Optimized Learning System for Web3 Security Auditing**

A memory-efficient, beginner-friendly CLI tool designed to help you learn Web3 security auditing while avoiding Gemini API rate limits. Built with aggressive caching, static analysis, and batch processing to minimize token usage.

## 🎯 Key Features

- **Token-Optimized**: < 2,000 tokens per session | < 10 API calls/hour
- **Zero-Token Learning**: Pre-generated ideas, static security library, offline mode
- **Smart Caching**: MD5-based caching for 100% response reuse
- **Batch Processing**: 1 API call per 3 lines of code
- **Rate Limiting**: Automatic protection against API overuse (max 8 calls/hour)
- **Security-First**: Built-in vulnerability scanner with 15+ patterns
- **Exam-Ready**: Progressive learning path from beginner to audit expert

## 🚀 Setup

### Windows Setup

For Windows users, a `setup.bat` script is provided to automate the setup process. This script will:
1. Create a Python virtual environment in a `venv` directory.
2. Install the required Python dependencies from `backend/requirements.txt`.

To run the script, simply execute it from the project root:
```bash
setup.bat
```
After the script has finished, you can activate the virtual environment by running:
```bash
venv\Scripts\activate.bat
```

### macOS and Linux Setup

For macOS and Linux users, a `setup.sh` script is provided to automate the setup process. This script will:
1. Create a Python virtual environment in a `venv` directory.
2. Install the required Python dependencies from `backend/requirements.txt`.

To run the script, first make it executable:
```bash
chmod +x setup.sh
```
Then, run the script:
```bash
./setup.sh
```
After the script has finished, you can activate the virtual environment by running:
```bash
source venv/bin/activate
```

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/djmahe4/Study-Web3-Code-Audit.git
cd Study-Web3-Code-Audit

# Install Node.js dependencies
npm install

# Install Python dependencies (preferably in a virtual environment)
cd backend
pip install -r requirements.txt
cd ..

# Make CLI globally available
npm link
```

### Usage

```bash
# Start interactive CLI
study-web3

# Or use direct commands
study-web3 idea --cached          # Get project ideas (0 API calls)
study-web3 start --batch=3        # Start coding with batched suggestions
study-web3 audit --local          # Audit code with local analysis only
study-web3 info                   # View system statistics
study-web3 clear                  # Clear cache
```

## 📚 Learning Modes

### 1. Cached Mode (0 API Calls)
```bash
study-web3 idea --cached
```
- Uses pre-generated project ideas
- Static security explanations
- Perfect for initial learning phase
- **Token usage**: 0

### 2. Batch Mode (Minimal API Calls)
```bash
study-web3 start --batch=3
```
- Buffers 3 lines before requesting suggestion
- 66% fewer API calls
- Smart context using last 5 lines only
- **Token usage**: ~150 per suggestion

### 3. Local Audit Mode (0 API Calls)
```bash
study-web3 audit --local
```
- Static pattern matching
- 15+ vulnerability patterns
- Instant results
- **Token usage**: 0

## 🛠️ Interactive Editor Commands

Once in the editor, use these commands:

| Command | Shortcut | Description |
|---------|----------|-------------|
| `:suggest` | `:s` | Get AI suggestion (batched) |
| `:audit` | `:a` | Run security scan |
| `:save` | - | Save code to file |
| `:stats` | - | View session statistics |
| `:undo` | `:u` | Remove last line |
| `:help` | `:h` | Show help |
| `:quit` | `:q` | Exit editor |

## 🔒 Security Patterns Detected

The tool automatically scans for:

- ✅ **Reentrancy** vulnerabilities (call before state update)
- ✅ **tx.origin** authentication issues
- ✅ **Integer overflow/underflow** risks
- ✅ **Weak randomness** sources
- ✅ **Access control** missing checks
- ✅ **Selfdestruct** vulnerabilities
- ✅ **Delegatecall** storage manipulation
- ✅ **Transfer gas limit** issues
- ✅ **Front-running** risks
- ✅ **Timestamp manipulation**
- ✅ **Gas limit DoS**
- ✅ **Unprotected constructors**
- ✅ **ERC20 approve race conditions**
- ✅ **Private data visibility**
- ✅ And more...

## 📊 Token Savings Strategy

| Technique | Implementation | Savings |
|-----------|---------------|---------|
| **Local Caching** | MD5-hashed JSON cache | 100% reuse |
| **Prompt Compression** | 80-150 tokens per prompt | 60% reduction |
| **Session Batching** | 1 call per 3 lines | 66% fewer calls |
| **Static Templates** | 50+ pre-written explanations | 0 tokens |
| **Diff-Based Context** | Last 5 lines only | 80% less context |
| **Rate Limiting** | Max 8 calls/hour | Prevents overuse |

## 📖 Project Ideas

The tool includes 12+ pre-generated project ideas:

### Ethereum / Solidity
1. **Secure Tip Jar** - Learn reentrancy protection
2. **Simple Voting System** - Access control patterns
3. **Token Faucet** - Rate limiting
4. **Secure Escrow** - CEI pattern implementation
5. **NFT Marketplace** - Safe transfers and approvals
6. **Multi-Sig Wallet** - Signature verification
7. **Time-Locked Savings** - Timestamp handling
8. **Lottery System** - Secure randomness
9. **Token Swap** - Front-running protection
10. **Staking Contract** - Reward calculations

### Solana / Rust
1. **Token Transfer Program** - Account validation
2. **NFT Minting Program** - PDA security

## 🎓 Exam Preparation Schedule

### Week 1: Fundamentals (Cached Mode Only)
- **Days 1-3**: Use `--cached` mode exclusively
- **Projects**: Secure Tip Jar, Simple Voting, Token Faucet
- **API Calls**: 0
- **Token Usage**: 0
- **Focus**: Learn basics, read static explanations

### Week 2: Advanced Topics (Minimal API)
- **Days 4-7**: Use `--batch=3` mode
- **Projects**: Secure Escrow, Lottery System, Staking Contract
- **API Calls**: 2-3 per day
- **Token Usage**: ~500 per day
- **Focus**: Reentrancy, randomness, CEI pattern

### Week 3: Real-World Patterns
- **Days 8-14**: Mix of cached and batch modes
- **Projects**: Multi-Sig Wallet, NFT Marketplace, Token Swap
- **API Calls**: 3-4 per day
- **Token Usage**: ~800 per day
- **Focus**: Complex patterns, upgrades, optimizations

### Exam Week: Practice
- **Mode**: `audit --local` exclusively
- **API Calls**: 0
- **Token Usage**: 0
- **Focus**: Review, audit practice, static analysis

## 📁 Project Structure

```
study-web3-code-audit/
├── package.json              # Node.js dependencies and scripts
├── cli.js                    # Main CLI interface
├── editor.js                 # Interactive code editor with batching
├── cache.js                  # MD5-based caching system
├── rate-limiter.js           # API call rate limiting (8/hour)
├── security-lib.js           # Static vulnerability patterns
├── .study-cache/             # Auto-generated cache directory
├── backend/
│   ├── gemini.py             # Minimal Gemini API wrapper
│   ├── prompts.py            # Token-efficient prompts
│   ├── requirements.txt      # Python dependencies (optional)
│   └── cache/                # Python cache directory
├── static/
│   ├── ideas.json            # 12+ pre-generated project ideas
│   └── explanations.json     # Platform guides and best practices
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

```bash
# Optional: Only needed for Gemini API integration
export GEMINI_API_KEY="your-api-key-here"
```

**Note**: The tool works perfectly without the API key using static analysis and cached content!

### Cache Management

```bash
# View cache statistics
study-web3 info

# Clear cache
study-web3 clear
```

## 📈 Statistics Tracking

Every session tracks:

- **Lines written**: Total code lines in session
- **API calls made**: Number of Gemini API calls
- **Cache hits**: Reused cached responses
- **Remaining calls**: Available API calls this hour
- **Cache size**: Total cached data size
- **Token estimation**: Approximate tokens used

View stats with `:stats` command or `study-web3 info`.

## 🎯 Best Practices

### To Minimize Token Usage:

1. **Start with cached mode**: Learn fundamentals without API calls
2. **Batch your work**: Write 3 lines before requesting suggestions
3. **Use local audit**: Run `:audit` frequently for instant feedback
4. **Cache everything**: Repeated patterns use 0 tokens
5. **Read static docs**: Use `:help` and project ideas before asking AI
6. **Plan before coding**: Know what you want to build
7. **Review before API**: Check your code with local tools first

### To Maximize Learning:

1. **Follow the schedule**: Progressive difficulty builds solid foundation
2. **Complete all projects**: Each teaches a different vulnerability
3. **Read all findings**: Don't just fix, understand why
4. **Practice auditing**: Use `audit --local` on every project
5. **Check the checklist**: Review security checklist for your platform
6. **Keep a learning log**: Track what you learn (locally, not in tool)

## 🚨 Troubleshooting

### "Rate limit reached"
- **Solution**: Use `--cached` mode or wait for cooldown
- **Time shown**: Check `:stats` for time until next call available
- **Fallback**: Tool automatically uses static analysis

### "GEMINI_API_KEY not set"
- **Solution**: Export your API key OR continue in static mode
- **Note**: Static mode is fully functional for learning!

### "No suggestions available"
- **Solution**: Write more code to reach batch size (3 lines)
- **Alternative**: Type `:suggest` to force suggestion with current buffer

### Cache too large
- **Solution**: Run `study-web3 clear` to clear cache
- **Safe**: All project ideas are in static files, not cache

## 🧪 Testing

```bash
# Test the CLI
npm start

# Test specific commands
study-web3 idea --cached
study-web3 audit --local contract.sol
study-web3 info

# Test Python backend (optional)
cd backend
python gemini.py --stats
python gemini.py "Test prompt"
cd ..
```

## 📝 Example Session

```bash
$ study-web3

╔═══════════════════════════════════════════╗
║   Study Web3 Code Audit CLI              ║
║   Token-Optimized Learning System        ║
╚═══════════════════════════════════════════╝

? What would you like to do? Get project idea

? Select platform: Ethereum / Solidity
? Select difficulty: beginner
? Choose a project: Secure Tip Jar

┌─────────────────────────────────────────┐
│                                         │
│   Secure Tip Jar                        │
│                                         │
│   Goal: Learn reentrancy protection     │
│   Vulnerability: reentrancy             │
│   Difficulty: beginner                  │
│   Estimated lines: 35                   │
│                                         │
│   Starter code:                         │
│   // SPDX-License-Identifier: MIT       │
│   pragma solidity ^0.8.0;               │
│   ...                                   │
└─────────────────────────────────────────┘

? What would you like to do? Start this project

✓ Loaded starter code (7 lines)

📝 Interactive Code Editor

[7 lines] > function deposit() public payable {
[8 lines] > balances[msg.sender] += msg.value;
[9 lines] > }
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
✓ Editor closed

👋 Happy learning!
```

## 🤝 Contributing

Contributions welcome! Focus areas:

- Additional project ideas
- More vulnerability patterns
- Platform support (Cosmos, Polkadot, etc.)
- Improved static analysis
- UI/UX enhancements

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Resources

- [Solidity Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Smart Contract Weakness Classification](https://swcregistry.io/)
- [Ethernaut CTF](https://ethernaut.openzeppelin.com/)
- [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/)

## 🎯 Goals Achieved

✅ **Zero rate limit crashes** - Rate limiter + caching prevents API overuse  
✅ **Full Web3 mastery** - 12+ projects covering all major vulnerabilities  
✅ **Exam-ready audit skills** - Progressive learning path with practice  
✅ **Runs offline after setup** - Static content + cache = no API needed  

---

**Start learning deeply. Let Gemini rest.** 🚀