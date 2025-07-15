import React, { useState, useRef } from 'react';
import DragPuzzleCaptcha from './DragPuzzleCaptcha';

// Example: Login Form Integration
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show CAPTCHA if both fields are filled but not verified
    if (email && password && !captchaVerified) {
      setShowCaptcha(true);
      return;
    }

    // Proceed with login
    console.log('Login submitted:', { email, password });
    // Your login logic here
  };

  const handleCaptchaVerify = (verified) => {
    setCaptchaVerified(verified);
    if (verified) {
      setShowCaptcha(false);
      // Optionally auto-submit form after verification
      // handleSubmit();
    }
  };

  const handleCaptchaClose = () => {
    setShowCaptcha(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Login Example</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </div>
        
        {/* Show verification status */}
        {captchaVerified && (
          <div style={{ 
            color: '#4caf50', 
            textAlign: 'center', 
            marginBottom: '1rem',
            fontWeight: '500'
          }}>
            ✓ Security verification completed
          </div>
        )}
        
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: email && password && !captchaVerified ? '#667eea' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {email && password && !captchaVerified ? '🛡️ Verify & Login' : 'Login'}
        </button>
      </form>

      <DragPuzzleCaptcha
        ref={captchaRef}
        onVerify={handleCaptchaVerify}
        showModal={showCaptcha}
        onCloseModal={handleCaptchaClose}
        language="eng" // or "fr"
      />
    </div>
  );
}

// Example: Contact Form Integration
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const isFormComplete = formData.name && formData.email && formData.message;

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isFormComplete && !captchaVerified) {
      setShowCaptcha(true);
      return;
    }
    
    console.log('Contact form submitted:', formData);
    // Your form submission logic here
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Contact Form Example</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Message:</label>
          <textarea
            value={formData.message}
            onChange={handleChange('message')}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              marginTop: '0.25rem',
              minHeight: '100px',
              resize: 'vertical'
            }}
            required
          />
        </div>
        
        {/* Show CAPTCHA button when form is complete but not verified */}
        {isFormComplete && !captchaVerified && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <button 
              type="button" 
              onClick={() => setShowCaptcha(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🛡️ Complete Security Verification
            </button>
          </div>
        )}
        
        {captchaVerified && (
          <div style={{ 
            color: '#4caf50', 
            textAlign: 'center', 
            marginBottom: '1rem',
            fontWeight: '500'
          }}>
            ✓ Security verification completed
          </div>
        )}
        
        <button 
          type="submit"
          disabled={isFormComplete && !captchaVerified}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: (isFormComplete && !captchaVerified) ? '#ccc' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (isFormComplete && !captchaVerified) ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Send Message
        </button>
      </form>

      <DragPuzzleCaptcha
        onVerify={(verified) => {
          setCaptchaVerified(verified);
          if (verified) setShowCaptcha(false);
        }}
        showModal={showCaptcha}
        onCloseModal={() => setShowCaptcha(false)}
        language="eng"
      />
    </div>
  );
}

// Main Demo Component
function App() {
  const [currentExample, setCurrentExample] = useState('login');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ 
        textAlign: 'center', 
        padding: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1>🛡️ Drag Puzzle CAPTCHA Examples</h1>
        <p>Beautiful, modern security verification for React apps</p>
      </header>
      
      <nav style={{ 
        textAlign: 'center', 
        padding: '1rem',
        background: '#f8f9fa'
      }}>
        <button
          onClick={() => setCurrentExample('login')}
          style={{
            margin: '0 0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: currentExample === 'login' ? '#667eea' : '#fff',
            color: currentExample === 'login' ? '#fff' : '#333',
            border: '1px solid #667eea',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login Form
        </button>
        <button
          onClick={() => setCurrentExample('contact')}
          style={{
            margin: '0 0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: currentExample === 'contact' ? '#667eea' : '#fff',
            color: currentExample === 'contact' ? '#fff' : '#333',
            border: '1px solid #667eea',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Contact Form
        </button>
      </nav>
      
      <main>
        {currentExample === 'login' && <LoginForm />}
        {currentExample === 'contact' && <ContactForm />}
      </main>
      
      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem',
        background: '#f8f9fa',
        color: '#666',
        marginTop: '3rem'
      }}>
        <p>Made with ❤️ for better user experiences</p>
      </footer>
    </div>
  );
}

export default App;
