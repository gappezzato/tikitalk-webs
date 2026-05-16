#!/usr/bin/env python3
from __future__ import annotations

import mimetypes
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "5173"))

# Ensure JS gets a sane content-type across Python versions.
mimetypes.add_type("text/javascript; charset=utf-8", ".js")
mimetypes.add_type("text/css; charset=utf-8", ".css")
mimetypes.add_type("text/html; charset=utf-8", ".html")


class NoCacheHandler(SimpleHTTPRequestHandler):
  def end_headers(self) -> None:
    self.send_header("Cache-Control", "no-cache")
    super().end_headers()


def main() -> None:
  server = ThreadingHTTPServer((HOST, PORT), NoCacheHandler)
  print(f"Server running at http://{HOST}:{PORT}")
  print(f"Serving: {os.getcwd()}")
  try:
    server.serve_forever()
  except KeyboardInterrupt:
    pass
  finally:
    server.server_close()


if __name__ == "__main__":
  main()

