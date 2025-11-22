# Contributing to AMSA Frontend

Thank you for your interest in contributing to AMSA Frontend! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Angular CLI (v20+)

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Navigate to `http://localhost:4200/`

## Development Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/description`
- Hotfix: `hotfix/description`

### Commit Messages
Follow conventional commit format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure code`
- `test: add tests`
- `chore: update dependencies`

## Coding Standards

### TypeScript
- Use strict type checking
- Avoid `any` type when possible
- Document complex functions with JSDoc comments
- Follow Angular style guide

### Styling
- **IMPORTANT**: Use Tailwind CSS utility classes ONLY
- Do NOT create or use SCSS files
- Keep inline styles to a minimum

### Components
- Use standalone components
- Implement proper lifecycle hooks
- Handle subscriptions properly (unsubscribe in `ngOnDestroy`)

### Code Quality
- Run linter: `npm run lint`
- Fix linting issues: `npm run lint:fix`
- Format code: `npm run format`
- Check formatting: `npm run format:check`

## Testing

### Running Tests
- Unit tests: `npm test`
- Always test locally before pushing: `ng serve`
- Check for linter errors before committing

### Writing Tests
- Write tests for all new features
- Maintain minimum 60% code coverage
- Test edge cases and error scenarios

## Pull Request Process

### Before Submitting
1. Test changes locally with `ng serve`
2. Run linter: `npm run lint`
3. Format code: `npm run format`
4. Update relevant documentation
5. Add tests for new features

### PR Guidelines
1. Create a descriptive PR title
2. Fill out the PR template completely
3. Link related issues
4. Request review from team members
5. Address review comments promptly

### CI/CD
- All tests must pass
- No linting errors allowed
- Build must succeed
- On merge to `main`, automatic deployment occurs

## Questions?

If you have questions or need help, please:
1. Check existing documentation
2. Search closed issues
3. Create a new issue with the `question` label

Thank you for contributing! 🎉

