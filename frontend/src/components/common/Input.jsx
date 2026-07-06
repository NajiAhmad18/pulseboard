import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, labelClassName, containerClassName, type, label, error, id, ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className={cn("mb-1.5 block text-[13px] font-medium text-gray-700 transition-colors duration-300", labelClassName)}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "flex w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60",
          error && "border-red-400 focus:ring-4 focus:ring-red-500/10 focus:border-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
