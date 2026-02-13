# Accessibility Audit - Claims Portal

**Date:** 2026-02-09
**WCAG Target:** Level AA
**Status:** In Progress

## Executive Summary

The Claims Portal has significant accessibility gaps that need to be addressed to meet WCAG 2.1 Level AA standards. This audit identifies issues across the application and provides a prioritized remediation plan.

## Key Findings

### Critical Issues (P0)
1. **Decorative icons without labels** - Screen readers cannot understand icon-only content
2. **Missing form labels** - Some form inputs lack proper label associations
3. **Missing keyboard navigation** - Custom interactive elements lack keyboard support
4. **No skip links** - Users cannot skip repetitive navigation
5. **Missing ARIA landmarks** - Page structure unclear to assistive technology

### High Priority Issues (P1)
6. **Color contrast issues** - Some text/background combinations fail WCAG AA
7. **Focus indicators** - Custom components may lack visible focus states
8. **Dynamic content updates** - No ARIA live regions for status changes
9. **Missing alt text** - Images without alternative text descriptions
10. **Heading hierarchy** - Inconsistent heading levels

### Medium Priority Issues (P2)
11. **Table accessibility** - Data tables missing proper headers/scope
12. **Modal focus management** - Dialogs don't trap focus properly
13. **Error announcements** - Form validation errors not announced
14. **Loading states** - Spinners not announced to screen readers

## Detailed Findings by Component

### App.jsx
- [ ] Add skip to main content link
- [ ] Add main landmark with `role="main"` or `<main>` element
- [ ] Ensure navigation has `role="navigation"` or `<nav>` element
- [ ] Add aria-label to demo mode toggle buttons
- [ ] Verify DxcApplicationLayout provides proper landmarks

### ClaimHeader.jsx
**Issues:**
- [ ] **Line 92-93**: Material icon "person" is decorative but not marked as `aria-hidden="true"`
- [ ] **Line 180-182**: Warning icon lacks aria-label for "SLA warning"
- [ ] **Line 98**: Separator "|" should be aria-hidden
- [ ] Add `role="banner"` or use `<header>` element for the claim header
- [ ] No live region for status changes

**Fixes Needed:**
```jsx
// Icon without text should be aria-hidden
<span className="material-icons" aria-hidden="true" style={{...}}>person</span>

// Warning icon needs label
<span className="material-icons" aria-label="SLA warning" role="img" style={{...}}>warning</span>

// Decorative separator
<span aria-hidden="true">|</span>

// Add live region for status
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  Claim {claim.claimNumber} status: {claim.status}
</div>
```

### Dashboard.jsx (627 lines)
- [ ] Add `<main>` landmark or `role="main"`
- [ ] Ensure search input has visible label (not just placeholder)
- [ ] Add aria-label to filter dropdowns describing their purpose
- [ ] Add aria-live region for search results count
- [ ] View toggle (grid/list) needs proper aria-pressed states
- [ ] Pagination needs proper aria-labels

### ClaimCard.jsx
**Issues:**
- [ ] Container has onClick but uses DxcContainer (not semantic)
- [ ] Should handle keyboard events (Enter/Space)
- [ ] Needs aria-label describing the claim
- [ ] Action buttons need aria-labels for context
- [ ] Status badge should have aria-label

**Fixes Needed:**
```jsx
<DxcContainer
  role="article"
  tabIndex={0}
  aria-label={`Claim ${displayId} for ${displayName}, status ${displayStatus}`}
  onClick={() => onSelect(submission)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(submission);
    }
  }}
>
```

### ClaimsWorkbench.jsx (758 lines)
- [ ] Tab navigation already using DxcTabs (likely accessible)
- [ ] Verify each tab panel has proper `role="tabpanel"` and `aria-labelledby`
- [ ] Modal dialogs need focus trapping
- [ ] Add aria-live region for workflow updates

