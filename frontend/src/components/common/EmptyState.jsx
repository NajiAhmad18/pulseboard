import React from 'react';
import { FileText } from 'lucide-react';
import Button from './Button';

export function EmptyState({ title, description, actionText, onAction, icon: Icon = FileText }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 px-6 py-16 text-center animate-fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 mb-4">
        <Icon className="h-6 w-6 text-accent-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">{actionText}</Button>
      )}
    </div>
  );
}
