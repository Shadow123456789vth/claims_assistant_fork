/**
 * Claim Progress Card Component
 * Displays claim progress metrics: requirements completion, SLA days remaining, and FastTrack status
 */

import {
  DxcFlex,
  DxcContainer,
  DxcTypography,
  DxcHeading,
  DxcProgressBar
} from '@dxc-technology/halstack-react';

const ClaimProgressCard = ({ claim, requirements }) => {
  return (
    <DxcContainer
      padding="var(--spacing-padding-l)"
      style={{ backgroundColor: "var(--color-bg-neutral-lightest)" }}
    >
      <DxcFlex direction="column" gap="var(--spacing-gap-m)">
        <DxcHeading level={3} text="Claim Progress" />
        {requirements.length > 0 && (
          <DxcProgressBar
            label="Requirements Complete"
            value={Math.round((requirements.filter(r => r.status === 'SATISFIED' || r.status === 'Completed').length / requirements.length) * 100)}
            showValue
          />
        )}
        <DxcFlex gap="var(--spacing-gap-xl)">
          {claim.workflow?.sla?.dueDate && (() => {
            const dueDate = new Date(claim.workflow.sla.dueDate);
            const today = new Date();
            const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const color = daysRemaining <= 3 ? '#000000' : daysRemaining <= 7 ? '#000000' : '#000000';

            return (
              <>
                <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                  <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                    SLA DAYS REMAINING
                  </DxcTypography>
                  <DxcTypography fontSize="32px" fontWeight="font-weight-semibold" color={color}>
                    {daysRemaining}
                  </DxcTypography>
                </DxcFlex>
                <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                  <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                    TARGET CLOSE DATE
                  </DxcTypography>
                  <DxcTypography fontSize="16px" fontWeight="font-weight-semibold">
                    {dueDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                  </DxcTypography>
                </DxcFlex>
              </>
            );
          })()}
          <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
            <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
              FASTTRACK ELIGIBLE
            </DxcTypography>
            <DxcTypography fontSize="16px" fontWeight="font-weight-semibold" color={claim.routing?.type === 'FASTTRACK' ? '#000000' : 'var(--color-fg-neutral-dark)'}>
              {claim.routing?.type === 'FASTTRACK' ? 'Yes' : 'No'}
            </DxcTypography>
          </DxcFlex>
        </DxcFlex>
      </DxcFlex>
    </DxcContainer>
  );
};

export default ClaimProgressCard;
