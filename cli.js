#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const fs = require('fs');
const path = require('path');

const Editor = require('./editor');
const { getCache, setCache, getCacheStats, clearCache } = require('./cache');
const { getStats: getRateLimitStats, reset: resetRateLimit } = require('./rate-limiter');
const { getAllPatterns, getSecurityChecklist } = require('./security-lib');

const IDEAS_FILE = path.join(__dirname, 'static', 'ideas.json');
const EXPLANATIONS_FILE = path.join(__dirname, 'static', 'explanations.json');

let currentEditor = null;

/**
 * Display welcome banner
 */
function showBanner() {
  const banner = chalk.bold.cyan(`
╔═══════════════════════════════════════════╗
║   Study Web3 Code Audit CLI              ║
║   Token-Optimized Learning System        ║
╚═══════════════════════════════════════════╝
  `);
  console.log(banner);
  console.log(chalk.gray('Memory-efficient | Security-focused | Exam-ready\n'));
}

/**
 * Load ideas from static file
 */
function loadIdeas() {
  try {
    const data = fs.readFileSync(IDEAS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.red('Error loading ideas:'), error.message);
    return [];
  }
}

/**
 * Load explanations from static file
 */
function loadExplanations() {
  try {
    const data = fs.readFileSync(EXPLANATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.red('Error loading explanations:'), error.message);
    return {};
  }
}

/**
 * Command: idea - Get project idea
 */
async function commandIdea(options = {}) {
  console.log(chalk.bold.blue('\n📚 Project Ideas\n'));
  
  const ideas = loadIdeas();
  
  if (options.cached) {
    console.log(chalk.green('✓ Using cached ideas (0 API calls)\n'));
  }

  // Select platform
  const { platform } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Select platform:',
      choices: [
        { name: 'Ethereum / Solidity', value: 'ethereum' },
        { name: 'Solana / Rust', value: 'solana' }
      ]
    }
  ]);

  // Filter ideas by platform
  const platformIdeas = ideas.filter(idea => idea.platform === platform);
  
  if (platformIdeas.length === 0) {
    console.log(chalk.yellow('No ideas found for this platform.'));
    return;
  }

  // Select difficulty
  const { difficulty } = await inquirer.prompt([
    {
      type: 'list',
      name: 'difficulty',
      message: 'Select difficulty:',
      choices: ['beginner', 'intermediate', 'advanced', 'all']
    }
  ]);

  // Filter by difficulty
  let filteredIdeas = platformIdeas;
  if (difficulty !== 'all') {
    filteredIdeas = platformIdeas.filter(idea => idea.difficulty === difficulty);
  }

  // Select project
  const { projectIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectIndex',
      message: 'Choose a project:',
      choices: filteredIdeas.map((idea, idx) => ({
        name: `${idea.title} - ${idea.goal} [${idea.lines} lines, ${idea.vuln}]`,
        value: idx
      }))
    }
  ]);

  const selectedIdea = filteredIdeas[projectIndex];

  // Display project details
  const projectBox = boxen(
    chalk.bold.cyan(selectedIdea.title) + '\n\n' +
    chalk.white('Goal: ') + selectedIdea.goal + '\n' +
    chalk.white('Vulnerability: ') + chalk.red(selectedIdea.vuln) + '\n' +
    chalk.white('Difficulty: ') + selectedIdea.difficulty + '\n' +
    chalk.white('Estimated lines: ') + selectedIdea.lines + '\n\n' +
    chalk.yellow('Starter code:\n') +
    chalk.gray(selectedIdea.starter),
    { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
  );

  console.log('\n' + projectBox + '\n');

  // Ask if user wants to start
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Start this project', value: 'start' },
        { name: 'View security checklist', value: 'checklist' },
        { name: 'Back to main menu', value: 'back' }
      ]
    }
  ]);

  if (action === 'start') {
    await commandStart({ platform, project: selectedIdea });
  } else if (action === 'checklist') {
    displaySecurityChecklist(platform);
    await commandIdea(options);
  }
}

/**
 * Display security checklist
 */
function displaySecurityChecklist(platform) {
  const checklist = getSecurityChecklist(platform);
  
  console.log(chalk.bold.yellow(`\n🔒 Security Checklist for ${platform}:\n`));
  checklist.forEach((item, idx) => {
    console.log(chalk.white(`  ${idx + 1}. ${item}`));
  });
  console.log();
}

