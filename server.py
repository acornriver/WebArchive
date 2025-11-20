#!/usr/bin/env python3
"""
Simple HTTP server with RTF conversion API
"""

import http.server
import socketserver
import json
import os
import sys
from urllib.parse import urlparse, parse_qs
import subprocess
from pathlib import Path

PORT = 8888
BASE_DIR = Path(__file__).parent


class RTFHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # API endpoint for RTF conversion
        if parsed_path.path == '/api/rtf-to-text':
            return self.handle_rtf_conversion(parsed_path)
        
        # Regular file serving
        return super().do_GET()
    
    def handle_rtf_conversion(self, parsed_path):
        """Convert RTF file to plaintext using convert_rtf.py"""
        query = parse_qs(parsed_path.query)
        
        if 'file' not in query:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': 'Missing file parameter'}).encode())
            return
        
        rtf_path = query['file'][0]
        
        # Security: prevent directory traversal
        if '..' in rtf_path or rtf_path.startswith('/'):
            self.send_response(403)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': 'Invalid file path'}).encode())
            return
        
        full_path = BASE_DIR / rtf_path
        
        if not full_path.exists():
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': 'File not found'}).encode())
            return
        
        try:
            # Call convert_rtf.py script
            converter_path = BASE_DIR / 'convert_rtf.py'
            result = subprocess.run(
                ['python3', str(converter_path), str(full_path)],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                data = json.loads(result.stdout)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(data).encode('utf-8'))
            else:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'error': result.stderr or 'Conversion failed'
                }).encode())
        
        except subprocess.TimeoutExpired:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': 'Conversion timeout'}).encode())
        
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode())


if __name__ == '__main__':
    handler = RTFHandler
    
    with socketserver.TCPServer(('', PORT), handler) as httpd:
        print(f'Server running at http://localhost:{PORT}/')
        print(f'Serving from: {BASE_DIR}')
        httpd.serve_forever()
