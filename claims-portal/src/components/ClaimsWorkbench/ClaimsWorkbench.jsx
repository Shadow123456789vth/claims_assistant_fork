import { useState } from 'react';
import { useDemoMode } from '../../contexts/DemoModeContext';
import {
  DxcHeading,
  DxcFlex,
  DxcContainer,
  DxcTypography,
  DxcButton,
  DxcBadge,
  DxcTabs,
  DxcInset,
  DxcProgressBar,
  DxcAlert,
  DxcChip,
  DxcDialog
} from '@dxc-technology/halstack-react';
import FastTrackBadge from '../shared/FastTrackBadge';
import ProcessTracker from '../shared/ProcessTracker';
import DocumentUpload from '../shared/DocumentUpload';
import MetricCard from '../shared/MetricCard';
import DocumentViewer from '../shared/DocumentViewer';
import BeneficiaryAnalyzer from '../BeneficiaryAnalyzer/BeneficiaryAnalyzer';
import DeathEventPanel from '../DeathEventPanel/DeathEventPanel';
import PolicySummaryPanel from '../PolicySummaryPanel/PolicySummaryPanel';
import PartyManagementPanel from '../PartyManagementPanel/PartyManagementPanel';
import AIInsightsPanel from '../AIInsightsPanel/AIInsightsPanel';
import LossEventPanel from '../LossEventPanel/LossEventPanel';
import PropertyDamagePanel from '../PropertyDamagePanel/PropertyDamagePanel';
import FraudDetectionPanel from '../FraudDetectionPanel/FraudDetectionPanel';
import ReserveManagementPanel from '../ReserveManagementPanel/ReserveManagementPanel';
import ClaimHeader from '../ClaimHeader/ClaimHeader';
import PMICalculator from '../PMICalculator/PMICalculator';
import TaxWithholdingCalculator from '../TaxWithholdingCalculator/TaxWithholdingCalculator';
import PaymentQuickView from '../PaymentQuickView/PaymentQuickView';
import PolicyDetailView from '../PolicyDetailView/PolicyDetailView';
import PartyForm from '../PartyForm/PartyForm';
import RequirementsEngine from '../RequirementsEngine/RequirementsEngine';
import WorkNotes from '../WorkNotes/WorkNotes';
import ClaimProgressCard from './ClaimProgressCard';
import FinancialsTab from './FinancialsTab';
import ModalWrapper from '../shared/ModalWrapper';
import './ClaimsWorkbench.css';