/**
 * Command: start - Start interactive editor
 */
async function commandStart(options = {}) {
  let platform = options.platform;
  let project = options.project;

  // If not provided, ask for platform
  if (!platform) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'platform',
        message: 'Select platform:',
        choices: [
          { name: 'Ethereum / Solidity', value: 'ethereum' },
          { name: 'Solana / Rust', value: 'solana' }
        ]
      }
    ]);
    platform = answer.platform;
  }

  // Create editor instance
  currentEditor = new Editor(platform, project);

  // If project provided, add starter code
  if (project && project.starter) {
    const starterLines = project.starter.split('\n');
    starterLines.forEach(line => currentEditor.addLine(line));
    console.log(chalk.green(`\n✓ Loaded starter code (${starterLines.length} lines)\n`));
  }

  console.log(chalk.bold.blue('📝 Interactive Code Editor\n'));
  console.log(chalk.gray('Commands:'));
  console.log(chalk.gray('  - Type code and press Enter to add line'));
  console.log(chalk.gray('  - Type ":suggest" for AI suggestion'));
  console.log(chalk.gray('  - Type ":audit" to run security scan'));
  console.log(chalk.gray('  - Type ":save" to save your code'));
  console.log(chalk.gray('  - Type ":stats" to view statistics'));
  console.log(chalk.gray('  - Type ":undo" to remove last line'));
  console.log(chalk.gray('  - Type ":quit" to exit\n'));

  await editorLoop();
}

/**
 * Interactive editor loop
 */
async function editorLoop() {
  while (true) {
    const stats = currentEditor.getStats();
    const prompt = chalk.cyan(`[${stats.totalLines} lines] > `);

    const { input } = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: prompt,
        prefix: ''
      }
    ]);

    // Handle commands
    if (input.startsWith(':')) {
      const command = input.slice(1).toLowerCase();

      if (command === 'quit' || command === 'exit' || command === 'q') {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Save before exiting?',
            default: true
          }
        ]);

        if (confirm) {
          await saveCode();
        }
        break;
      } else if (command === 'suggest' || command === 's') {
        await showSuggestion();
      } else if (command === 'audit' || command === 'a') {
        await runAudit();
      } else if (command === 'save') {
        await saveCode();
      } else if (command === 'stats') {
        showStats();
      } else if (command === 'undo' || command === 'u') {
        const result = currentEditor.undo();
        if (result.success) {
          console.log(chalk.yellow(`↶ Removed: ${result.removed}`));
        } else {
          console.log(chalk.red(result.message));
        }
      } else if (command === 'help' || command === 'h') {
        showHelp();
      } else {
        console.log(chalk.red(`Unknown command: ${command}`));
      }
    } else if (input.trim()) {
      // Add line of code
      currentEditor.addLine(input);
      
      // Check if we should show auto-suggestion
      const stats = currentEditor.getStats();
      if (stats.bufferSize >= 3) {
        console.log(chalk.gray('\n💡 Hint: Type :suggest for AI suggestion\n'));
      }
    }
  }

  console.log(chalk.green('\n✓ Editor closed\n'));
}

/**
 * Show suggestion
 */
async function showSuggestion() {
  const spinner = ora('Getting suggestion...').start();
  
  const result = await currentEditor.getSuggestion(true);
  
  spinner.stop();

  if (result.waiting) {
    console.log(chalk.yellow(result.message));
    return;
  }

  const sourceIcon = {
    'cache': '💾',
    'api': '🤖',
    'static': '📚'
  };

  console.log(chalk.bold(`\n${sourceIcon[result.source]} Suggestion (${result.source}):\n`));
  
  if (result.suggestion.message) {
    console.log(chalk.white(result.suggestion.message));
  }
  
  if (result.suggestion.fix) {
    console.log(chalk.green(`\nFix: ${result.suggestion.fix}`));
  }
  
  if (result.suggestion.code) {
    console.log(chalk.gray(`\nCode: ${result.suggestion.code}`));
  }
  
  if (result.suggestion.tips) {
    console.log(chalk.yellow('\nTips:'));
    result.suggestion.tips.forEach(tip => {
      console.log(chalk.gray(`  • ${tip}`));
    });
  }

  if (result.source === 'api') {
    console.log(chalk.gray(`\nAPI calls: ${result.apiCalls}, Remaining: ${result.remainingCalls}`));
  } else if (result.source === 'cache') {
    console.log(chalk.gray(`\nCache hits: ${result.cacheHits}`));
  }

  console.log();
}

