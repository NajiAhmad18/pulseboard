import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Loader({ className, size = 20 }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <Loader2 className={cn("animate-spin text-accent-500", className)} size={size} />
    </div>
  );
}
