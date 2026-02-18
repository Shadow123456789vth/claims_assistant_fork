import {
  DxcContainer,
  DxcFlex,
  DxcHeading,
  DxcTypography,
  DxcBadge,
  DxcAlert,
  DxcInset,
  DxcChip
} from '@dxc-technology/halstack-react';

const AnomalyDetection = ({ anomalyData, onClose }) => {
  if (!anomalyData || !anomalyData.AgenticSummary) {
    return (
      <DxcContainer padding="var(--spacing-padding-m)">
        <DxcAlert type="info" inlineText="No anomaly data available." />
      </DxcContainer>
    );
  }

  const summary = anomalyData.AgenticSummary;
  const overallStatus = summary.Overall_Status;
  const findings = summary.Analysis_Findings || [];
  const actionsRequired = summary.Actions_Required || [];
  const riskAssessment = summary.Risk_Assessment || [];

  // Count findings by severity
  const criticalCount = findings.filter(f => f.Severity === 'CRITICAL').length;
  const highCount = findings.filter(f => f.Severity === 'HIGH').length;
  const mediumCount = findings.filter(f => f.Severity === 'MEDIUM').length;
  const totalAlerts = findings.filter(f => f.Status === 'FAIL').length;

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'var(--color-fg-error-medium)';
      case 'HIGH':
        return 'var(--color-fg-error-medium)';
      case 'MEDIUM':
        return 'var(--color-fg-warning-medium)';
      case 'LOW':
        return 'var(--color-fg-info-medium)';
      default:
        return 'var(--color-fg-neutral-dark)';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'var(--color-fg-error-medium)';
      case 'HIGH':
        return 'var(--color-fg-error-medium)';
      case 'MEDIUM':
        return 'var(--color-fg-warning-medium)';
      default:
        return 'var(--color-fg-info-medium)';
    }
  };

  return (
    <DxcFlex direction="column" gap="var(--spacing-gap-m)">
      {/* Header with Status */}
      <DxcContainer
        padding="var(--spacing-padding-s)"
        style={{
          backgroundColor: overallStatus === 'PASS'
            ? 'var(--color-bg-success-lighter)'
            : 'var(--color-bg-error-lighter)'
        }}
      >
        <DxcFlex direction="column" gap="var(--spacing-gap-s)">
          <DxcFlex justifyContent="space-between" alignItems="center">
            <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
              <DxcHeading level={3} text="Payment Anomaly Detection" />
              <DxcBadge
                label={`${totalAlerts} Alert${totalAlerts !== 1 ? 's' : ''}`}
                mode="notification"
              />
            </DxcFlex>
            <DxcFlex gap="var(--spacing-gap-s)">
              {overallStatus === 'PASS' ? (
                <span style={{ fontSize: '32px', color: 'var(--color-fg-success-medium)' }}>✓</span>
              ) : (
                <span style={{ fontSize: '32px', color: 'var(--color-fg-error-medium)' }}>⚠</span>
              )}
            </DxcFlex>
          </DxcFlex>

          <DxcTypography
            fontSize="font-scale-03"
            fontWeight="font-weight-semibold"
            color={overallStatus === 'PASS' ? 'var(--color-fg-success-medium)' : 'var(--color-fg-error-medium)'}
          >
            {overallStatus === 'PASS'
              ? 'No anomalies detected'
              : `${totalAlerts} anomal${totalAlerts !== 1 ? 'ies' : 'y'} detected`}
          </DxcTypography>

          {overallStatus === 'PASS' ? (
            <DxcTypography fontSize="font-scale-02">
              All AI verification checks passed successfully.
            </DxcTypography>
          ) : (
            <DxcTypography fontSize="font-scale-02">
              {summary.Processing_Recommendation}
            </DxcTypography>
          )}
        </DxcFlex>
      </DxcContainer>

      {/* Policy and Claim Info */}
      {summary.General_Information && (
        <DxcContainer
          padding="var(--spacing-padding-s)"
          style={{ backgroundColor: 'var(--color-bg-neutral-lighter)' }}
        >
          <DxcFlex gap="var(--spacing-gap-xl)">
            <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                POLICY NUMBER
              </DxcTypography>
              <DxcTypography fontSize="16px" fontWeight="font-weight-semibold">
                {summary.General_Information.Policy_Number}
              </DxcTypography>
            </DxcFlex>
            <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                CLAIM NUMBER
              </DxcTypography>
              <DxcTypography fontSize="16px" fontWeight="font-weight-semibold">
                {summary.General_Information.Claim_Number}
              </DxcTypography>
            </DxcFlex>
          </DxcFlex>
        </DxcContainer>
      )}

      {/* Analysis Findings */}
      {findings.length > 0 && (
        <DxcFlex direction="column" gap="var(--spacing-gap-s)">
          <DxcHeading level={4} text="Analysis Findings" />
          {findings.map((finding, index) => (
            <DxcContainer
              key={index}
              padding="var(--spacing-padding-s)"
              style={{
                backgroundColor: finding.Status === 'FAIL'
                  ? 'var(--color-bg-error-lightest)'
                  : 'var(--color-bg-success-lightest)'
              }}
              border={{
                color: finding.Status === 'FAIL'
                  ? 'var(--border-color-error-lighter)'
                  : 'var(--border-color-success-lighter)',
                style: 'solid',
                width: '1px'
              }}
            >
              <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                <DxcFlex justifyContent="space-between" alignItems="center">
                  <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
                    <DxcTypography
                      fontSize="font-scale-03"
                      fontWeight="font-weight-semibold"
                      color={getSeverityColor(finding.Severity)}
                    >
                      {finding.Finding_ID}
                    </DxcTypography>
                    <DxcChip
                      label={finding.Severity}
                      size="small"
                      style={{
                        backgroundColor: getSeverityColor(finding.Severity),
                        color: 'white'
                      }}
                    />
                    <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                      {finding.Risk_Type}
                    </DxcTypography>
                  </DxcFlex>
                  <DxcBadge
                    label={finding.Status}
                    mode={finding.Status === 'FAIL' ? 'default' : 'contextual'}
                  />
                </DxcFlex>

                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                  {finding.Title}
                </DxcTypography>

                {finding.Evidence && finding.Evidence.length > 0 && (
                  <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                    <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                      Evidence:
                    </DxcTypography>
                    {finding.Evidence.map((evidence, evidenceIndex) => (
                      <DxcTypography key={evidenceIndex} fontSize="font-scale-02" style={{ paddingLeft: '16px' }}>
                        • {evidence}
                      </DxcTypography>
                    ))}
                  </DxcFlex>
                )}

                {finding.Recommendation && (
                  <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                    <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                      Recommendation:
                    </DxcTypography>
                    <DxcTypography fontSize="font-scale-02" style={{ paddingLeft: '16px' }}>
                      {finding.Recommendation}
                    </DxcTypography>
                  </DxcFlex>
                )}
              </DxcFlex>
            </DxcContainer>
          ))}
        </DxcFlex>
      )}

      {/* Actions Required */}
      {actionsRequired.length > 0 && (
        <DxcFlex direction="column" gap="var(--spacing-gap-s)">
          <DxcHeading level={4} text="Actions Required" />
          {actionsRequired.map((action, index) => (
            <DxcContainer
              key={index}
              padding="var(--spacing-padding-s)"
              style={{ backgroundColor: 'var(--color-bg-warning-lightest)' }}
              border={{
                color: 'var(--border-color-warning-lighter)',
                style: 'solid',
                width: '1px'
              }}
            >
              <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                <DxcFlex justifyContent="space-between" alignItems="center">
                  <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                    {action.Action}
                  </DxcTypography>
                  <DxcChip
                    label={action.Priority}
                    size="small"
                    style={{
                      backgroundColor: getPriorityColor(action.Priority),
                      color: 'white'
                    }}
                  />
                </DxcFlex>
                {action.Reason && (
                  <DxcTypography fontSize="font-scale-02">
                    {action.Reason}
                  </DxcTypography>
                )}
              </DxcFlex>
            </DxcContainer>
          ))}
        </DxcFlex>
      )}

      {/* Risk Assessment */}
      {riskAssessment.length > 0 && (
        <DxcFlex direction="column" gap="var(--spacing-gap-s)">
          <DxcHeading level={4} text="Risk Assessment" />
          <DxcContainer
            padding="var(--spacing-padding-s)"
            style={{ backgroundColor: 'var(--color-bg-neutral-lighter)' }}
          >
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              {riskAssessment.map((risk, index) => (
                <DxcFlex key={index} gap="var(--spacing-gap-m)" alignItems="center">
                  <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold" style={{ minWidth: '120px' }}>
                    {risk.Category}:
                  </DxcTypography>
                  <DxcTypography
                    fontSize="font-scale-03"
                    fontWeight="font-weight-semibold"
                    color={getSeverityColor(risk.Level)}
                  >
                    {risk.Level}
                  </DxcTypography>
                </DxcFlex>
              ))}
            </DxcFlex>
          </DxcContainer>
        </DxcFlex>
      )}

      {/* Summary Recommendation */}
      {summary.Summary_Recommendation && (
        <DxcContainer
          padding="var(--spacing-padding-s)"
          style={{
            backgroundColor: summary.Summary_Recommendation.Decision === 'STOP_AND_REVIEW'
              ? 'var(--color-bg-error-lightest)'
              : 'var(--color-bg-success-lightest)'
          }}
        >
          <DxcFlex direction="column" gap="var(--spacing-gap-s)">
            <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                Decision:
              </DxcTypography>
              <DxcBadge
                label={summary.Summary_Recommendation.Decision.replace(/_/g, ' ')}
                mode={summary.Summary_Recommendation.Decision === 'STOP_AND_REVIEW' ? 'default' : 'contextual'}
              />
            </DxcFlex>
            {summary.Summary_Recommendation.Rationale && (
              <DxcTypography fontSize="font-scale-02">
                {summary.Summary_Recommendation.Rationale}
              </DxcTypography>
            )}
          </DxcFlex>
        </DxcContainer>
      )}
    </DxcFlex>
  );
};

export default AnomalyDetection;
