/**
 * useAriaLiveRegion Hook
 * Announces dynamic content changes to screen readers
 *
 * Usage:
 * const [announce, LiveRegion] = useAriaLiveRegion();
 *
 * // In component:
 * <div>
 *   <LiveRegion />
 *   <button onClick={() => announce('Item added to cart')}>Add</button>
 * </div>
 */

import { useState, useCallback } from 'react';
import ScreenReaderOnly from '../components/shared/ScreenReaderOnly';

const useAriaLiveRegion = (politeness = 'polite') => {
  const [message, setMessage] = useState('');

  const announce = useCallback((text) => {
    // Clear message first to ensure re-announcement of same message
    setMessage('');
    setTimeout(() => setMessage(text), 100);
  }, []);

  const LiveRegion = useCallback(() => {
    if (!message) return null;

    return (
      <ScreenReaderOnly as="div">
        <div role="status" aria-live={politeness} aria-atomic="true">
          {message}
        </div>
      </ScreenReaderOnly>
    );
  }, [message, politeness]);

  return [announce, LiveRegion];
};

export default useAriaLiveRegion;
