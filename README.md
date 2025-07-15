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

## 📦 Installation

```bash
npm install drag-puzzle-captcha
```

## 🚀 Quick Start

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
      <DragPuzzleCaptcha onVerification={handleVerification} />
      {isVerified && <p>✅ Verification successful!</p>}
    </div>
  );
}

export default App;
```

## 📚 API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onVerification` | `(success: boolean) => void` | - | Callback function called when verification completes |
| `width` | `number` | `300` | Width of the captcha component |
| `height` | `number` | `200` | Height of the captcha component |

### Events

- `onVerification(success)`: Called when the user completes the puzzle
  - `success`: `true` if verification was successful, `false` otherwise

## 🎨 Styling

The component comes with default styles, but you can customize the appearance by overriding the CSS classes:

```css
.drag-puzzle-container {
  /* Your custom styles */
}

.puzzle-piece {
  /* Customize the draggable piece */
}

.slider-track {
  /* Customize the slider track */
}
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/mhamad-alawieh/drag-puzzle-captcha/issues) on GitHub.