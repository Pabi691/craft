import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

export default function Breadcrumbs({ items = [], className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink-400 ${className}`}>
      <Link to="/" className="transition-colors hover:text-ink-900">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          <FiChevronRight size={12} className="opacity-60" />
          {item.to && i < items.length - 1 ? (
            <Link to={item.to} className="transition-colors hover:text-ink-900">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
