# Security Policy

## ⚠️ CRITICAL: Never Commit Secrets

**This repository previously contained sensitive files that have been removed. If you have cloned this repository before this cleanup, you MUST:**

1. **Rotate all compromised credentials immediately:**
   - SSH keys (id_rsa, id_rsa.ppk)
   - Any passwords stored in "SSH Pass.txt"
   - All API keys, tokens, or credentials that may have been exposed

2. **Check your git history:**
   - These files were committed to git history
   - Consider using `git filter-branch` or BFG Repo-Cleaner to remove them from history
   - If the repository is public, assume all secrets are compromised

3. **Best Practices:**
   - Never commit private keys, passwords, or API keys
   - Use environment variables or secure secret management systems
   - Review `.gitignore` before committing
   - Use tools like `git-secrets` or `truffleHog` to scan for secrets

## Reporting Security Issues

If you discover a security vulnerability, please email: masoud.masoori@mas-ai.co

Do NOT open a public GitHub issue for security vulnerabilities.
