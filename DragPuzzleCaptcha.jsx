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
    openModal: () => {
      // This will be handled by the parent component
    }
  }));

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (onCloseModal && !isVerified) {
          onCloseModal();
        }
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showModal, isVerified, onCloseModal]);

  // Generate random puzzle images
  const generatePuzzle = () => {
    setIsLoading(true);
    
    // Create a canvas to generate background and puzzle images
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 340;
    canvas.height = 180;
    
    // Generate a more sophisticated background pattern
    const gradient = ctx.createLinearGradient(0, 0, 340, 180);
    const hue1 = Math.random() * 360;
    const hue2 = (hue1 + 60 + Math.random() * 60) % 360;
    const hue3 = (hue1 + 120 + Math.random() * 60) % 360;
    
    gradient.addColorStop(0, `hsl(${hue1}, 65%, 55%)`);
    gradient.addColorStop(0.5, `hsl(${hue2}, 70%, 50%)`);
    gradient.addColorStop(1, `hsl(${hue3}, 65%, 60%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 340, 180);
    
    // Add geometric patterns for visual complexity
    ctx.globalCompositeOperation = 'multiply';
    
    // Add diagonal stripes
    for (let i = 0; i < 15; i++) {
      ctx.strokeStyle = `hsla(${Math.random() * 360}, 60%, 70%, 0.1)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(i * 30 - 100, 0);
      ctx.lineTo(i * 30 + 100, 180);
      ctx.stroke();
    }
    
    ctx.globalCompositeOperation = 'source-over';
    
    // Add some random geometric shapes
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, 0.2)`;
      ctx.beginPath();
      
      if (Math.random() > 0.5) {
        // Circles
        ctx.arc(Math.random() * 340, Math.random() * 180, Math.random() * 40 + 15, 0, Math.PI * 2);
      } else {
        // Rectangles
        const x = Math.random() * 300;
        const y = Math.random() * 140;
        const w = Math.random() * 60 + 20;
        const h = Math.random() * 60 + 20;
        ctx.rect(x, y, w, h);
      }
      ctx.fill();
    }
    
    // Add subtle noise texture
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, 0.05)`;
      ctx.fillRect(Math.random() * 340, Math.random() * 180, 1, 1);
    }
    
    const backgroundImageUrl = canvas.toDataURL();
    setBackgroundImage(backgroundImageUrl);
    
    // Generate puzzle piece position (adjusted for new dimensions)
    const newTargetPosition = Math.random() * (340 - 70) + 35; // 70px puzzle width, 35px margin
    setTargetPosition(newTargetPosition);
    
    // Create puzzle piece image with more sophisticated design
    const puzzleCanvas = document.createElement('canvas');
    const puzzleCtx = puzzleCanvas.getContext('2d');
    puzzleCanvas.width = 70;
    puzzleCanvas.height = 70;
    
    // Create puzzle piece with more realistic shape
    const puzzleGradient = puzzleCtx.createRadialGradient(35, 35, 10, 35, 35, 35);
    puzzleGradient.addColorStop(0, '#4a5568');
    puzzleGradient.addColorStop(0.7, '#2d3748');
    puzzleGradient.addColorStop(1, '#1a202c');
    
    puzzleCtx.fillStyle = puzzleGradient;
    puzzleCtx.fillRect(0, 0, 70, 70);
    
    // Add puzzle piece connector
    puzzleCtx.fillStyle = '#e2e8f0';
    puzzleCtx.beginPath();
    puzzleCtx.arc(35, 35, 25, 0, Math.PI * 2);
    puzzleCtx.fill();
    
    // Add inner detail
    puzzleCtx.fillStyle = '#cbd5e0';
    puzzleCtx.beginPath();
    puzzleCtx.arc(35, 35, 15, 0, Math.PI * 2);
    puzzleCtx.fill();
    
    // Add center dot
    puzzleCtx.fillStyle = '#4a5568';
    puzzleCtx.beginPath();
    puzzleCtx.arc(35, 35, 8, 0, Math.PI * 2);
    puzzleCtx.fill();
    
    // Add highlight
    puzzleCtx.fillStyle = '#f7fafc';
    puzzleCtx.beginPath();
    puzzleCtx.arc(30, 30, 4, 0, Math.PI * 2);
    puzzleCtx.fill();
    
    const puzzleImageUrl = puzzleCanvas.toDataURL();
    setPuzzleImage(puzzleImageUrl);
    
    setIsLoading(false);
  };

  useEffect(() => {
    generatePuzzle();
  }, []);

  const resetPuzzle = () => {
    setIsVerified(false);
    setSliderPosition(0);
    setPuzzlePosition(0);
    setAttempts(0);
    generatePuzzle();
  };

  const handleMouseDown = (e) => {
    if (isVerified) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isVerified) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(e.clientX - rect.left - 22, 318)); // 22px for half slider width, 318px max (340 - 22)
    
    setSliderPosition(newPosition);
    setPuzzlePosition(newPosition);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Check if puzzle is in correct position (within 15px tolerance for larger piece)
    const tolerance = 15;
    const isCorrect = Math.abs(puzzlePosition - targetPosition) < tolerance;
    
    if (isCorrect) {
      setIsVerified(true);
      
      // Add success animation to modal
      if (modalRef.current) {
        modalRef.current.classList.add('success-animation');
        setTimeout(() => {
          modalRef.current?.classList.remove('success-animation');
        }, 800);
      }
      
      if (onVerify) {
        onVerify(true);
      }
      // Close modal after successful verification
      setTimeout(() => {
        if (onCloseModal) {
          onCloseModal();
        }
      }, 2000); // Increased delay to show success state
    } else {
      setAttempts(prev => prev + 1);
      // Reset position after failed attempt
      setTimeout(() => {
        setSliderPosition(0);
        setPuzzlePosition(0);
      }, 500);
      
      // Generate new puzzle after 3 failed attempts
      if (attempts >= 2) {
        setTimeout(() => {
          resetPuzzle();
        }, 1000);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, puzzlePosition, targetPosition, attempts]);

  if (!showModal) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="drag-puzzle-modal-overlay">
        <div className="drag-puzzle-modal" ref={modalRef}>
          <div className="drag-puzzle-modal-header">
            <h3>{getText('title')}</h3>
            <button 
              className="drag-puzzle-close-btn"
              onClick={onCloseModal}
            >
              ×
            </button>
          </div>
          <div className="drag-puzzle-container">
            <div className="drag-puzzle-loading">
              {getText('loading')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="drag-puzzle-modal-overlay">
      <div className="drag-puzzle-modal" ref={modalRef}>
        <div className="drag-puzzle-modal-header">
          <h3>{getText('title')}</h3>
          <button 
            className="drag-puzzle-close-btn"
            onClick={onCloseModal}
            disabled={isVerified}
          >
            ×
          </button>
        </div>
        
        <div className="drag-puzzle-container">
          <div className="drag-puzzle-title">
            {getText('instruction')}
          </div>
          
          <div className="drag-puzzle-game" ref={containerRef}>
            {/* Background image with missing piece */}
            <div 
              className="drag-puzzle-background"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              {/* Missing piece hole */}
              <div 
                className="drag-puzzle-hole"
                style={{ 
                  left: `${targetPosition}px`,
                  top: '55px' // Center vertically in the larger background
                }}
              />
              
              {/* Floating puzzle piece */}
              <div 
                className={`drag-puzzle-piece ${isVerified ? 'verified' : ''}`}
                ref={puzzleRef}
                style={{ 
                  left: `${puzzlePosition}px`,
                  top: '55px',
                  backgroundImage: `url(${puzzleImage})`
                }}
              />
            </div>
            
            {/* Slider track */}
            <div className="drag-puzzle-slider">
              <div className="drag-puzzle-track">
                <div 
                  className={`drag-puzzle-slider-button ${isDragging ? 'dragging' : ''} ${isVerified ? 'verified' : ''}`}
                  style={{ left: `${sliderPosition}px` }}
                  onMouseDown={handleMouseDown}
                >
                  <span className="drag-puzzle-slider-icon">
                    {isVerified ? '✓' : '⇄'}
                  </span>
                </div>
              </div>
              
              <div className="drag-puzzle-text">
                {isVerified 
                  ? getText('successText')
                  : getText('dragText')
                }
              </div>
            </div>
          </div>
          
          {attempts > 0 && !isVerified && (
            <div className="drag-puzzle-attempts">
              {getText('attempts')}: {attempts}/3
            </div>
          )}
          
          <div className="drag-puzzle-actions">
            <button 
              onClick={resetPuzzle}
              className="drag-puzzle-refresh"
              disabled={isVerified}
            >
              🔄 {getText('newPuzzle')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

DragPuzzleCaptcha.displayName = 'DragPuzzleCaptcha';

export default DragPuzzleCaptcha;
