#!/usr/bin/env python3
"""Local preview server for the portfolio, with HTTP Range support.

Python's built-in `python -m http.server` ignores Range requests, so browsers
cannot seek inside videos (the homepage timeline and the project players jump
back to 0:00). This server behaves like Netlify for local testing.

Usage, from the project root:
    python tools/serve.py            (serves on http://localhost:8080)
    python tools/serve.py 9000       (custom port)
    python tools/serve.py --fake-forms   (answer form POSTs with 200 so the success
                                          message can be tested locally; nothing is sent)

Forms only really submit on Netlify. Locally, without --fake-forms, a POST returns
an error so the form's error message can be checked.
"""
import os
import re
import sys
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class RangeHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map,
                      '.mp4': 'video/mp4', '.webp': 'image/webp', '.woff2': 'font/woff2',
                      '.json': 'application/json', '.js': 'text/javascript', '.svg': 'image/svg+xml'}

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            # same rule as Netlify: a folder serves its index.html, never a file listing
            if not self.path.split('?')[0].endswith('/'):
                self.send_response(HTTPStatus.MOVED_PERMANENTLY)
                self.send_header('Location', self.path.split('?')[0] + '/')
                self.end_headers()
                return None
            index = os.path.join(path, 'index.html')
            if not os.path.isfile(index):
                return self.not_found()
            path = index
        if not os.path.isfile(path):
            return self.not_found()
        size = os.path.getsize(path)
        ctype = self.guess_type(path)
        rng = self.headers.get('Range')
        f = open(path, 'rb')
        if rng:
            m = re.match(r'bytes=(\d*)-(\d*)', rng)
            if m:
                start = int(m.group(1)) if m.group(1) else max(0, size - int(m.group(2)))
                end = int(m.group(2)) if m.group(1) and m.group(2) else size - 1
                end = min(end, size - 1)
                if start >= size:
                    f.close()
                    self.send_response(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                    self.send_header('Content-Range', f'bytes */{size}')
                    self.end_headers()
                    return None
                self.send_response(HTTPStatus.PARTIAL_CONTENT)
                self.send_header('Content-Type', ctype)
                self.send_header('Accept-Ranges', 'bytes')
                self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
                self.send_header('Content-Length', str(end - start + 1))
                self.end_headers()
                f.seek(start)
                self._remaining = end - start + 1
                return f
        self.send_response(HTTPStatus.OK)
        self.send_header('Content-Type', ctype)
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Length', str(size))
        self.end_headers()
        self._remaining = size
        return f

    def do_POST(self):
        length = int(self.headers.get('Content-Length') or 0)
        data = self.rfile.read(length).decode('utf-8', 'replace')
        if FAKE_FORMS:
            print('[fake form submission]', data[:300])
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-Type', 'text/plain'); self.end_headers()
            self.wfile.write(b'ok (local test, not sent)')
        else:
            self.send_response(HTTPStatus.METHOD_NOT_ALLOWED)
            self.send_header('Content-Type', 'text/plain'); self.end_headers()
            self.wfile.write(b'Forms only submit on Netlify')

    def not_found(self):
        page = os.path.join(ROOT, '404.html')
        if os.path.isfile(page):
            data = open(page, 'rb').read()
            self.send_response(HTTPStatus.NOT_FOUND)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return None
        self.send_error(HTTPStatus.NOT_FOUND)
        return None

    def copyfile(self, source, outputfile):
        remaining = getattr(self, '_remaining', None)
        try:
            while remaining is None or remaining > 0:
                chunk = source.read(64 * 1024 if remaining is None else min(64 * 1024, remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                if remaining is not None:
                    remaining -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, fmt, *args):
        pass


FAKE_FORMS = '--fake-forms' in sys.argv

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    port = int(args[0]) if args else 8080
    server = ThreadingHTTPServer(('127.0.0.1', port), partial(RangeHandler, directory=ROOT))
    print(f'Serving {ROOT} at http://localhost:{port}  (Ctrl+C to stop)')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
