/**
 * Input Validation & Sanitization Utilities
 *
 * Provides validation functions and XSS protection for user inputs
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML/text input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized output safe for display
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: []
  });
};

/**
 * Trim and normalize whitespace in text input
 * @param {string} input - Raw text input
 * @returns {string} - Normalized text
 */
export const normalizeText = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/\s+/g, ' ');
};

/**
 * Validate SSN format (XXX-XX-XXXX)
 * @param {string} ssn - SSN input
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateSSN = (ssn) => {
  if (!ssn) return { isValid: true, error: '' }; // Optional field

  const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
  if (!ssnPattern.test(ssn)) {
    return {
      isValid: false,
      error: 'SSN must be in format XXX-XX-XXXX'
    };
  }

  // Additional validation: check for invalid SSNs
  const invalidSSNs = ['000-00-0000', '123-45-6789', '999-99-9999'];
  if (invalidSSNs.includes(ssn)) {
    return {
      isValid: false,
      error: 'Invalid SSN number'
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate date range
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { isValid: true, error: '' }; // Optional
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format'
    };
  }

  if (start > end) {
    return {
      isValid: false,
      error: 'Start date must be before end date'
    };
  }

  // Check if dates are reasonable (not too far in future/past)
  const now = new Date();
  const hundredYearsAgo = new Date(now.getFullYear() - 100, 0, 1);
  const oneYearFromNow = new Date(now.getFullYear() + 1, 11, 31);

  if (start < hundredYearsAgo || end > oneYearFromNow) {
    return {
      isValid: false,
      error: 'Date must be within reasonable range'
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate email format
 * @param {string} email - Email input
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email) return { isValid: true, error: '' }; // Optional

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate phone number (flexible format)
 * @param {string} phone - Phone number input
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone) return { isValid: true, error: '' }; // Optional

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10 || digitsOnly.length > 11) {
    return {
      isValid: false,
      error: 'Phone number must be 10-11 digits'
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate claim number format
 * @param {string} claimNumber - Claim number input
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateClaimNumber = (claimNumber) => {
  if (!claimNumber) return { isValid: true, error: '' }; // Optional

  // Allow various formats: CLM-000001, PC-2026-001, etc.
  const claimPattern = /^[A-Z]{2,4}-\d{4,}-?\d*$/i;
  if (!claimPattern.test(claimNumber)) {
    return {
      isValid: false,
      error: 'Invalid claim number format'
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate policy number format
 * @param {string} policyNumber - Policy number input
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePolicyNumber = (policyNumber) => {
  if (!policyNumber) return { isValid: true, error: '' }; // Optional

  // Allow alphanumeric with hyphens
  const policyPattern = /^[A-Z0-9-]{3,20}$/i;
  if (!policyPattern.test(policyNumber)) {
    return {
      isValid: false,
      error: 'Invalid policy number format'
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate amount/currency input
 * @param {string|number} amount - Amount input
 * @param {number} min - Minimum allowed value (default: 0)
 * @param {number} max - Maximum allowed value (default: Infinity)
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateAmount = (amount, min = 0, max = Infinity) => {
  if (!amount && amount !== 0) return { isValid: true, error: '' }; // Optional

  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount;

  if (isNaN(numAmount)) {
    return {
      isValid: false,
      error: 'Invalid amount format'
    };
  }

  if (numAmount < min) {
    return {
      isValid: false,
      error: `Amount must be at least $${min.toLocaleString()}`
    };
  }

  if (numAmount > max) {
    return {
      isValid: false,
      error: `Amount cannot exceed $${max.toLocaleString()}`
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate required field
 * @param {any} value - Field value
 * @param {string} fieldName - Name of field for error message
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Batch validate multiple fields
 * @param {Object} validations - Object with field names as keys and validation functions as values
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateFields = (validations) => {
  const errors = {};
  let isValid = true;

  Object.keys(validations).forEach(fieldName => {
    const validation = validations[fieldName];
    if (validation && !validation.isValid) {
      errors[fieldName] = validation.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
