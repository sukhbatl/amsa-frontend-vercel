# AMSA Frontend - Deployment Guide

Complete guide for deploying the AMSA frontend application to production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Automated Deployment (CI/CD)](#automated-deployment-cicd)
- [Manual Deployment](#manual-deployment)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Local Development
- Node.js v18 or higher
- npm v9 or higher
- Angular CLI v20 or higher
- Git access to repository

### Production Server
- VM/Server with SSH access
- PM2 installed globally
- Node.js v18 or higher
- Git configured with SSH keys

---

## Automated Deployment (CI/CD)

The frontend uses GitLab CI/CD for automated deployments.

### How It Works

On every push to `main` branch:
1. GitLab runner connects to VM via SSH
2. Pulls latest code from repository
3. Installs dependencies with `npm ci`
4. Builds production bundle with `npm run build`
5. Restarts PM2 process
6. Saves PM2 configuration

### GitLab CI/CD Variables

**Required variables** in **Settings → CI/CD → Variables**:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SSH_PRIVATE_KEY` | VM SSH private key | `-----BEGIN OPENSSH...` | ✅ Yes |
| `VM_USER` | SSH username | `root` | ✅ Yes |
| `VM_HOST` | VM hostname/IP | `amsa.mn` or `123.45.67.89` | ✅ Yes |
| `DEPLOY_PATH` | Frontend directory path | `/root/amsa/test/amsa-frontend` | ⚠️ Optional* |

**\*Note:** `DEPLOY_PATH` is optional. If not set, it defaults to `/root/amsa/test/amsa-frontend`

### Pipeline Configuration

Pipeline is defined in `.gitlab-ci.yml`:
```yaml
stages:
  - deploy

prod-deploy:
  stage: deploy
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
```

### Monitoring Pipeline

1. Go to **CI/CD → Pipelines** in GitLab
2. View pipeline status (success/failed)
3. Check logs for detailed execution steps
4. Re-run failed pipelines if needed

---

## Manual Deployment

For emergency deployments or when CI/CD is unavailable.

### Step 1: SSH into VM

```bash
ssh user@your-vm-host
```

### Step 2: Navigate to Project Directory

```bash
cd /root/amsa/test/amsa-frontend
# Or your configured DEPLOY_PATH
```

### Step 3: Pull Latest Changes

```bash
git fetch --all --prune
git reset --hard origin/main
git clean -fdx
```

### Step 4: Install Dependencies

```bash
npm ci
```

### Step 5: Build for Production

```bash
npm run build
```

### Step 6: Restart PM2

```bash
pm2 restart "AMSA Frontend"
# or
pm2 restart all

# Save PM2 configuration
pm2 save
```

### Step 7: Verify Deployment

```bash
# Check PM2 status
pm2 list

# View logs
pm2 logs "AMSA Frontend" --lines 50

# Check if app is responding
curl http://localhost:4200
```

---

## Environment Configuration

### Production Environment Variables

Located in `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  backendUrl: 'https://backend.amsa.mn/'
};
```

### PM2 Configuration

Located in `ecosystem.config.js` (in repository):

```javascript
module.exports = {
  apps: [{
    name: 'AMSA Frontend',
    script: './dist/amsa-frontend/server/server.mjs',
    cwd: '/root/amsa/test/amsa-frontend',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      AMSA_FRONTEND_PORT: '4000',
      AMSA_FRONTEND_FOLDER: ''
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
```

**Note:** The PM2 config is now version-controlled in the repository. Do NOT create a separate `/root/ecosystem.config.js` file as it will cause path conflicts.

---

## Troubleshooting

### Pipeline Fails at SSH Connection

**Error:** `Permission denied (publickey)`

**Solution:**
1. Verify `SSH_PRIVATE_KEY` variable is correctly set
2. Check that public key is added to VM's `~/.ssh/authorized_keys`
3. Test SSH connection manually: `ssh -i ~/.ssh/id_rsa user@host`

### Pipeline Fails at Git Operations

**Error:** `Repository not found` or `Permission denied`

**Solution:**
1. Ensure VM's SSH key has access to GitLab repository
2. Test: `git fetch` on the VM
3. If needed, change remote to SSH: `git remote set-url origin git@gitlab.com:mglseed/amsa-frontend.git`

### Build Fails

**Error:** `npm ERR!` or build errors

**Solution:**
```bash
# On VM, clean install
cd /root/amsa/test/amsa-frontend
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### PM2 Process Not Starting

**Error:** Process shows as `errored` in `pm2 list`

**Solution:**
```bash
# View error logs
pm2 logs "AMSA Frontend" --err --lines 50

# Delete and restart
pm2 delete "AMSA Frontend"
pm2 start /root/ecosystem.config.js
pm2 save
```

### Application Not Accessible

**Error:** Cannot access https://amsa.mn

**Solution:**
```bash
# Check if PM2 is running
pm2 list

# Check if port 4200 is listening
netstat -tulpn | grep 4200

# Check nginx/reverse proxy configuration
sudo nginx -t
sudo systemctl status nginx

# Restart nginx if needed
sudo systemctl restart nginx
```

### CORS Errors in Browser Console

**Error:** `Access to fetch ... has been blocked by CORS policy`

**Solution:** This is a backend issue. See [Backend DEPLOYMENT.md](../amsa-backend/DEPLOYMENT.md#cors-configuration)

### Path Duplication Error (ENOENT)

**Error:** `ENOENT: no such file or directory, open '/root/amsa/test/amsa-frontend/amsa/test/amsa-frontend/dist/...'`

**Cause:** Conflicting PM2 configuration with incorrect `AMSA_FRONTEND_FOLDER` environment variable or missing `cwd` setting.

**Solution:**
```bash
# SSH into VM
ssh user@vm-host

# Run the fix script
cd /root/amsa/test/amsa-frontend
bash fix-production.sh

# Or manually:
pm2 delete "AMSA Frontend"
rm -f /root/ecosystem.config.js  # Remove conflicting config
pm2 start /root/amsa/test/amsa-frontend/ecosystem.config.js
pm2 save
```

**Prevention:** Always use the `ecosystem.config.js` from the repository. Never create a separate PM2 config file outside the repository.

---

## Rollback Procedures

### Quick Rollback (Last Commit)

```bash
# SSH into VM
ssh user@vm-host

cd /root/amsa/test/amsa-frontend

# Rollback to previous commit
git reset --hard HEAD~1

# Rebuild
npm ci
npm run build

# Restart
pm2 restart "AMSA Frontend"
```

### Rollback to Specific Version

```bash
# Find the commit hash you want to rollback to
git log --oneline

# Rollback to specific commit
git reset --hard <commit-hash>

# Rebuild and restart
npm ci
npm run build
pm2 restart "AMSA Frontend"
```

### Emergency: Use Previous Build

If build fails, revert to last known working build:

```bash
# Don't rebuild, just restart with existing dist/
pm2 restart "AMSA Frontend"
```

---

## Health Checks

### Quick Health Check Commands

```bash
# Check PM2 status
pm2 list

# View recent logs
pm2 logs "AMSA Frontend" --lines 20

# Check memory usage
pm2 info "AMSA Frontend"

# Test local response
curl -I http://localhost:4200

# Test public URL
curl -I https://amsa.mn
```

### Monitoring

```bash
# Real-time monitoring
pm2 monit

# Save logs to file
pm2 logs "AMSA Frontend" > frontend-logs.txt
```

---

## Best Practices

1. ✅ **Test locally** before pushing to `main`
   ```bash
   ng serve
   # or
   npm run build
   ```

2. ✅ **Check CI/CD pipeline** after pushing
   - Monitor pipeline in GitLab UI
   - Verify successful deployment

3. ✅ **Test production** after deployment
   - Check https://amsa.mn loads correctly
   - Test critical user flows
   - Check browser console for errors

4. ✅ **Monitor PM2 logs** for any errors
   ```bash
   pm2 logs "AMSA Frontend" --lines 100
   ```

5. ❌ **Never** commit directly to `main` without testing
6. ❌ **Never** run `npm install` in production (use `npm ci`)
7. ❌ **Never** skip pipeline checks

---

## Quick Reference

### Common Commands

```bash
# Deploy (via CI/CD)
git push origin main

# Manual restart on VM
pm2 restart "AMSA Frontend"

# View logs
pm2 logs "AMSA Frontend"

# Check status
pm2 list

# Full redeploy
cd /root/amsa/test/amsa-frontend && \
  git pull && \
  npm ci && \
  npm run build && \
  pm2 restart "AMSA Frontend"
```

---

**Last Updated:** November 2025  
**Version:** 1.9.0

For issues or questions, contact the development team or create an issue in GitLab.

