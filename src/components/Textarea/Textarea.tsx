import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/format';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const areaId = id ?? props.name;
  return (
    <div className={cn('field', className)}>
      {label && (
        <label className="field-label" htmlFor={areaId}>
          {label}
        </label>
      )}
      <textarea id={areaId} className={cn('field-input field-textarea', error && 'field-input-error')} {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