### ServiceNowClaimsTable.jsx
**Good:** Already has keyboard navigation on table rows (lines 214-228)
**Issues:**
- [ ] Table needs `<caption>` element or aria-label
- [ ] Column headers should use `<th>` with proper scope
- [ ] Loading spinner needs aria-label
- [ ] Empty state needs proper heading structure

### DepartmentInventorySection.jsx
**Good:** Already has proper keyboard support and ARIA attributes
**Issues:**
- [ ] Icons should have aria-label or be aria-hidden
- [ ] Add group label with role="group" and aria-labelledby

### Forms (IntakeForms, PartyForm, ClaimSearch, etc.)
- [ ] All inputs must have associated `<label>` elements
- [ ] Error messages must be associated with inputs via `aria-describedby`
- [ ] Required fields must have `aria-required="true"` or `required` attribute
- [ ] Form validation errors must be announced via aria-live
- [ ] Submit buttons should have clear labels

### Modals (PMICalculator, TaxWithholdingCalculator, etc.)
- [ ] Add `role="dialog"` and `aria-modal="true"`
- [ ] Add `aria-labelledby` pointing to modal title
- [ ] Trap focus within modal when open
- [ ] Return focus to trigger element when closed
- [ ] Close on Escape key

### RequirementsEngine.jsx
- [ ] Requirements list should be a semantic list (`<ul>` or `<ol>`)
- [ ] Each requirement item needs clear status announcement
- [ ] Action buttons need descriptive aria-labels

## Color Contrast Analysis

**To Test:**
1. Primary text on light backgrounds
2. Button text on colored backgrounds
3. Status badges (success, warning, error, info)
4. Disabled states
5. Link colors

**Tool:** Use browser devtools or https://webaim.org/resources/contrastchecker/

## Keyboard Navigation Testing Checklist

- [ ] Tab through entire application - all interactive elements reachable
- [ ] Shift+Tab reverses navigation order
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and dropdowns
- [ ] Arrow keys navigate within components (tabs, dropdowns, etc.)
- [ ] Focus visible at all times (no invisible focus)
- [ ] No keyboard traps (can always escape from components)

## Screen Reader Testing

**To Test:**
- [ ] NVDA (Windows) - Free
- [ ] JAWS (Windows) - Paid, industry standard
- [ ] VoiceOver (Mac) - Built-in

**Key Scenarios:**
1. Navigate dashboard and read claim cards
2. Open claim details and navigate tabs
3. Fill out FNOL intake form
4. Search for claims
5. Review and approve/deny claim

## Remediation Priority

### Phase 1: Critical Fixes (Week 1)
1. Add skip link to main content
2. Fix all decorative icons (add aria-hidden)
3. Fix all functional icons (add aria-labels)
4. Ensure all form inputs have labels
5. Add keyboard support to ClaimCard component
6. Fix table accessibility (captions, headers)

### Phase 2: High Priority (Week 2)
7. Add ARIA live regions for dynamic content
8. Implement modal focus trapping
9. Add proper landmark regions throughout
10. Fix heading hierarchy
11. Add error announcements for forms

### Phase 3: Polish (Week 3)
12. Color contrast audit and fixes
13. Enhanced focus indicators
14. Loading state announcements
15. Comprehensive keyboard testing
16. Screen reader testing and refinements

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [DXC Halstack Accessibility](https://developer.dxc.com/design/principles/accessibility)

## Testing Tools

- Chrome DevTools Lighthouse (Accessibility audit)
- axe DevTools browser extension
- WAVE browser extension
- Keyboard-only navigation (unplug mouse!)
- Screen reader (NVDA/VoiceOver)

---

## Next Steps

1. Create utility component for screen-reader-only text
2. Create accessibility hooks (useFocusTrap, useAriaLiveRegion)
3. Fix critical issues in priority order
4. Document accessibility patterns for team
5. Add accessibility testing to CI/CD pipeline
