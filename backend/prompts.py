"""
Token-efficient Gemini prompts
Compressed for minimal token usage
"""

def get_idea_prompt(platform):
    """
    Generate project idea prompt (cached forever)
    Target: <100 tokens
    """
    return f"""ONE beginner Web3 project for {platform}.

Requirements:
- <50 lines
- 1 vulnerability to fix
- Secure by default after fix

Format:
Title: [name]
Goal: [1 sentence]
Vuln: [type]
Starter: [first 5 lines of code]
"""


def get_suggestion_prompt(last_lines, platform, hint=None):
    """
    Get next line suggestion (batched)
    Target: <80 tokens per call
    """
    context = "\n".join(last_lines[-3:])  # Only last 3 lines
    
    prompt = f"""Next 1 safe line.

Last code:
{context}

Platform: {platform}"""
    
    if hint:
        prompt += f"\nFix: {hint}"
    
    prompt += """

Output:
Line: [code]
Why: [1 sentence security note]
"""
    
    return prompt


def get_audit_prompt(code_snippet, focus_area=None):
    """
    Audit code for vulnerabilities
    Target: <150 tokens
    Uses diff-based analysis
    """
    # Only send changed/relevant lines
    lines = code_snippet.split('\n')
    if len(lines) > 20:
        # Focus on most recent 20 lines
        code_snippet = '\n'.join(lines[-20:])
    
    prompt = f"""Audit for vulnerabilities.

Code (last 20 lines):
{code_snippet}
"""
    
    if focus_area:
        prompt += f"\nFocus: {focus_area}"
    
    prompt += """

Output:
Vulns: [list with line numbers]
Severity: [CRITICAL/HIGH/MEDIUM/LOW]
Fix: [brief solution]
"""
    
    return prompt


def get_explain_prompt(code_line, context_before=None):
    """
    Explain a line of code
    Target: <60 tokens
    """
    prompt = f"""Explain this line.

Code: {code_line}
"""
    
    if context_before:
        prompt += f"Context: {context_before}"
    
    prompt += """

Output: [1 sentence explanation + security note if relevant]
"""
    
    return prompt


def get_fix_prompt(vulnerable_code, vulnerability_type):
    """
    Get fix for specific vulnerability
    Target: <100 tokens
    """
    return f"""Fix {vulnerability_type}.

Vulnerable:
{vulnerable_code}

Output:
Fixed: [secure code]
Why: [1 sentence]
"""


# Pre-defined prompt templates for common scenarios
PROMPT_TEMPLATES = {
    'reentrancy': """Fix reentrancy.
Use CEI pattern.
Output: [secure code]""",
    
    'access_control': """Add access control.
Use require + owner.
Output: [secure code]""",
    
    'overflow': """Protect overflow.
Solidity version?
Output: [secure code]""",
    
    'randomness': """Fix weak randomness.
Suggest: Chainlink VRF.
Output: [integration steps]"""
}


def get_template_prompt(template_name):
    """
    Get pre-defined template (0 tokens from Gemini)
    """
    return PROMPT_TEMPLATES.get(template_name, None)


# Token estimation
def estimate_tokens(text):
    """
    Rough token estimation (4 chars ≈ 1 token)
    """
    return len(text) // 4


def validate_prompt_size(prompt, max_tokens=200):
    """
    Validate prompt doesn't exceed token limit
    """
    estimated = estimate_tokens(prompt)
    if estimated > max_tokens:
        raise ValueError(f"Prompt too large: {estimated} tokens (max {max_tokens})")
    return estimated
