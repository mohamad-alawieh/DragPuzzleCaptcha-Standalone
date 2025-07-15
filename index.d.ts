import React from 'react';

export interface DragPuzzleCaptchaProps {
  /**
   * Callback function called when verification is completed
   * @param success - Whether the verification was successful
   */
  onVerify?: (success: boolean) => void;
  
  /**
   * Language for the component text
   * @default "eng"
   */
  language?: 'eng' | 'fr';
  
  /**
   * Whether to show the component in a modal
   * @default false
   */
  showModal?: boolean;
  
  /**
   * Callback function called when modal is closed
   */
  onCloseModal?: () => void;
}

export interface DragPuzzleCaptchaRef {
  /**
   * Reset the puzzle to initial state
   */
  reset: () => void;
  
  /**
   * Check if the puzzle is currently verified
   */
  isVerified: () => boolean;
}

declare const DragPuzzleCaptcha: React.ForwardRefExoticComponent<
  DragPuzzleCaptchaProps & React.RefAttributes<DragPuzzleCaptchaRef>
>;

export default DragPuzzleCaptcha;
