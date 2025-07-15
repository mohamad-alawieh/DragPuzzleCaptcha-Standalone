import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './DragPuzzleCaptcha.css';

const DragPuzzleCaptcha = forwardRef(({ onVerify, language = "eng", showModal = false, onCloseModal }, ref) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [puzzlePosition, setPuzzlePosition] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [puzzleImage, setPuzzleImage] = useState('');
  const [targetPosition, setTargetPosition] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const puzzleRef = useRef(null);
  const modalRef = useRef(null);

  // Text localization
  const getText = (key) => {
    const texts = {
      eng: {
        title: "Security Verification",
        instruction: "Drag the piece to complete the puzzle",
        dragText: "Drag to fit the piece",
        successText: "Verified successfully!",
        newPuzzle: "New puzzle",
        attempts: "Attempts",
        loading: "Loading puzzle..."
      },
      fr: {
        title: "Vérification de sécurité",
        instruction: "Glissez la pièce pour compléter le puzzle",
        dragText: "Glissez pour ajuster la pièce",
        successText: "Vérifié avec succès!",
        newPuzzle: "Nouveau puzzle",
        attempts: "Tentatives",
        loading: "Chargement du puzzle..."
      }
    };
    
    return texts[language]?.[key] || texts.eng[key];
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      resetPuzzle();
    },
    isVerified: () => isVerified,
  }));

  // Generate random background with canvas
  const generateRandomBackground = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 340;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const colors = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'],
      ['#a8edea', '#fed6e3'],
      ['#ff9a9e', '#fecfef'],
      ['#ffecd2', '#fcb69f']
    ];
    
    const colorPair = colors[Math.floor(Math.random() * colors.length)];
    gradient.addColorStop(0, colorPair[0]);
    gradient.addColorStop(1, colorPair[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some geometric patterns
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 50 + 10,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    return canvas.toDataURL();
  };

  // Reset puzzle
  const resetPuzzle = () => {
    setIsVerified(false);
    setIsDragging(false);
    setSliderPosition(0);
    setPuzzlePosition(0);
    setAttempts(0);
    generatePuzzle();
  };

  // Generate puzzle
  const generatePuzzle = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const bgImage = generateRandomBackground();
      setBackgroundImage(bgImage);
      
      // Create puzzle piece from background
      const canvas = document.createElement('canvas');
      canvas.width = 70;
      canvas.height = 70;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        const targetX = Math.random() * (340 - 70);
        const targetY = Math.random() * (180 - 70);
        
        ctx.drawImage(img, -targetX, -targetY, 340, 180);
        
        const pieceImage = canvas.toDataURL();
        setPuzzleImage(pieceImage);
        setTargetPosition(targetX);
        setIsLoading(false);
      };
      img.src = bgImage;
    }, 500);
  };

  // Handle slider drag start
  const handleSliderStart = (e) => {
    if (isVerified) return;
    setIsDragging(true);
    
    const startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const startPosition = sliderPosition;

    const handleMove = (e) => {
      const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
      const deltaX = currentX - startX;
      const newPosition = Math.max(0, Math.min(startPosition + deltaX, 290));
      
      setSliderPosition(newPosition);
      setPuzzlePosition(newPosition);
    };

    const handleEnd = () => {
      setIsDragging(false);
      checkVerification();
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  };

  // Check verification
  const checkVerification = () => {
    const tolerance = 15;
    const success = Math.abs(puzzlePosition - targetPosition) < tolerance;
    
    if (success) {
      setIsVerified(true);
      if (onVerify) {
        onVerify(true);
      }
    } else {
      setAttempts(prev => prev + 1);
      // Reset position if failed
      setTimeout(() => {
        setSliderPosition(0);
        setPuzzlePosition(0);
      }, 500);
      
      if (onVerify) {
        onVerify(false);
      }
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    if (onCloseModal && !isDragging) {
      onCloseModal();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isDragging) {
        handleCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showModal, isDragging]);

  // Generate initial puzzle
  useEffect(() => {
    generatePuzzle();
  }, []);

  // Prevent touch scrolling during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isDragging]);

  const content = React.createElement(
    React.Fragment,
    null,
    isLoading ? React.createElement(
      'div',
      { className: 'drag-puzzle-loading' },
      getText('loading')
    ) : React.createElement(
      'div',
      { className: 'drag-puzzle-game' },
      React.createElement(
        'div',
        {
          className: 'drag-puzzle-background',
          style: { backgroundImage: `url(${backgroundImage})` }
        },
        React.createElement('div', {
          className: 'drag-puzzle-hole',
          style: {
            left: `${targetPosition}px`,
            top: `${Math.random() * (180 - 70)}px`
          }
        }),
        React.createElement('div', {
          className: `drag-puzzle-piece ${isVerified ? 'verified' : ''}`,
          ref: puzzleRef,
          style: {
            backgroundImage: `url(${puzzleImage})`,
            left: `${puzzlePosition}px`,
            top: `${Math.random() * (180 - 70)}px`
          }
        })
      ),
      React.createElement(
        'div',
        { className: 'drag-puzzle-slider' },
        React.createElement(
          'div',
          { className: 'drag-puzzle-track', ref: sliderRef },
          React.createElement(
            'div',
            {
              className: `drag-puzzle-slider-button ${isDragging ? 'dragging' : ''} ${isVerified ? 'verified' : ''}`,
              style: { left: `${sliderPosition}px` },
              onMouseDown: handleSliderStart,
              onTouchStart: handleSliderStart
            },
            React.createElement(
              'span',
              { className: 'drag-puzzle-slider-icon' },
              isVerified ? '✓' : '→'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'drag-puzzle-text' },
          isVerified ? getText('successText') : getText('dragText')
        )
      ),
      attempts > 0 && !isVerified && React.createElement(
        'div',
        { className: 'drag-puzzle-attempts' },
        `${getText('attempts')}: ${attempts}`
      ),
      React.createElement(
        'div',
        { className: 'drag-puzzle-actions' },
        React.createElement(
          'button',
          {
            className: 'drag-puzzle-refresh',
            onClick: resetPuzzle,
            disabled: isDragging
          },
          getText('newPuzzle')
        )
      )
    )
  );

  if (showModal) {
    if (isLoading) {
      return React.createElement(
        'div',
        { className: 'drag-puzzle-modal-overlay', onClick: handleBackdropClick },
        React.createElement(
          'div',
          { className: 'drag-puzzle-modal', ref: modalRef },
          React.createElement(
            'div',
            { className: 'drag-puzzle-modal-header' },
            React.createElement('h3', null, getText('title')),
            React.createElement(
              'button',
              {
                className: 'drag-puzzle-close-btn',
                onClick: onCloseModal
              },
              '×'
            )
          ),
          React.createElement(
            'div',
            { className: 'drag-puzzle-container' },
            content
          )
        )
      );
    }

    return React.createElement(
      'div',
      { className: 'drag-puzzle-modal-overlay', onClick: handleBackdropClick },
      React.createElement(
        'div',
        { className: `drag-puzzle-modal ${isVerified ? 'success-animation' : ''}`, ref: modalRef },
        React.createElement(
          'div',
          { className: 'drag-puzzle-modal-header' },
          React.createElement('h3', null, getText('title')),
          React.createElement(
            'button',
            {
              className: 'drag-puzzle-close-btn',
              onClick: onCloseModal,
              disabled: isDragging
            },
            '×'
          )
        ),
        React.createElement(
          'div',
          { className: 'drag-puzzle-container' },
          React.createElement(
            'div',
            { className: 'drag-puzzle-title' },
            getText('instruction')
          ),
          content
        )
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'drag-puzzle-container', ref: containerRef },
    React.createElement(
      'div',
      { className: 'drag-puzzle-title' },
      getText('instruction')
    ),
    content
  );
});

DragPuzzleCaptcha.displayName = 'DragPuzzleCaptcha';

export default DragPuzzleCaptcha;
