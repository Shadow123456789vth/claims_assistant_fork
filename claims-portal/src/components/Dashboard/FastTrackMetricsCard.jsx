/**
 * FastTrack Metrics Card Component
 * Displays FastTrack-specific performance metrics
 */

import { DxcFlex, DxcContainer, DxcTypography } from '@dxc-technology/halstack-react';
import { RoutingType, ClaimStatus } from '../../types/claim.types';

const FastTrackMetricsCard = ({ claims }) => {
  // Calculate FastTrack metrics
  const fastTrackMetrics = (() => {
    if (!claims || claims.length === 0) {
      return {
        count: 0,
        percentage: 0,
        avgDaysToClose: 0
      };
    }

    const fastTrackClaims = claims.filter(c => c.routing?.type === RoutingType.FASTTRACK || c.routing?.type === 'FASTTRACK');
    const closedFastTrackClaims = fastTrackClaims.filter(c => c.status === ClaimStatus.CLOSED || c.status === ClaimStatus.APPROVED);

    // Calculate average days to close
    let totalDays = 0;
    closedFastTrackClaims.forEach(claim => {
      if (claim.createdAt && claim.closedAt) {
        const created = new Date(claim.createdAt);
        const closed = new Date(claim.closedAt);
        const days = Math.floor((closed - created) / (1000 * 60 * 60 * 24));
        totalDays += days;
      }
    });

    const avgDaysToClose = closedFastTrackClaims.length > 0
      ? Math.round(totalDays / closedFastTrackClaims.length)
      : 0;

    const percentage = claims.length > 0
      ? Math.round((fastTrackClaims.length / claims.length) * 100)
      : 0;

    return {
      count: fastTrackClaims.length,
      percentage,
      avgDaysToClose
    };
  })();

  return (
    <DxcContainer
      padding="12px"
      style={{
        backgroundColor: 'var(--color-bg-info-lightest)',
        borderRadius: 'var(--border-radius-m)',
        boxShadow: 'var(--shadow-mid-02)'
      }}
    >
      <DxcFlex direction="column" gap="8px">
        {/* Card Title */}
        <DxcFlex gap="6px" alignItems="center">
          <span className="material-icons" style={{ color: '#000000', fontSize: '16px' }}>
            flash_on
          </span>
          <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
            STP Performance
          </DxcTypography>
        </DxcFlex>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px'
        }}>
          {/* FastTrack Claims Count */}
          <DxcContainer
            padding="10px"
            style={{ backgroundColor: 'var(--color-bg-info-lighter)' }}
          >
            <DxcFlex direction="column" gap="4px" alignItems="center">
              <DxcTypography fontSize="10px" fontWeight="font-weight-semibold">
                STP
              </DxcTypography>
              <DxcTypography fontSize="24px" fontWeight="font-weight-semibold" color="#000000" style={{ lineHeight: '1' }}>
                {fastTrackMetrics.count}
              </DxcTypography>
            </DxcFlex>
          </DxcContainer>

          {/* Avg Days to Close */}
          <DxcContainer
            padding="10px"
            style={{ backgroundColor: 'var(--color-bg-success-lighter)' }}
          >
            <DxcFlex direction="column" gap="4px" alignItems="center">
              <DxcTypography fontSize="10px" fontWeight="font-weight-semibold">
                AVG DAYS
              </DxcTypography>
              <DxcTypography fontSize="24px" fontWeight="font-weight-semibold" color="#000000" style={{ lineHeight: '1' }}>
                {fastTrackMetrics.avgDaysToClose}
              </DxcTypography>
              <DxcTypography fontSize="9px" color="var(--color-fg-neutral-strong)">
                Target: ≤10
              </DxcTypography>
            </DxcFlex>
          </DxcContainer>

          {/* Target Achievement */}
          <DxcContainer
            padding="10px"
            style={{
              backgroundColor: fastTrackMetrics.percentage >= 40
                ? 'var(--color-bg-success-lighter)'
                : 'var(--color-bg-warning-lighter)'
            }}
          >
            <DxcFlex direction="column" gap="4px" alignItems="center">
              <DxcTypography fontSize="10px" fontWeight="font-weight-semibold">
                % OF TOTAL
              </DxcTypography>
              <DxcTypography
                fontSize="24px"
                fontWeight="font-weight-semibold"
                color="#000000"
                style={{ lineHeight: '1' }}
              >
                {fastTrackMetrics.percentage}%
              </DxcTypography>
              <DxcTypography fontSize="9px" color="var(--color-fg-neutral-strong)">
                Target: ≥40%
              </DxcTypography>
            </DxcFlex>
          </DxcContainer>
        </div>
      </DxcFlex>
    </DxcContainer>
  );
};

export default FastTrackMetricsCard;
