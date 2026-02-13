/**
 * MetricCard Component
 *
 * Reusable metric display card with colored background
 * Used throughout the app for displaying key metrics and statistics
 */

import { DxcFlex, DxcTypography } from '@dxc-technology/halstack-react';

/**
 * @param {Object} props
 * @param {string} props.label - Metric label (displayed in small caps)
 * @param {string|number} props.value - Metric value (large, prominent)
 * @param {string} [props.subtext] - Optional text below the value
 * @param {'info'|'success'|'warning'|'error'|'neutral'} [props.variant='info'] - Color variant
 * @param {string} [props.valueColor] - Custom color for the value (overrides default)
 * @param {string} [props.subtextColor] - Custom color for the subtext
 * @param {'small'|'medium'|'large'} [props.size='medium'] - Size of the card
 */
const MetricCard = ({
  label,
  value,
  subtext,
  variant = 'info',
  valueColor,
  subtextColor,
  size = 'medium'
}) => {
  // Map variant to background color
  const backgroundColors = {
    info: 'var(--color-bg-info-lighter)',
    success: 'var(--color-bg-success-lighter)',
    warning: 'var(--color-bg-warning-lighter)',
    error: 'var(--color-bg-error-lighter)',
    neutral: 'var(--color-bg-neutral-lighter)'
  };

  // Map size to font sizes
  const valueFontSizes = {
    small: '20px',
    medium: '24px',
    large: '32px'
  };

  const labelFontSizes = {
    small: '9px',
    medium: '10px',
    large: '11px'
  };

  const subtextFontSizes = {
    small: '9px',
    medium: '10px',
    large: '11px'
  };

  return (
    <div
      style={{
        padding: '10px',
        backgroundColor: backgroundColors[variant] || backgroundColors.info
      }}
    >
      <DxcFlex direction="column" gap="4px" alignItems="center">
        {/* Label */}
        <DxcTypography
          fontSize={labelFontSizes[size]}
          fontWeight="font-weight-semibold"
          color="var(--color-fg-neutral-stronger)"
          textAlign="center"
        >
          {label}
        </DxcTypography>

        {/* Value */}
        <DxcTypography
          fontSize={valueFontSizes[size]}
          fontWeight="font-weight-semibold"
          color={valueColor || '#000000'}
          textAlign="center"
        >
          {value}
        </DxcTypography>

        {/* Optional Subtext */}
        {subtext && (
          <DxcTypography
            fontSize={subtextFontSizes[size]}
            fontWeight="font-weight-regular"
            color={subtextColor || '#000000'}
            textAlign="center"
          >
            {subtext}
          </DxcTypography>
        )}
      </DxcFlex>
    </div>
  );
};

export default MetricCard;
