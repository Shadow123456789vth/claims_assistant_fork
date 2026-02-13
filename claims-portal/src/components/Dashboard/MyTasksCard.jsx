/**
 * My Tasks Card Component
 * Displays task-related metrics: Open Claims, New Today, New This Week
 */

import { DxcFlex, DxcContainer, DxcTypography } from '@dxc-technology/halstack-react';
import { ClaimStatus } from '../../types/claim.types';

const MyTasksCard = ({ claims }) => {
  // Calculate metrics
  const metrics = (() => {
    if (!claims || claims.length === 0) {
      return {
        openClaims: 0,
        newToday: 0,
        newThisWeek: 0
      };
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const openClaims = claims.filter(c =>
      c.status !== ClaimStatus.CLOSED &&
      c.status !== ClaimStatus.DENIED
    ).length;

    const newToday = claims.filter(c =>
      new Date(c.createdAt) >= todayStart
    ).length;

    const newThisWeek = claims.filter(c =>
      new Date(c.createdAt) >= weekStart
    ).length;

    return {
      openClaims,
      newToday,
      newThisWeek
    };
  })();

  return (
    <DxcContainer
      padding="var(--spacing-padding-m)"
      style={{
        backgroundColor: 'var(--color-bg-neutral-lightest)',
        borderRadius: 'var(--border-radius-m)',
        boxShadow: 'var(--shadow-mid-04)',
        height: '240px',
        boxSizing: 'border-box'
      }}
    >
      <DxcFlex direction="column" gap="var(--spacing-gap-m)">
        {/* Card Title */}
        <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
          My Tasks
        </DxcTypography>

        {/* Metrics Row */}
        <DxcFlex gap="var(--spacing-gap-none)" alignItems="center">
          {/* Open Claims */}
          <DxcFlex
            direction="column"
            gap="var(--spacing-gap-s)"
            alignItems="center"
            justifyContent="center"
            grow={1}
            basis="0"
          >
            <DxcTypography
              fontSize="32px"
              fontWeight="font-weight-semibold"
              color="#000000"
              textAlign="center"
            >
              {metrics.openClaims}
            </DxcTypography>
            <DxcTypography
              fontSize="font-scale-03"
              fontWeight="font-weight-semibold"
              color="var(--color-fg-neutral-stronger)"
              textAlign="center"
            >
              Open Claims
            </DxcTypography>
          </DxcFlex>

          {/* Divider */}
          <div style={{ padding: 'var(--spacing-padding-xs)' }}>
            <div style={{
              height: '97px',
              width: '1px',
              backgroundColor: 'var(--color-bg-neutral-light)'
            }} />
          </div>

          {/* New Today */}
          <DxcFlex
            direction="column"
            gap="var(--spacing-gap-s)"
            alignItems="center"
            justifyContent="center"
            grow={1}
            basis="0"
          >
            <DxcTypography
              fontSize="32px"
              fontWeight="font-weight-semibold"
              color="#000000"
              textAlign="center"
            >
              {metrics.newToday}
            </DxcTypography>
            <DxcTypography
              fontSize="font-scale-03"
              fontWeight="font-weight-semibold"
              color="var(--color-fg-neutral-stronger)"
              textAlign="center"
            >
              New Today
            </DxcTypography>
          </DxcFlex>

          {/* Divider */}
          <div style={{ padding: 'var(--spacing-padding-xs)' }}>
            <div style={{
              height: '97px',
              width: '1px',
              backgroundColor: 'var(--color-bg-neutral-light)'
            }} />
          </div>

          {/* New This Week */}
          <DxcFlex
            direction="column"
            gap="var(--spacing-gap-s)"
            alignItems="center"
            justifyContent="center"
            grow={1}
            basis="0"
          >
            <DxcTypography
              fontSize="32px"
              fontWeight="font-weight-semibold"
              color="#000000"
              textAlign="center"
            >
              {metrics.newThisWeek}
            </DxcTypography>
            <DxcTypography
              fontSize="font-scale-03"
              fontWeight="font-weight-semibold"
              color="var(--color-fg-neutral-stronger)"
              textAlign="center"
            >
              New This Week
            </DxcTypography>
          </DxcFlex>
        </DxcFlex>
      </DxcFlex>
    </DxcContainer>
  );
};

export default MyTasksCard;
