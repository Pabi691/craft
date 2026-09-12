export default function Spinner({ className = 'h-4 w-4', light = false }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 ${light ? 'border-white/30 border-t-white' : 'border-ink-900/15 border-t-ink-900'} ${className}`}
    />
  );
}
