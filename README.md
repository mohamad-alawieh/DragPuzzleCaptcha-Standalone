# Drag Puzzle Captcha

A beautiful, modern drag-and-drop puzzle CAPTCHA component for React applications. This component provides an interactive slider puzzle that users must solve to verify they are human.

## ✨ Features

- 🎯 Interactive drag-and-drop puzzle verification
- 🎨 Modern, beautiful UI design
- 📱 Responsive and mobile-friendly
- 🔧 Easy to integrate and customize
- 🚀 Lightweight with no external dependencies
- ♿ Accessible design
- 🎭 Smooth animations and transitions
- 🌍 Multi-language support (English & French)
- 📦 Compatible with Vite, Create React App, and Next.js

## 📦 Installation

```bash
npm install drag-puzzle-captcha
```

## 🚀 Quick Start

### Basic Usage (Create React App / Vite)

```jsx
import React, { useState } from 'react';
import DragPuzzleCaptcha from 'drag-puzzle-captcha';
import 'drag-puzzle-captcha/DragPuzzleCaptcha.css';

function App() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = (success) => {
    setIsVerified(success);
    if (success) {
      console.log('CAPTCHA verified successfully!');
    }
  };

  return (
    <div>
      <h1>My Form</h1>
      <DragPuzzleCaptcha onVerify={handleVerification} />
      {isVerified && <p>✅ Verification successful!</p>}
    </div>
  );
}

export default App;
```

### Vite Projects

For Vite projects, you can import styles in multiple ways:

```jsx
// Method 1: Import CSS directly
import 'drag-puzzle-captcha/DragPuzzleCaptcha.css';

// Method 2: Import as style (alias)
import 'drag-puzzle-captcha/style';

// Method 3: Import in your CSS file
/* In your main CSS file */
@import 'drag-puzzle-captcha/DragPuzzleCaptcha.css';
```

### Next.js Usage

```jsx
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'drag-puzzle-captcha/DragPuzzleCaptcha.css';

// Dynamic import to avoid SSR issues
const DragPuzzleCaptcha = dynamic(
  () => import('drag-puzzle-captcha'),
  { ssr: false }
);

export default function MyPage() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div>
      <h1>Secure Form</h1>
      <DragPuzzleCaptcha onVerify={setIsVerified} />
      {isVerified && <p>✅ Verified!</p>}
    </div>
  );
}
```

### Modal Usage

```jsx
import React, { useState } from 'react';
import DragPuzzleCaptcha from 'drag-puzzle-captcha';
import 'drag-puzzle-captcha/DragPuzzleCaptcha.css';

function App() {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = (success) => {
    setIsVerified(success);
    if (success) {
      setShowCaptcha(false);
    }
  };

  return (
    <div>
      <button onClick={() => setShowCaptcha(true)}>
        Verify Identity
      </button>
      
      {showCaptcha && (
        <DragPuzzleCaptcha 
          showModal={true}
          onVerify={handleVerification}
          onCloseModal={() => setShowCaptcha(false)}
        />
      )}
    </div>
  );
}
```

### TypeScript Usage

```tsx
import React, { useState, useRef } from 'react';
import DragPuzzleCaptcha, { 
  DragPuzzleCaptchaProps, 
  DragPuzzleCaptchaRef 
} from 'drag-puzzle-captcha';
import 'drag-puzzle-captcha/DragPuzzleCaptcha.css';

const MyComponent: React.FC = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const captchaRef = useRef<DragPuzzleCaptchaRef>(null);

  const handleVerification = (success: boolean) => {
    setIsVerified(success);
  };

  const resetCaptcha = () => {
    captchaRef.current?.reset();
  };

  return (
    <div>
      <DragPuzzleCaptcha 
        ref={captchaRef}
        onVerify={handleVerification}
        language="eng"
      />
      <button onClick={resetCaptcha}>Reset</button>
    </div>
  );
};
```

## 📚 API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onVerify` | `(success: boolean) => void` | - | Callback function called when verification completes |
| `language` | `'eng' \| 'fr'` | `'eng'` | Language for component text |
| `showModal` | `boolean` | `false` | Whether to display the component in a modal |
| `onCloseModal` | `() => void` | - | Callback when modal is closed |

### Ref Methods

| Method | Type | Description |
|--------|------|-------------|
| `reset` | `() => void` | Reset the puzzle to initial state |
| `isVerified` | `() => boolean` | Check if puzzle is currently verified |

## 🎨 Styling

The component comes with default styles, but you can customize the appearance:

```css
/* Override default styles */
.drag-puzzle-container {
  --primary-color: #your-color;
  --background-color: #your-bg;
}

.drag-puzzle-piece {
  border-radius: 12px; /* Custom border radius */
}

.drag-puzzle-track {
  background: your-custom-gradient;
}
```

## 🌍 Internationalization

Currently supports:
- English (`'eng'`)
- French (`'fr'`)

```jsx
<DragPuzzleCaptcha language="fr" onVerify={handleVerify} />
```

## ⚡ Performance Tips

1. **Lazy Loading**: Use dynamic imports for better bundle splitting
2. **CSS Optimization**: Import styles only where needed
3. **SSR**: Use `ssr: false` for Next.js to avoid hydration issues

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/mhamad-alawieh/drag-puzzle-captcha/issues) on GitHub.