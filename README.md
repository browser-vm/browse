# Browse - An Ultraviolet Web Proxy

![Ultraviolet Web Proxy](https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

A modern, terminal-inspired web proxy application built with Next.js that allows secure and private browsing through a proxy server.

## Features

- **Terminal-Style Interface**: Modern, purple-themed terminal interface for interacting with the proxy
- **Enhanced Security**: Option for one-time use URLs that expire after a single use
- **Complete URL Rewriting**: All links, resources, and JavaScript references are properly rewritten
- **Original Site Appearance**: Proxied websites appear exactly as they would when accessed directly
- **Client-Side Security**: Token-based handling of proxy requests with automatic expiration

## Technology Stack

- **Frontend**: Next.js with App Router, React, TypeScript
- **Styling**: TailwindCSS for modern, clean UI
- **Proxy Technology**: Ultraviolet proxy system
- **Animation**: React Type Animation for terminal effects
- **Icons**: Lucide React for UI icons
- **State Management**: React hooks for local state management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ultraviolet-web-proxy.git
cd ultraviolet-web-proxy
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun dev
```

4. Build for production:
```bash
bun run build
```

## Usage

### Terminal Commands

The terminal interface supports the following commands:

- `browse [url]` - Navigate to any website through the proxy
- `about` - Learn about the proxy service
- `security [one-time|standard]` - Set the security level for URL handling
- `clear` - Clear terminal history
- `help` - Display available commands

### Security Levels

- **One-Time URLs**: Each proxy URL can only be accessed once, providing maximum security
- **Standard**: URLs use basic encoding without one-time restrictions, better for browsing multiple pages

## Architecture

### Proxy System

The Ultraviolet proxy works by:

1. Taking a URL input from the user via terminal commands
2. Encoding or tokenizing the URL based on security settings
3. Routing requests through the proxy service
4. Fetching and rewriting content from the target website
5. Serving rewritten content back to the user

### Main Components

- **Terminal UI**: React components for the terminal interface
- **Proxy Service**: API route handlers for proxying requests
- **Token Manager**: Client-side service for managing one-time URLs
- **Content Rewriters**: Functions to rewrite HTML, CSS, and JavaScript content

### File Structure

```
src/
├── app/
│   ├── page.tsx               # Landing page with terminal interface
│   ├── layout.tsx             # Root layout
│   └── service/               # Proxy service API routes
│       └── [encodedUrl]/
│           └── route.ts       # Proxy handler for URL requests
├── components/
│   ├── terminal.tsx           # Terminal UI component
│   └── loading-animation.tsx  # Loading animations
├── lib/
│   ├── proxy.ts               # Proxy utility functions and URL rewriting
│   ├── token-manager.ts       # One-time URL token management
│   ├── ultraviolet-service.ts # Proxy service hooks
│   └── utils.ts               # General utility functions
└── middleware.ts              # Request middleware for proxy routes
```

## Security Considerations

- The proxy is designed for educational and legitimate use cases
- One-time URLs provide enhanced security but may impact browsing experience
- All proxied content is processed through the server, which may have performance implications
- No logs are kept of browsed sites for maximum privacy

## Disclaimer

This tool is for educational purposes only. Users are responsible for complying with all applicable laws and regulations when using this proxy service. The developers do not condone or support using this tool for illegal activities.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
