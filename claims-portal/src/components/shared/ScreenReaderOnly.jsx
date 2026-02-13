/**
 * ScreenReaderOnly Component
 * Visually hides content but keeps it accessible to screen readers
 *
 * Usage:
 * <ScreenReaderOnly>Hidden text for screen readers</ScreenReaderOnly>
 */

const ScreenReaderOnly = ({ children, as: Component = 'span' }) => {
  return (
    <Component
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
      }}
    >
      {children}
    </Component>
  );
};

export default ScreenReaderOnly;