/**
 * Run security audit
 */
async function runAudit() {
  const spinner = ora('Running security audit...').start();
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const audit = currentEditor.auditCode();
  
  spinner.stop();

  console.log(chalk.bold.yellow('\n🔍 Security Audit Report\n'));
  console.log(chalk.white(`Total lines: ${audit.totalLines}`));
  console.log(chalk.red(`Critical: ${audit.summary.critical}`));
  console.log(chalk.yellow(`High: ${audit.summary.high}`));
  console.log(chalk.blue(`Medium: ${audit.summary.medium}`));
  console.log(chalk.gray(`Low: ${audit.summary.low}\n`));

  if (audit.findings.length > 0) {
    console.log(chalk.bold('Findings:\n'));
    audit.findings.forEach((finding, idx) => {
      const severityColor = {
        'CRITICAL': chalk.red,
        'HIGH': chalk.yellow,
        'MEDIUM': chalk.blue,
        'LOW': chalk.gray
      }[finding.severity] || chalk.white;

      console.log(severityColor(`${idx + 1}. [${finding.severity}] Line ${finding.line}: ${finding.title}`));
      console.log(chalk.gray(`   ${finding.description}`));
      console.log(chalk.green(`   Fix: ${finding.fix}\n`));
    });
  } else {
    console.log(chalk.green('✓ No vulnerabilities detected!\n'));
  }
}

/**
 * Save code to file
 */
async function saveCode() {
  const { filename } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filename',
      message: 'Save as:',
      default: 'contract.sol'
    }
  ]);

  try {
    currentEditor.saveToFile(filename);
    console.log(chalk.green(`✓ Saved to ${filename}\n`));
  } catch (error) {
    console.log(chalk.red(`Error saving: ${error.message}\n`));
  }
}

/**
 * Show statistics
 */
function showStats() {
  const editorStats = currentEditor.getStats();
  const cacheStats = getCacheStats();
  const rateLimitStats = getRateLimitStats();

  const statsBox = boxen(
    chalk.bold.cyan('Session Statistics\n\n') +
    chalk.white('Code:\n') +
    chalk.gray(`  Lines written: ${editorStats.totalLines}\n`) +
    chalk.gray(`  Buffer size: ${editorStats.bufferSize}\n\n`) +
    chalk.white('API Usage:\n') +
    chalk.gray(`  API calls made: ${editorStats.apiCalls}\n`) +
    chalk.gray(`  Cache hits: ${editorStats.cacheHits}\n`) +
    chalk.gray(`  Remaining calls: ${rateLimitStats.remaining}/${rateLimitStats.maxPerHour}\n\n`) +
    chalk.white('Cache:\n') +
    chalk.gray(`  Cached items: ${cacheStats.count}\n`) +
    chalk.gray(`  Cache size: ${cacheStats.sizeKB} KB`),
    { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
  );

  console.log('\n' + statsBox + '\n');
}

/**
 * Show help
 */
function showHelp() {
  console.log(chalk.bold.blue('\n📖 Help\n'));
  console.log(chalk.white('Commands:'));
  console.log(chalk.gray('  :suggest, :s    - Get AI suggestion'));
  console.log(chalk.gray('  :audit, :a      - Run security audit'));
  console.log(chalk.gray('  :save           - Save code to file'));
  console.log(chalk.gray('  :stats          - View statistics'));
  console.log(chalk.gray('  :undo, :u       - Undo last line'));
  console.log(chalk.gray('  :help, :h       - Show this help'));
  console.log(chalk.gray('  :quit, :q       - Exit editor\n'));
}

/**
 * Command: resume - Resume from saved session
 */
async function commandResume() {
  console.log(chalk.yellow('\n⚠️  Resume functionality not yet implemented\n'));
  console.log(chalk.gray('Use :save to save your work and load it later\n'));
}

/**
 * Command: audit - Run audit on file
 */
async function commandAudit(options = {}) {
  console.log(chalk.bold.yellow('\n🔍 Security Audit (Local Mode)\n'));

  if (options.local) {
    console.log(chalk.green('✓ Using local analysis only (0 API calls)\n'));
  }

  const { filename } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filename',
      message: 'File to audit:',
      default: 'contract.sol'
    }
  ]);

  if (!fs.existsSync(filename)) {
    console.log(chalk.red(`File not found: ${filename}\n`));
    return;
  }

  const code = fs.readFileSync(filename, 'utf8');
  const securityLib = require('./security-lib');
  const findings = securityLib.scanCode(code);

  console.log(chalk.white(`Auditing: ${filename}\n`));

  if (findings.length > 0) {
    findings.forEach((finding, idx) => {
      const severityColor = {
        'CRITICAL': chalk.red,
        'HIGH': chalk.yellow,
        'MEDIUM': chalk.blue,
        'LOW': chalk.gray
      }[finding.severity] || chalk.white;

      console.log(severityColor(`${idx + 1}. [${finding.severity}] Line ${finding.line}: ${finding.title}`));
      console.log(chalk.gray(`   ${finding.description}`));
      console.log(chalk.green(`   Fix: ${finding.fix}\n`));
    });
  } else {
    console.log(chalk.green('✓ No vulnerabilities detected!\n'));
  }
}

