# AMSA Frontend Architecture

## Overview

This document describes the technical architecture and design decisions for the AMSA Frontend application.

## Tech Stack

### Core
- **Framework**: Angular 20
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4.1
- **UI Components**: PrimeNG 20.0
- **Server**: Express with SSR support

### Key Features
- Standalone components (no NgModules)
- Server-Side Rendering (SSR)
- Signal-based reactivity
- Functional HTTP interceptors

## Architecture Patterns

### Component Architecture

#### Standalone Components
All components use Angular's standalone API:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, OtherComponents],
  templateUrl: './example.component.html'
})
export class ExampleComponent {}
```

#### Smart vs Presentational Components
- **Smart Components**: Handle business logic, API calls, routing
- **Presentational Components**: Display data, emit events

### State Management

#### Local State
- Component-level state using TypeScript properties
- RxJS Subjects for component communication

#### Shared State
- Services with BehaviorSubjects
- Observable patterns for reactive updates

### Routing Strategy

#### Lazy Loading
All routes use lazy loading for optimal bundle size:

```typescript
{
  path: 'feature',
  loadComponent: () => import('./feature.component')
    .then(m => m.FeatureComponent)
}
```

#### Route Guards
- `AuthGuard`: Protects authenticated routes
- Level-based access control

## Data Flow

```
User Action → Component → Service → HTTP Interceptor → Backend API
                  ↓
            Update UI ← Observable ← Service Response
```

### HTTP Interceptors

#### AuthInterceptor
- Adds JWT token to all requests
- Automatically handles authentication headers

#### ErrorInterceptor
- Global error handling
- User-friendly error messages via PrimeNG Toast
- SSR-aware (checks platform)

## Services Architecture

### Core Services

#### AuthService
- User authentication and authorization
- Token management
- Auto-login functionality
- Level-based permissions

#### LocalStorageService
- SSR-safe localStorage access
- Platform detection (browser vs server)

#### ThemeService
- Dark/light mode toggle
- System preference detection
- Persistent theme storage

#### SEOService
- Dynamic meta tags
- Server-side rendering optimization
- Social media sharing tags

## Security

### Implementation

#### Headers (Helmet)
```typescript
- Content-Security-Policy
- HSTS
- X-Frame-Options: DENY
- X-XSS-Protection
- Referrer-Policy
```

#### Authentication
- JWT-based authentication
- Token expiration handling
- Auto-logout on token expiry

#### Data Protection
- Environment-based API endpoints
- Secure HTTP-only connections in production

## Performance Optimizations

### Build Optimizations
- Bundle size limits (1MB max)
- Tree-shaking unused code
- Lazy-loaded routes

### Runtime Optimizations
- OnPush change detection where applicable
- Trackby functions in *ngFor loops
- Subscription management (unsubscribe pattern)

### Network Optimizations
- Gzip compression
- Static file caching (1 year)
- CDN-ready assets

## SSR (Server-Side Rendering)

### Benefits
- Improved SEO
- Faster initial page load
- Better social media sharing

### Implementation
- Express server with CommonEngine
- Platform detection (isPlatformBrowser)
- Browser-only code guards

### Challenges & Solutions

**Challenge**: localStorage not available on server  
**Solution**: LocalStorageService with platform detection

**Challenge**: window/document undefined on server  
**Solution**: isPlatformBrowser checks

## Error Handling

### Levels
1. **Component Level**: Try-catch blocks, loading states
2. **Service Level**: Error transformation, logging
3. **Global Level**: ErrorInterceptor, Toast notifications

### User Experience
- User-friendly error messages
- Loading indicators during operations
- Retry functionality where appropriate

## Testing Strategy

### Unit Tests
- Component testing with TestBed
- Service testing with HttpClientTestingModule
- Isolated unit tests for utilities

### E2E Tests (Planned)
- Critical user flows
- Authentication flows
- Form submissions

### Coverage Goals
- Minimum 60% code coverage
- 80% coverage for services
- 70% coverage for components

## CI/CD Pipeline

### Build Process
```
1. Git pull
2. npm ci (clean install)
3. npm run build (production)
4. PM2 restart
5. Health check validation
```

### Quality Gates
- Linting must pass
- Build must succeed
- No TypeScript errors

## File Organization

### Naming Conventions
- Components: `feature-name.component.ts`
- Services: `feature-name.service.ts`
- Models: `feature-name.model.ts`
- Guards: `feature-name.guard.ts`

### Module Structure
```
feature/
├── feature.component.ts
├── feature.component.html
├── feature.service.ts
├── feature.model.ts
└── sub-features/
```

## Environment Configuration

### Variables
- `production`: boolean
- `backendUrl`: API base URL
- `apiUrl`: Full API endpoint
- `apiTimeout`: Request timeout (30s)
- `retryAttempts`: Failed request retries
- `featureFlags`: Feature toggles

## Future Enhancements

### Planned Features
- [ ] Progressive Web App (PWA)
- [ ] Advanced analytics integration
- [ ] Real-time notifications
- [ ] Improved caching strategy
- [ ] More comprehensive testing

### Technical Debt
- Add comprehensive E2E tests
- Implement advanced error monitoring (Sentry)
- Add performance monitoring
- Migrate remaining console.error to proper logging service

## Best Practices

### TypeScript
- Use strict typing
- Avoid `any` type
- Define interfaces for all data structures
- Use readonly where applicable

### Angular
- Follow Angular style guide
- Use OnPush change detection when possible
- Properly unsubscribe from observables
- Use trackBy with ngFor

### Tailwind CSS
- Use utility classes exclusively
- Avoid inline styles
- No SCSS files
- Keep responsive design in mind

## Monitoring & Logging

### Current
- Health check endpoint (`/health`)
- Basic error logging (console.error)

### Planned
- Structured logging service
- Application performance monitoring (APM)
- Error tracking service integration

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility

### Tools
- Accessibility testing utilities
- Skip navigation links
- Focus management

## References

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PrimeNG Documentation](https://primeng.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: November 2025  
**Version**: 1.0.0

