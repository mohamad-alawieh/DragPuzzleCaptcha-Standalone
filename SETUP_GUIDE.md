# 🚀 Complete Setup Instructions

## Step-by-Step Guide for Git + NPM Setup

### 🔧 **Phase 1: Git Repository Setup**

1. **Open Terminal/Command Prompt** in the `DragPuzzleCaptcha-Standalone` folder

2. **Initialize Git Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Drag Puzzle CAPTCHA v1.0.0"
   ```

3. **Create GitHub Repository:**
   - Go to [GitHub.com](https://github.com)
   - Click "New Repository" (green button)
   - Repository name: `drag-puzzle-captcha`
   - Description: "Beautiful drag-and-drop puzzle CAPTCHA for React"
   - Make it **Public** ✅
   - **Don't** check "Add a README file" (we have one)
   - Click "Create repository"

4. **Connect to GitHub:**
   ```bash
   # Replace 'yourusername' with your actual GitHub username
   git remote add origin https://github.com/yourusername/drag-puzzle-captcha.git
   git branch -M main
   git push -u origin main
   ```

5. **Create Version Tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

### 📦 **Phase 2: NPM Package Setup**

1. **Create NPM Account:**
   - Go to [npmjs.com](https://www.npmjs.com)
   - Click "Sign Up"
   - Choose a username, email, and password
   - Verify your email

2. **Update Package Information:**
   - Edit `package.json` and replace:
     - `"yourusername"` with your actual GitHub username
     - `"Your Name"` with your real name
     - `"your.email@example.com"` with your email

3. **Login to NPM:**
   ```bash
   npm login
   ```
   Enter your NPM username, password, and email when prompted.

4. **Test Package:**
   ```bash
   npm pack
   ```
   This creates a `.tgz` file - check it contains the right files.

5. **Publish to NPM:**
   ```bash
   npm publish
   ```

   **If the name is taken, use a scoped package:**
   ```bash
   # Change package.json name to: "@yourusername/drag-puzzle-captcha"
   npm publish
   ```

### 🔄 **Phase 3: Using in Your 10+ Projects**

#### **Method A: NPM Package (Recommended)**
In each project:
```bash
npm install drag-puzzle-captcha
# or if scoped: npm install @yourusername/drag-puzzle-captcha
```

```jsx
import DragPuzzleCaptcha from 'drag-puzzle-captcha';
import 'drag-puzzle-captcha/DragPuzzleCaptcha.css';
```

#### **Method B: Git Submodule**
In each project:
```bash
git submodule add https://github.com/yourusername/drag-puzzle-captcha.git src/components/DragPuzzleCaptcha
```

```jsx
import DragPuzzleCaptcha from './components/DragPuzzleCaptcha';
```

### 🔧 **Phase 4: Future Updates**

When you improve the component:

1. **Make changes** to the code
2. **Update version:**
   ```bash
   git add .
   git commit -m "feat: improved puzzle generation"
   npm version patch  # 1.0.0 -> 1.0.1
   git push origin main
   git push origin --tags
   npm publish
   ```

3. **Update in projects:**
   ```bash
   npm update drag-puzzle-captcha
   ```

### 📋 **Quick Checklist**

- [ ] Git repository created and pushed to GitHub
- [ ] NPM account created and verified
- [ ] Package published to NPM
- [ ] Tested installation in one project
- [ ] Ready to use in all 10+ projects!

### 🆘 **Troubleshooting**

**Package name taken?**
- Use scoped package: `@yourusername/drag-puzzle-captcha`

**NPM login issues?**
- Make sure email is verified
- Try `npm logout` then `npm login` again

**Git push issues?**
- Make sure repository is public
- Check username/password are correct

### 🎉 **You're All Set!**

You now have:
- ✅ A professional Git repository
- ✅ A published NPM package
- ✅ Easy way to use in 10+ projects
- ✅ Version control for updates
- ✅ Automated publishing workflow

**Next:** Start integrating into your projects using the examples in `examples.jsx`!
