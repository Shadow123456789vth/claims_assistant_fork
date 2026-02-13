/**
 * My Performance Component
 * Displays individual performance metrics focused on work completed
 */

import { useState, useMemo } from 'react';
import {
  DxcFlex,
  DxcContainer,
  DxcTypography,
  DxcButton,
  DxcBadge,
  DxcDialog,
  DxcTabs
} from '@dxc-technology/halstack-react';
import { ClaimStatus } from '../../types/claim.types';

const MyPerformance = ({ claims, user }) => {
  const [showClosedClaims, setShowClosedClaims] = useState(false);
  const [showDrillThrough, setShowDrillThrough] = useState(false);
  const [drillThroughPeriod, setDrillThroughPeriod] = useState(0); // 0=MTD, 1=WTD, 2=Yesterday, 3=Today

  // Calculate yesterday's date range
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(23, 59, 59, 999);

  // Calculate metrics for yesterday
  const yesterdayMetrics = (() => {
    // Mock hours worked (in real app, would come from time tracking system)
    const hoursWorked = 7.5;
    const rollingAverage = 7.8;

    // Cases closed yesterday
    const closedYesterday = claims?.filter(c => {
      if (c.status !== ClaimStatus.CLOSED && c.status !== ClaimStatus.DENIED) return false;
      const closedDate = new Date(c.closedAt || c.updatedAt);
      const isYesterday = closedDate >= yesterday && closedDate <= yesterdayEnd;

      // Filter by user if available
      if (user && c.assignedTo) {
        return isYesterday && (c.assignedTo === user.name || c.assignedTo === user.id);
      }
      return isYesterday;
    }) || [];

    // Activities completed yesterday (mock data - would come from activity log)
    // In production, this would aggregate: calls, emails, letters, indexing, notes, approvals, etc.
    const activitiesCompleted = 42;

    // Activity utilization
    const activitiesPerHour = hoursWorked > 0 ? (activitiesCompleted / hoursWorked).toFixed(1) : 0;
    const utilizationPercent = hoursWorked > 0 ? Math.round((activitiesCompleted / (hoursWorked * 10)) * 100) : 0;

    return {
      hoursWorked,
      rollingAverage,
      casesClosedCount: closedYesterday.length,
      closedClaims: closedYesterday,
      activitiesCompleted,
      activitiesPerHour,
      utilizationPercent
    };
  })();

  // Format hours comparison
  const hoursComparison = yesterdayMetrics.hoursWorked - yesterdayMetrics.rollingAverage;
  const hoursComparisonText = hoursComparison >= 0
    ? `+${hoursComparison.toFixed(1)}h vs avg`
    : `${hoursComparison.toFixed(1)}h vs avg`;
  const hoursComparisonColor = hoursComparison >= 0 ? 'var(--color-fg-success-medium)' : 'var(--color-fg-error-medium)';

  // Generate detailed performance data for drill-through
  const detailedPerformanceData = useMemo(() => {
    const today = new Date();
    const data = [];

    // Helper to generate mock daily data
    const generateDayData = (date, hoursWorked, activitiesCompleted, casesClosed) => {
      return {
        date: date.toISOString().split('T')[0],
        dateDisplay: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        hoursWorked,
        activitiesCompleted,
        casesClosed,
        activityBreakdown: {
          calls: Math.floor(activitiesCompleted * 0.25),
          emails: Math.floor(activitiesCompleted * 0.30),
          mail: Math.floor(activitiesCompleted * 0.15),
          reviews: Math.floor(activitiesCompleted * 0.20),
          outbound: Math.floor(activitiesCompleted * 0.10)
        }
      };
    };

    // Generate data for last 30 days (for MTD view)
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Skip weekends for mock data
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Generate varied data
      const hoursWorked = 7 + Math.random() * 2; // 7-9 hours
      const activitiesCompleted = Math.floor(30 + Math.random() * 30); // 30-60 activities
      const casesClosed = Math.floor(2 + Math.random() * 5); // 2-7 cases

      data.push(generateDayData(date, hoursWorked, activitiesCompleted, casesClosed));
    }

    return data;
  }, []);

  // Filter data by selected period
  const filteredPerformanceData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (drillThroughPeriod) {
      case 0: // MTD
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return detailedPerformanceData.filter(d => new Date(d.date) >= monthStart);

      case 1: // WTD
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        return detailedPerformanceData.filter(d => new Date(d.date) >= weekStart);

      case 2: // Yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return detailedPerformanceData.filter(d => d.date === yesterday.toISOString().split('T')[0]);

      case 3: // Today
        return detailedPerformanceData.filter(d => d.date === today.toISOString().split('T')[0]);

      default:
        return detailedPerformanceData;
    }
  }, [detailedPerformanceData, drillThroughPeriod]);

  // Calculate totals for selected period
  const periodTotals = useMemo(() => {
    return filteredPerformanceData.reduce((acc, day) => ({
      hoursWorked: acc.hoursWorked + day.hoursWorked,
      activitiesCompleted: acc.activitiesCompleted + day.activitiesCompleted,
      casesClosed: acc.casesClosed + day.casesClosed,
      calls: acc.calls + day.activityBreakdown.calls,
      emails: acc.emails + day.activityBreakdown.emails,
      mail: acc.mail + day.activityBreakdown.mail,
      reviews: acc.reviews + day.activityBreakdown.reviews,
      outbound: acc.outbound + day.activityBreakdown.outbound
    }), {
      hoursWorked: 0,
      activitiesCompleted: 0,
      casesClosed: 0,
      calls: 0,
      emails: 0,
      mail: 0,
      reviews: 0,
      outbound: 0
    });
  }, [filteredPerformanceData]);

  return (
    <>
      <DxcContainer
        padding="12px"
        style={{
          backgroundColor: 'var(--color-bg-neutral-lightest)',
          borderRadius: 'var(--border-radius-m)',
          boxShadow: 'var(--shadow-mid-02)'
        }}
      >
        <DxcFlex direction="column" gap="8px">
          {/* Section Title */}
          <DxcFlex justifyContent="space-between" alignItems="center">
            <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
              My Performance
            </DxcTypography>
            <DxcBadge label="Yesterday" mode="contextual" color="neutral" />
          </DxcFlex>

          {/* Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px'
          }}>
            {/* Hours Worked */}
            <DxcContainer
              padding="10px"
              style={{ backgroundColor: 'var(--color-bg-info-lighter)', height: '100%' }}
            >
              <DxcFlex direction="column" gap="4px" alignItems="center" style={{ height: '100%' }}>
                <DxcTypography fontSize="10px" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">
                  HOURS WORKED
                </DxcTypography>
                <DxcTypography fontSize="28px" fontWeight="font-weight-bold" color="#000000" style={{ lineHeight: '1' }}>
                  {yesterdayMetrics.hoursWorked}
                </DxcTypography>
                <DxcTypography fontSize="10px" color={hoursComparisonColor}>
                  {hoursComparisonText}
                </DxcTypography>
                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <button
                    onClick={() => {
                      setDrillThroughPeriod(2);
                      setShowDrillThrough(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-fg-primary-medium)',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      textDecoration: 'underline'
                    }}
                  >
                    Details
                  </button>
                </div>
              </DxcFlex>
            </DxcContainer>

            {/* Cases Closed */}
            <DxcContainer
              padding="10px"
              style={{ backgroundColor: 'var(--color-bg-success-lighter)', height: '100%' }}
            >
              <DxcFlex direction="column" gap="4px" alignItems="center" style={{ height: '100%' }}>
                <DxcTypography fontSize="10px" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">
                  CASES CLOSED
                </DxcTypography>
                <DxcTypography fontSize="28px" fontWeight="font-weight-bold" color="#000000" style={{ lineHeight: '1' }}>
                  {yesterdayMetrics.casesClosedCount}
                </DxcTypography>
                <div style={{ height: '10px' }} />
                <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', gap: '8px' }}>
                  {yesterdayMetrics.casesClosedCount > 0 && (
                    <button
                      onClick={() => setShowClosedClaims(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-fg-primary-medium)',
                        fontSize: '11px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        textDecoration: 'underline'
                      }}
                    >
                      Claims
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setDrillThroughPeriod(2);
                      setShowDrillThrough(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-fg-primary-medium)',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      textDecoration: 'underline'
                    }}
                  >
                    Details
                  </button>
                </div>
              </DxcFlex>
            </DxcContainer>

            {/* Activities Completed */}
            <DxcContainer
              padding="10px"
              style={{ backgroundColor: 'var(--color-bg-warning-lighter)', height: '100%' }}
            >
              <DxcFlex direction="column" gap="4px" alignItems="center" style={{ height: '100%' }}>
                <DxcTypography fontSize="10px" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">
                  ACTIVITIES
                </DxcTypography>
                <DxcTypography fontSize="28px" fontWeight="font-weight-bold" color="#000000" style={{ lineHeight: '1' }}>
                  {yesterdayMetrics.activitiesCompleted}
                </DxcTypography>
                <DxcTypography fontSize="10px" color="var(--color-fg-neutral-strong)">
                  Calls, emails, notes
                </DxcTypography>
                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <button
                    onClick={() => {
                      setDrillThroughPeriod(2);
                      setShowDrillThrough(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-fg-primary-medium)',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      textDecoration: 'underline'
                    }}
                  >
                    Details
                  </button>
                </div>
              </DxcFlex>
            </DxcContainer>

            {/* Activity Utilization */}
            <DxcContainer
              padding="10px"
              style={{
                backgroundColor: yesterdayMetrics.utilizationPercent >= 80
                  ? 'var(--color-bg-success-lighter)'
                  : yesterdayMetrics.utilizationPercent >= 60
                  ? 'var(--color-bg-warning-lighter)'
                  : 'var(--color-bg-error-lighter)',
                height: '100%'
              }}
            >
              <DxcFlex direction="column" gap="4px" alignItems="center" style={{ height: '100%' }}>
                <DxcTypography fontSize="10px" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">
                  UTILIZATION
                </DxcTypography>
                <DxcTypography fontSize="28px" fontWeight="font-weight-bold" color="#000000" style={{ lineHeight: '1' }}>
                  {yesterdayMetrics.utilizationPercent}%
                </DxcTypography>
                <DxcTypography fontSize="10px" color="var(--color-fg-neutral-strong)">
                  {yesterdayMetrics.activitiesPerHour}/hr
                </DxcTypography>
                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <button
                    onClick={() => {
                      setDrillThroughPeriod(2);
                      setShowDrillThrough(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-fg-primary-medium)',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      textDecoration: 'underline'
                    }}
                  >
                    Details
                  </button>
                </div>
              </DxcFlex>
            </DxcContainer>
          </div>

          {/* Info Note */}
          <DxcTypography fontSize="10px" color="var(--color-fg-neutral-dark)" style={{ fontStyle: 'italic' }}>
            Utilization target: ≥80% • Data from yesterday
          </DxcTypography>
        </DxcFlex>
      </DxcContainer>

      {/* Closed Claims Dialog */}
      {showClosedClaims && (
        <DxcDialog onCloseIconClick={() => setShowClosedClaims(false)}>
          <DxcFlex direction="column" gap="var(--spacing-gap-m)" style={{ padding: '0 16px' }}>
            <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold">
              Cases Closed Yesterday
            </DxcTypography>

            {yesterdayMetrics.closedClaims.length > 0 ? (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #000000', textAlign: 'left' }}>
                      <th style={{ padding: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                        Claim Number
                      </th>
                      <th style={{ padding: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                        Claimant
                      </th>
                      <th style={{ padding: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                        Type
                      </th>
                      <th style={{ padding: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                        Closed At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {yesterdayMetrics.closedClaims.map((claim, index) => (
                      <tr
                        key={claim.claimNumber || index}
                        style={{
                          borderBottom: '1px solid var(--border-color-neutral-lighter)',
                          backgroundColor: index % 2 === 0 ? '#fff' : 'var(--color-bg-neutral-lighter)'
                        }}
                      >
                        <td style={{ padding: '8px' }}>
                          <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
                            {claim.claimNumber || claim.fnolNumber}
                          </DxcTypography>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <DxcTypography fontSize="font-scale-02">
                            {claim.claimant?.name || claim.insured?.name || 'N/A'}
                          </DxcTypography>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <DxcTypography fontSize="font-scale-02">{claim.type}</DxcTypography>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <DxcTypography fontSize="font-scale-02">
                            {new Date(claim.closedAt || claim.updatedAt).toLocaleString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </DxcTypography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <DxcTypography>No cases closed yesterday.</DxcTypography>
            )}

            <DxcFlex justifyContent="flex-end">
              <DxcButton
                label="Close"
                mode="secondary"
                onClick={() => setShowClosedClaims(false)}
              />
            </DxcFlex>
          </DxcFlex>
        </DxcDialog>
      )}

      {/* Performance Drill-Through Dialog */}
      {showDrillThrough && (
        <DxcDialog
          onCloseIconClick={() => setShowDrillThrough(false)}
          overlay={true}
        >
          <div style={{ minWidth: '800px', maxWidth: '1000px', padding: '0 16px' }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold">
                Performance Details
              </DxcTypography>

              {/* Period Tabs */}
              <DxcTabs iconPosition="left">
                <DxcTabs.Tab
                  label="Month-to-Date"
                  active={drillThroughPeriod === 0}
                  onClick={() => setDrillThroughPeriod(0)}
                >
                  <div />
                </DxcTabs.Tab>
                <DxcTabs.Tab
                  label="Week-to-Date"
                  active={drillThroughPeriod === 1}
                  onClick={() => setDrillThroughPeriod(1)}
                >
                  <div />
                </DxcTabs.Tab>
                <DxcTabs.Tab
                  label="Yesterday"
                  active={drillThroughPeriod === 2}
                  onClick={() => setDrillThroughPeriod(2)}
                >
                  <div />
                </DxcTabs.Tab>
                <DxcTabs.Tab
                  label="Today"
                  active={drillThroughPeriod === 3}
                  onClick={() => setDrillThroughPeriod(3)}
                >
                  <div />
                </DxcTabs.Tab>
              </DxcTabs>

              {/* Summary Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--spacing-gap-s)',
                padding: 'var(--spacing-padding-m)',
                backgroundColor: 'var(--color-bg-neutral-lighter)',
                borderRadius: 'var(--border-radius-m)'
              }}>
                <div>
                  <DxcTypography fontSize="10px" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">
                    TOTAL HOURS
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold">
                    {periodTotals.hoursWorked.toFixed(1)}
                  </DxcTypography>
                </div>
                <div>
                  <DxcTypography fontSize="10px" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">
                    TOTAL ACTIVITIES
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold">
                    {periodTotals.activitiesCompleted}
                  </DxcTypography>
                </div>
                <div>
                  <DxcTypography fontSize="10px" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">
                    TOTAL CASES CLOSED
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold">
                    {periodTotals.casesClosed}
                  </DxcTypography>
                </div>
                <div>
                  <DxcTypography fontSize="10px" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">
                    AVG ACTIVITIES/HR
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold">
                    {(periodTotals.activitiesCompleted / periodTotals.hoursWorked).toFixed(1)}
                  </DxcTypography>
                </div>
              </div>

              {/* Activity Breakdown */}
              <DxcContainer
                padding="var(--spacing-padding-s)"
                style={{ backgroundColor: 'var(--color-bg-warning-lighter)' }}
              >
                <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
                  <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
                    Activity Breakdown
                  </DxcTypography>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--spacing-gap-s)' }}>
                    <div>
                      <DxcTypography fontSize="10px">Calls</DxcTypography>
                      <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                        {periodTotals.calls}
                      </DxcTypography>
                    </div>
                    <div>
                      <DxcTypography fontSize="10px">Emails</DxcTypography>
                      <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                        {periodTotals.emails}
                      </DxcTypography>
                    </div>
                    <div>
                      <DxcTypography fontSize="10px">Mail</DxcTypography>
                      <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                        {periodTotals.mail}
                      </DxcTypography>
                    </div>
                    <div>
                      <DxcTypography fontSize="10px">Reviews</DxcTypography>
                      <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                        {periodTotals.reviews}
                      </DxcTypography>
                    </div>
                    <div>
                      <DxcTypography fontSize="10px">Outbound</DxcTypography>
                      <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                        {periodTotals.outbound}
                      </DxcTypography>
                    </div>
                  </div>
                </DxcFlex>
              </DxcContainer>

              {/* Daily Detail Table */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                    <tr style={{ borderBottom: '2px solid #000000', textAlign: 'left' }}>
                      <th style={{ padding: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>
                        Date
                      </th>
                      <th style={{ padding: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>
                        Hours
                      </th>
                      <th style={{ padding: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>
                        Activities
                      </th>
                      <th style={{ padding: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>
                        Cases Closed
                      </th>
                      <th style={{ padding: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>
                        Calls
                      </th>
                      <th style={{ padding: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>
                        Emails
                      </th>
                      <th style={{ padding: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>
                        Mail
                      </th>
                      <th style={{ padding: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>
                        Reviews
                      </th>
                      <th style={{ padding: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>
                        Outbound
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPerformanceData.map((day, index) => (
                      <tr
                        key={day.date}
                        style={{
                          borderBottom: '1px solid var(--border-color-neutral-lighter)',
                          backgroundColor: index % 2 === 0 ? '#fff' : 'var(--color-bg-neutral-lighter)'
                        }}
                      >
                        <td style={{ padding: '8px' }}>
                          <DxcTypography fontSize="12px" fontWeight="font-weight-semibold">
                            {day.dateDisplay}
                          </DxcTypography>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <DxcTypography fontSize="12px">{day.hoursWorked.toFixed(1)}</DxcTypography>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <DxcTypography fontSize="12px" fontWeight="font-weight-semibold">
                            {day.activitiesCompleted}
                          </DxcTypography>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <DxcTypography fontSize="12px">{day.casesClosed}</DxcTypography>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <DxcTypography fontSize="12px">{day.activityBreakdown.calls}</DxcTypography>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <DxcTypography fontSize="12px">{day.activityBreakdown.emails}</DxcTypography>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <DxcTypography fontSize="12px">{day.activityBreakdown.mail}</DxcTypography>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <DxcTypography fontSize="12px">{day.activityBreakdown.reviews}</DxcTypography>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <DxcTypography fontSize="12px">{day.activityBreakdown.outbound}</DxcTypography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <DxcFlex justifyContent="flex-end">
                <DxcButton
                  label="Close"
                  mode="secondary"
                  onClick={() => setShowDrillThrough(false)}
                />
              </DxcFlex>
            </DxcFlex>
          </div>
        </DxcDialog>
      )}
    </>
  );
};

export default MyPerformance;
