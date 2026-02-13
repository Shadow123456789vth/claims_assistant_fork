/**
 * Department Inventory Section Component
 * Displays clickable department filter cards (Death, Disability, Annuity, etc.)
 */

import { DxcFlex, DxcContainer, DxcTypography, DxcBadge } from '@dxc-technology/halstack-react';

const DepartmentInventorySection = ({
  claims,
  demoLineOfBusiness,
  subsetFilter,
  onFilterChange,
  compact = false
}) => {
  // Calculate department counts
  const departmentGroups = (() => {
    if (demoLineOfBusiness === 'PC') {
      return [
        {
          key: 'property',
          label: 'Property',
          count: claims?.filter(c => ['property_damage', 'commercial_property'].includes(c.type)).length || 0,
          icon: 'home',
          color: '#1b75bb'
        },
        {
          key: 'auto',
          label: 'Auto',
          count: claims?.filter(c => ['auto_collision', 'auto_comprehensive'].includes(c.type)).length || 0,
          icon: 'directions_car',
          color: '#37a526'
        },
        {
          key: 'liability',
          label: 'Liability',
          count: claims?.filter(c => c.type === 'liability').length || 0,
          icon: 'gavel',
          color: '#ffa500'
        },
        {
          key: 'commercial',
          label: 'Commercial',
          count: claims?.filter(c => c.type === 'commercial_property').length || 0,
          icon: 'business',
          color: '#00adee'
        }
      ];
    } else {
      return [
        {
          key: 'death',
          label: 'Death',
          count: claims?.filter(c => c.type === 'death').length || 0,
          icon: 'favorite',
          color: '#d02e2e'
        },
        {
          key: 'disability',
          label: 'Disability',
          count: claims?.filter(c => c.type === 'disability').length || 0,
          icon: 'accessible',
          color: '#ffa500'
        },
        {
          key: 'annuity',
          label: 'Annuity',
          count: claims?.filter(c => ['annuity', 'maturity', 'annuity_death'].includes(c.type)).length || 0,
          icon: 'account_balance',
          color: '#1b75bb'
        },
        {
          key: 'surrender',
          label: 'Surrender',
          count: claims?.filter(c => c.type === 'surrender').length || 0,
          icon: 'exit_to_app',
          color: '#37a526'
        }
      ];
    }
  })();

  const handleDepartmentClick = (groupKey) => {
    onFilterChange(subsetFilter === groupKey ? null : groupKey);
  };

  return (
    <DxcContainer
      padding={compact ? 'var(--spacing-padding-s)' : 'var(--spacing-padding-m)'}
      style={{
        backgroundColor: 'var(--color-bg-neutral-lightest)',
        borderRadius: 'var(--border-radius-m)',
        boxShadow: 'var(--shadow-mid-04)',
        height: compact ? '100%' : 'auto'
      }}
    >
      <DxcFlex direction="column" gap={compact ? 'var(--spacing-gap-s)' : 'var(--spacing-gap-m)'} style={{ height: '100%' }}>
        {/* Section Title */}
        <DxcTypography fontSize={compact ? 'font-scale-02' : 'font-scale-03'} fontWeight="font-weight-semibold">
          Department Inventory
        </DxcTypography>

        {/* Department Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: compact ? 'var(--spacing-gap-s)' : 'var(--spacing-gap-m)',
          flex: compact ? '1' : 'auto',
          alignContent: 'start'
        }}>
          {departmentGroups.map((group) => (
            <div
              key={group.key}
              role="button"
              tabIndex={0}
              aria-label={`Filter by ${group.label} (${group.count} claims)`}
              aria-pressed={subsetFilter === group.key}
              onClick={() => handleDepartmentClick(group.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDepartmentClick(group.key);
                }
              }}
              style={{
                padding: compact ? 'var(--spacing-padding-s)' : 'var(--spacing-padding-m)',
                backgroundColor: subsetFilter === group.key
                  ? 'var(--color-bg-primary-lighter)'
                  : 'var(--color-bg-neutral-lighter)',
                borderRadius: 'var(--border-radius-m)',
                border: subsetFilter === group.key
                  ? '2px solid var(--color-border-primary-strong)'
                  : '1px solid var(--color-border-neutral-lighter)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: subsetFilter === group.key ? 'var(--shadow-mid-02)' : 'none'
              }}
            >
              <DxcFlex
                direction={compact ? 'row' : 'column'}
                gap={compact ? 'var(--spacing-gap-xs)' : 'var(--spacing-gap-s)'}
                alignItems="center"
                justifyContent={compact ? 'space-between' : 'center'}
              >
                <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                  <span
                    className="material-icons"
                    style={{
                      fontSize: compact ? '20px' : '32px',
                      color: group.color
                    }}
                  >
                    {group.icon}
                  </span>
                  <DxcTypography fontSize={compact ? 'font-scale-01' : 'font-scale-02'} fontWeight="font-weight-semibold">
                    {group.label}
                  </DxcTypography>
                </DxcFlex>
                <DxcBadge
                  label={group.count.toString()}
                  mode={compact ? 'notification' : 'contextual'}
                  color={subsetFilter === group.key ? 'primary' : 'neutral'}
                />
              </DxcFlex>
            </div>
          ))}
        </div>
      </DxcFlex>
    </DxcContainer>
  );
};

export default DepartmentInventorySection;
