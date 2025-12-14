# 🤘 Contributing to FIST-LIVE

Thank you for considering contributing to **FIST-LIVE**! This document provides guidelines and instructions for contributing code, documentation, and bug reports.

---

## 💫 Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

---

## ❓ How to Contribute

### 1. Report Bugs

Bug reports are tracked as [GitHub issues](https://github.com/JAAFAR1996/FIST-LIVE/issues).

**Before creating a bug report, check the issue list** as you might find out that you don't need to create one. When creating a bug report, include as many details as possible:

- **Use a clear, descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the observed behavior and what you expected to see instead**
- **Include screenshots or GIFs if possible**
- **Include your environment details** (OS, browser, Node version, etc.)

### 2. Suggest Enhancements

Enhancements are tracked as [GitHub issues](https://github.com/JAAFAR1996/FIST-LIVE/issues).

**Before creating an enhancement suggestion, check the issue list** as you might find out that you don't need to create one. When creating an enhancement suggestion, include:

- **Use a clear, descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### 3. Pull Requests

- Fill in the required PR template
- Follow the code style guidelines
- Ensure all tests pass
- Include appropriate test cases
- Update documentation as needed
- Add yourself to the CONTRIBUTORS list if this is your first contribution

---

## 🛠️ Local Development Setup

### Prerequisites

- **Node.js**: v20.11.0 or later
- **pnpm**: v9.1.0 or later
- **Git**: Latest version

### Setup Steps

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork locally
git clone https://github.com/YOUR-USERNAME/FIST-LIVE.git
cd FIST-LIVE

# 3. Add upstream remote
git remote add upstream https://github.com/JAAFAR1996/FIST-LIVE.git

# 4. Install dependencies
pnpm install

# 5. Create a new branch for your feature
git checkout -b feature/your-feature-name
```

### Running the Project

```bash
# Development mode (Client)
pnpm run dev:client

# Development mode (Server)
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with UI
pnpm run test:ui

# Generate coverage report
pnpm run test:coverage

# Type checking
pnpm run check

# Database operations
pnpm run db:push
pnpm run admin:setup
pnpm run admin:check
```

---

## 📝 Code Style Guide

### TypeScript

- Use **strict mode** in TypeScript
- Use **const/let** instead of **var**
- Use **arrow functions** when appropriate
- Add **type annotations** for function parameters and returns
- Use **interfaces** for object types
- Use **enums** for fixed sets of values

### Naming Conventions

- **Variables/Functions**: `camelCase`
- **Classes/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private members**: Prefix with `_`
- **React components**: `PascalCase`
- **Custom hooks**: Prefix with `use`

### File Organization

```
src/
├── components/
│   └── FeatureName/
│       ├── FeatureName.tsx
│       ├── FeatureName.test.tsx
│       └── FeatureName.module.css
├── hooks/
│   └── useFeature.ts
├── utils/
│   └── helperFunction.ts
├── types/
│   └── index.ts
└── index.ts
```

### Comments

- Use clear, descriptive comments
- Explain **why**, not **what**
- Keep comments up-to-date with code
- Use JSDoc for public APIs

```typescript
/**
 * Calculate total price including tax
 * @param subtotal - The subtotal amount
 * @param taxRate - The tax rate (0-1)
 * @returns The total price with tax
 */
function calculateTotal(subtotal: number, taxRate: number): number {
  return subtotal * (1 + taxRate);
}
```

---

## 🧪 Testing

### Test Requirements

- Add tests for new features
- Update tests when modifying functionality
- Aim for **>80% code coverage**
- Use **descriptive test names**
- Test both success and error cases

### Testing Example

```typescript
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './math.ts';

describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    const result = calculateTotal(100, 0.1);
    expect(result).toBe(110);
  });

  it('should handle zero tax rate', () => {
    const result = calculateTotal(100, 0);
    expect(result).toBe(100);
  });

  it('should throw error for negative subtotal', () => {
    expect(() => calculateTotal(-100, 0.1)).toThrow();
  });
});
```

---

## 🚀 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or updating tests
- **chore**: Changes to build process, dependencies, etc.

### Example

```
feat(auth): add JWT token validation

Implement JWT token validation for API endpoints.
Adds middleware to verify token signature and expiration.

Closes #123
```

---

## 📄 Pull Request Process

1. **Create a branch** from `develop` for new features
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guide

3. **Add/Update tests** for your changes
   ```bash
   pnpm run test
   ```

4. **Check types**
   ```bash
   pnpm run check
   ```

5. **Commit with clear messages**
   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

6. **Keep your branch up-to-date**
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Fill in the PR template completely
   - Ensure all CI checks pass
   - Request review from code owners
   - Address review comments promptly

9. **Merge**
   - PR must have at least 1 approval
   - All CI checks must pass
   - Branch must be up-to-date with target branch

---

## 🔍 Code Review Process

### As a Reviewer

- Review code for correctness, style, and performance
- Ask questions if something is unclear
- Be respectful and constructive
- Approve when satisfied
- Request changes if issues are found

### As an Author

- Respond to all feedback
- Update code based on feedback
- Re-request review after making changes
- Communicate delays or blockers

---

## ✅ Before Submitting a PR

- [ ] Code follows the project style
- [ ] TypeScript type checking passes (`pnpm run check`)
- [ ] All tests pass (`pnpm run test`)
- [ ] No ESLint errors
- [ ] PR description is clear and complete
- [ ] Commits are properly formatted
- [ ] Related issues are referenced
- [ ] Documentation is updated
- [ ] No secrets or sensitive data committed

---

## 📂 Documentation

### When to Update Documentation

- New features should be documented
- API changes require documentation updates
- Breaking changes must be documented
- Configuration changes should be explained

### Documentation Format

- Use clear, concise language
- Include code examples where helpful
- Link to related documentation
- Keep README.md up-to-date

---

## 🤔 Questions?

- Check the [FAQ](docs/FAQ.md)
- Read existing [documentation](docs/)
- Open an [issue](https://github.com/JAAFAR1996/FIST-LIVE/issues) with your question
- Contact the maintainers

---

## 💆 License

By contributing to FIST-LIVE, you agree that your contributions will be licensed under its MIT License.

---

**Thank you for contributing to FIST-LIVE! 🌟**
