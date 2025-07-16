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
  const [targetY, setTargetY] = useState(0);
  const [puzzleY, setPuzzleY] = useState(0);
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

  // Get responsive dimensions based on screen size
  const getResponsiveDimensions = () => {
    const viewportWidth = window.innerWidth;
    const padding = 64; // 4rem in pixels
    
    let backgroundWidth, backgroundHeight, pieceSize, sliderMax;
    
    if (viewportWidth <= 360) {
      // Very small mobile
      backgroundWidth = Math.min(260, viewportWidth - 32);
      backgroundHeight = Math.round(backgroundWidth * 0.527);
      pieceSize = Math.min(50, backgroundWidth * 0.192);
      sliderMax = backgroundWidth - pieceSize;
    } else if (viewportWidth <= 480) {
      // Small mobile
      backgroundWidth = Math.min(280, viewportWidth - 40);
      backgroundHeight = Math.round(backgroundWidth * 0.529);
      pieceSize = Math.min(55, backgroundWidth * 0.196);
      sliderMax = backgroundWidth - pieceSize;
    } else if (viewportWidth <= 768) {
      // Tablets
      backgroundWidth = Math.min(300, viewportWidth - 48);
      backgroundHeight = Math.round(backgroundWidth * 0.527);
      pieceSize = Math.min(60, backgroundWidth * 0.2);
      sliderMax = backgroundWidth - pieceSize;
    } else {
      // Desktop and large screens
      backgroundWidth = Math.min(340, viewportWidth - padding);
      backgroundHeight = 180;
      pieceSize = 70;
      sliderMax = 290; // 340 - 50 (slider button width)
    }
    
    return {
      backgroundWidth,
      backgroundHeight,
      pieceSize,
      sliderMax
    };
  };

  // Generate random background with canvas
  const generateRandomBackground = (width = 340, height = 180) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
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
    console.log('Resetting puzzle');
    setIsVerified(false);
    setIsDragging(false);
    setSliderPosition(0);
    setPuzzlePosition(0);
    setAttempts(0);
    setTargetY(0);
    setPuzzleY(0);
    generatePuzzle();
  };

  // Generate puzzle
  const generatePuzzle = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const dimensions = getResponsiveDimensions();
      const { backgroundWidth, backgroundHeight, pieceSize, sliderMax } = dimensions;
      
      const bgImage = generateRandomBackground(backgroundWidth, backgroundHeight);
      setBackgroundImage(bgImage);
      
      // Calculate positions based on responsive dimensions
      const targetX = Math.random() * (backgroundWidth - pieceSize);
      const sharedY = Math.random() * (backgroundHeight - pieceSize);
      
      setTargetPosition(targetX);
      setTargetY(sharedY);
      setPuzzleY(sharedY); // Same Y position as the hole
      
      // Create puzzle piece from background
      const canvas = document.createElement('canvas');
      canvas.width = pieceSize;
      canvas.height = pieceSize;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, -targetX, -sharedY, backgroundWidth, backgroundHeight);
        
        const pieceImage = canvas.toDataURL();
        setPuzzleImage(pieceImage);
        setIsLoading(false);
      };
      img.src = bgImage;
    }, 500);
  };

  // Handle slider drag start
  const handleSliderStart = (e) => {
    if (isVerified) return;
    setIsDragging(true);
    
    const dimensions = getResponsiveDimensions();
    const { sliderMax } = dimensions;
    
    const startX = e.type === 'mousedown' ? e.clientX : 
                   e.touches && e.touches[0] ? e.touches[0].clientX : 
                   e.clientX; // Fallback to clientX if touches not available
    const startPosition = sliderPosition;

    const handleMove = (moveEvent) => {
      const currentX = moveEvent.type === 'mousemove' ? moveEvent.clientX : 
                      moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientX : 
                      moveEvent.clientX; // Fallback to clientX if touches not available
      const deltaX = currentX - startX;
      const newPosition = Math.max(0, Math.min(startPosition + deltaX, sliderMax));
      
      setSliderPosition(newPosition);
      setPuzzlePosition(newPosition);
    };

    const handleEnd = (endEvent) => {
      setIsDragging(false);
      // Get the final position directly from the last calculation
      const currentX = endEvent.type === 'mouseup' ? endEvent.clientX : 
                      endEvent.changedTouches && endEvent.changedTouches[0] ? endEvent.changedTouches[0].clientX : 
                      endEvent.clientX; // Fallback to clientX if touches not available
      const deltaX = currentX - startX;
      const finalPosition = Math.max(0, Math.min(startPosition + deltaX, sliderMax));
      
      // Pass the final position directly to verification
      checkVerification(finalPosition);
      
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
  const checkVerification = (currentPosition = puzzlePosition) => {
    const tolerance = 20; // Increased tolerance for better user experience
    const distance = Math.abs(currentPosition - targetPosition);
    const success = distance < tolerance;
    
    console.log('Verification check:', {
      currentPosition,
      puzzlePosition, // Also log state position for comparison
      targetPosition, 
      distance,
      tolerance,
      success
    });
    
    if (success) {
      setIsVerified(true);
      // Update positions to the current position to ensure consistency
      setSliderPosition(currentPosition);
      setPuzzlePosition(currentPosition);
      
      // Add success animation to modal
      if (modalRef.current) {
        modalRef.current.classList.add('success-animation');
        setTimeout(() => {
          if (modalRef.current) {
            modalRef.current.classList.remove('success-animation');
          }
        }, 800);
      }
      
      if (onVerify) {
        onVerify(true);
      }
      
      // Close modal after successful verification with a delay to show success state
      setTimeout(() => {
        if (onCloseModal) {
          onCloseModal();
        }
      }, 2000); // 2 second delay to show success message
    } else {
      setAttempts(prev => {
        const newAttempts = prev + 1;
        console.log('Failed attempt:', newAttempts);
        return newAttempts;
      });
      
      // Reset position if failed
      setTimeout(() => {
        setSliderPosition(0);
        setPuzzlePosition(0);
      }, 800); // Increased delay to show feedback
      
      if (onVerify) {
        onVerify(false);
      }
      
      // Generate new puzzle after 3 failed attempts
      if (attempts >= 2) {
        setTimeout(() => {
          resetPuzzle();
        }, 1000);
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

  // Handle window resize - regenerate puzzle for new dimensions
  useEffect(() => {
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        if (!isDragging && !isVerified) {
          generatePuzzle();
        }
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, [isDragging, isVerified]);

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
            top: `${targetY}px`
          }
        }),
        React.createElement('div', {
          className: `drag-puzzle-piece ${isVerified ? 'verified' : ''}`,
          ref: puzzleRef,
          style: {
            backgroundImage: `url(${puzzleImage})`,
            left: `${puzzlePosition}px`,
            top: `${puzzleY}px`
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
      React.createElement(
        'div',
        { className: 'drag-puzzle-attempts-container' },
        attempts > 0 && !isVerified && React.createElement(
          'div',
          { className: 'drag-puzzle-attempts' },
          `${getText('attempts')}: ${attempts}/3`
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
    )
  );

  // Don't render anything if modal should not be shown
  if (!showModal) {
    return null;
  }

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
});

DragPuzzleCaptcha.displayName = 'DragPuzzleCaptcha';

export default DragPuzzleCaptcha;
