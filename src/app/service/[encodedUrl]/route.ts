import { NextResponse } from 'next/server';
import { defaultProxyConfig, rewriteHtml, rewriteCss, rewriteJavaScript } from '@/lib/proxy';

export async function GET(
  request: Request,
  { params }: { params: { encodedUrl: string } }
) {
  try {
    // Decode the URL from token or base64
    const decodedUrl = defaultProxyConfig.decodeUrl(params.encodedUrl);
    
    if (!decodedUrl) {
      return new NextResponse(
        `<html>
          <head>
            <title>Link Expired</title>
            <style>
              body {
                font-family: monospace;
                background-color: #0f0f0f;
                color: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .error-container {
                max-width: 600px;
                padding: 2rem;
                background-color: #1a1a1a;
                border: 1px solid #a855f7;
                border-radius: 8px;
                text-align: center;
              }
              h1 {
                color: #a855f7;
                margin-top: 0;
              }
              .icon {
                font-size: 3rem;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="error-container">
              <div class="icon">🔒</div>
              <h1>Secure Link Expired</h1>
              <p>This one-time proxy link has expired or already been used.</p>
              <p>For security reasons, each link can only be accessed once.</p>
              <button onclick="window.location.href='/';" 
                style="background-color: #a855f7; color: white; border: none; padding: 8px 16px; 
                border-radius: 4px; cursor: pointer; font-family: monospace; margin-top: 1rem;">
                Return to Terminal
              </button>
            </div>
          </body>
        </html>`,
        {
          status: 410, // Gone
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
    
    // Get request URL with pathname to handle relative URLs correctly
    const requestUrl = new URL(request.url);
    const requestPath = requestUrl.pathname;
    
    // Fetch the target website content
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': request.headers.get('Accept') || '*/*',
        'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.9',
        'Referer': decodedUrl
      },
    });
    
    // Get content type to determine how to process the response
    const contentType = response.headers.get('Content-Type') || '';
    const responseText = await response.text();
    
    // Process content based on content type, preserving as much original content as possible
    let processedContent = responseText;
    
    if (contentType.includes('text/html')) {
      // Rewrite HTML content
      processedContent = rewriteHtml(responseText, decodedUrl, defaultProxyConfig);
    } else if (contentType.includes('text/css')) {
      // Rewrite CSS content
      processedContent = rewriteCss(responseText, decodedUrl, defaultProxyConfig);
    } else if (contentType.includes('application/javascript') || 
               contentType.includes('text/javascript')) {
      // Rewrite JavaScript content
      processedContent = rewriteJavaScript(responseText, decodedUrl, defaultProxyConfig);
    }
    
    // Clone all original headers from the target website
    const headers = new Headers();
    response.headers.forEach((value, key) => {
      // Skip headers that would break our proxy functionality
      if (!['content-encoding', 'content-length', 'connection', 'transfer-encoding'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });
    
    // Set crucial headers for proxy functionality
    headers.set('Content-Type', contentType);
    headers.set('Access-Control-Allow-Origin', '*');
    
    // Create a new response with original headers and processed content
    const proxyResponse = new NextResponse(processedContent, {
      status: response.status,
      statusText: response.statusText,
      headers
    });

    return proxyResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse(
      `<html>
        <head>
          <title>Proxy Error</title>
          <style>
            body {
              font-family: monospace;
              background-color: #0f0f0f;
              color: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .error-container {
              max-width: 600px;
              padding: 2rem;
              background-color: #1a1a1a;
              border: 1px solid #a855f7;
              border-radius: 8px;
            }
            h1 {
              color: #a855f7;
              margin-top: 0;
            }
            .error-code {
              background-color: #2d2d2d;
              padding: 1rem;
              border-radius: 4px;
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>Ultraviolet Proxy Error</h1>
            <p>An error occurred while trying to access the requested URL:</p>
            <div class="error-code">
              <code>${error instanceof Error ? error.message : 'Unknown error'}</code>
            </div>
            <p>Please try a different URL or return to the terminal.</p>
            <button onclick="window.location.href='/';" 
              style="background-color: #a855f7; color: white; border: none; padding: 8px 16px; 
              border-radius: 4px; cursor: pointer; font-family: monospace;">
              Return to Terminal
            </button>
          </div>
        </body>
      </html>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}
