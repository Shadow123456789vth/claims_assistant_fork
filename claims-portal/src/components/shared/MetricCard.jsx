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
    small: '24px',
    medium: '32px',
    large: '40px'
  };

  const labelFontSizes = {
    small: '10px',
    medium: '12px',
    large: '14px'
  };

  const subtextFontSizes = {
    small: '10px',
    medium: '12px',
    large: '14px'
  };

  return (
    <div
      style={{
        padding: 'var(--spacing-padding-m)',
        backgroundColor: backgroundColors[variant] || backgroundColors.info
      }}
    >
      <DxcFlex direction="column" gap="var(--spacing-gap-xs)" alignItems="center">
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
