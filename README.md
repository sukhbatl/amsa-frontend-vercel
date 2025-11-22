# AMSA Frontend

Modern Angular application for the American Mongolian Student Association (AMSA) platform.

## 🚀 Features

- **Server-Side Rendering (SSR)** for improved SEO and performance
- **Tailwind CSS** for modern, utility-first styling
- **PrimeNG** component library for rich UI components
- **Angular 20** with standalone components
- **TypeScript** with strict type checking
- **Responsive Design** optimized for all devices
- **Internationalization** support
- **Security headers** with Helmet
- **Automated CI/CD** deployment pipeline

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20 or higher)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd amsa-frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200/`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run serve:ssr:amsa-frontend` | Serve SSR build |

## 🏗️ Project Structure

```
src/
├── app/
│   ├── auth/           # Authentication module
│   ├── common/         # Shared components
│   ├── navigation/     # Navigation components
│   ├── services/       # Application services
│   ├── models/         # TypeScript interfaces
│   └── ...             # Feature modules
├── assets/            # Static assets
├── environments/      # Environment configurations
└── styles.css        # Global styles (Tailwind)
```

## 🎨 Styling Guidelines

**IMPORTANT**: This project uses **Tailwind CSS exclusively** for styling.

- ✅ Use Tailwind utility classes in HTML templates
- ❌ Do NOT create or use SCSS files
- ❌ Avoid inline styles unless absolutely necessary

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage
```

**Testing Guidelines:**
- Write tests for all new features
- Maintain minimum 60% code coverage
- Test components, services, and utilities

## 🔒 Security

This application implements multiple security measures:

- **Helmet** for security headers
- **CSP (Content Security Policy)** configuration
- **HSTS** (HTTP Strict Transport Security)
- **XSS Protection**
- **Compression** for optimized delivery

## 🌍 Environment Configuration

### Development
```typescript
// src/environments/environment.ts
backendUrl: 'http://localhost:3000/'
```

### Production
```typescript
// src/environments/environment.prod.ts
backendUrl: 'https://backend.amsa.mn/'
```

## 🚀 Deployment

For complete deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Overview

**Automated (CI/CD):** Automatic deployment occurs on push to `main` branch
- Git pull latest changes
- Install dependencies with `npm ci`
- Build production bundle
- Restart PM2 process

**Manual:** Build locally and deploy to server
```bash
npm run build
# See DEPLOYMENT.md for full manual deployment steps
```

**Related Documentation:**
- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment procedures
- [Contributing Guide](./CONTRIBUTING.md) - Development workflow
- [Backend Deployment](../amsa-backend/DEPLOYMENT.md) - Backend deployment

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Test locally (`npm start`)
4. Run linter (`npm run lint`)
5. Format code (`npm run format`)
6. Commit changes (`git commit -m 'feat: add amazing feature'`)
7. Push to branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

## 📝 Code Quality

This project enforces code quality through:

- **ESLint** for TypeScript/Angular linting
- **Prettier** for consistent code formatting
- **TypeScript strict mode** for type safety
- **Angular style guide** compliance

## 🐛 Known Issues

See the [issues page](https://gitlab.com/your-org/amsa-frontend/-/issues) for known bugs and feature requests.

## 📄 License

This project is proprietary and confidential.

## 👥 Team

- **Project Lead**: [Name]
- **Developers**: [Names]

## 📞 Support

For support and questions:
- Create an issue in GitLab
- Contact the development team
- Check the [CONTRIBUTING.md](CONTRIBUTING.md) guide

## 🙏 Acknowledgments

- Angular team for the amazing framework
- PrimeNG for the component library
- All contributors to this project

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Angular Version**: 20.0.0
