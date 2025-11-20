#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RTF to Plain Text Converter for CP949 encoded files
"""

import sys
import re
from pathlib import Path

def rtf_to_text(rtf_content):
    """Convert RTF content to plain text, handling CP949 encoding."""
    
    text = rtf_content
    
    # 0. FIRST: Remove spaces between consecutive unicode escape sequences
    # This prevents "연 산 적 시" by removing spaces between \uN codes
    # Match pattern: \uN<space>\uN<space>\uN...
    text = re.sub(r'(\\u-?\d+)\s+(?=\\u)', r'\1', text)
    
    # 1. Decode unicode escapes \uc0\uN (high unicode marker + code)
    def decode_unicode(match):
        code = int(match.group(1))
        if code < 0:
            code = 65536 + code
        try:
            return chr(code)
        except:
            return ""
    
    # First handle \uc0\uN sequences (most common)
    text = re.sub(r'\\uc0\\u(-?\d+)', decode_unicode, text)
    
    # Then handle standalone \uN sequences
    text = re.sub(r'\\u(-?\d+)\??', decode_unicode, text)
    
    # 2. Handle CP949 hex sequences like \'c7 \'d1
    hex_pattern = r"\\'([0-9a-fA-F]{2})"
    
    def replace_hex_bytes(text):
        """Replace all \'XX sequences with decoded CP949 text."""
        result = []
        i = 0
        while i < len(text):
            match = re.match(hex_pattern, text[i:])
            if match:
                # Collect consecutive hex bytes
                hex_bytes = bytearray()
                while i < len(text):
                    match = re.match(hex_pattern, text[i:])
                    if match:
                        hex_bytes.append(int(match.group(1), 16))
                        i += len(match.group(0))
                    else:
                        break
                
                # Decode the collected bytes as CP949
                try:
                    # Use 'ignore' instead of 'replace' to skip problematic bytes entirely
                    decoded = hex_bytes.decode('cp949', errors='ignore')
                    result.append(decoded)
                except:
                    result.append('')
            else:
                result.append(text[i])
                i += 1
        
        return ''.join(result)
    
    text = replace_hex_bytes(text)
    
    # 3. Replace \par and \line with newlines
    text = re.sub(r'\\par[d]?', '\n', text)
    text = re.sub(r'\\line', '\n', text)
    
    # 4. Remove all remaining RTF control words and sequences
    text = re.sub(r'\\[a-zA-Z*]+(-?\d+)?', '', text)
    
    # 5. Remove any remaining backslash sequences
    text = re.sub(r'\\[^\w\s\n]', '', text)
    
    # 6. Remove braces and other RTF structure
    text = re.sub(r'[{}]', '', text)
    
    # 7. Remove RTF special markers
    text = re.sub(r'[;*]', '', text)
    
    # 8. Remove all remaining backslashes
    text = re.sub(r'\\+', '', text)
    
    # 9. Smart spacing cleanup - remove spaces between Korean characters AND between Korean and punctuation
    # Phase 1: Remove ALL spaces between Korean characters (aggressive)
    text = re.sub(r'([\uac00-\ud7af\u1100-\u11ff])\s+([\uac00-\ud7af\u1100-\u11ff])', r'\1\2', text)
    
    # Phase 2: Remove spaces after hyphens and before Korean
    text = re.sub(r'(-)\s+([\uac00-\ud7af\u1100-\u11ff])', r'\1\2', text)
    
    # Phase 3: Remove spaces between Korean and punctuation
    text = re.sub(r'([\uac00-\ud7af\u1100-\u11ff])\s+([\,\.\?!;:])', r'\1\2', text)
    
    # 10. Clean up multiple spaces (but not newlines)
    text = re.sub(r' {2,}', ' ', text)
    
    # 11. Split into lines for further processing
    lines = text.split('\n')
    
    # 12. Filter out noise lines and clean up
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        
        # Skip empty lines for now
        if not stripped:
            cleaned_lines.append('')
            continue
        
        # Skip font name lines (Times-Roman, AppleMyungjo, Helvetica, etc.)
        # Can include spaces like "Times-Roman AppleMyungjo"
        if re.match(r'^[A-Za-z\s\-]+;?$', stripped):
            continue
        
        # Skip pure number lines (4 digits or less)
        if re.match(r'^[\d\-]+$', stripped) and len(stripped) <= 4:
            continue
        
        # Skip lines that look like RTF tokens or metadata
        if re.match(r'^[a-z]+\d+$', stripped):
            continue
        
        # Skip lines that are ONLY ASCII/English (no Korean) and short
        has_korean = any(0xAC00 <= ord(c) <= 0xD7AF or 0x1100 <= ord(c) <= 0x11FF for c in stripped)
        is_ascii_only = all(ord(c) < 128 or ord(c) in [0x24FB, 0xA9] for c in stripped)  # Allow ⓒ ©
        
        if is_ascii_only and len(stripped) < 5:
            # Skip very short ASCII-only lines, but keep URLs and copyright
            if not any(keyword in stripped for keyword in ['http', 'www', 'ⓒ', '©', '2025', 'All rights']):
                continue
        
        cleaned_lines.append(line)
    
    text = '\n'.join(cleaned_lines)
    
    # 13. Clean up excessive newlines
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
    
    # 14. Trim each line
    lines = [line.rstrip() if line.strip() else '' for line in text.split('\n')]
    text = '\n'.join(lines)
    
    # 15. Remove leading/trailing empty lines
    text = re.sub(r'^\n+|\n+$', '', text)
    
    # 16. Remove any invalid UTF-8 surrogates or broken characters
    # Remove surrogates, replacement char, and other invalid Unicode
    text = ''.join(c for c in text if ord(c) < 0xD800 or ord(c) > 0xDFFF)
    text = text.replace('\ufffd', '')  # Remove Unicode replacement character
    
    # 17. Clean up remaining control characters and problematic bytes
    # Keep only printable characters, spaces, and newlines
    text = ''.join(c for c in text if c.isprintable() or c in '\n\t ')
    
    return text.strip()

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 convert_rtf.py <rtf_file_path>")
        sys.exit(1)
    
    rtf_path = sys.argv[1]
    
    try:
        # Read RTF file with cp949 encoding
        with open(rtf_path, 'r', encoding='cp949', errors='replace') as f:
            rtf_content = f.read()
        
        # Convert to plain text
        plain_text = rtf_to_text(rtf_content)
        
        # Output as JSON for consistency
        import json
        print(json.dumps({
            'success': True,
            'text': plain_text
        }))
    except Exception as e:
        import json
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()
