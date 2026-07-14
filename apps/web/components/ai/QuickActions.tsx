"use client";

interface QuickAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({
  actions,
}: QuickActionsProps) {
  if (!actions.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}