# Security Policy

## ⚠️ CRITICAL: Never Commit Secrets

**This repository previously contained sensitive files that have been removed from git history. If you have cloned this repository before the security cleanup, please rotate all affected credentials immediately.**

## Security Best Practices

### Files That Should NEVER Be Committed

- **SSH Keys**: `id_rsa`, `id_rsa.pub`, `id_rsa.ppk`, `*.pem`, `*.key`
- **Passwords**: Any file containing passwords (`.txt`, `.md`, etc.)
- **Environment Variables**: `.env`, `.env.*` files
- **API Keys**: Any file containing API keys or tokens
- **Certificates**: `*.p12`, `*.pfx`, and other certificate files

### If You Accidentally Commit Secrets

1. **Immediately rotate/revoke the exposed credentials**
2. Remove the files from git history using:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch <file>" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push the cleaned history:
   ```bash
   git push origin --force --all
   git push origin --force --tags
   ```
4. Notify all team members to re-clone the repository

### Current Status

- ✅ Sensitive files have been removed from git history
- ✅ `.gitignore` has been updated to prevent future commits
- ⚠️ **All SSH keys that were in this repository should be considered compromised and rotated**

### Rotation Steps for Compromised Keys

1. Generate new SSH key pairs:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add the new public key to all services (GitHub, servers, etc.)

3. Remove the old public key from all services

4. Delete the old private key from your local machine

5. Test the new key before removing the old one from services

## Reporting Security Issues

If you discover a security vulnerability, please report it privately to the repository maintainers rather than opening a public issue.
