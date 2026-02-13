import {
  DxcHeading,
  DxcFlex,
  DxcTypography,
  DxcProgressBar,
  DxcInset,
  DxcAlert,
  DxcChip
} from '@dxc-technology/halstack-react';
import './FraudDetectionPanel.css';

const FraudDetectionPanel = ({ fraudData, claimData }) => {
  if (!fraudData) {
    return (
      <DxcInset space="2rem">
        <DxcTypography>Fraud detection data not available</DxcTypography>
      </DxcInset>
    );
  }

  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: 'success', semanticColor: '#000000' };
    if (score < 70) return { level: 'Medium', color: 'warning', semanticColor: '#000000' };
    return { level: 'High', color: 'error', semanticColor: '#000000' };
  };

  const getRiskIcon = (score) => {
    if (score < 30) return '✅';
    if (score < 70) return '⚠️';
    return '🚨';
  };

  const riskInfo = getRiskLevel(fraudData.riskScore);
  const hasFraudIndicators = fraudData.fraudIndicators && fraudData.fraudIndicators.length > 0;

  return (
    <div className="fraud-detection-panel">
      <DxcInset space="2rem">
        <DxcFlex direction="column" gap="var(--spacing-gap-l)">

          {/* Header */}
          <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
            <DxcHeading level={3} text="AI Fraud Detection Analysis" />
            <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
              Intelligent fraud risk assessment powered by machine learning
            </DxcTypography>
          </DxcFlex>

          {/* Risk Score */}
          <div className="risk-score-section">
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcFlex justifyContent="space-between" alignItems="center">
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                  Risk Score
                </DxcTypography>
                <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                  <span style={{ fontSize: '24px' }}>{getRiskIcon(fraudData.riskScore)}</span>
                  <DxcTypography
                    fontSize="font-scale-05"
                    fontWeight="font-weight-bold"
                    style={{ color: riskInfo.semanticColor }}
                  >
                    {fraudData.riskScore}/100
                  </DxcTypography>
                </DxcFlex>
              </DxcFlex>

              <DxcProgressBar
                label=""
                value={fraudData.riskScore}
                showValue
                mode={riskInfo.color}
              />

              <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
                <DxcTypography>Risk Level:</DxcTypography>
                <DxcChip
                  label={riskInfo.level}
                  size="medium"
                  color={riskInfo.color}
                />
              </DxcFlex>
            </DxcFlex>
          </div>

          {/* Fraud Indicators */}
          <DxcFlex direction="column" gap="var(--spacing-gap-m)">
            <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
              Fraud Indicators
            </DxcTypography>

            {hasFraudIndicators ? (
              <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                {fraudData.fraudIndicators.map((indicator, index) => (
                  <DxcAlert
                    key={index}
                    type="warning"
                    mode="inline"
                    inlineText={indicator}
                    size="small"
                  />
                ))}
              </DxcFlex>
            ) : (
              <DxcAlert
                type="success"
                mode="inline"
                inlineText="No fraud indicators detected"
                size="small"
              />
            )}

            {fraudData.fraudReasoning && (
              <div className="reasoning-box">
                <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                  <strong>Analysis:</strong> {fraudData.fraudReasoning}
                </DxcTypography>
              </div>
            )}
          </DxcFlex>

          {/* AI Recommended Actions */}
          {fraudData.aiRecommendedActions && fraudData.aiRecommendedActions.length > 0 && (
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                AI-Recommended Actions
              </DxcTypography>
              <div className="actions-list">
                {fraudData.aiRecommendedActions.map((action, index) => (
                  <div key={index} className="action-item">
                    <span className="action-bullet">▸</span>
                    <DxcTypography>{action}</DxcTypography>
                  </div>
                ))}
              </div>
            </DxcFlex>
          )}

          {/* Processing Eligibility */}
          <div className="processing-section">
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                Processing Assessment
              </DxcTypography>

              <div className="processing-grid">
                <div className="processing-item">
                  <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                    Auto-Approval:
                  </DxcTypography>
                  <DxcChip
                    label={fraudData.autoApproval ? 'Eligible' : 'Not Eligible'}
                    size="small"
                    color={fraudData.autoApproval ? 'success' : 'default'}
                  />
                </div>

                <div className="processing-item">
                  <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                    Adjuster Required:
                  </DxcTypography>
                  <DxcChip
                    label={fraudData.requiresAdjuster ? 'Yes' : 'No'}
                    size="small"
                    color={fraudData.requiresAdjuster ? 'warning' : 'success'}
                  />
                </div>

                <div className="processing-item">
                  <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                    Straight-Through Processing:
                  </DxcTypography>
                  <DxcChip
                    label={fraudData.straightThroughProcessing ? 'Eligible' : 'Not Eligible'}
                    size="small"
                    color={fraudData.straightThroughProcessing ? 'success' : 'default'}
                  />
                </div>

                {fraudData.claimComplexity && (
                  <div className="processing-item">
                    <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                      Claim Complexity:
                    </DxcTypography>
                    <DxcChip
                      label={fraudData.claimComplexity.charAt(0).toUpperCase() + fraudData.claimComplexity.slice(1)}
                      size="small"
                      color="info"
                    />
                  </div>
                )}
              </div>
            </DxcFlex>
          </div>

        </DxcFlex>
      </DxcInset>
    </div>
  );
};

export default FraudDetectionPanel;
