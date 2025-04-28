// This is a basic proxy utility to handle requests

import { TokenManager } from './token-manager';

export type ProxyConfig = {
  prefix: string;
  rewriteUrls: boolean;
  useOneTimeTokens: boolean;
  encodeUrl: (url: string) => string;
  decodeUrl: (encodedUrl: string) => string;
};

export const defaultProxyConfig: ProxyConfig = {
  prefix: '/service/',
  rewriteUrls: true,
  useOneTimeTokens: false, // Set to false by default for better browsing experience
  
  encodeUrl: (url: string) => {
    if (typeof window !== 'undefined' && defaultProxyConfig.useOneTimeTokens) {
      // Create a one-time token for the URL
      const tokenManager = TokenManager.getInstance();
      return tokenManager.createToken(url);
    }
    // Fallback to base64 encoding if not in browser or tokens disabled
    return btoa(url);
  },
  
  decodeUrl: (encodedUrl: string) => {
    try {
      // First try to decode as a token
      if (typeof window !== 'undefined' && defaultProxyConfig.useOneTimeTokens) {
        const tokenManager = TokenManager.getInstance();
        const url = tokenManager.getUrlByToken(encodedUrl);
        if (url) return url;
      }
      
      // Fallback to base64 decoding (for backward compatibility)
      return atob(encodedUrl);
    } catch (error) {
      console.error('Failed to decode URL:', error);
      return '';
    }
  }
};

export function createProxyUrl(url: string, config: ProxyConfig = defaultProxyConfig): string {
  try {
    // Ensure URL is properly formatted
    if (!url.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }
    
    // Encode the URL and append to the proxy path
    const encodedUrl = config.encodeUrl(url);
    return `${config.prefix}${encodedUrl}`;
  } catch (error) {
    console.error('Error creating proxy URL:', error);
    return '/error';
  }
}

