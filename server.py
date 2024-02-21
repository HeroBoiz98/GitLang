import http.server
import socketserver

PORT = 8000  # Specify the port you want to use

Handler = http.server.SimpleHTTPRequestHandler

# Set up the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server started on port {PORT}")
    # Start the server and keep it running until interrupted
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer interrupted. Shutting down...")
        httpd.shutdown()
