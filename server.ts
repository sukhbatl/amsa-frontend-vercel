import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import helmet from 'helmet';
import compression from 'compression';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = join(process.cwd(), process.env['AMSA_FRONTEND_FOLDER'] ?? '', 'dist/amsa-frontend/server');
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  // Security headers with helmet
  server.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://stackpath.bootstrapcdn.com"],
        styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://stackpath.bootstrapcdn.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://stackpath.bootstrapcdn.com", "data:"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        connectSrc: ["'self'", "https://backend.amsa.mn", "http://localhost:3000"],
        frameSrc: ["'self'", "https://w.soundcloud.com", "https://donorbox.org", "https://podcasters.spotify.com", "https://creators.spotify.com", "https://accounts.spotify.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env['NODE_ENV'] === 'production' ? [] : null,
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: { action: 'deny' },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));

  // Enable compression
  server.use(compression());

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Health check endpoint
  server.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Serve manifest.json with correct content-type
  server.get('/manifest.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.sendFile(join(browserDistFolder, 'manifest.json'), (err) => {
      if (err) {
        next(err);
      }
    });
  });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const baseHref = baseUrl || '/';

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseHref }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['AMSA_FRONTEND_PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
