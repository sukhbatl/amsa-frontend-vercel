# PR: Restore Feature Changes Without Angular Upgrade

## Overview
This PR restores valuable feature improvements and bug fixes from the `backup-angular20-2025-11-03` branch while excluding the problematic Angular 20 upgrade that caused issues.

## Changes Included

### 1. UI/UX Improvements
- **User Authentication Menu Fix**: Fixed profile menu to only show appropriate items based on authentication state
- **Navigation Updates**: Improved topnav component with better menu filtering and language button visibility

### 2. Styling Migration
- **Removed SCSS Files**: Deleted `user-card.component.scss` and `topnav.component.scss`
- **Tailwind CSS Only**: All styling now exclusively uses Tailwind CSS utility classes (as per project standards)

### 3. Image Loading Improvements
- **Lazy Loading**: Added lazy loading and error handling for user card images
- **Dynamic Height**: Added `minHeight` input to user-card component for flexible card sizing
- **Fixed Broken Images**: 
  - Removed expired Facebook CDN images from BUOP component
  - Replaced missing teacher profile images with AMSA logo fallback
  - Applied 400px min-height to BUOP teacher cards

### 4. DevOps Enhancements
- **GitLab CI/CD**: Added `.gitlab-ci.yml` configuration for automatic deployment to VM
  - Deploys on push to `main` branch
  - Handles clean rebuilds with `npm ci` and `npm run build`
  - Automatically restarts PM2 process (ID 1)

### 5. Developer Experience
- **Added Cursor Command**: Created `.cursor/commands/startamsa.md` for quick project startup
- **Cleanup**: Removed obsolete helper scripts (`fix-message-service.js`, `fix-remaining-issues.js`)

## Files Changed
- **Added**: `.gitlab-ci.yml`, `.cursor/commands/startamsa.md`
- **Deleted**: SCSS files, obsolete fix scripts
- **Modified**: Multiple component files (user-card, topnav, buop, landing, members)

## Testing Status
✅ No linter errors
✅ All changes cherry-picked successfully from backup branch
✅ Components maintain Tailwind-only styling approach

## What Was Excluded
- Angular 20 upgrade (caused SSR manifest initialization bugs)
- All SSR-related configuration changes
- Package version updates (keeping current stable Angular version)

## Commits Included
1. `7123460` - Fix user authentication menu visibility and remove SCSS files
2. `4baa46c` - Add GitLab CI/CD configuration for automatic deployment to VM
3. `f830789` - Update topnav component and styles, add .cursor commands folder
4. `f292695` - Fix image errors and add dynamic height to user cards
5. `2350dbc` - Add lazy loading and error handling for user card images

## Next Steps
1. Review and approve this PR
2. Test locally with `ng serve` before merging
3. Once merged, the GitLab CI/CD will automatically deploy to production VM

