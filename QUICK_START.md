# 🚀 Quick Integration Guide

## Method 1: Copy and Paste (Fastest)

1. **Copy the component files** to your project:
   ```
   src/components/DragPuzzleCaptcha/
   ├── DragPuzzleCaptcha.jsx
   ├── DragPuzzleCaptcha.css
   └── index.js
   ```

2. **Import and use:**
   ```jsx
   import DragPuzzleCaptcha from './components/DragPuzzleCaptcha';
   ```

## Method 2: NPM Package (Coming Soon)

```bash
npm install drag-puzzle-captcha
```

## Method 3: Git Submodule

```bash
git submodule add https://github.com/yourusername/drag-puzzle-captcha.git src/components/DragPuzzleCaptcha
```

---

## 📋 Quick Setup Checklist

- [ ] Copy the three files to your project
- [ ] Import the component
- [ ] Add state management for `showModal` and `captchaVerified`
- [ ] Implement the `onVerify` callback
- [ ] Test the integration

## 🎯 Common Use Cases

### Login Forms
```jsx
// Show CAPTCHA when both email and password are filled
const needsCaptcha = email && password && !captchaVerified;
```

### Contact Forms
```jsx
// Show CAPTCHA when form is complete
const needsCaptcha = formComplete && !captchaVerified;
```

### Registration
```jsx
// Show CAPTCHA at specific step
const needsCaptcha = currentStep === 2 && !captchaVerified;
```

---

**Need help?** Check the full README.md for detailed examples and customization options.
