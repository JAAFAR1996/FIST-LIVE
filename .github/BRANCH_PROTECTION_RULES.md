# 🔐 Branch Protection Rules - FIST-LIVE

## 🎯 Overview

This document outlines the branch protection rules that should be configured in GitHub to ensure code quality and security.

---

## 🔏 Main Branch Rules (`main`)

### 🔐 Protection Settings

| Setting | Value | Purpose |
|---------|-------|----------|
| **Require pull request reviews** | 1 approval | Ensures peer review before merge |
| **Require status checks** | ✅ Enabled | Enforces all CI checks must pass |
| **Require branches to be up to date** | ✅ Enabled | Prevents merge of stale branches |
| **Require code quality checks** | ✅ All checks required | Ensures build, test, and security pass |
| **Require conversation resolution** | ✅ Enabled | Must resolve all PR comments |
| **Require commit signature** | ⚠️ Recommended | Ensures code authenticity |
| **Force pushes** | ❌ Disabled | Prevents destructive changes |
| **Delete branch** | ❌ Disabled | Prevents accidental deletion |
| **Dismiss stale PR approvals** | ✅ Enabled | Re-requires review after changes |
| **Require review from code owners** | ✅ Enabled | CODEOWNERS file must approve |

### 👤 Required Reviewers

- **Minimum approvals**: 1
- **Code owners approval required**: Yes
- **Dismiss stale reviews**: Yes

### 🔨 Required Status Checks

All of the following **must pass**:

- ✅ **validate** - Linting and type checking
- ✅ **build** - Build verification
- ✅ **test** - Unit and integration tests
- ✅ **security** - Security audit
- ✅ **pipeline-status** - Overall pipeline status

---

## 🐛 Develop Branch Rules (`develop`)

### 🔐 Protection Settings

| Setting | Value | Purpose |
|---------|-------|----------|
| **Require pull request reviews** | 1 approval | Ensures peer review |
| **Require status checks** | ✅ Enabled | All CI checks must pass |
| **Require branches to be up to date** | ✅ Enabled | Prevents stale merges |
| **Dismiss stale PR approvals** | ✅ Enabled | Re-requires review after changes |
| **Force pushes** | ❌ Disabled | Prevents destructive changes |
| **Delete branch** | ❌ Disabled | Prevents accidental deletion |

### 🔨 Required Status Checks

- ✅ **validate** - Linting and type checking
- ✅ **build** - Build verification
- ✅ **test** - Unit and integration tests
- ✅ **security** - Security audit

---

## 📄 PR Template Requirements

All pull requests **must include**:

### 📋 Description
- Clear description of changes
- Related issue(s) reference (e.g., #123)
- Testing notes

### 🮟 Type of Change
- [ ] 🐋 Bug fix
- [ ] ✨ New feature
- [ ] 📉 Documentation
- [ ] ⚠️ Breaking change

### 🧪 Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed

### 🔍 Verification
- [ ] Code follows project style
- [ ] No new warnings generated
- [ ] Documentation updated
- [ ] Security implications considered

---

## 🔏 CODEOWNERS Configuration

```
# Default owners for entire repository
* @JAAFAR1996

# Client code
/client/ @JAAFAR1996

# Server/API code
/server/ @JAAFAR1996
/api/ @JAAFAR1996

# Database
/migrations/ @JAAFAR1996

# Configuration
/.github/ @JAAFAR1996
package.json @JAAFAR1996
```

---

## 🐐 Enforcement Rules

### 📢 Notifications
- PR author must resolve all requested changes
- Failed status checks will block merge
- Stale reviews require re-approval after changes

### 🔎 Monitoring
- GitHub tracks all branch protection activities
- Admin review logs available in repository settings
- Bypass attempts are logged

---

## 🚀 Setup Instructions

### Step 1: Configure Main Branch

1. Go to **Settings** > **Branches**
2. Click **Add rule** for `main`
3. Apply settings from **Main Branch Rules** section
4. Enable all required status checks
5. Set minimum review count to **1**
6. Enable **Dismiss stale PR approvals**
7. Enable **Require code owner reviews**

### Step 2: Configure Develop Branch

1. Click **Add rule** for `develop`
2. Apply settings from **Develop Branch Rules** section
3. Enable required status checks
4. Set minimum review count to **1**

### Step 3: Create CODEOWNERS File

1. Create `.github/CODEOWNERS` file
2. Copy content from **CODEOWNERS Configuration** section
3. Commit to repository

### Step 4: Configure Rulesets (Optional - GitHub Enterprise)

1. Go to **Settings** > **Rulesets**
2. Create ruleset for enforcement
3. Apply to `main` and `develop` branches
4. Enable all security rules

---

## 🛡️ Security Considerations

### Preventing Common Issues

1. **Force Pushes**: Disabled to prevent overwriting history
2. **Unreviewed Code**: Requires 1+ approvals before merge
3. **Failed Tests**: Status checks prevent merging broken code
4. **Secrets in Code**: TruffleHog scans detect secrets
5. **Dependency Issues**: npm audit checks for vulnerabilities

### Best Practices

- Never bypass branch protection
- Always create PRs for code review
- Keep branches up-to-date with main
- Resolve all conversations before merge
- Add tests for new features
- Document breaking changes

---

## 🛠️ Troubleshooting

### Issue: PR Cannot Be Merged

**Solutions:**
- Ensure all status checks pass (see CI workflow)
- Wait for at least 1 review approval
- Resolve all conversations
- Update branch with latest main changes

### Issue: Stale Review After Changes

**Solutions:**
- Request new review from reviewer
- Re-request approval in PR comments
- Ensure reviewer is notified

### Issue: Code Owner Not Responding

**Solutions:**
- Check if code owner was added to PR
- Verify correct CODEOWNERS file
- Contact code owner directly
- Admin can override if necessary

---

## 🔄 Review Schedule

- **Monthly**: Review protection rules effectiveness
- **Quarterly**: Update rules based on team needs
- **Annually**: Full security audit

---

**Last Updated**: December 14, 2025
**Status**: 🔐 Active