// Utility to modify HTML content for proxied pages
export function rewriteHtml(html: string, baseUrl: string, config: ProxyConfig = defaultProxyConfig): string {
  if (!config.rewriteUrls) return html;
  
  const parsedBaseUrl = new URL(baseUrl);
  const baseOrigin = parsedBaseUrl.origin;
  const basePath = parsedBaseUrl.pathname.split('/').slice(0, -1).join('/') + '/';
  
  // Create an enhanced version with more comprehensive rewriting
  let rewrittenHtml = html;
  
  // Function to determine if a URL is relative or absolute
  const processUrl = (url: string): string => {
    if (!url) return url;
    
    // Skip data: URLs, javascript: URLs, and anchor (#) links
    if (url.startsWith('data:') || 
        url.startsWith('javascript:') || 
        url.startsWith('#') || 
        url.startsWith('about:') ||
        url.startsWith('mailto:')) {
      return url;
    }
    
    // Handle absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return createProxyUrl(url, config);
    }
    
    // Handle protocol-relative URLs (//example.com/path)
    if (url.startsWith('//')) {
      return createProxyUrl(`${parsedBaseUrl.protocol}${url}`, config);
    }
    
    // Handle root-relative URLs (/path/to/resource)
    if (url.startsWith('/')) {
      return createProxyUrl(`${baseOrigin}${url}`, config);
    }
    
    // Handle relative URLs (path/to/resource)
    return createProxyUrl(`${baseOrigin}${basePath}${url}`, config);
  };

  // Check if base tag already exists
  const hasBaseTag = /<base\s/i.test(rewrittenHtml);
  
  // Add base tag to help with relative URLs if it doesn't exist
  if (!hasBaseTag) {
    rewrittenHtml = rewrittenHtml.replace(
      /<head(?:\s[^>]*)?>/i,
      (match) => `${match}\n<base href="${baseUrl}">`
    );
  }
  
  // Rewrite various HTML attributes that contain URLs
  const urlAttributes = [
    // Links and navigation
    { tag: 'a', attr: 'href' },
    { tag: 'area', attr: 'href' },
    { tag: 'link', attr: 'href' },
    { tag: 'base', attr: 'href' },
    
    // Media and resources
    { tag: 'img', attr: 'src' },
    { tag: 'img', attr: 'srcset' },
    { tag: 'script', attr: 'src' },
    { tag: 'audio', attr: 'src' },
    { tag: 'video', attr: 'src' },
    { tag: 'source', attr: 'src' },
    { tag: 'track', attr: 'src' },
    { tag: 'embed', attr: 'src' },
    { tag: 'iframe', attr: 'src' },
    { tag: 'object', attr: 'data' },
    
    // Forms
    { tag: 'form', attr: 'action' },
    
    // Other
    { tag: 'meta', attr: 'content' }, // For meta refresh redirects
    { tag: 'button', attr: 'formaction' },
    { tag: 'input', attr: 'formaction' },
  ];
  
  // Generic attribute rewriter for all tags
  urlAttributes.forEach(({ tag, attr }) => {
    const regex = new RegExp(`<${tag}\\s+([^>]*?${attr}=["']([^"']+)["'][^>]*)>`, 'gi');
    rewrittenHtml = rewrittenHtml.replace(regex, (match, attribs, url) => {
      if (tag === 'meta' && !attribs.includes('http-equiv="refresh"') && !attribs.includes("http-equiv='refresh'")) {
        return match; // Only process meta refresh tags
      }
      
      // Special handling for srcset attribute which contains multiple URLs
      if (attr === 'srcset') {
        const srcsetUrls = url.split(',').map((src: string) => {
          const [srcUrl, descriptor] = src.trim().split(/\s+/);
          return `${processUrl(srcUrl)} ${descriptor || ''}`.trim();
        }).join(', ');
        return match.replace(url, srcsetUrls);
      }
      
      // Special handling for meta refresh tags
      if (tag === 'meta' && attribs.includes('http-equiv="refresh"') || attribs.includes("http-equiv='refresh'")) {
        const refreshMatch = url.match(/^\d+;\s*url=(.+)$/i);
        if (refreshMatch) {
          const refreshUrl = refreshMatch[1];
          const processedUrl = processUrl(refreshUrl);
          return match.replace(url, url.replace(refreshUrl, processedUrl));
        }
      }
      
      return match.replace(`${attr}="${url}"`, `${attr}="${processUrl(url)}"`);
    });
  });

  // Rewrite inline styles with url() references
  rewrittenHtml = rewrittenHtml.replace(
    /style=["']([^"']*url\([^)]+\)[^"']*)["']/gi,
    (match, styleContent) => {
      const rewrittenStyle = styleContent.replace(
        /url\(['"]?([^'")]+)['"]?\)/gi,
        (urlMatch: string, urlContent: string) => {
          return `url('${processUrl(urlContent)}')`;
        }
      );
      return match.replace(styleContent, rewrittenStyle);
    }
  );

  // Rewrite style tags content
  rewrittenHtml = rewrittenHtml.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/gi,
    (match, styleContent) => {
      const rewrittenStyle = rewriteCss(styleContent, baseUrl, config);
      return match.replace(styleContent, rewrittenStyle);
    }
  );
  
  // Add a script to rewrite dynamic content - with minimal DOM changes to preserve original appearance
  const rewriteScript = `
<script>
  (function() {
    // Store original methods that we'll override
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalFetch = window.fetch;
    const originalCreateElement = document.createElement;
    
    // Function to rewrite URLs in the same way as server-side
    function rewriteUrl(url) {
      // Skip data: URLs, javascript: URLs, and anchor links
      if (!url || url.startsWith('data:') || url.startsWith('javascript:') || url.startsWith('#') || url.startsWith('about:')) {
        return url;
      }
      
      // Get base URL from the base tag
      const baseElement = document.querySelector('base');
      const baseUrl = baseElement ? baseElement.href : window.location.href;
      const base = new URL(baseUrl);
      
      try {
        // Handle absolute URLs
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return '/service/' + btoa(url); // Always use btoa for encoding to ensure consistent behavior
        }
        
        // Handle protocol-relative URLs
        if (url.startsWith('//')) {
          return '/service/' + btoa(base.protocol + url);
        }
        
        // Handle root-relative URLs
        if (url.startsWith('/')) {
          return '/service/' + btoa(base.origin + url);
        }
        
        // Handle relative URLs
        const basePath = base.pathname.split('/').slice(0, -1).join('/') + '/';
        return '/service/' + btoa(base.origin + basePath + url);
      } catch (e) {
        console.error('Failed to rewrite URL:', url, e);
        return url;
      }
    }
    
    // Override XMLHttpRequest.open to rewrite URLs
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
      const rewrittenUrl = rewriteUrl(url);
      return originalOpen.call(this, method, rewrittenUrl, async, user, password);
    };
    
    // Override fetch to rewrite URLs
    window.fetch = function(input, init) {
      if (typeof input === 'string') {
        input = rewriteUrl(input);
      } else if (input instanceof Request) {
        input = new Request(rewriteUrl(input.url), input);
      }
      return originalFetch.call(this, input, init);
    };
    
    // Override createElement to catch script and iframe creations
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'iframe') {
        // Create getters/setters for src attribute
        const originalDescriptor = Object.getOwnPropertyDescriptor(element.__proto__, 'src');
        Object.defineProperty(element, 'src', {
          get: function() {
            return originalDescriptor.get.call(this);
          },
          set: function(value) {
            return originalDescriptor.set.call(this, rewriteUrl(value));
          }
        });
      }
      return element;
    };
    
    // Observe DOM changes to rewrite URLs in dynamically added elements
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              // Rewrite attributes with URLs
              ['href', 'src', 'action', 'data', 'formaction'].forEach(attr => {
                if (node.hasAttribute && node.hasAttribute(attr)) {
                  node.setAttribute(attr, rewriteUrl(node.getAttribute(attr)));
                }
              });
              
              // Recursively process child nodes
              if (node.querySelectorAll) {
                ['a', 'link', 'img', 'script', 'iframe', 'form', 'source', 'video', 'audio'].forEach(tagName => {
                  node.querySelectorAll(tagName).forEach(element => {
                    ['href', 'src', 'action', 'data', 'formaction'].forEach(attr => {
                      if (element.hasAttribute(attr)) {
                        element.setAttribute(attr, rewriteUrl(element.getAttribute(attr)));
                      }
                    });
                  });
                });
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true 
    });

    // Helper function to preserve the browser URL bar showing original site
    function updateUrlBar() {
      try {
        const baseElement = document.querySelector('base');
        if (baseElement && baseElement.href) {
          const originalUrl = baseElement.href;
          window.history.replaceState(null, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error('Failed to update URL bar:', e);
      }
    }

    // Run once after page load
    window.addEventListener('load', updateUrlBar);
  })();
</script>`;

  // Inject the script at the end of the body or before the closing html tag
  // Use a more reliable way to inject that won't break existing scripts
  if (rewrittenHtml.includes('</body>')) {
    const bodyCloseIndex = rewrittenHtml.lastIndexOf('</body>');
    rewrittenHtml = rewrittenHtml.substring(0, bodyCloseIndex) + 
                    rewriteScript + 
                    rewrittenHtml.substring(bodyCloseIndex);
  } else {
    const htmlCloseIndex = rewrittenHtml.lastIndexOf('</html>');
    if (htmlCloseIndex !== -1) {
      rewrittenHtml = rewrittenHtml.substring(0, htmlCloseIndex) + 
                      rewriteScript + 
                      rewrittenHtml.substring(htmlCloseIndex);
    } else {
      // If no closing tags found, append to the end
      rewrittenHtml = rewrittenHtml + rewriteScript;
    }
  }
  
  return rewrittenHtml;
}

