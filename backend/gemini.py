"""
Ultra-lightweight Gemini API wrapper
Optimized for minimal token usage and aggressive caching
"""

import os
import json
import hashlib
from pathlib import Path
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Cache directory
CACHE_DIR = Path(__file__).parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)


def hash_key(key: str) -> str:
    """Generate SHA-256 hash for cache key"""
    return hashlib.sha256(key.encode()).hexdigest()


def get_cache(key: str) -> Optional[Dict[str, Any]]:
    """Retrieve cached response"""
    cache_file = CACHE_DIR / f"{hash_key(key)}.json"
    if cache_file.exists():
        try:
            with open(cache_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Cache read error: {e}")
    return None


def set_cache(key: str, value: Dict[str, Any]):
    """Store response in cache"""
    cache_file = CACHE_DIR / f"{hash_key(key)}.json"
    try:
        with open(cache_file, 'w') as f:
            json.dump(value, f, indent=2)
    except Exception as e:
        print(f"Cache write error: {e}")


def call_gemini(prompt: str, use_cache: bool = True) -> Dict[str, Any]:
    """
    Call Gemini API with caching
    
    Args:
        prompt: The prompt to send
        use_cache: Whether to use cached responses
    
    Returns:
        Response dict with 'text' and 'cached' fields
    """
    # Check cache first
    if use_cache:
        cached = get_cache(prompt)
        if cached:
            return {
                'text': cached.get('text', ''),
                'cached': True,
                'tokens': 0
            }
    
    # Check if API key is available
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        # Return helpful fallback
        return {
            'text': 'GEMINI_API_KEY not set. Using static analysis mode.',
            'cached': False,
            'tokens': 0,
            'error': 'missing_api_key'
        }
    
    try:
        # Import Gemini library (only when needed)
        import google.generativeai as genai
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Make API call
        response = model.generate_content(prompt)
        
        result = {
            'text': response.text,
            'cached': False,
            'tokens': len(prompt.split())  # Rough estimate
        }
        
        # Cache the response
        if use_cache:
            set_cache(prompt, result)
        
        return result
        
    except ImportError:
        return {
            'text': 'google-generativeai package not installed. Run: pip install google-generativeai',
            'cached': False,
            'tokens': 0,
            'error': 'missing_package'
        }
    except Exception as e:
        return {
            'text': f'Error calling Gemini API: {str(e)}',
            'cached': False,
            'tokens': 0,
            'error': str(e)
        }


def batch_call_gemini(prompts: list, use_cache: bool = True) -> list:
    """
    Batch API calls (with individual caching)
    """
    results = []
    for prompt in prompts:
        result = call_gemini(prompt, use_cache)
        results.append(result)
    return results


def get_cache_stats() -> Dict[str, Any]:
    """Get cache statistics"""
    cache_files = list(CACHE_DIR.glob("*.json"))
    total_size = sum(f.stat().st_size for f in cache_files)
    
    return {
        'count': len(cache_files),
        'size_bytes': total_size,
        'size_kb': round(total_size / 1024, 2),
        'cache_dir': str(CACHE_DIR)
    }


def clear_cache():
    """Clear all cached responses"""
    for cache_file in CACHE_DIR.glob("*.json"):
        cache_file.unlink()


# Simple CLI for testing
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python gemini.py <prompt>")
        print("       python gemini.py --stats")
        print("       python gemini.py --clear")
        sys.exit(1)
    
    if sys.argv[1] == "--stats":
        stats = get_cache_stats()
        print(f"Cache statistics:")
        print(f"  Files: {stats['count']}")
        print(f"  Size: {stats['size_kb']} KB")
        print(f"  Location: {stats['cache_dir']}")
    elif sys.argv[1] == "--clear":
        clear_cache()
        print("Cache cleared")
    else:
        prompt = " ".join(sys.argv[1:])
        result = call_gemini(prompt)
        print(f"Response: {result['text']}")
        print(f"Cached: {result['cached']}")
        print(f"Tokens: {result.get('tokens', 0)}")