/**
 * Command: info - Show system info
 */
async function commandInfo() {
  const cacheStats = getCacheStats();
  const rateLimitStats = getRateLimitStats();
  const patterns = getAllPatterns();

  const infoBox = boxen(
    chalk.bold.cyan('System Information\n\n') +
    chalk.white('Cache:\n') +
    chalk.gray(`  Cached items: ${cacheStats.count}\n`) +
    chalk.gray(`  Cache size: ${cacheStats.sizeKB} KB\n\n`) +
    chalk.white('Rate Limiter:\n') +
    chalk.gray(`  Max calls/hour: ${rateLimitStats.maxPerHour}\n`) +
    chalk.gray(`  Used: ${rateLimitStats.used}\n`) +
    chalk.gray(`  Remaining: ${rateLimitStats.remaining}\n`) +
    chalk.gray(`  Can call API: ${rateLimitStats.canCall ? 'Yes' : 'No'}\n\n`) +
    chalk.white('Security Library:\n') +
    chalk.gray(`  Known patterns: ${patterns.length}\n\n`) +
    chalk.white('Token Savings:\n') +
    chalk.green(`  ✓ Aggressive caching enabled\n`) +
    chalk.green(`  ✓ Batched suggestions (3 lines)\n`) +
    chalk.green(`  ✓ Static fallbacks ready`),
    { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
  );

  console.log('\n' + infoBox + '\n');
}

/**
 * Command: clear - Clear cache
 */
async function commandClear() {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Clear all cache?',
      default: false
    }
  ]);

  if (confirm) {
    clearCache();
    resetRateLimit();
    console.log(chalk.green('\n✓ Cache cleared\n'));
  }
}

/**
 * Main menu
 */
async function mainMenu() {
  showBanner();

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '💡 Get project idea', value: 'idea' },
        { name: '📝 Start coding', value: 'start' },
        { name: '🔍 Audit code', value: 'audit' },
        { name: 'ℹ️  System info', value: 'info' },
        { name: '🗑️  Clear cache', value: 'clear' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }
  ]);

  switch (action) {
    case 'idea':
      await commandIdea({ cached: true });
      await mainMenu();
      break;
    case 'start':
      await commandStart();
      await mainMenu();
      break;
    case 'audit':
      await commandAudit({ local: true });
      await mainMenu();
      break;
    case 'info':
      await commandInfo();
      await mainMenu();
      break;
    case 'clear':
      await commandClear();
      await mainMenu();
      break;
    case 'exit':
      console.log(chalk.green('\n👋 Happy learning!\n'));
      process.exit(0);
      break;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'idea') {
  commandIdea({ cached: args.includes('--cached') }).then(() => process.exit(0));
} else if (command === 'start') {
  const batchIndex = args.findIndex(arg => arg.startsWith('--batch='));
  const batchSize = batchIndex >= 0 ? parseInt(args[batchIndex].split('=')[1]) : 3;
  commandStart({ batchSize }).then(() => process.exit(0));
} else if (command === 'resume') {
  commandResume().then(() => process.exit(0));
} else if (command === 'audit') {
  commandAudit({ local: args.includes('--local') }).then(() => process.exit(0));
} else if (command === 'info') {
  commandInfo().then(() => process.exit(0));
} else if (command === 'clear') {
  commandClear().then(() => process.exit(0));
} else {
  // No command or unknown command, show main menu
  mainMenu();
}