// Helper function to rewrite URLs in CSS content while preserving original formatting
export function rewriteCss(css: string, baseUrl: string, config: ProxyConfig = defaultProxyConfig): string {
  if (!config.rewriteUrls) return css;
  
  const parsedBaseUrl = new URL(baseUrl);
  const baseOrigin = parsedBaseUrl.origin;
  const basePath = parsedBaseUrl.pathname.split('/').slice(0, -1).join('/') + '/';
  
  // Match all url() patterns including those with quotes and without
  return css.replace(/url\(['"]?([^'")]+)['"]?\)/gi, (match, url) => {
    // Skip data: URLs and empty URLs
    if (!url || url.startsWith('data:')) return match;
    
    // Preserve original quote style
    const hasDoubleQuotes = match.includes('"');
    const hasSingleQuotes = match.includes("'");
    const quoteChar = hasDoubleQuotes ? '"' : (hasSingleQuotes ? "'" : '');
    
    // Handle absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return `url(${quoteChar}${createProxyUrl(url, config)}${quoteChar})`;
    }
    
    // Handle protocol-relative URLs
    if (url.startsWith('//')) {
      return `url(${quoteChar}${createProxyUrl(`${parsedBaseUrl.protocol}${url}`, config)}${quoteChar})`;
    }
    
    // Handle root-relative URLs
    if (url.startsWith('/')) {
      return `url(${quoteChar}${createProxyUrl(`${baseOrigin}${url}`, config)}${quoteChar})`;
    }
    
    // Handle relative URLs
    return `url(${quoteChar}${createProxyUrl(`${baseOrigin}${basePath}${url}`, config)}${quoteChar})`;
  });
}

