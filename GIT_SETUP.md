# Drag Puzzle CAPTCHA - Git Setup Guide

## 🚀 Setting Up Git Repository for Multiple Projects

### Step 1: Initialize Git Repository
```bash
cd DragPuzzleCaptcha-Standalone
git init
git add .
git commit -m "Initial commit: Drag Puzzle CAPTCHA component v1.0.0"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name: `drag-puzzle-captcha`
4. Description: "Beautiful drag-and-drop puzzle CAPTCHA component for React"
5. Make it **Public** (for NPM publishing)
6. Don't initialize with README (we already have one)

### Step 3: Connect Local to Remote
```bash
# Replace 'yourusername' with your actual GitHub username
git remote add origin https://github.com/yourusername/drag-puzzle-captcha.git
git branch -M main
git push -u origin main
```

### Step 4: Create Release Tags
```bash
# Tag the first version
git tag v1.0.0
git push origin v1.0.0
```

## 📦 Using in Multiple Projects

### Method 1: Git Submodule (Recommended)
In each of your 10+ projects:

```bash
# Add as submodule
git submodule add https://github.com/yourusername/drag-puzzle-captcha.git src/components/DragPuzzleCaptcha

# Update package.json to include the path
# Then import normally:
# import DragPuzzleCaptcha from './components/DragPuzzleCaptcha'
```

### Method 2: Direct Clone
```bash
# In each project's components folder
cd src/components
git clone https://github.com/yourusername/drag-puzzle-captcha.git DragPuzzleCaptcha
```

### Method 3: NPM Package (see NPM_SETUP.md)

## 🔄 Updating Across Projects

When you make improvements:

```bash
# In the main repository
git add .
git commit -m "feat: improve puzzle generation algorithm"
git tag v1.0.1
git push origin main
git push origin v1.0.1

# In each project using submodules
git submodule update --remote src/components/DragPuzzleCaptcha
```

## 🌟 Benefits of This Approach

- ✅ **Single source of truth**: Update once, use everywhere
- ✅ **Version control**: Track changes and rollback if needed
- ✅ **Collaboration**: Team members can contribute improvements
- ✅ **Easy updates**: Pull latest changes to all projects
- ✅ **Professional workflow**: Industry-standard approach

## 📝 Next Steps

1. Set up the repository following the steps above
2. Test in one project first
3. Add as submodule to other projects
4. Consider publishing to NPM for even easier distribution
