import {
  DxcHeading,
  DxcFlex,
  DxcTypography,
  DxcButton,
  DxcInset,
  DxcChip,
  DxcProgressBar
} from '@dxc-technology/halstack-react';
import './ReserveManagementPanel.css';

const ReserveManagementPanel = ({ financial }) => {
  if (!financial) {
    return (
      <DxcInset space="2rem">
        <DxcTypography>Reserve management data not available</DxcTypography>
      </DxcInset>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAdequacyColor = (adequacy) => {
    switch (adequacy?.toLowerCase()) {
      case 'adequate':
        return 'success';
      case 'review_required':
        return 'warning';
      case 'insufficient':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateUtilization = () => {
    if (!financial.policyLimit || financial.policyLimit === 0) return 0;
    return (financial.totalExposure / financial.policyLimit) * 100;
  };

  const utilization = calculateUtilization();

  return (
    <div className="reserve-management-panel">
      <DxcInset space="2rem">
        <DxcFlex direction="column" gap="var(--spacing-gap-l)">

          {/* Header */}
          <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
            <DxcHeading level={3} text="Reserve Management" />
            <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
              Financial reserves and claim exposure tracking
            </DxcTypography>
          </DxcFlex>

          {/* Reserve Amounts Grid */}
          <div className="reserve-grid">
            <div className="reserve-card">
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Claim Amount
              </DxcTypography>
              <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-bold">
                {formatCurrency(financial.claimAmount)}
              </DxcTypography>
            </div>

            <div className="reserve-card">
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Current Reserve
              </DxcTypography>
              <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-bold" style={{ color: 'var(--color-fg-primary-strong)' }}>
                {formatCurrency(financial.currentReserve)}
              </DxcTypography>
            </div>

            <div className="reserve-card">
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Policy Limit
              </DxcTypography>
              <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-bold">
                {formatCurrency(financial.policyLimit)}
              </DxcTypography>
            </div>

            <div className="reserve-card">
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Deductible
              </DxcTypography>
              <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-bold">
                {formatCurrency(financial.deductible)}
              </DxcTypography>
            </div>
          </div>

          {/* Total Exposure */}
          <div className="exposure-section">
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcFlex justifyContent="space-between" alignItems="center">
                <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold">
                  Total Exposure:
                </DxcTypography>
                <DxcTypography
                  fontSize="font-scale-05"
                  fontWeight="font-weight-bold"
                  style={{ color: '#000000' }}
                >
                  {formatCurrency(financial.totalExposure)}
                </DxcTypography>
              </DxcFlex>

              <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
                <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                  Policy Limit Utilization: {utilization.toFixed(1)}%
                </DxcTypography>
                <DxcProgressBar
                  label=""
                  value={utilization}
                  showValue
                  mode={utilization > 80 ? 'error' : utilization > 50 ? 'warning' : 'default'}
                />
              </DxcFlex>
            </DxcFlex>
          </div>

          {/* Business Interruption */}
          {financial.businessInterruptionClaim && financial.businessInterruptionClaim > 0 && (
            <div className="bi-section">
              <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                  Business Interruption Claim
                </DxcTypography>
                <DxcFlex justifyContent="space-between" alignItems="center">
                  <DxcTypography>Additional BI Exposure:</DxcTypography>
                  <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold" style={{ color: '#000000' }}>
                    {formatCurrency(financial.businessInterruptionClaim)}
                  </DxcTypography>
                </DxcFlex>
              </DxcFlex>
            </div>
          )}

          {/* Payments */}
          <div className="payments-section">
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                Payment Status
              </DxcTypography>
              <div className="payments-grid">
                <div className="payment-item">
                  <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                    Paid to Date:
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold" style={{ color: '#000000' }}>
                    {formatCurrency(financial.paidToDate)}
                  </DxcTypography>
                </div>
                <div className="payment-item">
                  <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                    Remaining Reserve:
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold">
                    {formatCurrency(financial.currentReserve - financial.paidToDate)}
                  </DxcTypography>
                </div>
              </div>
            </DxcFlex>
          </div>

          {/* Reserve Adequacy */}
          <div className="adequacy-section">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                  Reserve Adequacy
                </DxcTypography>
                {financial.lastReserveUpdate && (
                  <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
                    Last Updated: {formatDate(financial.lastReserveUpdate)}
                  </DxcTypography>
                )}
              </DxcFlex>
              <DxcChip
                label={financial.reserveAdequacy ? financial.reserveAdequacy.replace('_', ' ').toUpperCase() : 'Unknown'}
                size="large"
                color={getAdequacyColor(financial.reserveAdequacy)}
              />
            </DxcFlex>
          </div>

          {/* Actions */}
          <DxcFlex gap="var(--spacing-gap-m)">
            <DxcButton
              label="Update Reserve"
              mode="primary"
              icon="edit"
              onClick={() => {
                console.log('Update reserve clicked');
              }}
            />
            <DxcButton
              label="View History"
              mode="secondary"
              icon="history"
              onClick={() => {
                console.log('View history clicked');
              }}
            />
          </DxcFlex>

        </DxcFlex>
      </DxcInset>
    </div>
  );
};

export default ReserveManagementPanel;
