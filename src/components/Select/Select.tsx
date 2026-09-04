import type { SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/format';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, children, className, id, ...props }: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <div className={cn('field', className)}>
      {label && (
        <label className="field-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select id={selectId} className={cn('field-input field-select', error && 'field-input-error')} {...props}>
        {children}
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