// A JavaScript URL rewriter with improved pattern matching
export function rewriteJavaScript(js: string, baseUrl: string, config: ProxyConfig = defaultProxyConfig): string {
  if (!config.rewriteUrls) return js;
  
  // More comprehensive pattern matching for JavaScript URLs
  const urlPatterns = [
    // fetch('url') or fetch("url")
    { regex: /fetch\(\s*['"]([^'"]+)['"]\s*\)/g, group: 1 },
    // URL constructor: new URL('url') or new URL("url")
    { regex: /new\s+URL\(\s*['"]([^'"]+)['"]\s*\)/g, group: 1 },
    // XHR open: .open('GET', 'url')
    { regex: /\.open\(\s*['"][^'"]+['"],\s*['"]([^'"]+)['"]\s*[,)]/g, group: 1 },
    // src/href assignments: .src = 'url' or .href = "url"
    { regex: /\.(src|href)\s*=\s*['"]([^'"]+)['"]/g, group: 2 },
    // window.location assignments
    { regex: /(?:window\.)?location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/g, group: 1 },
    // axios.get("url") and similar
    { regex: /\.\s*(?:get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]/g, group: 1 },
    // Other common URL string patterns with more precise boundaries
    { 
      regex: /['"]((https?:\/\/|\/\/)[^'"]+)['"]/g, 
      group: 1,
      // Only process if it looks like a URL and not a CSS selector or other string
      validate: (url: string) => {
        return url.includes('.') && 
              !url.includes(' ') && 
              !url.startsWith('//--') &&
              !url.includes('//*/');
      }
    }
  ];
  
  let rewrittenJs = js;
  
  urlPatterns.forEach(pattern => {
    rewrittenJs = rewrittenJs.replace(pattern.regex, (match, ...groups) => {
      const url = groups[pattern.group - 1];
      if (!url) return match;
      
      // Skip certain URLs
      if (url.startsWith('data:') || 
          url.startsWith('blob:') || 
          url.startsWith('javascript:') || 
          url.startsWith('#') || 
          url.startsWith('about:')) {
        return match;
      }
      
      // Apply validation if present
      if (pattern.validate && !pattern.validate(url)) {
        return match;
      }
      
      // Create absolute URL if needed
      let absoluteUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        const parsedBase = new URL(baseUrl);
        
        if (url.startsWith('//')) {
          absoluteUrl = `${parsedBase.protocol}${url}`;
        } else if (url.startsWith('/')) {
          absoluteUrl = `${parsedBase.origin}${url}`;
        } else {
          const basePath = parsedBase.pathname.split('/').slice(0, -1).join('/') + '/';
          absoluteUrl = `${parsedBase.origin}${basePath}${url}`;
        }
      }
      
      // Preserve quote style in the replacement
      const proxyUrl = createProxyUrl(absoluteUrl, config);
      
      // Replace only the URL part while keeping the quotes and other context
      return match.replace(url, proxyUrl);
    });
  });
  
  return rewrittenJs;
}
