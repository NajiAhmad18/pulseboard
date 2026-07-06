import React from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  );
}

export function SkeletonLine({ className, width = 'w-full', ...props }) {
  return <Skeleton className={cn("h-4", width, className)} {...props} />;
}

export function SkeletonCard({ className, ...props }) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white p-5 space-y-3", className)} {...props}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-16" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className, ...props }) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white overflow-hidden", className)} {...props}>
      <div className="bg-gray-50 px-5 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-t border-gray-100 px-5 py-3.5 flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-3.5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