const ClaimsWorkbench = ({ claim, onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showBeneficiaryAnalyzer, setShowBeneficiaryAnalyzer] = useState(false);
  const { demoLineOfBusiness } = useDemoMode();

  // Modal states
  const [showPMICalculator, setShowPMICalculator] = useState(false);
  const [showTaxCalculator, setShowTaxCalculator] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showPartyForm, setShowPartyForm] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);

  if (!claim) {
    return (
      <DxcContainer
        padding="var(--spacing-padding-xl)"
        style={{ backgroundColor: "var(--color-bg-secondary-lightest)" }}
      >
        <DxcAlert
          type="info"
          inlineText="Please select a claim from the dashboard to view details."
        />
      </DxcContainer>
    );
  }

  // Helper function - must be declared before use
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBeneficiaryStatusColor = (status) => {
    const statusUpper = (status || '').toUpperCase();
    if (statusUpper === 'VERIFIED' || statusUpper === 'APPROVED') {
      return 'green';
    }
    if (statusUpper === 'PENDING' || statusUpper === 'UNDER REVIEW') {
      return 'orange';
    }
    if (statusUpper === 'REJECTED' || statusUpper === 'INVALID') {
      return 'red';
    }
    return 'grey';
  };

  // Extract financial data from claim
  const totalClaimAmount = claim.financial?.claimAmount || claim.financial?.totalClaimed || 0;
  const payments = claim.financial?.payments || claim.payments || [];
  const reserves = claim.financial?.reserves || {};

  // Calculate totals
  const totalPaid = payments
    .filter(p => p.status === 'PAID' || p.status === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pendingPayments = payments.filter(p =>
    p.status === 'PENDING' || p.status === 'Pending Approval' || p.status === 'SCHEDULED'
  );

  const completedPayments = payments.filter(p =>
    p.status === 'PAID' || p.status === 'Paid' || p.status === 'COMPLETED'
  );

  const financialData = {
    totalClaimAmount,
    reserves: {
      initial: reserves.initial || totalClaimAmount,
      current: reserves.current || (totalClaimAmount - totalPaid),
      paid: totalPaid,
      outstanding: reserves.outstanding || (totalClaimAmount - totalPaid)
    },
    payments: completedPayments,
    pendingPayments
  };

  // Extract policy data from claim
  const policyDetails = {
    policyNumber: claim.policy?.policyNumber || 'N/A',
    insuredName: claim.insured?.name || claim.claimant?.name || 'N/A',
    policyType: claim.policy?.policyType || 'Term Life Insurance',
    coverage: claim.financial?.claimAmount ? formatCurrency(claim.financial.claimAmount) : 'N/A',
    effectiveDate: claim.policy?.effectiveDate || claim.policy?.issueDate || 'N/A',
    expirationDate: claim.policy?.expirationDate || 'N/A',
    premium: claim.policy?.premium || 'N/A'
  };

  // Extract beneficiaries from claim
  const beneficiaries = claim.beneficiaries || claim.policy?.beneficiaries || [];

  // Extract timeline from claim
  const timelineEvents = claim.timeline || claim.activityLog || [];

  // Extract requirements from claim
  const requirements = claim.requirements || [];

  return (
    <DxcContainer
      padding="0"
      style={{ backgroundColor: "var(--color-bg-secondary-lightest)" }}
    >
      <DxcFlex direction="column" gap="0">
        {/* Persistent Claim Header */}
        <ClaimHeader
          claim={claim}
          onHold={() => console.log('Hold claim')}
          onApprove={() => console.log('Approve claim')}
          onDeny={() => console.log('Deny claim')}
          onAssign={() => console.log('Assign claim')}
          onBack={onBack || (() => window.history.back())}
        />

        {/* Main Content Area */}
        <DxcContainer padding="var(--spacing-padding-l)">
          <DxcFlex direction="column" gap="var(--spacing-gap-m)">
            {/* Progress Card */}
            <ClaimProgressCard claim={claim} requirements={requirements} />

        {/* Tabs */}
        <DxcContainer
          style={{ backgroundColor: "var(--color-bg-neutral-lightest)" }}
        >
          <DxcFlex direction="column">
            <DxcInset space="var(--spacing-padding-l)" top>
              <DxcTabs iconPosition="left">
                <DxcTabs.Tab
                  label="Dashboard"
                  icon="dashboard"
                  active={activeTab === 0}
                  onClick={() => setActiveTab(0)}
                >
                  <div />
                </DxcTabs.Tab>
                <DxcTabs.Tab
                  label="Financials"
                  icon="payments"
                  active={activeTab === 1}
                  onClick={() => setActiveTab(1)}
                >
                  <div />
                </DxcTabs.Tab>
                <DxcTabs.Tab
                  label="Policy 360"
                  icon="policy"
                  active={activeTab === 2}
                  onClick={() => setActiveTab(2)}
                >
                  <div />
                </DxcTabs.Tab>
                <DxcTabs.Tab
                  label="Timeline"
                  icon="timeline"
                  active={activeTab === 3}
                  onClick={() => setActiveTab(3)}
                >
                  <div />
                </DxcTabs.Tab>
                <DxcTabs.Tab
                  label="Requirements"
                  icon="checklist"
                  active={activeTab === 4}
                  onClick={() => setActiveTab(4)}
                >
                  <div />
                </DxcTabs.Tab>
                <DxcTabs.Tab
                  label="Documents"
                  icon="folder"
                  active={activeTab === 5}
                  onClick={() => setActiveTab(5)}
                >
                  <div />
                </DxcTabs.Tab>
                {/* Only show Beneficiary Analyzer tab for death claims */}
                {claim.type === 'death' && (
                  <DxcTabs.Tab
                    label="Beneficiary Analyzer"
                    icon="psychology"
                    active={activeTab === 6}
                    onClick={() => setActiveTab(6)}
                  >
                    <div />
                  </DxcTabs.Tab>
                )}
              </DxcTabs>
            </DxcInset>

            <DxcInset space="var(--spacing-padding-l)">
              {/* Dashboard Tab - SA-001 Claim Dashboard 360° View */}
              {activeTab === 0 && (
                <DxcFlex direction="column" gap="var(--spacing-gap-l)">
                  {demoLineOfBusiness === 'LA' ? (
                    <>
                      {/* L&A Mode: Conditional panels based on claim type */}
                      <div className="dashboard-grid-top">
                        {/* Only show Death Event Panel for death claims */}
                        {claim.type === 'death' && (
                          <DeathEventPanel
                            claimData={{
                              dateOfDeath: claim.deathEvent?.dateOfDeath || claim.insured?.dateOfDeath,
                              mannerOfDeath: claim.deathEvent?.mannerOfDeath || 'Natural',
                              causeOfDeath: claim.deathEvent?.causeOfDeath,
                              deathInUSA: claim.deathEvent?.deathInUSA || 'Yes',
                              countryOfDeath: claim.deathEvent?.countryOfDeath || 'United States',
                              proofOfDeathSourceType: claim.deathEvent?.proofOfDeathSourceType || 'Certified Death Certificate',
                              proofOfDeathDate: claim.deathEvent?.proofOfDeathDate,
                              certifiedDOB: claim.insured?.dateOfBirth,
                              verificationSource: claim.deathEvent?.verificationSource || 'LexisNexis',
                              verificationScore: claim.deathEvent?.verificationScore || 95,
                              specialEvent: claim.deathEvent?.specialEvent
                            }}
                            onEdit={() => console.log('Edit death event')}
                          />
                        )}
                        <AIInsightsPanel
                          claimData={{
                            riskScore: claim.aiInsights?.riskScore || 0
                          }}
                          insights={claim.aiInsights?.alerts || []}
                          onViewDetail={(insight) => console.log('View insight:', insight)}
                          onDismiss={(insight) => console.log('Dismiss insight:', insight)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* P&C Mode: Loss Event and Fraud Detection */}
                      <div className="dashboard-grid-top">
                        <LossEventPanel claimData={claim} />
                        <FraudDetectionPanel fraudData={claim.intelligentFNOL} claimData={claim} />
                      </div>
                      {/* P&C: Property Damage Panel */}
                      <PropertyDamagePanel damageData={claim.propertyDamage} />
                    </>
                  )}

                  {/* Middle Row: Policy Summary and Party Management */}
                  <div className="dashboard-grid-middle">
                    <PolicySummaryPanel
                      policies={claim.policies || (claim.policy ? [claim.policy] : [])}
                      onViewPolicy={(policy) => {
                        setSelectedPolicy(policy);
                        setShowPolicyModal(true);
                      }}
                      onAssociate={() => console.log('Associate policy')}
                      onDissociate={(policy) => console.log('Dissociate policy:', policy)}
                      onSearchPolicy={() => console.log('Search policy')}
                    />
                    <PartyManagementPanel
                      parties={claim.parties || []}
                      onAddParty={() => {
                        setSelectedParty(null);
                        setShowPartyForm(true);
                      }}
                      onEditParty={(party) => {
                        setSelectedParty(party);
                        setShowPartyForm(true);
                      }}
                      onChangeInsured={() => console.log('Change insured')}
                      onCSLNSearch={(party) => console.log('CSLN search for party:', party)}
                    />
                  </div>

                  {/* Bottom Row: Quick Actions */}
                  <DxcContainer
                    padding="var(--spacing-padding-m)"
                    style={{ backgroundColor: 'var(--color-bg-neutral-lightest)' }}
                  >
                    <DxcFlex gap="var(--spacing-gap-m)" wrap="wrap">
                      <DxcButton
                        label="View Full Financials"
                        mode="secondary"
                        icon="payments"
                        onClick={() => setActiveTab(1)}
                      />
                      <DxcButton
                        label="View Policy Details"
                        mode="secondary"
                        icon="policy"
                        onClick={() => setActiveTab(2)}
                      />
                      <DxcButton
                        label="Manage Requirements"
                        mode="secondary"
                        icon="checklist"
                        onClick={() => setActiveTab(4)}
                      />
                      <DxcButton
                        label="Upload Documents"
                        mode="secondary"
                        icon="upload_file"
                        onClick={() => setActiveTab(5)}
                      />
                      {/* Only show Beneficiary Analyzer for death claims */}
                      {claim.type === 'death' && (
                        <DxcButton
                          label="Analyze Beneficiaries"
                          mode="primary"
                          icon="psychology"
                          onClick={() => setActiveTab(6)}
                        />
                      )}
                    </DxcFlex>
                  </DxcContainer>
                </DxcFlex>
              )}

              {/* Financials Tab */}
              {activeTab === 1 && (
                <FinancialsTab
                  demoLineOfBusiness={demoLineOfBusiness}
                  claim={claim}
                  financialData={financialData}
                  formatCurrency={formatCurrency}
                  onShowPMICalculator={() => setShowPMICalculator(true)}
                  onShowTaxCalculator={() => setShowTaxCalculator(true)}
                  onPaymentClick={(payment) => {
                    setSelectedPayment(payment);
                    setShowPaymentModal(true);
                  }}
                />
              )}

              {/* Policy 360 Tab */}
              {activeTab === 2 && (
                <DxcFlex direction="column" gap="var(--spacing-gap-l)">
                  <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                    <DxcFlex justifyContent="space-between" alignItems="center">
                      <DxcHeading level={4} text="Policy Details" />
                      <DxcButton label="View Full Policy" mode="secondary" size="small" icon="open_in_new" />
                    </DxcFlex>
                    <DxcContainer
                      padding="var(--spacing-padding-m)"
                      style={{ backgroundColor: "var(--color-bg-neutral-lighter)" }}
                      border={{ color: "var(--border-color-neutral-lighter)", style: "solid", width: "1px" }}
                    >
                      <div className="policy-details-grid">
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Policy Number</DxcTypography>
                          <DxcTypography fontSize="16px" fontWeight="font-weight-semibold">{policyDetails.policyNumber}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Insured Name</DxcTypography>
                          <DxcTypography fontSize="16px" fontWeight="font-weight-semibold">{policyDetails.insuredName}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Product Type</DxcTypography>
                          <DxcTypography fontSize="16px" fontWeight="font-weight-semibold">{policyDetails.policyType}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Face Amount</DxcTypography>
                          <DxcTypography fontSize="16px" fontWeight="font-weight-semibold" color="var(--color-fg-info-medium)">{policyDetails.coverage}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Issue Date</DxcTypography>
                          <DxcTypography fontSize="16px">{policyDetails.effectiveDate}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Issue State</DxcTypography>
                          <DxcTypography fontSize="16px">{claim.policy?.issueState || 'N/A'}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Plan Code</DxcTypography>
                          <DxcTypography fontSize="16px">{claim.policy?.planCode || 'N/A'}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Policy Status</DxcTypography>
                          <DxcTypography fontSize="16px">{claim.policy?.adminStatus || 'Active'}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Region</DxcTypography>
                          <DxcTypography fontSize="16px">{claim.policy?.region || 'N/A'}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Company Code</DxcTypography>
                          <DxcTypography fontSize="16px">{claim.policy?.companyCode || 'N/A'}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Paid To Date</DxcTypography>
                          <DxcTypography fontSize="16px">{claim.policy?.paidToDate || 'N/A'}</DxcTypography>
                        </DxcFlex>
                        <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Source System</DxcTypography>
                          <DxcTypography fontSize="16px">{claim.policy?.source || 'CyberLife'}</DxcTypography>
                        </DxcFlex>
                      </div>
                    </DxcContainer>
                  </DxcFlex>

                  <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                    <DxcFlex justifyContent="space-between" alignItems="center">
                      <DxcHeading level={4} text="Beneficiaries" />
                      <DxcButton
                        label="Analyze Beneficiaries with AI"
                        mode="primary"
                        icon="psychology"
                        onClick={() => setShowBeneficiaryAnalyzer(true)}
                      />
                    </DxcFlex>
                    {beneficiaries.map((ben, index) => (
                      <DxcContainer
                        key={index}
                        style={{ backgroundColor: "var(--color-bg-neutral-lighter)" }}
                        border={{ color: "var(--border-color-neutral-lighter)", style: "solid", width: "1px" }}
                      >
                        <DxcInset space="var(--spacing-padding-m)">
                          <DxcFlex justifyContent="space-between" alignItems="center">
                            <DxcFlex gap="var(--spacing-gap-l)" alignItems="center">
                              <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                                <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Name</DxcTypography>
                                <DxcTypography fontSize="16px" fontWeight="font-weight-semibold">{ben.name}</DxcTypography>
                              </DxcFlex>
                              <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                                <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Relationship</DxcTypography>
                                <DxcTypography fontSize="16px">{ben.relationship}</DxcTypography>
                              </DxcFlex>
                              <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                                <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Percentage</DxcTypography>
                                <DxcTypography fontSize="16px">{ben.percentage}</DxcTypography>
                              </DxcFlex>
                              <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                                <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">Amount</DxcTypography>
                                <DxcTypography fontSize="20px" fontWeight="font-weight-semibold" color="#000000">{ben.amount}</DxcTypography>
                              </DxcFlex>
                              <DxcBadge label={ben.status} color={getBeneficiaryStatusColor(ben.status)} />
                            </DxcFlex>
                          </DxcFlex>
                        </DxcInset>
                      </DxcContainer>
                    ))}
                  </DxcFlex>
                </DxcFlex>
              )}

              {/* Timeline Tab - SA-010 Activity Timeline */}
              {activeTab === 3 && (
                <DxcFlex direction="column" gap="var(--spacing-gap-l)">
                  {/* Pizza Tracker Style Progress */}
                  <ProcessTracker claim={claim} />

                  <DxcFlex justifyContent="space-between" alignItems="center">
                    <DxcHeading level={4} text="Activity Timeline" />
                    <DxcFlex gap="var(--spacing-gap-s)">
                      <DxcChip label="User Generated" size="small" />
                      <DxcChip label="System Generated" size="small" />
                    </DxcFlex>
                  </DxcFlex>
                  {timelineEvents.length > 0 ? (
                    timelineEvents.map((event, index) => (
                      <DxcContainer
                        key={index}
                        style={{ backgroundColor: "var(--color-bg-neutral-lighter)" }}
                        border={{ color: "var(--border-color-neutral-lighter)", style: "solid", width: "1px" }}
                      >
                        <DxcInset space="var(--spacing-padding-m)">
                          <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
                            <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
                              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                                {event.type || 'Event'}
                              </DxcTypography>
                              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                                {event.timestamp ? new Date(event.timestamp).toLocaleString('en-US', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'N/A'}
                              </DxcTypography>
                            </DxcFlex>
                            {event.user?.name && (
                              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                                by {event.user.name}
                              </DxcTypography>
                            )}
                            <DxcTypography fontSize="font-scale-03">
                              {event.description || 'No description'}
                            </DxcTypography>
                          </DxcFlex>
                        </DxcInset>
                      </DxcContainer>
                    ))
                  ) : (
                    <DxcContainer
                      padding="var(--spacing-padding-l)"
                      style={{ backgroundColor: "var(--color-bg-neutral-lighter)" }}
                    >
                      <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                        No timeline events available for this claim.
                      </DxcTypography>
                    </DxcContainer>
                  )}
                </DxcFlex>
              )}

              {/* Requirements Tab */}
              {activeTab === 4 && (
                <RequirementsEngine
                  claim={claim}
                  onGenerateRequirements={() => {
                    console.log('Generate requirements clicked');
                  }}
                  onGenerateLetter={() => {
                    console.log('Generate letter clicked');
                  }}
                  onUploadDocument={(req) => {
                    console.log('Upload document for requirement:', req);
                    setActiveTab(5); // Switch to Documents tab
                  }}
                  onWaive={(req) => {
                    console.log('Waive requirement:', req);
                  }}
                />
              )}

              {/* Documents Tab */}
              {activeTab === 5 && (
                <DxcFlex direction="column" gap="var(--spacing-gap-l)">
                  {/* Upload Section */}
                  <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                    <DxcHeading level={3} text="Upload Documents" />
                    <DocumentUpload
                      claimId={claim.id}
                      onUploadComplete={(result) => {
                        console.log('Upload complete:', result);
                        // TODO: Refresh documents list
                      }}
                      acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
                      maxFileSize={10 * 1024 * 1024}
                      multiple={true}
                    />
                  </DxcFlex>

                  {/* Documents List */}
                  <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                    <DxcHeading level={3} text="Uploaded Documents" />
                    <DocumentViewer
                      documents={claim.documents || []}
                      onDocumentClick={(doc) => {
                        console.log('Document clicked:', doc);
                        // TODO: Open document preview modal
                      }}
                      onDownload={(doc) => {
                        console.log('Download document:', doc);
                        // TODO: Implement download
                      }}
                      showIDP={true}
                      showActions={true}
                    />
                  </DxcFlex>
                </DxcFlex>
              )}

              {/* Beneficiary Analyzer Tab */}
              {activeTab === 6 && (
                <BeneficiaryAnalyzer
                  claimId={claim.claimNumber || claim.id}
                  claim={claim}
                  onApproveBeneficiaries={(beneficiaries) => {
                    // TODO: Update claim with approved beneficiaries
                    // Switch back to Policy 360 tab to see updated beneficiaries
                    setActiveTab(2);
                  }}
                  onCancel={() => {
                    // Return to Policy 360 tab
                    setActiveTab(2);
                  }}
                />
              )}
            </DxcInset>
          </DxcFlex>
        </DxcContainer>
          </DxcFlex>
        </DxcContainer>

        {/* Work Notes Panel - Always Visible */}
        <DxcContainer padding="var(--spacing-padding-l)" paddingTop="0">
          <WorkNotes
            claimSysId={claim.sysId || claim.servicenow_sys_id}
            fnolNumber={claim.fnolNumber || claim.claimNumber}
            isDemo={!claim.sysId || claim.sysId?.startsWith('demo-')}
            demoWorkNotes={claim.workNotes || []}
          />
        </DxcContainer>
      </DxcFlex>

      {/* Modal Dialogs */}
      {/* PMI Calculator Modal */}
      <ModalWrapper
        isOpen={showPMICalculator}
        onClose={() => setShowPMICalculator(false)}
        ariaLabel="PMI Calculator"
      >
        <PMICalculator
          claimData={claim}
          onCalculate={(result) => {
            console.log('PMI calculated:', result);
          }}
          onApply={(result) => {
            console.log('PMI applied:', result);
            setShowPMICalculator(false);
          }}
          onClose={() => setShowPMICalculator(false)}
        />
      </ModalWrapper>

      {/* Tax Withholding Calculator Modal */}
      <ModalWrapper
        isOpen={showTaxCalculator}
        onClose={() => setShowTaxCalculator(false)}
        ariaLabel="Tax Withholding Calculator"
      >
        <TaxWithholdingCalculator
          claimData={claim}
          paymentData={claim.financial?.payments?.[0]}
          onCalculate={(result) => {
            console.log('Tax calculated:', result);
          }}
          onApply={(result) => {
            console.log('Tax applied:', result);
            setShowTaxCalculator(false);
          }}
          onClose={() => setShowTaxCalculator(false)}
        />
      </ModalWrapper>

      {/* Payment Quick View Modal */}
      <ModalWrapper
        isOpen={showPaymentModal && !!selectedPayment}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPayment(null);
        }}
        ariaLabel={`Payment details for ${selectedPayment?.id || 'payment'}`}
      >
        {selectedPayment && (
          <PaymentQuickView
            payment={selectedPayment}
            onEdit={(payment) => {
              console.log('Edit payment:', payment);
              setShowPaymentModal(false);
            }}
            onCancel={(payment) => {
              console.log('Cancel payment:', payment);
              setShowPaymentModal(false);
            }}
            onResend={(payment) => {
              console.log('Resend payment:', payment);
              setShowPaymentModal(false);
            }}
            onView1099={() => {
              console.log('View 1099');
            }}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedPayment(null);
            }}
          />
        )}
      </ModalWrapper>

      {/* Policy Detail View Modal */}
      <ModalWrapper
        isOpen={showPolicyModal && !!selectedPolicy}
        onClose={() => {
          setShowPolicyModal(false);
          setSelectedPolicy(null);
        }}
        ariaLabel={`Policy details for ${selectedPolicy?.policyNumber || 'policy'}`}
      >
        {selectedPolicy && (
          <PolicyDetailView
            policy={selectedPolicy}
            onEdit={(policy) => {
              console.log('Edit policy:', policy);
              setShowPolicyModal(false);
            }}
            onSuspend={(policy) => {
              console.log('Suspend policy:', policy);
              setShowPolicyModal(false);
            }}
            onAssociate={(policy) => {
              console.log('Associate policy:', policy);
              setShowPolicyModal(false);
            }}
            onDissociate={(policy) => {
              console.log('Dissociate policy:', policy);
              setShowPolicyModal(false);
            }}
            onClose={() => {
              setShowPolicyModal(false);
              setSelectedPolicy(null);
            }}
          />
        )}
      </ModalWrapper>

      {/* Party Add/Edit Form Modal */}
      <ModalWrapper
        isOpen={showPartyForm}
        onClose={() => {
          setShowPartyForm(false);
          setSelectedParty(null);
        }}
        ariaLabel={selectedParty ? `Edit party ${selectedParty.name}` : 'Add new party'}
      >
        <PartyForm
          party={selectedParty}
          onSave={(partyData) => {
            console.log('Party saved:', partyData);
            setShowPartyForm(false);
            setSelectedParty(null);
          }}
          onCancel={() => {
            setShowPartyForm(false);
            setSelectedParty(null);
          }}
          onCSLNSearch={(partyData) => {
            console.log('CSLN search for:', partyData);
          }}
        />
      </ModalWrapper>

      {/* Beneficiary Analyzer Modal */}
      <ModalWrapper
        isOpen={showBeneficiaryAnalyzer}
        onClose={() => setShowBeneficiaryAnalyzer(false)}
        ariaLabel="Beneficiary Analyzer"
      >
        <BeneficiaryAnalyzer
          claimId={claim.claimNumber || claim.id}
          claim={claim}
          onApproveBeneficiaries={(beneficiaries) => {
            console.log('Beneficiaries approved:', beneficiaries);
            setShowBeneficiaryAnalyzer(false);
          }}
          onRequestDocuments={(beneficiaries) => {
            console.log('Request documents for beneficiaries:', beneficiaries);
            setShowBeneficiaryAnalyzer(false);
          }}
          onClose={() => setShowBeneficiaryAnalyzer(false)}
        />
      </ModalWrapper>
    </DxcContainer>
  );
};

export default ClaimsWorkbench;
